<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private const ACTIVE_STATUSES = ['waiting_dp', 'dp_received', 'processing'];

    public function index(Request $request): JsonResponse
    {
        $totalOrders = Order::count();
        $activeOrders = Order::whereIn('status', self::ACTIVE_STATUSES)->count();
        $revenue = Payment::sum('amount');
        $outstanding = Order::whereIn('status', self::ACTIVE_STATUSES)->sum('remaining_amount');
        $totalCustomers = Customer::count();
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
                'metrics' => $metrics,
                'recentActivities' => $this->recentActivities(),
            ],
        ]);
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

        usort($activities, fn (array $a, array $b) => strcmp((string) ($b['createdAt'] ?? ''), (string) ($a['createdAt'] ?? '')));

        return array_slice(array_values($activities), 0, 8);
    }
}
