<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    public function sales(Request $request): JsonResponse
    {
        $orders = $this->filteredOrders($request, ['customer', 'items'])->get();

        $quantity = $orders->sum(fn (Order $order) => $order->items->sum('quantity'));
        $revenue = $orders->sum('grand_total');

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_orders' => $orders->count(),
                    'total_quantity' => (int) $quantity,
                    'revenue' => round((float) $revenue, 2),
                    'average_order_value' => $orders->isEmpty()
                        ? 0
                        : round((float) $revenue / $orders->count(), 2),
                ],
                'rows' => $orders->map(fn (Order $order) => [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'customer_name' => $order->customer?->name,
                    'order_date' => $order->order_date,
                    'status' => $order->status,
                    'quantity' => (int) $order->items->sum('quantity'),
                    'subtotal' => (float) $order->subtotal,
                    'discount_amount' => (float) $order->discount_amount,
                    'shipping_cost' => (float) $order->shipping_cost,
                    'grand_total' => (float) $order->grand_total,
                    'paid_amount' => (float) $order->paid_amount,
                    'remaining_amount' => (float) $order->remaining_amount,
                ])->values(),
            ],
        ]);
    }

    public function profit(Request $request): JsonResponse
    {
        $orders = $this->filteredOrders($request, ['items', 'shipments'])->get();

        $revenue = $orders->sum('grand_total');
        $productionCost = $orders->sum(fn (Order $order) => $order->items->sum(fn ($item) => (float) $item->cost_price * (float) $item->quantity));
        $shippingCost = $orders->sum('shipping_cost');
        $discount = $orders->sum('discount_amount');

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'revenue' => round((float) $revenue, 2),
                    'production_cost' => round($productionCost, 2),
                    'shipping_cost' => round((float) $shippingCost, 2),
                    'discount' => round((float) $discount, 2),
                    'profit' => round((float) $revenue - $productionCost - (float) $shippingCost, 2),
                ],
                'rows' => $orders->map(function (Order $order) {
                    $cost = $order->items->sum(fn ($item) => (float) $item->cost_price * (float) $item->quantity);

                    return [
                        'id' => $order->id,
                        'order_code' => $order->order_code,
                        'customer_name' => $order->customer?->name,
                        'order_date' => $order->order_date,
                        'status' => $order->status,
                        'grand_total' => (float) $order->grand_total,
                        'production_cost' => round($cost, 2),
                        'shipping_cost' => (float) $order->shipping_cost,
                        'discount_amount' => (float) $order->discount_amount,
                        'profit' => round((float) $order->grand_total - $cost - (float) $order->shipping_cost, 2),
                    ];
                })->values(),
            ],
        ]);
    }

    public function customers(Request $request): JsonResponse
    {
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        $ordersQuery = Order::query()->when($start, fn ($query) => $query->whereDate('order_date', '>=', $start))
            ->when($end, fn ($query) => $query->whereDate('order_date', '<=', $end));

        $newCustomersQuery = Customer::query();
        if ($start) {
            $newCustomersQuery->whereDate('created_at', '>=', $start);
        }
        if ($end) {
            $newCustomersQuery->whereDate('created_at', '<=', $end);
        }

        $customerRows = $ordersQuery->with('customer')->get()->groupBy('customer_id')->map(function ($orders, $customerId) {
            $customer = $orders->first()?->customer;

            return [
                'id' => (int) $customerId,
                'customer_name' => $customer?->name,
                'customer_code' => $customer?->customer_code,
                'city' => $customer?->city,
                'order_count' => $orders->count(),
                'total_spent' => round((float) $orders->sum('grand_total'), 2),
                'last_order_date' => $orders->max('order_date'),
            ];
        })->values();

        $repeatCount = $customerRows->filter(fn (array $row) => $row['order_count'] > 1)->count();
        $totalSpent = $customerRows->sum('total_spent');

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_customers' => $customerRows->count(),
                    'new_customers' => $newCustomersQuery->count(),
                    'repeat_customers' => $repeatCount,
                    'total_spent' => round($totalSpent, 2),
                    'average_customer_value' => $customerRows->isEmpty()
                        ? 0
                        : round($totalSpent / $customerRows->count(), 2),
                ],
                'rows' => $customerRows
                    ->sortByDesc('total_spent')
                    ->values(),
            ],
        ]);
    }

    public function products(Request $request): JsonResponse
    {
        $orderIds = $this->filteredOrders($request)->get()->pluck('id');

        $items = OrderItem::query()
            ->when($orderIds->isNotEmpty(), fn ($query) => $query->whereIn('order_id', $orderIds))
            ->get();

        $productRows = $items->groupBy(fn ($item) => $item->product_id ?? 0)->map(function ($group) {
            $product = Product::find($group->first()?->product_id);
            $quantity = $group->sum('quantity');
            $revenue = $group->sum(fn ($item) => (float) $item->quantity * (float) $item->unit_price);
            $cost = $group->sum(fn ($item) => (float) $item->quantity * (float) $item->cost_price);

            return [
                'id' => $group->first()?->product_id,
                'product_name' => $group->first()?->product_name_snapshot ?? $product?->name ?? 'Custom item',
                'sku' => $product?->sku,
                'category' => $product?->category,
                'quantity' => (int) $quantity,
                'revenue' => round($revenue, 2),
                'cost' => round($cost, 2),
                'profit' => round($revenue - $cost, 2),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_quantity' => (int) $items->sum('quantity'),
                    'revenue' => round($items->sum(fn ($item) => (float) $item->quantity * (float) $item->unit_price), 2),
                    'cost' => round($items->sum(fn ($item) => (float) $item->quantity * (float) $item->cost_price), 2),
                    'profit' => round($items->sum(fn ($item) => (float) $item->quantity * ((float) $item->unit_price - (float) $item->cost_price)), 2),
                ],
                'rows' => $productRows
                    ->sortByDesc('quantity')
                    ->values(),
            ],
        ]);
    }

    public function export(Request $request, string $type): Response
    {
        $format = $request->input('format', 'csv');

        if ($format !== 'csv') {
            throw ValidationException::withMessages([
                'format' => ['Format yang didukung saat ini: csv.'],
            ]);
        }

        if (! in_array($type, ['sales', 'profit', 'customers', 'products'], true)) {
            abort(404);
        }

        $data = match ($type) {
            'sales' => $this->sales($request)->getData(true)['data'],
            'profit' => $this->profit($request)->getData(true)['data'],
            'customers' => $this->customers($request)->getData(true)['data'],
            'products' => $this->products($request)->getData(true)['data'],
        };

        $rows = $data['rows'] ?? [];
        $rows = is_array($rows) ? $rows : ($rows instanceof \Illuminate\Support\Collection ? $rows->all() : []);

        $header = array_keys($rows[0] ?? [
            'order_code', 'customer_name', 'order_date', 'status', 'quantity',
            'subtotal', 'discount_amount', 'shipping_cost', 'grand_total', 'paid_amount', 'remaining_amount',
        ]);

        $stream = fopen('php://temp', 'r+');

        fputcsv($stream, $header);

        foreach ($rows as $row) {
            fputcsv($stream, $row);
        }

        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"report-{$type}-" . now()->format('YmdHis') . ".csv\"",
        ]);
    }

    private function filteredOrders(Request $request, array $with = []): \Illuminate\Database\Eloquent\Builder
    {
        $query = Order::query()->with($with)->latest('order_date');

        if ($request->filled('start_date')) {
            $query->whereDate('order_date', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('order_date', '<=', $request->input('end_date'));
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->input('customer_id'));
        }

        if ($request->filled('product_id')) {
            $query->whereHas('items', fn ($items) => $items->where('product_id', $request->input('product_id')));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return $query;
    }
}
