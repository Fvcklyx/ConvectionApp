<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FrndlyApiTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::factory()->create([
            'email' => 'admin@frndly.test',
            'password' => bcrypt('password123'),
        ]);
    }

    public function test_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/v1/dashboard')
            ->assertStatus(401);
    }

    public function test_user_can_login_and_receive_a_token(): void
    {
        $this->createUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@frndly.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);
    }

    public function test_login_with_invalid_credentials_returns_422(): void
    {
        $this->createUser();

        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@frndly.test',
            'password' => 'salah-password',
        ])->assertStatus(422);
    }

    public function test_authenticated_dashboard_returns_metrics_and_activities(): void
    {
        $user = $this->createUser();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/dashboard')
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'metrics',
                    'recentActivities',
                ],
            ]);
    }

    public function test_me_and_logout_flow(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('frndly-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    'user' => [
                        'email' => 'admin@frndly.test',
                    ],
                ],
            ]);

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_token_expires_after_ten_minutes(): void
    {
        $user = $this->createUser();

        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@frndly.test',
            'password' => 'password123',
        ])->assertStatus(200);

        $token = $user->tokens()->first();

        $this->assertNotNull($token->expires_at);
        $this->assertTrue($token->expires_at->isAfter(now()->addMinutes(8)));
        $this->assertTrue($token->expires_at->isBefore(now()->addMinutes(12)));
    }

    public function test_expired_token_is_rejected(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('frndly-token', ['*'], now()->subMinute())->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    public function test_refresh_returns_new_token_and_session_stays_active(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('frndly-token', ['*'], now()->addMinutes(3))->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/v1/auth/refresh')
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'token',
                ],
            ]);

        $newToken = $response->json('data.token');
        $this->assertNotSame($token, $newToken);

        $this->withToken($newToken)->getJson('/api/v1/auth/me')->assertStatus(200);
    }

    public function test_refresh_requires_an_active_token(): void
    {
        $this->postJson('/api/v1/auth/refresh')->assertStatus(401);
    }

    public function test_unauthenticated_cannot_create_customer(): void
    {
        $this->postJson('/api/v1/customers', [
            'company_id' => 1,
            'customer_code' => 'CUS-0999',
            'name' => 'Orang Baru',
        ])->assertStatus(401);

        $this->assertDatabaseCount('customers', 0);
    }

    public function test_authenticated_can_create_and_delete_customer(): void
    {
        $user = $this->createUser();
        $company = \App\Models\Company::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/customers', [
            'company_id' => $company->id,
            'customer_code' => 'CUS-0009',
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'status' => 'active',
        ])->assertStatus(201)
            ->assertJsonPath('data.name', 'Budi Santoso');

        $this->assertDatabaseHas('customers', ['customer_code' => 'CUS-0009']);

        $customer = Customer::where('customer_code', 'CUS-0009')->firstOrFail();

        $this->deleteJson("/api/v1/customers/{$customer->id}")
            ->assertStatus(200);

        $this->assertDatabaseCount('customers', 0);
    }

    public function test_authenticated_can_update_customer(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        Sanctum::actingAs($user);

        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-EDIT-001',
            'name' => 'Nama Lama',
            'status' => 'active',
        ]);

        $this->putJson("/api/v1/customers/{$customer->id}", [
            'name' => 'Nama Baru',
            'city' => 'Jakarta',
            'status' => 'inactive',
        ])->assertStatus(200)
            ->assertJsonPath('data.name', 'Nama Baru');

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'name' => 'Nama Baru',
            'city' => 'Jakarta',
            'status' => 'inactive',
        ]);
    }

    public function test_authenticated_can_update_product(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        Sanctum::actingAs($user);

        $product = Product::create([
            'company_id' => $company->id,
            'sku' => 'PRD-EDIT-001',
            'name' => 'Kaos Lama',
            'price' => 50000,
            'status' => 'active',
        ]);

        $this->putJson("/api/v1/products/{$product->id}", [
            'name' => 'Kaos Baru',
            'price' => 60000,
        ])->assertStatus(200)
            ->assertJsonPath('data.price', '60000.00');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Kaos Baru',
            'price' => 60000,
        ]);
    }

    public function test_order_update_with_items_recalculates_totals(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-ORD-EDIT',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-EDIT-001',
            'status' => 'draft',
            'subtotal' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 0,
            'paid_amount' => 0,
            'remaining_amount' => 0,
        ]);

        $order->items()->create([
            'product_name_snapshot' => 'Item Lama',
            'quantity' => 1,
            'unit_price' => 10000,
            'subtotal' => 10000,
        ]);

        $this->putJson("/api/v1/orders/{$order->id}", [
            'status' => 'processing',
            'discount_amount' => 5000,
            'order_items' => [
                [
                    'product_name' => 'Kaos Custom',
                    'quantity' => 2,
                    'unit_price' => 50000,
                ],
            ],
        ])->assertStatus(200)
            ->assertJsonPath('data.status', 'processing')
            ->assertJsonPath('data.subtotal', '100000.00')
            ->assertJsonPath('data.discount_amount', '5000.00')
            ->assertJsonPath('data.grand_total', '95000.00')
            ->assertJsonPath('data.remaining_amount', '95000.00');

        $this->assertDatabaseCount('order_items', 1);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_name_snapshot' => 'Kaos Custom',
            'quantity' => 2,
        ]);
    }

    public function test_authenticated_can_create_and_update_payment(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-ORD-PAY',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-PAY-001',
            'status' => 'waiting_dp',
            'subtotal' => 1000000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 1000000,
            'paid_amount' => 0,
            'remaining_amount' => 1000000,
        ]);

        $payment = \App\Models\Payment::create([
            'order_id' => $order->id,
            'amount' => 500000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ]);

        $this->putJson("/api/v1/payments/{$payment->id}", [
            'amount' => 600000,
            'reference' => 'TRF-UPDATED',
        ])->assertStatus(200)
            ->assertJsonPath('data.amount', '600000.00');

        $order->refresh();
        $this->assertEquals(600000, (int) $order->paid_amount);
        $this->assertEquals(400000, (int) $order->remaining_amount);
    }

    public function test_authenticated_can_download_invoice_pdf(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-ORD-PDF',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-PDF-001',
            'status' => 'paid',
            'subtotal' => 500000,
            'discount_amount' => 0,
            'shipping_cost' => 25000,
            'grand_total' => 525000,
            'paid_amount' => 525000,
            'remaining_amount' => 0,
        ]);

        $order->items()->create([
            'product_name_snapshot' => 'Jaket Bomber Custom',
            'quantity' => 10,
            'unit_price' => 50000,
            'subtotal' => 500000,
        ]);

        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_code' => 'INV-PDF-001',
            'total_amount' => 525000,
            'paid_amount' => 525000,
            'outstanding_amount' => 0,
            'status' => 'paid',
        ]);

        $this->get("/api/v1/invoices/{$invoice->id}/pdf")
            ->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_invoice_pdf_supports_multiple_items_and_long_names(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-ORD-PDF-MANY',
            'name' => 'PT Konveksi Nusantara Sejahtera Abadi',
            'address' => 'Jl. Raya Industri Utama No. 88, Kawasan Industri Jababeka Cikarang Selatan',
            'city' => 'Bekasi',
            'province' => 'Jawa Barat',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-PDF-MANY-001',
            'status' => 'paid',
            'subtotal' => 0,
            'discount_amount' => 150000,
            'shipping_cost' => 75000,
            'grand_total' => 0,
            'paid_amount' => 0,
            'remaining_amount' => 0,
        ]);

        $subtotal = 0;

        for ($i = 1; $i <= 30; $i++) {
            $name = "Kaos Polos Cotton Combed 24s Premium Extra {$i} - Custom Sablon DTF Nama & Nomor";
            $unitPrice = 50000 + ($i * 1000);
            $subtotal += 3 * $unitPrice;
            $order->items()->create([
                'product_name_snapshot' => $name,
                'quantity' => 3,
                'unit_price' => $unitPrice,
                'subtotal' => 3 * $unitPrice,
            ]);
        }

        $grandTotal = $subtotal - 150000 + 75000;
        $order->update([
            'subtotal' => $subtotal,
            'grand_total' => $grandTotal,
            'paid_amount' => $grandTotal,
            'remaining_amount' => 0,
        ]);

        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_code' => 'INV-PDF-MANY-001',
            'total_amount' => $grandTotal,
            'paid_amount' => $grandTotal,
            'outstanding_amount' => 0,
            'status' => 'paid',
        ]);

        $this->get("/api/v1/invoices/{$invoice->id}/pdf")
            ->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition', 'attachment; filename=INV-PDF-MANY-001.pdf');
    }

    public function test_invoice_create_computes_outstanding_amount(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-INV-CREATE',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-INV-CREATE',
            'status' => 'processing',
            'subtotal' => 1000000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 1000000,
            'paid_amount' => 400000,
            'remaining_amount' => 600000,
        ]);

        $this->postJson('/api/v1/invoices', [
            'order_id' => $order->id,
            'invoice_code' => 'INV-CREATE-001',
            'total_amount' => 1000000,
            'paid_amount' => 400000,
        ])->assertStatus(201)
            ->assertJsonPath('data.outstanding_amount', '600000.00');
    }

    public function test_creating_payment_recalculates_order_totals(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-PAY-CREATE',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-PAY-CREATE',
            'status' => 'waiting_dp',
            'subtotal' => 1000000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 1000000,
            'paid_amount' => 0,
            'remaining_amount' => 1000000,
        ]);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 500000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(201)
            ->assertJsonPath('data.amount', '500000.00');

        $order->refresh();
        $this->assertEquals(500000, (int) $order->paid_amount);
        $this->assertEquals(500000, (int) $order->remaining_amount);

        $this->postJson('/api/v1/payments', [
            'order_id' => $order->id,
            'amount' => 500000,
            'payment_type' => 'final',
            'payment_date' => now()->toDateString(),
        ])->assertStatus(201);

        $order->refresh();
        $this->assertEquals(1000000, (int) $order->paid_amount);
        $this->assertEquals(0, (int) $order->remaining_amount);
    }

    public function test_customer_update_preserves_order_relationship(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-REL-001',
            'name' => 'Nama Lama',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-REL-001',
            'status' => 'draft',
            'subtotal' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 0,
            'paid_amount' => 0,
            'remaining_amount' => 0,
        ]);

        $this->putJson("/api/v1/customers/{$customer->id}", [
            'name' => 'Nama Baru',
        ])->assertStatus(200);

        $order->refresh();
        $this->assertEquals($customer->id, $order->customer_id);
        $this->assertEquals('Nama Baru', $order->customer->name);
    }

    public function test_edit_validation_rejects_invalid_values(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-VAL-001',
            'name' => 'Budi',
            'status' => 'active',
        ]);
        Sanctum::actingAs($user);

        $product = Product::create([
            'company_id' => $company->id,
            'sku' => 'PRD-VAL-001',
            'name' => 'Kaos',
            'price' => 50000,
            'status' => 'active',
        ]);

        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-VAL-001',
            'status' => 'draft',
            'subtotal' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 0,
            'paid_amount' => 0,
            'remaining_amount' => 0,
        ]);

        $this->putJson("/api/v1/orders/{$order->id}", [
            'status' => 'status_tidak_ada',
        ])->assertStatus(422);

        $this->putJson("/api/v1/products/{$product->id}", [
            'price' => -1000,
        ])->assertStatus(422);

        $this->putJson("/api/v1/customers/{$customer->id}", [
            'status' => 'archived',
        ])->assertStatus(422);
    }
}
