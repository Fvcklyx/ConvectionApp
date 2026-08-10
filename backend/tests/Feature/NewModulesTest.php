<?php

namespace Tests\Feature;

use App\Models\ApplicationSetting;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NewModulesTest extends TestCase
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

    private function createOrder(Company $company, string $status = 'waiting_dp', float $grandTotal = 1000000): Order
    {
        $customer = $this->createCustomer($company);

        return Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-' . uniqid(),
            'status' => $status,
            'subtotal' => $grandTotal,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => $grandTotal,
            'paid_amount' => $status === 'paid' ? $grandTotal : 0,
            'remaining_amount' => $status === 'paid' ? 0 : $grandTotal,
        ]);
    }

    private function createReview(Order $order): Review
    {
        return Review::create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'rating' => 10,
            'review_text' => 'Sangat puas dengan hasilnya.',
            'is_published' => true,
        ]);
    }

    public function test_can_create_and_advance_production_order(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/production", ['status' => 'design'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'design');

        $this->assertDatabaseCount('production_orders', 1);
        $this->assertDatabaseCount('production_events', 1);

        $this->patchJson("/api/v1/orders/{$order->id}/production/status", ['status' => 'approval'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approval');

        $this->assertDatabaseCount('production_events', 2);

        $this->getJson("/api/v1/orders/{$order->id}/production/events")
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_duplicate_production_order_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/production", ['status' => 'design'])->assertCreated();

        $this->postJson("/api/v1/orders/{$order->id}/production", ['status' => 'design'])
            ->assertStatus(422);
    }

    public function test_production_status_cannot_move_backward(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/production", ['status' => 'production'])->assertCreated();

        $this->patchJson("/api/v1/orders/{$order->id}/production/status", ['status' => 'design'])
            ->assertStatus(422);
    }

    public function test_can_create_shipment_with_tracking_details(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/shipments", [
            'recipient_name' => 'Budi Santoso',
            'recipient_phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 10',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'courier' => 'JNE',
            'service' => 'REG',
            'tracking_number' => 'JNE123456789',
            'shipping_cost' => 25000,
        ])->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.recipient_name', 'Budi Santoso')
            ->assertJsonPath('data.tracking_number', 'JNE123456789');

        $this->assertDatabaseCount('shipments', 1);
        $this->assertDatabaseCount('shipment_events', 1);
    }

    public function test_shipment_cannot_be_cancelled_after_shipping(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/orders/{$order->id}/shipments", [
            'recipient_name' => 'Budi',
            'address' => 'Jl. Merdeka No. 10',
        ])->assertCreated();

        $shipmentId = $response['data']['id'];

        $this->postJson("/api/v1/orders/{$order->id}/shipments/{$shipmentId}/events", ['status' => 'packed'])
            ->assertCreated();

        $this->postJson("/api/v1/orders/{$order->id}/shipments/{$shipmentId}/events", ['status' => 'shipped'])
            ->assertCreated();

        $this->postJson("/api/v1/orders/{$order->id}/shipments/{$shipmentId}/events", ['status' => 'cancelled'])
            ->assertStatus(422);
    }

    public function test_shipment_requires_recipient_name_and_address(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/shipments", [])
            ->assertStatus(422);
    }

    public function test_review_can_only_be_created_for_paid_order(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $unpaid = $this->createOrder($company, 'waiting_dp');
        $paid = $this->createOrder($company, 'paid');
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$unpaid->id}/reviews", ['rating' => 9, 'review_text' => 'Bagus'])
            ->assertStatus(422);

        $this->postJson("/api/v1/orders/{$paid->id}/reviews", ['rating' => 9, 'review_text' => 'Kualitas oke'])
            ->assertCreated()
            ->assertJsonPath('data.rating', 9);
    }

    public function test_duplicate_review_is_rejected(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 'paid');
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/orders/{$order->id}/reviews", ['rating' => 8])->assertCreated();

        $this->postJson("/api/v1/orders/{$order->id}/reviews", ['rating' => 9])
            ->assertStatus(422);
    }

    public function test_review_can_be_published_and_unpublished(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 'paid');
        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'rating' => 10,
            'review_text' => 'Mantap',
            'is_published' => false,
        ]);
        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/reviews/{$review->id}/publish")
            ->assertOk()
            ->assertJsonPath('data.is_published', true);

        $this->patchJson("/api/v1/reviews/{$review->id}/unpublish")
            ->assertOk()
            ->assertJsonPath('data.is_published', false);
    }

    public function test_testimonial_can_be_created_from_review(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 'paid');
        $review = $this->createReview($order);
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/testimonials', [
            'review_id' => $review->id,
            'quote' => 'Produk berkualitas dan tepat waktu.',
        ])->assertCreated()
            ->assertJsonPath('data.customer_id', $order->customer_id)
            ->assertJsonPath('data.quote', 'Produk berkualitas dan tepat waktu.');

        $this->assertDatabaseHas('testimonials', ['review_id' => $review->id]);
    }

    public function test_testimonial_can_toggle_featured(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $order = $this->createOrder($company, 'paid');
        $review = $this->createReview($order);
        $testimonial = Testimonial::create([
            'review_id' => $review->id,
            'customer_id' => $order->customer_id,
            'quote' => 'Bagus',
            'is_featured' => false,
        ]);
        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/testimonials/{$testimonial->id}/feature")
            ->assertOk()
            ->assertJsonPath('data.is_featured', true);

        $this->patchJson("/api/v1/testimonials/{$testimonial->id}/feature")
            ->assertOk()
            ->assertJsonPath('data.is_featured', false);
    }

    public function test_sales_report_returns_summary_and_rows(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-REP-SALES',
            'status' => 'paid',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 100000,
            'paid_amount' => 100000,
            'remaining_amount' => 0,
        ]);
        $order->items()->create([
            'product_name_snapshot' => 'Kaos Polos',
            'quantity' => 2,
            'unit_price' => 50000,
            'cost_price' => 30000,
            'subtotal' => 100000,
        ]);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/reports/sales')
            ->assertOk()
            ->assertJsonPath('data.summary.total_orders', 1)
            ->assertJsonPath('data.summary.total_quantity', 2)
            ->assertJsonPath('data.summary.revenue', 100000)
            ->assertJsonPath('data.rows.0.order_code', 'ORD-REP-SALES');
    }

    public function test_profit_report_computes_profit(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-REP-PROFIT',
            'status' => 'paid',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 10000,
            'grand_total' => 110000,
            'paid_amount' => 110000,
            'remaining_amount' => 0,
        ]);
        $order->items()->create([
            'product_name_snapshot' => 'Kaos Polos',
            'quantity' => 2,
            'unit_price' => 50000,
            'cost_price' => 30000,
            'subtotal' => 100000,
        ]);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/reports/profit')
            ->assertOk()
            ->assertJsonPath('data.summary.revenue', 110000)
            ->assertJsonPath('data.summary.production_cost', 60000)
            ->assertJsonPath('data.summary.shipping_cost', 10000)
            ->assertJsonPath('data.summary.profit', 40000);
    }

    public function test_products_report_aggregates_by_product(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $product = Product::create([
            'company_id' => $company->id,
            'sku' => 'PRD-REP-001',
            'name' => 'Kaos Polos',
            'price' => 50000,
            'status' => 'active',
        ]);
        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-REP-PRD',
            'status' => 'paid',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 100000,
            'paid_amount' => 100000,
            'remaining_amount' => 0,
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_name_snapshot' => 'Kaos Polos',
            'quantity' => 2,
            'unit_price' => 50000,
            'cost_price' => 30000,
            'subtotal' => 100000,
        ]);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/reports/products')
            ->assertOk()
            ->assertJsonPath('data.summary.total_quantity', 2)
            ->assertJsonPath('data.summary.revenue', 100000)
            ->assertJsonPath('data.summary.profit', 40000)
            ->assertJsonPath('data.rows.0.product_name', 'Kaos Polos')
            ->assertJsonPath('data.rows.0.quantity', 2);
    }

    public function test_report_csv_export_returns_csv(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();
        $customer = $this->createCustomer($company);
        $order = Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-REP-CSV',
            'status' => 'paid',
            'subtotal' => 100000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 100000,
            'paid_amount' => 100000,
            'remaining_amount' => 0,
        ]);
        $order->items()->create([
            'product_name_snapshot' => 'Kaos Polos',
            'quantity' => 1,
            'unit_price' => 100000,
            'cost_price' => 50000,
            'subtotal' => 100000,
        ]);
        Sanctum::actingAs($user);

        $response = $this->get('/api/v1/reports/sales/export?format=csv')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $this->assertStringContainsString('order_code', $response->getContent());
    }

    public function test_settings_require_authentication(): void
    {
        $this->getJson('/api/v1/settings')->assertStatus(401);
    }

    public function test_settings_return_defaults_and_persist_updates(): void
    {
        $user = $this->createUser();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/settings')
            ->assertOk()
            ->assertJsonPath('data.invoice.prefix', 'INV')
            ->assertJsonPath('data.appearance.default_theme', 'system')
            ->assertJsonPath('data.order.dp_percent', 50);

        $this->putJson('/api/v1/settings', [
            'settings' => [
                'invoice' => ['prefix' => 'FRN'],
                'appearance' => ['default_theme' => 'dark'],
                'order' => ['dp_percent' => 40, 'require_dp' => true],
            ],
        ])->assertOk()
            ->assertJsonPath('data.invoice.prefix', 'FRN')
            ->assertJsonPath('data.appearance.default_theme', 'dark')
            ->assertJsonPath('data.order.dp_percent', 40);

        $this->getJson('/api/v1/settings')
            ->assertOk()
            ->assertJsonPath('data.invoice.prefix', 'FRN')
            ->assertJsonPath('data.appearance.default_theme', 'dark');
    }

    public function test_settings_company_returns_active_company(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create(['name' => 'FRNDLY', 'active' => true]);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/settings/company')
            ->assertOk()
            ->assertJsonPath('data.id', $company->id)
            ->assertJsonPath('data.name', 'FRNDLY');
    }

    public function test_dashboard_respects_period_filter(): void
    {
        $user = $this->createUser();
        $company = Company::factory()->create();

        Carbon::setTestNow(now()->subMonths(2));
        try {
            $order = $this->createOrder($company, 'paid', 500000);

            \App\Models\Payment::create([
                'order_id' => $order->id,
                'amount' => 500000,
                'payment_type' => 'full',
                'payment_date' => now()->toDateString(),
            ]);
        } finally {
            Carbon::setTestNow();
        }

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/dashboard?period=this_month')
            ->assertOk()
            ->assertJsonPath('data.period', 'this_month')
            ->assertJsonPath('data.metrics.0.value', '0');

        $this->getJson('/api/v1/dashboard?period=all_time')
            ->assertOk()
            ->assertJsonPath('data.period', 'all_time')
            ->assertJsonPath('data.metrics.0.value', '1')
            ->assertJsonPath('data.metrics.2.value', 'Rp500.000');
    }
}
