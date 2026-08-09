<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class FrndlySeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@frndly.test'],
            [
                'name' => 'Admin FRNDLY',
                'password' => bcrypt('password123'),
            ]
        );

        $company = Company::firstOrCreate(
            ['name' => 'FRNDLY Studio'],
            [
                'email' => 'hello@frndly.id',
                'phone' => '0812-3456-7890',
                'address' => 'Jl. Merdeka No. 10',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'primary_color' => '#111827',
                'secondary_color' => '#6366f1',
                'active' => true,
            ]
        );

        $customers = [];
        $customerData = [
            ['CUS-0001', 'Bambang Wijaya', '0812-1111-2222', 'bambang@example.com', 'Jl. Cikutra No. 5', 'Bandung', 'Jawa Barat'],
            ['CUS-0002', 'Siti Rahayu', '0813-2222-3333', 'siti@example.com', 'Jl. Dipatiukur No. 12', 'Bandung', 'Jawa Barat'],
            ['CUS-0003', 'Dewa Pratama', '0856-3333-4444', 'dewa@example.com', 'Jl. Malioboro No. 7', 'Yogyakarta', 'DI Yogyakarta'],
        ];
        foreach ($customerData as [$code, $name, $phone, $email, $address, $city, $province]) {
            $customers[$code] = Customer::firstOrCreate(
                ['customer_code' => $code],
                [
                    'company_id' => $company->id,
                    'name' => $name,
                    'phone' => $phone,
                    'email' => $email,
                    'address' => $address,
                    'city' => $city,
                    'province' => $province,
                    'notes' => 'Repeat customer',
                    'status' => 'active',
                ]
            );
        }

        $products = [];
        $productData = [
            ['PRD-001', 'Kaos Custom', 'Apparel', 'Cotton Combed 24s', 'Regular', 'Black', 'M', 75000],
            ['PRD-002', 'Jaket Bomber', 'Apparel', 'Drill', 'Bomber', 'Navy', 'L', 185000],
            ['PRD-003', 'Lanyard', 'Aksesoris', 'Satuan 2 cm', 'Standar', 'Merah', null, 15000],
            ['PRD-004', 'ID Card Holder', 'Aksesoris', 'PVC', 'Horizontal', 'Putih', null, 12000],
        ];
        foreach ($productData as [$sku, $name, $category, $material, $model, $color, $size, $price]) {
            $products[$sku] = Product::firstOrCreate(
                ['sku' => $sku],
                [
                    'company_id' => $company->id,
                    'name' => $name,
                    'category' => $category,
                    'material' => $material,
                    'model' => $model,
                    'color' => $color,
                    'size' => $size,
                    'price' => $price,
                    'status' => 'active',
                ]
            );
        }

        $orderData = [
            [
                'code' => 'ORD-20260801-001',
                'customer' => 'CUS-0001',
                'status' => 'paid',
                'items' => [
                    ['product' => 'PRD-001', 'qty' => 100, 'price' => 75000, 'cost' => 50000],
                ],
                'discount' => 0,
                'shipping' => 25000,
                'deadline' => now()->subDays(5)->toDateString(),
                'payments' => [
                    ['type' => 'dp', 'amount' => 3000000, 'ref' => 'PAY-001', 'date' => now()->subDays(8)->toDateString()],
                    ['type' => 'final', 'amount' => 4525000, 'ref' => 'PAY-002', 'date' => now()->subDays(6)->toDateString()],
                ],
                'invoice' => ['INV-20260801-001', 'paid'],
            ],
            [
                'code' => 'ORD-20260804-002',
                'customer' => 'CUS-0002',
                'status' => 'processing',
                'items' => [
                    ['product' => 'PRD-002', 'qty' => 50, 'price' => 185000, 'cost' => 140000],
                ],
                'discount' => 0,
                'shipping' => 0,
                'deadline' => now()->addDays(7)->toDateString(),
                'payments' => [
                    ['type' => 'dp', 'amount' => 4000000, 'ref' => 'PAY-003', 'date' => now()->subDays(4)->toDateString()],
                ],
                'invoice' => ['INV-20260804-002', 'issued'],
            ],
            [
                'code' => 'ORD-20260806-003',
                'customer' => 'CUS-0003',
                'status' => 'dp_received',
                'items' => [
                    ['product' => 'PRD-003', 'qty' => 200, 'price' => 15000, 'cost' => 8000],
                    ['product' => 'PRD-004', 'qty' => 100, 'price' => 12000, 'cost' => 6000],
                ],
                'discount' => 200000,
                'shipping' => 50000,
                'deadline' => now()->addDays(10)->toDateString(),
                'payments' => [
                    ['type' => 'dp', 'amount' => 1500000, 'ref' => 'PAY-004', 'date' => now()->subDays(2)->toDateString()],
                ],
                'invoice' => null,
            ],
            [
                'code' => 'ORD-20260808-004',
                'customer' => 'CUS-0001',
                'status' => 'waiting_dp',
                'items' => [
                    ['product' => 'PRD-001', 'qty' => 25, 'price' => 75000, 'cost' => 50000],
                ],
                'discount' => 0,
                'shipping' => 0,
                'deadline' => now()->addDays(14)->toDateString(),
                'payments' => [],
                'invoice' => null,
            ],
            [
                'code' => 'ORD-20260809-005',
                'customer' => 'CUS-0002',
                'status' => 'draft',
                'items' => [
                    ['product' => 'PRD-002', 'qty' => 10, 'price' => 185000, 'cost' => 140000],
                ],
                'discount' => 0,
                'shipping' => 0,
                'deadline' => null,
                'payments' => [],
                'invoice' => null,
            ],
        ];

        foreach ($orderData as $data) {
            $subtotal = array_sum(array_map(fn ($i) => $i['qty'] * $i['price'], $data['items']));
            $grandTotal = $subtotal - $data['discount'] + $data['shipping'];
            $paid = array_sum(array_column($data['payments'], 'amount'));

            $order = Order::firstOrCreate(
                ['order_code' => $data['code']],
                [
                    'company_id' => $company->id,
                    'customer_id' => $customers[$data['customer']]->id,
                    'status' => $data['status'],
                    'subtotal' => $subtotal,
                    'discount_amount' => $data['discount'],
                    'shipping_cost' => $data['shipping'],
                    'grand_total' => $grandTotal,
                    'paid_amount' => $paid,
                    'remaining_amount' => max(0, $grandTotal - $paid),
                    'deadline' => $data['deadline'],
                    'notes' => 'Seed data',
                ]
            );

            if ($order->items()->count() === 0) {
                foreach ($data['items'] as $item) {
                    $order->items()->create([
                        'product_id' => $products[$item['product']]->id,
                        'product_name_snapshot' => $products[$item['product']]->name,
                        'quantity' => $item['qty'],
                        'unit_price' => $item['price'],
                        'cost_price' => $item['cost'],
                        'discount_amount' => 0,
                        'subtotal' => $item['qty'] * $item['price'],
                    ]);
                }
            }

            foreach ($data['payments'] as $payment) {
                Payment::firstOrCreate(
                    ['reference' => $payment['ref']],
                    [
                        'order_id' => $order->id,
                        'amount' => $payment['amount'],
                        'payment_type' => $payment['type'],
                        'payment_date' => $payment['date'],
                        'notes' => $payment['type'] === 'dp' ? 'Down payment received' : 'Pelunasan',
                    ]
                );
            }

            if ($data['invoice'] !== null) {
                [$invoiceCode, $invoiceStatus] = $data['invoice'];
                Invoice::firstOrCreate(
                    ['invoice_code' => $invoiceCode],
                    [
                        'order_id' => $order->id,
                        'total_amount' => $grandTotal,
                        'paid_amount' => $paid,
                        'outstanding_amount' => max(0, $grandTotal - $paid),
                        'status' => $invoiceStatus,
                    ]
                );
            }
        }
    }
}
