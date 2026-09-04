<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ScopesByCompany;

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->scopeCompany(Product::query(), $request)
                ->latest()
                ->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Product::class);
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'sku' => 'nullable|string|unique:products,sku',
            'name' => 'required|string|max:150',
            'category' => 'nullable|string',
            'material' => 'nullable|string',
            'model' => 'nullable|string',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'nullable|string|in:active,inactive',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240', 'dimensions:min_width=1,min_height=1'],
        ]);

        $data['company_id'] = $this->companyId($request);

        $data['sku'] = empty($data['sku'] ?? null)
            ? CodeGeneratorService::productCode()
            : $data['sku'];

        $product = $this->saveProduct(new Product(), $data, $request);

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $this->assertSameCompany($product->company_id);

        $product->load('company');

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);
        $this->assertSameCompany($product->company_id);

        $data = $request->validate([
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id,
            'name' => 'sometimes|string|max:150',
            'category' => 'nullable|string',
            'material' => 'nullable|string',
            'model' => 'nullable|string',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'nullable|string|in:active,inactive',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240', 'dimensions:min_width=1,min_height=1'],
        ]);

        $product = $this->saveProduct($product, $data, $request);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);
        $this->assertSameCompany($product->company_id);

        $imagePath = $product->image_path;
        $product->delete();
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product dihapus.',
        ]);
    }

    private function saveProduct(Product $product, array $data, Request $request): Product
    {
        $oldPath = $product->image_path;
        $newPath = null;
        unset($data['image']);

        try {
            if ($request->hasFile('image')) {
                $newPath = $request->file('image')->store('products', 'public');
                abort_unless(is_string($newPath) && $newPath !== '', 500, 'Gambar gagal disimpan.');
                $product->image_path = $newPath;
            }
            DB::transaction(function () use ($product, $data) {
                $product->fill($data);
                $product->save();
            });
        } catch (\Throwable $error) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }
            throw $error;
        }

        if ($newPath && $oldPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return $product->fresh();
    }
}
