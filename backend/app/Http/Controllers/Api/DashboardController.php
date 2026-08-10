<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductionEvent;
use App\Models\Review;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    private const ACTIVE_STATUSES = ['waiting_dp', 'dp_received', 'processing'];

    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', 'this_month');
        [$from, $to] = $this->periodRange($period);

        $ordersQuery = Order::query();
        $paymentsQuery = Payment::query();
        $customersQuery = Customer::query();

        if ($from !== null) {
            $ordersQuery->whereBetween('created_at', [$from, $to]);
            $paymentsQuery->whereBetween('created_at', [$from, $to]);
            $customersQuery->whereBetween('created_at', [$from, $to]);
        }

        $totalOrders = (clone $ordersQuery)->count();
        $activeOrders = (clone $ordersQuery)->whereIn('status', self::ACTIVE_STATUSES)->count();
        $revenue = (clone $paymentsQuery)->sum('amount');
        $outstanding = (clone $ordersQuery)->whereIn('status', self::ACTIVE_STATUSES)->sum('remaining_amount');
        $totalCustomers = (clone $customersQuery)->count();
        $totalProducts = Product::count();

        $metrics = [
            ['label' => 'Total Orders', 'value' => (string) $totalOrders, 'trend' => null],
            ['label' => 'Active Orders', 'value' => (string) $activeOrders, 'trend' => null],
            ['label' => 'Revenue', 'value' => 'Rp' . number_format($revenue, 0, ',', '.'), 'trend' => null],
            ['label' => 'Outstanding', 'value' => 'Rp' . number_format($outstanding, 0, ',', '.'), 'trend' => null],
            ['label' => 'Customers', 'value' => (string) $totalCustomers, 'trend' => null],
            ['label' => 'Products', 'value' => (string) $totalProducts, 'trend' => null],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'metrics' => $metrics,
                'recentActivities' => $this->recentActivities(),
            ],
        ]);
    }

    private function periodRange(?string $period): array
    {
        $now = Carbon::now();

        return match ($period) {
            'last_month' => [$now->copy()->subMonthNoOverflow()->startOfMonth(), $now->copy()->startOfMonth()],
            'last_3_months' => [$now->copy()->subMonthsNoOverflow(3)->startOfMonth(), $now],
            'this_year' => [$now->copy()->startOfYear(), $now],
            'all_time' => [null, null],
            default => [$now->copy()->startOfMonth(), $now],
        };
    }

    private function recentActivities(): array
    {
        $activities = [];

        Order::latest('updated_at')->take(5)->get()->each(function (Order $order) use (&$activities) {
            $activities[] = [
                'title' => "Order {$order->order_code} diperbarui",
                'description' => "Status: " . $order->status,
                'createdAt' => $order->updated_at?->toISOString(),
            ];
        });

        Payment::with('order')->latest()->take(4)->get()->each(function (Payment $payment) use (&$activities) {
            $activities[] = [
                'title' => 'Pembayaran dicatat',
                'description' => 'Rp' . number_format($payment->amount, 0, ',', '.')
                    . ($payment->order ? " untuk {$payment->order->order_code}" : ''),
                'createdAt' => $payment->created_at?->toISOString(),
            ];
        });

        Invoice::latest()->take(4)->get()->each(function (Invoice $invoice) use (&$activities) {
            $activities[] = [
                'title' => "Invoice {$invoice->invoice_code} dibuat",
                'description' => 'Total: Rp' . number_format($invoice->total_amount, 0, ',', '.'),
                'createdAt' => $invoice->created_at?->toISOString(),
            ];
        });

        ProductionEvent::with('productionOrder.order.customer')->latest()->take(4)->get()->each(function (ProductionEvent $event) use (&$activities) {
            $order = $event->productionOrder?->order;
            $orderLabel = $order?->order_code ?? ('#' . $event->production_order_id);
            $activities[] = [
                'title' => "Produksi {$orderLabel} diperbarui",
                'description' => 'Status: ' . ($event->status ?? '-'),
                'createdAt' => $event->created_at?->toISOString(),
            ];
        });

        Shipment::with('order')->latest()->take(4)->get()->each(function (Shipment $shipment) use (&$activities) {
            $tracking = $shipment->tracking_number ?? ('#' . $shipment->id);
            $activities[] = [
                'title' => "Shipment {$tracking} dibuat",
                'description' => trim(($shipment->courier ?? '') . ' — ' . ($shipment->order?->order_code ?? ''), ' —'),
                'createdAt' => $shipment->created_at?->toISOString(),
            ];
        });

        Review::with('order')->latest()->take(4)->get()->each(function (Review $review) use (&$activities) {
            $activities[] = [
                'title' => "Review {$review->rating}/10 diterima",
                'description' => $review->order?->order_code ? "Untuk {$review->order->order_code}" : '',
                'createdAt' => $review->created_at?->toISOString(),
            ];
        });

        usort($activities, fn (array $a, array $b) => strcmp((string) ($b['createdAt'] ?? ''), (string) ($a['createdAt'] ?? '')));

        return array_slice(array_values($activities), 0, 8);
    }
}
