<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        $payment = Payment::create($data);

        $this->recalculateOrder($payment->order_id);

        $payment->load('order');

        return response()->json([
            'success' => true,
            'data' => $payment,
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

        $payment->update($data);

        $this->recalculateOrder($payment->order_id);

        $payment->load('order');

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $orderId = $payment->order_id;
        $payment->delete();

        $this->recalculateOrder($orderId);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran dihapus.',
        ]);
    }

    private function recalculateOrder(int $orderId): void
    {
        $order = Order::find($orderId);

        if (! $order) {
            return;
        }

        $paidAmount = $order->payments()->sum('amount');

        $order->update([
            'paid_amount' => $paidAmount,
            'remaining_amount' => max(0, $order->grand_total - $paidAmount),
        ]);
    }
}
