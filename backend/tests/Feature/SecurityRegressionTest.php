<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_cannot_escalate_to_admin(): void
    {
        Company::factory()->create(['active' => true]);
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Customer Test', 'email' => 'client@example.test',
            'password' => 'Strong-test-password123', 'is_admin' => true,
        ])->assertCreated()->assertJsonPath('data.user.is_admin', false);
        $user = User::where('email', 'client@example.test')->firstOrFail();
        $this->assertTrue(Hash::check('Strong-test-password123', $user->password));
        $this->withToken($response->json('data.token'));
        $this->getJson('/api/v1/auth/me')->assertOk();
        foreach (['customers', 'products', 'orders', 'payments', 'invoices', 'dashboard', 'productions', 'shipments', 'reviews', 'testimonials', 'settings', 'settings/company', 'reports/sales'] as $path) {
            $this->getJson('/api/v1/'.$path)->assertForbidden();
        }
        $this->postJson('/api/v1/orders', [])->assertForbidden();
        $this->putJson('/api/v1/settings', ['settings' => []])->assertForbidden();
        $this->getJson('/api/v1/company/profile')->assertOk();
    }

    public function test_registration_rejects_short_passwords(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Customer', 'email' => 'client@example.test', 'password' => '123456',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->assertDatabaseCount('users', 0);
    }

    public function test_settings_reject_malformed_values_and_unknown_groups(): void
    {
        Sanctum::actingAs(User::factory()->create());
        foreach ([['business' => ['company_name' => ['invalid']]], ['appearance' => ['default_theme' => 'bad']], ['order' => ['dp_percent' => 101]], ['secret' => ['key' => 'value']]] as $settings) {
            $this->putJson('/api/v1/settings', compact('settings'))->assertUnprocessable();
        }
        $this->assertDatabaseCount('application_settings', 0);
        $this->putJson('/api/v1/settings', ['settings' => ['appearance' => ['default_period' => 'last_month']]])->assertOk();
    }

    public function test_refresh_does_not_accumulate_tokens_and_logout_revokes_session(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test', ['*'], now()->addMinute())->plainTextToken;
        $this->withToken($token);
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/v1/auth/refresh')->assertOk()->assertJsonPath('data.token', $token);
        }
        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertTrue($user->tokens()->first()->expires_at->isAfter(now()->addMinutes(8)));
        $this->postJson('/api/v1/auth/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_unmapped_admin_is_not_assigned_an_arbitrary_company(): void
    {
        Company::factory()->count(2)->create(['active' => true]);
        Sanctum::actingAs(User::factory()->create(['company_id' => null]));
        $this->getJson('/api/v1/orders')->assertForbidden();
    }

    public function test_unmapped_admin_cannot_read_inactive_company_relations(): void
    {
        $company = Company::factory()->create(['active' => false]);
        $customer = \App\Models\Customer::create(['company_id' => $company->id, 'customer_code' => 'TEST', 'name' => 'Private']);
        $order = \App\Models\Order::create(['company_id' => $company->id, 'customer_id' => $customer->id, 'order_code' => 'TEST', 'status' => 'draft', 'subtotal' => 0, 'grand_total' => 0, 'paid_amount' => 0, 'remaining_amount' => 0]);
        \App\Models\ProductionOrder::create(['order_id' => $order->id, 'status' => 'design']);
        Sanctum::actingAs(User::factory()->create(['company_id' => null]));
        $this->getJson('/api/v1/productions')->assertOk()->assertJsonCount(0, 'data.data');
    }
}
