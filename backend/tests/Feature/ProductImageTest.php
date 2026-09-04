<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductImageTest extends TestCase
{
    use RefreshDatabase;

    private function payload(): array
    {
        Storage::fake('public');
        $company = Company::factory()->create(['active' => true]);
        Sanctum::actingAs(User::factory()->create(['company_id' => $company->id]));
        return ['company_id' => $company->id, 'name' => 'Produk uji', 'price' => 50000, 'status' => 'active'];
    }

    public function test_image_at_limit_is_saved_and_exposed_in_public_catalog(): void
    {
        $data = $this->payload();
        $response = $this->postJson('/api/v1/products', $data + ['image' => UploadedFile::fake()->image('produk.png')->size(10240)])
            ->assertCreated()->assertJsonMissingPath('data.image_path');
        $product = Product::findOrFail($response->json('data.id'));
        Storage::disk('public')->assertExists($product->image_path);
        $this->assertSame('/storage/'.$product->image_path, $response->json('data.image_url'));
        $this->getJson('/api/v1/company/profile')->assertOk()
            ->assertJsonPath('data.products.0.image_url', $response->json('data.image_url'));
    }

    public function test_multipart_update_replaces_image_and_missing_upload_preserves_it(): void
    {
        $data = $this->payload();
        $id = $this->postJson('/api/v1/products', $data + ['image' => UploadedFile::fake()->image('old.png')])->assertCreated()->json('data.id');
        $old = Product::findOrFail($id)->image_path;
        $this->post('/api/v1/products/'.$id, ['_method' => 'PUT', 'image' => UploadedFile::fake()->image('new.jpg')], ['Accept' => 'application/json'])->assertOk();
        $new = Product::findOrFail($id)->image_path;
        $this->assertNotSame($old, $new);
        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists($new);
        $this->putJson('/api/v1/products/'.$id, ['name' => 'Diubah'])->assertOk();
        $this->assertSame($new, Product::findOrFail($id)->image_path);
        $this->putJson('/api/v1/products/'.$id, ['image' => UploadedFile::fake()->image('large.png')->size(10241)])
            ->assertUnprocessable()->assertJsonValidationErrors('image');
        $this->assertSame($new, Product::findOrFail($id)->image_path);
        Storage::disk('public')->assertExists($new);
    }

    public function test_no_image_returns_null_and_disguised_files_are_rejected(): void
    {
        $data = $this->payload();
        $this->postJson('/api/v1/products', $data)->assertCreated()->assertJsonPath('data.image_url', null);
        foreach (['fake.png', 'script.svg', 'script.php'] as $name) {
            $this->postJson('/api/v1/products', $data + ['image' => UploadedFile::fake()->createWithContent($name, '<?php echo "unsafe";')])
                ->assertUnprocessable()->assertJsonValidationErrors('image');
        }
        $this->assertCount(0, Storage::disk('public')->allFiles());
        $this->assertDatabaseCount('products', 1);
    }

    public function test_public_business_name_tracks_settings_changes(): void
    {
        $this->payload();
        foreach (['Konveksi Pertama', 'Konveksi Baru'] as $name) {
            $this->putJson('/api/v1/settings', ['settings' => ['business' => ['company_name' => $name]]])->assertOk();
            $this->getJson('/api/v1/company/profile')->assertOk()->assertJsonPath('data.name', $name);
        }
    }

    public function test_staff_cannot_upload_and_other_company_product_is_inaccessible(): void
    {
        $data = $this->payload();
        $id = $this->postJson('/api/v1/products', $data)->assertCreated()->json('data.id');
        Sanctum::actingAs(User::factory()->staff()->create(['company_id' => $data['company_id']]));
        $this->postJson('/api/v1/products', $data + ['image' => UploadedFile::fake()->image('test.png')])->assertForbidden();
        $other = Company::factory()->create();
        Sanctum::actingAs(User::factory()->create(['company_id' => $other->id]));
        $this->putJson('/api/v1/products/'.$id, ['image' => UploadedFile::fake()->image('test.png')])->assertNotFound();
        $this->assertCount(0, Storage::disk('public')->allFiles());
    }
}
