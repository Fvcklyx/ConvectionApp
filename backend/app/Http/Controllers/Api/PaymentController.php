<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    private const PAYMENT_TYPES = ['dp', 'final'];

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Payment::with('order')->latest()->paginate(20),
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

        $this->assertValidPayment($order, $data['payment_type'], $data['amount']);

        $payment = Payment::create($data);

        $this->syncOrderAfterPaymentChange($order);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dicatat.',
            'data' => $payment->load('order'),
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load('order');

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    public function update(Request $request, Payment $payment): JsonResponse
    {
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

        $this->assertValidPayment($order, $newType, $newAmount, $payment->id);

        $payment->update($data);

        $this->syncOrderAfterPaymentChange($order);

        return response()->json([
            'success' => true,
            'data' => $payment->load('order'),
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $order = $payment->order;
        $payment->delete();

        $this->syncOrderAfterPaymentChange($order);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran dihapus.',
            'data' => null,
        ]);
    }

    private function assertValidPayment(Order $order, string $type, float $amount, ?int $exceptId = null): void
    {
        if ($order->status === 'paid' && $order->remaining_amount <= 0) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah lunas.'],
            ]);
        }

        $otherPaid = $order->payments()
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->sum('amount');

        $remaining = (float) $order->grand_total - (float) $otherPaid;

        if ($remaining <= 0) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah lunas.'],
            ]);
        }

        if ($amount > $remaining) {
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
    }

    private function syncOrderAfterPaymentChange(Order $order): void
    {
        $order->refresh();

        $paid = (float) $order->payments()->sum('amount');
        $grand = (float) $order->grand_total;

        $order->paid_amount = $paid;
        $order->remaining_amount = max(0, $grand - $paid);
        $order->save();

        if ($paid >= $grand && $order->status !== 'paid') {
            $order->update(['status' => 'paid']);

            return;
        }

        if ($order->payments()->where('payment_type', 'dp')->exists()
            && in_array($order->status, ['draft', 'waiting_dp'], true)) {
            $order->update(['status' => 'dp_received']);
        }
    }
}
