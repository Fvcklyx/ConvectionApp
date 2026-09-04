<?php

namespace Tests\Feature;

use App\Models\{Company, Customer, Invoice, Order, PortalDraft, Product, Review, Testimonial, User};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerPortalTest extends TestCase
{
    use RefreshDatabase;

    private function setupCustomer(): array
    {
        $company = Company::factory()->create();
        $user = User::factory()->staff()->create(['company_id' => $company->id]);
        Sanctum::actingAs($user);
        $profile = $this->putJson('/api/v1/portal/profile', $this->profileData())->assertOk()->json('data');
        $product = Product::create(['company_id' => $company->id, 'sku' => 'TEST-'.$company->id, 'name' => 'Kaos', 'price' => 75000, 'status' => 'active']);
        return [$user, $company, $product, $profile];
    }

    private function profileData(): array
    {
        return ['name' => 'Customer', 'phone' => '08123456789', 'address' => 'Jalan Uji 1', 'city' => 'Bandung', 'province' => 'Jawa Barat'];
    }

    private function createDraft(Product $product): array
    {
        return $this->postJson('/api/v1/portal/drafts', [
            'items' => [['product_id' => $product->id, 'quantity' => 24, 'unit_price' => 1]],
            'shipping_address' => 'Alamat Kirim', 'notes' => 'Sablon biru', 'total' => 1,
        ])->assertCreated()->json('data');
    }

    public function test_profile_has_server_generated_code_and_never_claims_existing_email_match(): void
    {
        [$user, $company, $product, $profile] = $this->setupCustomer();
        $this->assertStringStartsWith('CUS-', $profile['customer_code']);
        $this->putJson('/api/v1/portal/profile', $this->profileData() + ['customer_code' => 'FORGED', 'status' => 'inactive', 'user_id' => 99])->assertOk();
        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseHas('customers', ['user_id' => $user->id, 'customer_code' => $profile['customer_code'], 'status' => 'active']);
        $this->getJson('/api/v1/portal/profile')->assertJsonMissingPath('data.notes');
        $another = User::factory()->staff()->create(['company_id' => $company->id]);
        Customer::create(['company_id' => $company->id, 'customer_code' => 'OLD', 'name' => 'Existing', 'email' => $another->email]);
        Sanctum::actingAs($another);
        $this->getJson('/api/v1/portal/profile')->assertJsonPath('data.customer_code', null);
        $this->putJson('/api/v1/portal/profile', $this->profileData())->assertOk();
        $this->assertDatabaseHas('customers', ['customer_code' => 'OLD', 'user_id' => null]);
    }

    public function test_draft_persists_and_submit_is_idempotent_with_server_prices(): void
    {
        [$user, $company, $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        $this->assertEquals(1800000, $draft['total']);
        $this->assertDatabaseCount('orders', 0);
        $this->getJson('/api/v1/portal/drafts')->assertJsonPath('data.data.0.id', $draft['id']);
        $submitted = $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->assertOk()->json('data');
        $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->assertOk()->assertJsonPath('data.order_id', $submitted['order_id']);
        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('orders', ['id' => $submitted['order_id'], 'customer_id' => $draft['order_id'] ?? Customer::where('user_id', $user->id)->value('id'), 'grand_total' => 1800000]);
        $this->assertDatabaseHas('order_items', ['order_id' => $submitted['order_id'], 'unit_price' => 75000, 'quantity' => 24]);
    }

    public function test_edit_syncs_unconfirmed_order_and_rejects_stale_version(): void
    {
        [, , $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        $submitted = $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->json('data');
        $body = ['version' => $submitted['version'], 'items' => [['product_id' => $product->id, 'quantity' => 12]], 'shipping_address' => 'Alamat baru'];
        $this->putJson('/api/v1/portal/drafts/'.$draft['id'], $body)->assertOk()->assertJsonPath('data.version', 3);
        $this->assertDatabaseHas('orders', ['id' => $submitted['order_id'], 'grand_total' => 900000]);
        $this->putJson('/api/v1/portal/drafts/'.$draft['id'], $body)->assertStatus(409);
        Order::find($submitted['order_id'])->update(['status' => 'waiting_dp']);
        $body['version'] = 3;
        $this->putJson('/api/v1/portal/drafts/'.$draft['id'], $body)->assertStatus(409);
        $this->deleteJson('/api/v1/portal/drafts/'.$draft['id'], ['version' => 3])->assertStatus(409);
    }

    public function test_invoice_blocks_deletion_and_only_owner_can_download_issued_pdf(): void
    {
        [$user, $company, $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        $orderId = $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->json('data.order_id');
        $invoice = Invoice::create(['order_id' => $orderId, 'invoice_code' => 'INV-TEST', 'total_amount' => 1800000, 'paid_amount' => 0, 'outstanding_amount' => 1800000, 'status' => 'draft']);
        $this->getJson('/api/v1/portal/invoices/'.$invoice->id.'/pdf')->assertNotFound();
        $this->deleteJson('/api/v1/portal/drafts/'.$draft['id'], ['version' => 2])->assertStatus(409);
        $invoice->update(['status' => 'issued']);
        $this->get('/api/v1/portal/invoices/'.$invoice->id.'/pdf')->assertOk()->assertHeader('content-type', 'application/pdf');
        Sanctum::actingAs(User::factory()->staff()->create(['company_id' => $company->id]));
        $this->getJson('/api/v1/portal/invoices/'.$invoice->id.'/pdf')->assertNotFound();
    }

    public function test_cross_account_access_and_cross_company_products_are_denied(): void
    {
        [$owner, $company, $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        [$other, , $otherProduct] = $this->setupCustomer();
        $this->putJson('/api/v1/portal/drafts/'.$draft['id'], ['version' => 1])->assertNotFound();
        $this->deleteJson('/api/v1/portal/drafts/'.$draft['id'], ['version' => 1])->assertNotFound();
        $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->assertNotFound();
        $this->getJson('/api/v1/portal/drafts')->assertJsonCount(0, 'data.data');
        $this->postJson('/api/v1/portal/drafts', ['items' => [['product_id' => $product->id, 'quantity' => 12]], 'shipping_address' => 'Uji'])->assertUnprocessable();
    }

    public function test_review_requires_paid_own_order_and_testimonial_needs_moderation(): void
    {
        [$user, $company, $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        $orderId = $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->json('data.order_id');
        $body = ['rating' => 9, 'review_text' => 'Bagus', 'is_published' => true];
        $this->postJson('/api/v1/portal/orders/'.$orderId.'/review', $body)->assertUnprocessable();
        Order::find($orderId)->update(['status' => 'paid', 'paid_amount' => 1800000, 'remaining_amount' => 0]);
        $review = $this->postJson('/api/v1/portal/orders/'.$orderId.'/review', $body)->assertCreated()->assertJsonPath('data.is_published', false)->json('data');
        $this->postJson('/api/v1/portal/orders/'.$orderId.'/review', $body)->assertStatus(409);
        $this->postJson('/api/v1/portal/testimonials', ['review_id' => $review['id'], 'quote' => 'Hasil rapi', 'is_published' => true, 'is_featured' => true])->assertCreated()->assertJsonPath('data.is_published', false)->assertJsonPath('data.is_featured', false);
        $this->postJson('/api/v1/portal/testimonials', ['review_id' => $review['id'], 'quote' => 'Duplikat'])->assertStatus(409);
        Sanctum::actingAs(User::factory()->staff()->create(['company_id' => $company->id]));
        $this->postJson('/api/v1/portal/orders/'.$orderId.'/review', $body)->assertNotFound();
        $this->getJson('/api/v1/portal/engagement')->assertJsonCount(0, 'data.reviews');
    }

    public function test_unconfirmed_draft_can_be_deleted_and_changed_price_requires_resave(): void
    {
        [, , $product] = $this->setupCustomer();
        $draft = $this->createDraft($product);
        $product->update(['price' => 80000]);
        $this->postJson('/api/v1/portal/drafts/'.$draft['id'].'/submit', ['version' => 1])->assertStatus(409);
        $this->assertDatabaseCount('orders', 0);
        $this->deleteJson('/api/v1/portal/drafts/'.$draft['id'], ['version' => 1])->assertOk();
        $this->assertDatabaseCount('portal_drafts', 0);
    }

    public function test_portal_requires_authentication_and_rejects_admin_role(): void
    {
        $this->getJson('/api/v1/portal/profile')->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/v1/portal/profile')->assertForbidden();
    }

    public function test_admin_created_orders_are_visible_only_to_the_linked_customer(): void
    {
        [$user, $company, $product, $profile] = $this->setupCustomer();
        $order = Order::create(['company_id' => $company->id, 'customer_id' => $profile['id'],
            'order_code' => 'ORD-ADMIN', 'order_date' => today(), 'status' => 'draft',
            'subtotal' => 900000, 'grand_total' => 900000, 'remaining_amount' => 900000,
            'internal_notes' => 'Private admin note']);
        $this->getJson('/api/v1/portal/orders')->assertOk()
            ->assertJsonPath('data.data.0.id', 'order-'.$order->id)
            ->assertJsonPath('data.data.0.editable', false)
            ->assertJsonMissingPath('data.data.0.internal_notes');
        Sanctum::actingAs(User::factory()->staff()->create(['company_id' => $company->id]));
        $this->getJson('/api/v1/portal/orders')->assertOk()->assertJsonCount(0, 'data.data');
    }
}
