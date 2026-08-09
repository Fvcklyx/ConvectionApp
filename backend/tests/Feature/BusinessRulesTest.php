<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BusinessRulesTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::factory()->create([
            'email' => 'admin@frndly.test',
            'password' => bcrypt('password123'),
        ]);
    }

    private function createCustomer(Company $company): Customer
    {
        return Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-' . uniqid(),
            'name' => 'Customer Test',
        ]);
    }

    private function createOrder(Company $company, float $grandTotal = 1000000): Order
    {
        $customer = $this->createCustomer($company);

        return Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-' . uniqid(),
            'status' => 'waiting_dp',
            'grand_total' => $grandTotal,
            'subtotal' => $grandTotal,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'paid_amount' => 0,
            'remaining_amount' => $grandTotal,
        ]);
    }

    public function test_order_code_is_auto_generated_in_format(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $product = Product::create([
            'company_id' => $company->id,
            'sku' => 'PRD-' . uniqid(),
            'name' => 'Kaos Polos',
            'price' => 50000,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/orders', [
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_items' => [
                ['product_id' => $product->id, 'product_name' => 'Kaos Polos', 'quantity' => 2, 'unit_price' => 50000],
            ],
        ])->assertCreated();

        $this->assertMatchesRegularExpression('/^ORD-\d{8}-\d{3}$/', $response['data']['order_code']);
    }

    public function test_order_create_stores_order_date_and_internal_notes(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $product = Product::create([
            'company_id' => $company->id,
            'sku' => 'PRD-' . uniqid(),
            'name' => 'Kaos Polos',
            'price' => 50000,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/orders', [
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_date' => '2026-08-05',
            'internal_notes' => 'Internal: desain belum final.',
            'notes' => 'Untuk event 17 Agustus.',
            'order_items' => [
                ['product_id' => $product->id, 'product_name' => 'Kaos Polos', 'quantity' => 2, 'unit_price' => 50000],
            ],
        ])->assertCreated();

        $this->assertSame('2026-08-05', $response['data']['order_date']);
        $this->assertSame('Internal: desain belum final.', $response['data']['internal_notes']);
        $this->assertSame('Untuk event 17 Agustus.', $response['data']['notes']);
    }

    public function test_order_date_defaults_to_today_when_not_provided(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/orders', [
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_items' => [
                ['product_id' => null, 'product_name' => 'Kaos Polos', 'quantity' => 1, 'unit_price' => 50000],
            ],
        ])->assertCreated();

        $this->assertSame(now()->toDateString(), $response['data']['order_date']);
    }

    public function test_customer_code_is_auto_generated_in_format(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/customers', [
            'company_id' => $company->id,
            'name' => 'Budi Santoso',
        ])->assertCreated();

        $this->assertMatchesRegularExpression('/^CUS-\d{8}-\d{3}$/', $response['data']['customer_code']);
    }

    public function test_product_sku_is_auto_generated_in_format(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/products', [
            'company_id' => $company->id,
            'name' => 'Kaos Polos',
            'price' => 75000,
        ])->assertCreated();

        $this->assertMatchesRegularExpression('/^PRD-\d{8}-\d{3}$/', $response['data']['sku']);
    }

    public function test_invoice_code_is_auto_generated_and_sequential_daily(): void
    {
        Carbon::setTestNow('2026-08-09 10:00:00');

        try {
            $user = $this->createUser();
            $company = Company::factory()->create();
            $order = $this->createOrder($company);

            Sanctum::actingAs($user);

            $first = $this->postJson('/api/v1/invoices', [
                'order_id' => $order->id,
                'total_amount' => 1000000,
            ])->assertCreated();

            $second = $this->postJson('/api/v1/invoices', [
                'order_id' => $order->id,
                'total_amount' => 1000000,
            ])->assertCreated();

            $this->assertSame('INV-20260809-001', $first['data']['invoice_code']);
            $this->assertSame('INV-20260809-002', $second['data']['invoice_code']);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_invoice_code_counter_resets_daily(): void
    {
        Carbon::setTestNow('2026-08-09 10:00:00');

        try {
            $user = $this->createUser();
            $company = Company::factory()->create();
            $order = $this->createOrder($company);

            Sanctum::actingAs($user);

            $first = $this->postJson('/api/v1/invoices', [
                'order_id' => $order->id,
                'total_amount' => 1000000,
            ])->assertCreated();

            Carbon::setTestNow('2026-08-10 10:00:00');

            $second = $this->postJson('/api/v1/invoices', [
                'order_id' => $order->id,
                'total_amount' => 1000000,
            ])->assertCreated();

            $this->assertSame('INV-20260809-001', $first['data']['invoice_code']);
            $this->assertSame('INV-20260810-001', $second['data']['invoice_code']);
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_order_status_can_only_move_forward_via_patch(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'dp_received'])
            ->assertOk()
            ->assertJsonPath('data.status', 'dp_received');

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'draft'])
            ->assertStatus(422);

        $order->refresh();
        $this->assertSame('dp_received', $order->status);
    }

    public function test_order_status_backward_transition_rejected_on_update(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);

        Sanctum::actingAs($user);

        $this->putJson("/api/v1/orders/{$order->id}", ['status' => 'processing'])
            ->assertOk();

        $this->putJson("/api/v1/orders/{$order->id}", ['status' => 'waiting_dp'])
            ->assertStatus(422);

        $this->putJson("/api/v1/orders/{$order->id}", ['status' => 'draft'])
            ->assertStatus(422);
    }

    public function test_dp_payment_then_final_payment_updates_order_to_paid(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 1000000);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 300000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ])->assertCreated();

        $order->refresh();
        $this->assertSame('dp_received', $order->status);
        $this->assertSame(300000, (int) $order->paid_amount);
        $this->assertSame(700000, (int) $order->remaining_amount);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 700000,
            'payment_type' => 'final',
            'payment_date' => now()->toDateString(),
        ])->assertCreated();

        $order->refresh();
        $this->assertSame('paid', $order->status);
        $this->assertSame(0, (int) $order->remaining_amount);
    }

    public function test_second_dp_payment_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 1000000);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 300000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ])->assertCreated();

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 200000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(422);
    }

    public function test_final_payment_before_dp_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 1000000);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 1000000,
            'payment_type' => 'final',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(422);
    }

    public function test_overpayment_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 1000000);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 1500000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(422);
    }

    public function test_payment_on_paid_order_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 1000000);
        $order->update(['status' => 'paid', 'paid_amount' => 1000000, 'remaining_amount' => 0]);

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 100000,
            'payment_type' => 'final',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(422);
    }
}
