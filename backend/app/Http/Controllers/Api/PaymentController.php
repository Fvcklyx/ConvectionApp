<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Order;
use App\Models\Payment;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    use ScopesByCompany;

    private const PAYMENT_TYPES = ['dp', 'final'];

    public function index(Request $request): JsonResponse
    {
        $query = Payment::query()->with('order');

        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->whereHas('order', fn ($orders) => $orders->where('company_id', $companyId));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:1',
            'payment_type' => 'nullable|string|in:' . implode(',', self::PAYMENT_TYPES),
            'payment_date' => 'required|date',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $data['payment_type'] = $data['payment_type'] ?? 'dp';

        $order = Order::findOrFail($data['order_id']);

        $this->assertSameCompany($order->company_id, $request);

        $payment = DB::transaction(function () use ($data, $order): Payment {
            $locked = Order::whereKey($order->getKey())->lockForUpdate()->first();

            $this->assertValidPayment($locked, $data['payment_type'], $data['amount']);

            $payment = Payment::create($data);

            $this->syncOrderAfterPaymentChange($locked);

            return $payment;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dicatat.',
            'data' => $payment->load('order'),
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load('order');

        $this->assertSameCompany($payment->order->company_id, request());

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    public function update(Request $request, Payment $payment): JsonResponse
    {
        $this->authorize('update', $payment);

        $payment->load('order');

        $this->assertSameCompany($payment->order->company_id, $request);

        $data = $request->validate([
            'amount' => 'sometimes|numeric|min:1',
            'payment_type' => 'sometimes|string|in:' . implode(',', self::PAYMENT_TYPES),
            'payment_date' => 'sometimes|date',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $order = $payment->order;

        $newType = $data['payment_type'] ?? $payment->payment_type;
        $newAmount = $data['amount'] ?? $payment->amount;

        DB::transaction(function () use ($order, $payment, $data, $newType, $newAmount): void {
            $locked = Order::whereKey($order->getKey())->lockForUpdate()->first();

            $this->assertValidPayment($locked, $newType, $newAmount, $payment->id);

            $payment->update($data);

            $this->syncOrderAfterPaymentChange($locked);
        });

        return response()->json([
            'success' => true,
            'data' => $payment->fresh()->load('order'),
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $this->authorize('delete', $payment);

        $payment->load('order');

        $this->assertSameCompany($payment->order->company_id, request());

        $order = $payment->order;

        DB::transaction(function () use ($order, $payment): void {
            $locked = Order::whereKey($order->getKey())->lockForUpdate()->first();

            $payment->delete();

            $this->syncOrderAfterPaymentChange($locked);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran dihapus.',
            'data' => null,
        ]);
    }

    private function assertValidPayment(Order $order, string $type, float $amount, ?int $exceptId = null): void
    {
        // Order yang sudah lunas tidak boleh menerima pembayaran BARU,
        // tetapi pembayaran yang sudah ada tetap boleh diedit/dihapus.
        if ($exceptId === null && $order->status === 'paid' && $order->remaining_amount <= 0) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah lunas.'],
            ]);
        }

        $otherPaid = $order->payments()
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->sum('amount');

        $remaining = (float) $order->grand_total - (float) $otherPaid;

        if ($remaining <= 0 && $exceptId === null) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah lunas.'],
            ]);
        }

        if ($amount > max(0, $remaining)) {
            throw ValidationException::withMessages([
                'amount' => ['Pembayaran melebihi sisa tagihan order.'],
            ]);
        }

        $hasDp = $order->payments()
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->where('payment_type', 'dp')
            ->exists();

        if ($type === 'dp' && $hasDp) {
            throw ValidationException::withMessages([
                'payment_type' => ['Order ini sudah memiliki pembayaran DP.'],
            ]);
        }

        if ($type === 'final' && ! $hasDp) {
            throw ValidationException::withMessages([
                'payment_type' => ['Pembayaran pelunasan hanya dapat dicatat setelah DP masuk.'],
            ]);
        }

        // Kebijakan DP dari application settings (order.require_dp / order.dp_percent).
        if ($type === 'dp' && ! $hasDp) {
            $this->assertDpMeetsPolicy($order, $amount);
        }
    }

    private function assertDpMeetsPolicy(Order $order, float $amount): void
    {
        $requireDp = (bool) ApplicationSetting::value('order.require_dp', true);

        if (! $requireDp) {
            return;
        }

        $dpPercent = (float) ApplicationSetting::value('order.dp_percent', 50);

        if ($dpPercent <= 0) {
            return;
        }

        $minimum = ((float) $order->grand_total) * ($dpPercent / 100);

        if ($amount < $minimum) {
            throw ValidationException::withMessages([
                'amount' => [
                    "Pembayaran DP minimal {$dpPercent}% dari total order (minimal "
                    . number_format($minimum, 0, ',', '.') . ').',
                ],
            ]);
        }
    }

    private function syncOrderAfterPaymentChange(Order $order): void
    {
        $order->refresh();

        $paid = (float) $order->payments()->sum('amount');
        $grand = (float) $order->grand_total;
        $hasDp = $order->payments()->where('payment_type', 'dp')->exists();

        $order->paid_amount = $paid;
        $order->remaining_amount = max(0, $grand - $paid);
        $order->save();

        if ($paid >= $grand) {
            if ($order->status !== 'paid') {
                $order->update(['status' => 'paid']);
            }

            $this->syncInvoicesToPaid($order);

            return;
        }

        // Pembayaran berkurang/hapus: turunkan status bila order tidak lagi lunas.
        if ($order->status === 'paid') {
            $order->update(['status' => $hasDp ? 'dp_received' : 'waiting_dp']);
            $this->syncInvoicesToOutstanding($order);

            return;
        }

        if ($hasDp && in_array($order->status, ['draft', 'waiting_dp'], true)) {
            $order->update(['status' => 'dp_received']);
        }
    }

    private function syncInvoicesToPaid(Order $order): void
    {
        $order->invoices()->where('status', '!=', 'paid')->update(['status' => 'paid']);
    }

    private function syncInvoicesToOutstanding(Order $order): void
    {
        $order->invoices()
            ->where('status', 'paid')
            ->where('outstanding_amount', '>', 0)
            ->update(['status' => 'issued']);
    }
}
