<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductionEvent;
use App\Models\ProductionOrder;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductionController extends Controller
{
    use ScopesByCompany;

    private const PRODUCTION_STATUSES = ['design', 'approval', 'production', 'quality_control', 'packing', 'shipping'];

    public function index(Request $request): JsonResponse
    {
        $query = ProductionOrder::query()->with(['order.customer', 'events']);

        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->whereHas('order', fn ($orders) => $orders->where('company_id', $companyId));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request, Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, $request);

        $data = $request->validate([
            'status' => 'nullable|string|in:' . implode(',', self::PRODUCTION_STATUSES),
            'notes' => 'nullable|string',
        ]);

        if ($order->production()->exists()) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah memiliki production order.'],
            ]);
        }

        // Produksi hanya dapat dimulai ketika order sudah menerima DP.
        if (! in_array($order->status, ['dp_received', 'processing', 'paid'], true)) {
            throw ValidationException::withMessages([
                'order_id' => [
                    'Produksi hanya dapat dimulai setelah order menerima DP'
                    . ' (status order: draft → waiting_dp → dp_received).',
                ],
            ]);
        }

        // Production order selalu dimulai dari tahap design.
        $production = ProductionOrder::create([
            'order_id' => $order->id,
            'status' => 'design',
            'started_at' => null,
            'completed_at' => null,
            'notes' => $data['notes'] ?? null,
        ]);

        $production->events()->create([
            'status' => $production->status,
            'notes' => $production->notes,
            'created_by' => $request->user()?->id,
        ]);

        $production->load(['order.customer', 'events']);

        return response()->json([
            'success' => true,
            'data' => $production,
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, request());

        $production = $order->production()->with(['order.customer', 'events'])->first();

        if (! $production) {
            return response()->json([
                'success' => true,
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $production,
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, $request);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::PRODUCTION_STATUSES)],
            'notes' => 'nullable|string',
        ]);

        $production = $order->production()->first();

        if (! $production) {
            throw ValidationException::withMessages([
                'order_id' => ['Belum ada production order untuk order ini.'],
            ]);
        }

        $this->authorize('update', $production);

        if ($data['status'] !== $production->status) {
            $this->assertAllowedTransition($production->status, $data['status']);
        }

        $production->update([
            'status' => $data['status'],
            'started_at' => $production->started_at ?? now(),
            'completed_at' => $data['status'] === 'shipping' ? now() : $production->completed_at,
        ]);

        $production->events()->create([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        $production->load(['order.customer', 'events']);

        return response()->json([
            'success' => true,
            'data' => $production,
        ]);
    }

    public function events(Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, request());

        $production = $order->production()->first();

        if (! $production) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $production->events()->latest()->get(),
        ]);
    }

    public function storeEvent(Request $request, Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, $request);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::PRODUCTION_STATUSES)],
            'notes' => 'nullable|string',
        ]);

        $production = $order->production()->first();

        if (! $production) {
            throw ValidationException::withMessages([
                'order_id' => ['Belum ada production order untuk order ini.'],
            ]);
        }

        $this->authorize('update', $production);

        $this->assertAllowedTransition($production->status, $data['status']);

        $production->update([
            'status' => $data['status'],
            'started_at' => $production->started_at ?? now(),
            'completed_at' => $data['status'] === 'shipping' ? now() : $production->completed_at,
        ]);

        $event = ProductionEvent::create([
            'production_order_id' => $production->id,
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $event,
        ], 201);
    }

    private function assertAllowedTransition(string $current, string $next): void
    {
        $currentIndex = array_search($current, self::PRODUCTION_STATUSES, true);
        $nextIndex = array_search($next, self::PRODUCTION_STATUSES, true);

        if ($currentIndex !== false && $nextIndex !== false && $nextIndex <= $currentIndex) {
            throw ValidationException::withMessages([
                'status' => [
                    'Status produksi hanya dapat maju.'
                    . ' Urutan: design → approval → production → quality_control → packing → shipping.',
                ],
            ]);
        }
    }
}
