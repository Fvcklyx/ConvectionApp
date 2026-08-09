<?php

namespace Tests\Feature;

use App\Models\Customer;
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
}
