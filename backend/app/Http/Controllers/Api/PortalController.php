<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Company, Customer, Invoice, Order, PortalDraft, Product, Review, Testimonial, User};
use App\Services\{CodeGeneratorService, InvoicePdfService};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PortalController extends Controller
{
    private function user(Request $request): User
    {
        abort_if($request->user()->isAdmin(), 403);
        return $request->user();
    }

    private function customer(Request $request): ?Customer
    {
        $user = $this->user($request);
        $customer = Customer::where('user_id', $user->id)->first();
        if ($customer && $user->company_id) abort_unless($customer->company_id === $user->company_id, 403);
        return $customer;
    }

    private function profileData(Customer $customer): array
    {
        return $customer->only(['id', 'customer_code', 'name', 'phone', 'email', 'address', 'city', 'province']);
    }

    public function profile(Request $request)
    {
        $customer = $this->customer($request);
        $user = $request->user();
        return response()->json(['data' => $customer ? $this->profileData($customer) : [
            'customer_code' => null, 'name' => $user->name, 'phone' => $user->phone,
            'email' => $user->email, 'address' => '', 'city' => '', 'province' => '',
        ]]);
    }

    public function saveProfile(Request $request)
    {
        $user = $this->user($request);
        $data = $request->validate([
            'name' => 'required|string|max:150', 'phone' => 'required|string|max:40',
            'address' => 'required|string|max:255', 'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
        ]);
        $customer = DB::transaction(function () use ($request, $user, $data) {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $customer = $this->customer($request);
            if (!$customer) {
                $company = Company::where('active', true)->when($user->company_id, fn ($q) => $q->whereKey($user->company_id))->first();
                abort_unless($company, 422, 'Bisnis belum tersedia. Hubungi admin.');
                $customer = new Customer();
                $customer->user_id = $user->id;
                $customer->company_id = $company->id;
                $customer->customer_code = CodeGeneratorService::customerCode();
                $customer->status = 'active';
                $user->company_id = $company->id;
            }
            abort_unless($customer->status === 'active', 403, 'Profil dinonaktifkan oleh admin.');
            $customer->fill($data);
            $customer->email = $user->email; // Never grant ownership through an editable email field.
            $customer->save();
            $user->fill(['name' => $data['name'], 'phone' => $data['phone']])->save();
            return $customer;
        });
        return response()->json(['data' => $this->profileData($customer)]);
    }

    private function ownedDraft(Request $request, int $id): PortalDraft
    {
        $customer = $this->customer($request);
        abort_unless($customer, 404);
        return PortalDraft::where('user_id', $request->user()->id)->where('customer_id', $customer->id)
            ->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    private function editable(PortalDraft $draft, ?Order $order): bool
    {
        if (!$draft->submitted_at) return true;
        return $order && $order->status === 'draft'
            && !$order->payments()->exists() && !$order->invoices()->exists()
            && !$order->production()->exists() && !$order->shipments()->exists() && !$order->review()->exists();
    }

    private function payload(PortalDraft $draft): array
    {
        $order = $draft->order;
        return [
            'id' => $draft->id, 'version' => $draft->version, 'items' => $draft->items,
            'notes' => $draft->notes, 'shipping_address' => $draft->shipping_address,
            'total' => $order?->grand_total ?? $draft->total, 'submitted_at' => $draft->submitted_at,
            'editable' => $this->editable($draft, $order), 'order_id' => $order?->id,
            'order_code' => $order?->order_code, 'status' => $order?->status ?? ($draft->submitted_at ? 'removed' : 'draft_local'),
            'order_items' => $order?->items()->get(['product_name_snapshot', 'quantity', 'unit_price', 'subtotal', 'notes']),
            'paid_amount' => $order?->paid_amount ?? 0, 'remaining_amount' => $order?->remaining_amount ?? $draft->total,
            'invoices' => $order?->invoices()->whereIn('status', ['issued', 'paid'])->get(['id', 'invoice_code', 'status', 'total_amount']) ?? [],
            'review' => $order?->review()->first(['id', 'rating', 'review_text', 'is_published']),
        ];
    }

    public function drafts(Request $request)
    {
        $customer = $this->customer($request);
        $rows = PortalDraft::where('user_id', $request->user()->id)->where('customer_id', $customer?->id ?? 0)
            ->with('order')->latest()->paginate(30);
        return response()->json(['data' => $rows->through(fn ($draft) => $this->payload($draft))]);
    }

    public function orders(Request $request)
    {
        $customer = $this->customer($request);
        $rows = Order::where('customer_id', $customer?->id ?? 0)->where('company_id', $customer?->company_id ?? 0)
            ->whereNotIn('id', PortalDraft::where('user_id', $request->user()->id)->whereNotNull('order_id')->select('order_id'))
            ->latest()->paginate(30);
        return response()->json(['data' => $rows->through(function ($order) use ($customer) {
            $draft = new PortalDraft(['id' => 'order-'.$order->id, 'customer_id' => $order->customer_id,
                'order_id' => $order->id, 'items' => [], 'shipping_address' => $customer->address,
                'total' => $order->grand_total, 'submitted_at' => $order->created_at]);
            $draft->setRelation('order', $order);
            return array_merge($this->payload($draft), ['id' => 'order-'.$order->id, 'editable' => false]);
        })]);
    }

    private function draftData(Request $request, Customer $customer): array
    {
        abort_unless($customer->status === 'active', 403);
        $data = $request->validate([
            'items' => 'required|array|min:1|max:20', 'items.*.product_id' => 'required|integer|distinct',
            'items.*.quantity' => 'required|integer|min:12|max:10000',
            'notes' => 'nullable|string|max:3000', 'shipping_address' => 'required|string|max:255',
        ]);
        $totalCents = 0;
        $items = [];
        foreach ($data['items'] as $item) {
            $product = Product::whereKey($item['product_id'])->where('company_id', $customer->company_id)->where('status', 'active')->first();
            abort_unless($product && (float) $product->price > 0, 422, 'Produk tidak tersedia atau harganya perlu dikonfirmasi admin.');
            $cents = (int) round((float) $product->price * 100);
            $totalCents += $cents * $item['quantity'];
            abort_if($totalCents > 99999999999, 422, 'Nilai pesanan terlalu besar. Hubungi admin.');
            $items[] = ['product_id' => $product->id, 'product_name' => $product->name,
                'quantity' => $item['quantity'], 'unit_price' => $cents / 100, 'subtotal' => ($cents * $item['quantity']) / 100];
        }
        return ['items' => $items, 'total' => $totalCents / 100, 'notes' => $data['notes'] ?? null, 'shipping_address' => $data['shipping_address']];
    }

    public function createDraft(Request $request)
    {
        $customer = $this->customer($request);
        abort_unless($customer && $customer->address && $customer->phone, 422, 'Lengkapi profil pelanggan terlebih dahulu.');
        $data = $this->draftData($request, $customer);
        $draft = PortalDraft::create($data + ['user_id' => $request->user()->id, 'customer_id' => $customer->id]);
        return response()->json(['data' => $this->payload($draft)], 201);
    }

    private function assertVersion(Request $request, PortalDraft $draft): void
    {
        $data = $request->validate(['version' => 'required|integer|min:1']);
        abort_unless((int) $data['version'] === $draft->version, 409, 'Pesanan telah berubah. Segarkan halaman terlebih dahulu.');
    }

    private function lockedOrder(PortalDraft $draft): ?Order
    {
        return $draft->order_id ? Order::whereKey($draft->order_id)->lockForUpdate()->first() : null;
    }

    private function syncOrder(PortalDraft $draft, Order $order): void
    {
        $order->fill(['subtotal' => $draft->total, 'grand_total' => $draft->total, 'remaining_amount' => $draft->total,
            'discount_amount' => 0, 'shipping_cost' => 0,
            'notes' => 'Alamat pengiriman: '.$draft->shipping_address."\n".($draft->notes ?? '')])->save();
        $order->items()->delete();
        foreach ($draft->items as $item) {
            $order->items()->create(['product_id' => $item['product_id'], 'product_name_snapshot' => $item['product_name'],
                'quantity' => $item['quantity'], 'unit_price' => $item['unit_price'], 'subtotal' => $item['subtotal'],
                'cost_price' => 0, 'discount_amount' => 0]);
        }
    }

    public function updateDraft(Request $request, int $draft)
    {
        $result = DB::transaction(function () use ($request, $draft) {
            $draft = $this->ownedDraft($request, $draft);
            $this->assertVersion($request, $draft);
            $order = $this->lockedOrder($draft);
            abort_unless($this->editable($draft, $order), 409, 'Pesanan sudah ditangani admin dan tidak dapat diubah.');
            $draft->fill($this->draftData($request, $draft->customer));
            $draft->version++;
            $draft->save();
            if ($order) $this->syncOrder($draft, $order);
            return $this->payload($draft->fresh());
        });
        return response()->json(['data' => $result]);
    }

    public function submitDraft(Request $request, int $draft)
    {
        $result = DB::transaction(function () use ($request, $draft) {
            $draft = $this->ownedDraft($request, $draft);
            if ($draft->submitted_at) {
                abort_unless($draft->order_id, 409, 'Pesanan ini telah dihapus admin.');
                return $this->payload($draft); // Idempotent: retry never creates another order.
            }
            $this->assertVersion($request, $draft);
            abort_unless($draft->customer->status === 'active', 403);
            foreach ($draft->items as $item) {
                $product = Product::whereKey($item['product_id'])->where('company_id', $draft->customer->company_id)->where('status', 'active')->first();
                abort_unless($product && round((float) $product->price, 2) === round((float) $item['unit_price'], 2), 409,
                    'Harga atau ketersediaan produk berubah. Edit dan simpan ulang draft.');
            }
            $order = Order::create(['company_id' => $draft->customer->company_id, 'customer_id' => $draft->customer_id,
                'order_code' => CodeGeneratorService::orderNumber(), 'order_date' => now()->toDateString(),
                'status' => 'draft', 'subtotal' => $draft->total, 'grand_total' => $draft->total,
                'remaining_amount' => $draft->total, 'paid_amount' => 0]);
            $this->syncOrder($draft, $order);
            $draft->update(['order_id' => $order->id, 'submitted_at' => now(), 'version' => $draft->version + 1]);
            return $this->payload($draft->fresh());
        });
        return response()->json(['data' => $result]);
    }

    public function deleteDraft(Request $request, int $draft)
    {
        DB::transaction(function () use ($request, $draft) {
            $draft = $this->ownedDraft($request, $draft);
            $this->assertVersion($request, $draft);
            $order = $this->lockedOrder($draft);
            abort_unless($this->editable($draft, $order), 409, 'Pesanan sudah ditangani admin dan tidak dapat dihapus.');
            $draft->delete();
            if ($order) $order->delete();
        });
        return response()->json(['message' => 'Draft dihapus.']);
    }

    private function ownedOrder(Request $request, int $id): Order
    {
        $customer = $this->customer($request);
        abort_unless($customer, 404);
        return Order::where('customer_id', $customer->id)->where('company_id', $customer->company_id)->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    public function engagement(Request $request)
    {
        $customer = $this->customer($request);
        return response()->json(['data' => [
            'reviews' => Review::where('customer_id', $customer?->id ?? 0)->latest()->limit(100)->get(['id', 'order_id', 'rating', 'review_text', 'is_published']),
            'testimonials' => Testimonial::where('customer_id', $customer?->id ?? 0)->latest()->limit(100)->get(['id', 'review_id', 'quote', 'is_published']),
        ]]);
    }

    public function review(Request $request, int $order)
    {
        $data = $request->validate(['rating' => 'required|integer|min:1|max:10', 'review_text' => 'required|string|max:2000']);
        $review = DB::transaction(function () use ($request, $order, $data) {
            $order = $this->ownedOrder($request, $order);
            abort_unless($order->status === 'paid', 422, 'Review hanya untuk pesanan lunas.');
            abort_if($order->review()->exists(), 409, 'Review sudah dikirim.');
            return Review::create($data + ['order_id' => $order->id, 'customer_id' => $order->customer_id, 'is_published' => false]);
        });
        return response()->json(['data' => $review], 201);
    }

    public function testimonial(Request $request)
    {
        $customer = $this->customer($request);
        abort_unless($customer, 404);
        $data = $request->validate(['review_id' => 'required|integer', 'quote' => 'required|string|max:2000']);
        $testimonial = DB::transaction(function () use ($customer, $data) {
            $review = Review::where('customer_id', $customer->id)->whereKey($data['review_id'])->lockForUpdate()->firstOrFail();
            abort_if(Testimonial::where('review_id', $review->id)->exists(), 409, 'Testimonial untuk review ini sudah ada.');
            return Testimonial::create($data + ['customer_id' => $customer->id, 'is_published' => false, 'is_featured' => false]);
        });
        return response()->json(['data' => $testimonial], 201);
    }

    public function invoice(Request $request, int $invoice)
    {
        $invoice = Invoice::whereKey($invoice)->whereIn('status', ['issued', 'paid'])->firstOrFail();
        $this->ownedOrder($request, $invoice->order_id);
        return app(InvoicePdfService::class)->download($invoice);
    }
}
