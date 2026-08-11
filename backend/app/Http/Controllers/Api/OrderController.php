<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    use ScopesByCompany;

    private const ORDER_STATUSES = ['draft', 'waiting_dp', 'dp_received', 'processing', 'paid'];

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->scopeCompany(Order::query(), $request)
                ->with(['customer', 'company', 'items', 'payments', 'invoice'])
                ->latest()
                ->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'customer_id' => 'required|exists:customers,id',
            'order_code' => 'nullable|string|unique:orders,order_code',
            'order_date' => 'nullable|date',
            'subtotal' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'grand_total' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'order_items' => 'nullable|array',
            'order_items.*.product_id' => 'nullable|exists:products,id',
            'order_items.*.product_name' => 'required_with:order_items|string',
            'order_items.*.quantity' => 'required_with:order_items|integer|min:1',
            'order_items.*.unit_price' => 'required_with:order_items|numeric|min:0',
            'order_items.*.cost_price' => 'nullable|numeric|min:0',
            'order_items.*.notes' => 'nullable|string',
        ]);

        // Company ditentukan dari konteks user (multi-tenant), bukan dari klien.
        $data['company_id'] = $this->companyId($request);
        $data['order_code'] = empty($data['order_code'] ?? null)
            ? CodeGeneratorService::orderNumber()
            : $data['order_code'];

        $data['order_date'] = $data['order_date'] ?? now()->toDateString();

        $items = $request->input('order_items');

        if ($items) {
            $subtotal = array_sum(array_map(
                fn ($item) => $item['quantity'] * $item['unit_price'],
                $items,
            ));
            $data['subtotal'] = $subtotal;
            $data['grand_total'] = max(0, $subtotal - ($data['discount_amount'] ?? 0) + ($data['shipping_cost'] ?? 0));
            $data['remaining_amount'] = $data['grand_total'];
        }

        // Status dan saldo pembayaran tidak boleh di-set oleh klien saat create.
        $data['status'] = 'draft';
        $data['paid_amount'] = 0;
        $data['discount_amount'] = $data['discount_amount'] ?? 0;
        $data['shipping_cost'] = $data['shipping_cost'] ?? 0;
        $data['subtotal'] = $data['subtotal'] ?? 0;
        $data['grand_total'] = $data['grand_total'] ?? 0;
        $data['remaining_amount'] = $data['remaining_amount'] ?? $data['grand_total'];

        $order = Order::create($data);

        if ($items) {
            foreach ($items as $item) {
                $product = isset($item['product_id']) ? Product::find($item['product_id']) : null;
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'product_name_snapshot' => $item['product_name'] ?? $product?->name ?? 'Product',
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'cost_price' => $item['cost_price'] ?? 0,
                    'discount_amount' => 0,
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }
        }

        $order->load(['customer', 'items', 'payments', 'invoice']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id);

        $order->load(['customer', 'company', 'items', 'payments', 'invoice']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $this->authorize('update', $order);
        $this->assertSameCompany($order->company_id);

        $data = $request->validate([
            'customer_id' => 'sometimes|exists:customers,id',
            'order_date' => 'nullable|date',
            'status' => 'sometimes|string|in:' . implode(',', self::ORDER_STATUSES),
            'discount_amount' => 'sometimes|numeric|min:0',
            'shipping_cost' => 'sometimes|numeric|min:0',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'order_items' => 'nullable|array',
            'order_items.*.id' => 'nullable|integer',
            'order_items.*.product_id' => 'nullable|exists:products,id',
            'order_items.*.product_name' => 'required_with:order_items|string',
            'order_items.*.quantity' => 'required_with:order_items|integer|min:1',
            'order_items.*.unit_price' => 'required_with:order_items|numeric|min:0',
            'order_items.*.cost_price' => 'nullable|numeric|min:0',
            'order_items.*.notes' => 'nullable|string',
        ]);

        if (array_key_exists('status', $data) && $data['status'] !== $order->status) {
            $this->assertAllowedStatusTransition($order->status, $data['status']);
        }

        $hasItems = array_key_exists('order_items', $data);
        $items = $hasItems ? ($data['order_items'] ?? []) : null;

        if ($items !== null) {
            $subtotal = array_sum(array_map(
                fn ($item) => $item['quantity'] * $item['unit_price'],
                $items,
            ));
            $data['subtotal'] = $subtotal;
            $data['grand_total'] = max(0, $subtotal
                - ($data['discount_amount'] ?? $order->discount_amount)
                + ($data['shipping_cost'] ?? $order->shipping_cost));
            $data['remaining_amount'] = max(0, $data['grand_total'] - $order->paid_amount);
        } elseif (array_key_exists('discount_amount', $data) || array_key_exists('shipping_cost', $data)) {
            $data['grand_total'] = max(0, ($order->subtotal)
                - ($data['discount_amount'] ?? $order->discount_amount)
                + ($data['shipping_cost'] ?? $order->shipping_cost));
            $data['remaining_amount'] = max(0, $data['grand_total'] - $order->paid_amount);
        }

        if (($data['status'] ?? $order->status) === 'paid') {
            $this->assertPaidOrderHasNoRemaining($data['grand_total'] ?? $order->grand_total, $order->paid_amount);
        }

        $order->update(collect($data)->except('order_items')->all());

        // Jika order paid tetapi item/diskonya berubah sehingga sisa tagihan positif,
        // turunkan status agar konsisten dengan pembayaran aktual.
        if ($order->status === 'paid' && (float) $order->fresh()->remaining_amount > 0) {
            $order->update(['status' => 'dp_received']);
        }

        if ($items !== null) {
            $order->items()->delete();

            foreach ($items as $item) {
                $product = isset($item['product_id']) ? Product::find($item['product_id']) : null;
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'product_name_snapshot' => $item['product_name'] ?? $product?->name ?? 'Product',
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'cost_price' => $item['cost_price'] ?? 0,
                    'discount_amount' => 0,
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }
        }

        $order->load(['customer', 'items', 'payments', 'invoice']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $this->authorize('update', $order);
        $this->assertSameCompany($order->company_id);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::ORDER_STATUSES)],
        ]);

        if ($data['status'] !== $order->status) {
            $this->assertAllowedStatusTransition($order->status, $data['status']);
        }

        if ($data['status'] === 'paid') {
            $this->assertPaidOrderHasNoRemaining($order->grand_total, $order->paid_amount);
        }

        $order->update(['status' => $data['status']]);

        $this->syncInvoicesWithStatus($order, $data['status']);

        return response()->json([
            'success' => true,
            'data' => $order->fresh(['customer', 'items', 'payments', 'invoice']),
        ]);
    }

    private function syncInvoicesWithStatus(Order $order, string $status): void
    {
        if ($status === 'paid') {
            $order->invoices()->where('status', '!=', 'paid')->update(['status' => 'paid']);
        } elseif ($status !== 'paid' && $order->remaining_amount > 0) {
            $order->invoices()
                ->where('status', 'paid')
                ->where('outstanding_amount', '>', 0)
                ->update(['status' => 'issued']);
        }
    }

    private function assertAllowedStatusTransition(string $current, string $next): void
    {
        $currentIndex = array_search($current, self::ORDER_STATUSES, true);
        $nextIndex = array_search($next, self::ORDER_STATUSES, true);

        if ($currentIndex !== false && $nextIndex !== false && $nextIndex < $currentIndex) {
            throw ValidationException::withMessages([
                'status' => [
                    'Tidak dapat mengubah status ke tahap sebelumnya.'
                    . ' Urutan: draft → waiting_dp → dp_received → processing → paid.',
                ],
            ]);
        }
    }

    private function assertPaidOrderHasNoRemaining(float|int|string $grandTotal, float|int|string $paidAmount): void
    {
        if ((float) $paidAmount < (float) $grandTotal) {
            throw ValidationException::withMessages([
                'status' => ['Status paid hanya dapat ditetapkan ketika order sudah lunas.'],
            ]);
        }
    }

    public function destroy(Order $order): JsonResponse
    {
        $this->authorize('delete', $order);
        $this->assertSameCompany($order->company_id);

        if ($order->payments()->exists() || $order->invoices()->exists()
            || $order->production()->exists() || $order->shipments()->exists()
            || $order->review()->exists()) {
            throw ValidationException::withMessages([
                'order_id' => [
                    'Order dengan pembayaran, invoice, produksi, pengiriman,'
                    . ' atau review tidak dapat dihapus.',
                ],
            ]);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order dihapus.',
        ]);
    }
}
