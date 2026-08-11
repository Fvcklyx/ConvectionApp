<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ShipmentController extends Controller
{
    private const SHIPMENT_STATUSES = ['pending', 'packed', 'shipped', 'in_transit', 'delivered', 'cancelled'];

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Shipment::with(['order.customer', 'events'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function orderIndex(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $order->shipments()->with(['order.customer', 'events'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function store(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'recipient_name' => 'required|string|max:150',
            'recipient_phone' => 'nullable|string|max:30',
            'address' => 'required|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'courier' => 'nullable|string|max:100',
            'service' => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:100',
            'shipping_cost' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:' . implode(',', self::SHIPMENT_STATUSES),
            'notes' => 'nullable|string',
        ]);

        $data['shipping_cost'] = $data['shipping_cost'] ?? 0;
        $data['status'] = $data['status'] ?? 'pending';

        $shipment = $order->shipments()->create($data);

        $shipment->events()->create([
            'status' => $shipment->status,
            'notes' => $shipment->notes,
            'created_by' => $request->user()?->id,
        ]);

        $shipment->load(['order.customer', 'events']);

        return response()->json([
            'success' => true,
            'data' => $shipment,
        ], 201);
    }

    public function show(Order $order, Shipment $shipment): JsonResponse
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }

        $shipment->load(['order.customer', 'events']);

        return response()->json([
            'success' => true,
            'data' => $shipment,
        ]);
    }

    public function update(Request $request, Order $order, Shipment $shipment): JsonResponse
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }

        $data = $request->validate([
            'recipient_name' => 'sometimes|required|string|max:150',
            'recipient_phone' => 'nullable|string|max:30',
            'address' => 'sometimes|required|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'courier' => 'nullable|string|max:100',
            'service' => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:100',
            'shipping_cost' => 'nullable|numeric|min:0',
            'status' => 'sometimes|string|in:' . implode(',', self::SHIPMENT_STATUSES),
            'notes' => 'nullable|string',
        ]);

        if (array_key_exists('status', $data) && $data['status'] !== $shipment->status) {
            $this->assertAllowedTransition($shipment->status, $data['status']);
        }

        $shipment->update($data);

        if ($shipment->status === 'delivered') {
            $shipment->delivered_at = $shipment->delivered_at ?? now();
            $shipment->save();
        }

        if ($shipment->status === 'shipped' && $shipment->shipped_at === null) {
            $shipment->shipped_at = now();
            $shipment->save();
        }

        $shipment->load(['order.customer', 'events']);

        return response()->json([
            'success' => true,
            'data' => $shipment,
        ]);
    }

    public function events(Order $order, Shipment $shipment): JsonResponse
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }

        return response()->json([
            'success' => true,
            'data' => $shipment->events()->latest()->get(),
        ]);
    }

    public function storeEvent(Request $request, Order $order, Shipment $shipment): JsonResponse
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }

        $data = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::SHIPMENT_STATUSES)],
            'notes' => 'nullable|string',
        ]);

        if ($data['status'] !== $shipment->status) {
            $this->assertAllowedTransition($shipment->status, $data['status']);
        }

        $shipment->update(['status' => $data['status']]);

        if ($shipment->status === 'delivered') {
            $shipment->delivered_at = $shipment->delivered_at ?? now();
            $shipment->save();
        }

        if ($shipment->status === 'shipped' && $shipment->shipped_at === null) {
            $shipment->shipped_at = now();
            $shipment->save();
        }

        $event = ShipmentEvent::create([
            'shipment_id' => $shipment->id,
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $event,
        ], 201);
    }

    public function destroy(Order $order, Shipment $shipment): JsonResponse
    {
        if ($shipment->order_id !== $order->id) {
            abort(404);
        }

        $this->authorize('delete', $shipment);

        $shipment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Shipment dihapus.',
        ]);
    }

    private function assertAllowedTransition(string $current, string $next): void
    {
        if ($next === 'cancelled') {
            $progress = array_flip(self::SHIPMENT_STATUSES);
            if ($progress[$current] > $progress['packed']) {
                throw ValidationException::withMessages([
                    'status' => ['Shipment yang sudah dikirim tidak dapat dibatalkan.'],
                ]);
            }

            return;
        }

        $currentIndex = array_search($current, self::SHIPMENT_STATUSES, true);
        $nextIndex = array_search($next, self::SHIPMENT_STATUSES, true);

        if ($currentIndex !== false && $nextIndex !== false && $nextIndex <= $currentIndex) {
            throw ValidationException::withMessages([
                'status' => [
                    'Status shipment hanya dapat maju.'
                    . ' Urutan: pending → packed → shipped → in_transit → delivered.',
                ],
            ]);
        }
    }
}
