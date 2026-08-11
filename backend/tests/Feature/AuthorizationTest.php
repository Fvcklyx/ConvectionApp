<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function createCompany(): Company
    {
        return Company::factory()->create();
    }

    private function createCustomer(Company $company): Customer
    {
        return Customer::create([
            'company_id' => $company->id,
            'customer_code' => 'CUS-' . uniqid(),
            'name' => 'Customer Test',
        ]);
    }

    private function createOrder(Company $company): Order
    {
        $customer = $this->createCustomer($company);

        return Order::create([
            'company_id' => $company->id,
            'customer_id' => $customer->id,
            'order_code' => 'ORD-' . uniqid(),
            'status' => 'paid',
            'subtotal' => 1000000,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'grand_total' => 1000000,
            'paid_amount' => 1000000,
            'remaining_amount' => 0,
        ]);
    }

    private function actAs(User $user): void
    {
        Sanctum::actingAs($user);
    }

    public function test_staff_can_view_and_create_resources(): void
    {
        $company = $this->createCompany();
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->postJson('/api/v1/customers', [
            'company_id' => $company->id,
            'name' => 'Customer Baru',
        ])->assertCreated();

        $this->getJson('/api/v1/customers')->assertOk();
        $this->getJson('/api/v1/orders')->assertOk();
    }

    public function test_staff_cannot_delete_customer(): void
    {
        $company = $this->createCompany();
        $customer = $this->createCustomer($company);
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->deleteJson("/api/v1/customers/{$customer->id}")->assertStatus(403);

        $this->assertDatabaseHas('customers', ['id' => $customer->id]);
    }

    public function test_staff_cannot_delete_payment(): void
    {
        $company = $this->createCompany();
        $order = $this->createOrder($company);
        $payment = Payment::create([
            'order_id' => $order->id,
            'amount' => 1000000,
            'payment_type' => 'dp',
            'payment_date' => now()->toDateString(),
        ]);
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->deleteJson("/api/v1/payments/{$payment->id}")->assertStatus(403);

        $this->assertDatabaseHas('payments', ['id' => $payment->id]);
    }

    public function test_staff_cannot_delete_invoice(): void
    {
        $company = $this->createCompany();
        $order = $this->createOrder($company);
        $invoice = Invoice::create([
            'order_id' => $order->id,
            'invoice_code' => 'INV-20260811-001',
            'total_amount' => 1000000,
            'paid_amount' => 0,
            'outstanding_amount' => 1000000,
            'status' => 'issued',
        ]);
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->deleteJson("/api/v1/invoices/{$invoice->id}")->assertStatus(403);

        $this->assertDatabaseHas('invoices', ['id' => $invoice->id]);
    }

    public function test_staff_cannot_publish_testimonial(): void
    {
        $company = $this->createCompany();
        $order = $this->createOrder($company);
        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'rating' => 10,
            'review_text' => 'Bagus sekali.',
            'is_published' => false,
        ]);
        $testimonial = Testimonial::create([
            'review_id' => $review->id,
            'customer_id' => $order->customer_id,
            'quote' => 'Sangat puas.',
            'is_published' => false,
        ]);
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->patchJson("/api/v1/testimonials/{$testimonial->id}/publish")->assertStatus(403);

        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id, 'is_published' => false]);
    }

    public function test_staff_cannot_update_settings(): void
    {
        $staff = User::factory()->staff()->create();

        $this->actAs($staff);

        $this->putJson('/api/v1/settings', [
            'settings' => ['invoice' => ['prefix' => 'FRN']],
        ])->assertStatus(403);
    }

    public function test_admin_can_delete_customer(): void
    {
        $company = $this->createCompany();
        $customer = $this->createCustomer($company);
        $admin = User::factory()->create();

        $this->actAs($admin);

        $this->deleteJson("/api/v1/customers/{$customer->id}")->assertOk();

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }
}
