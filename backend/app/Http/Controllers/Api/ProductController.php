<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ScopesByCompany;

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->scopeCompany(Product::query(), $request)
                ->with('company')
                ->latest()
                ->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
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
        ]);

        $data['company_id'] = $this->companyId($request);

        $data['sku'] = empty($data['sku'] ?? null)
            ? CodeGeneratorService::productCode()
            : $data['sku'];

        $product = Product::create($data);

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
        ]);

        $product->update($data);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);
        $this->assertSameCompany($product->company_id);

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product dihapus.',
        ]);
    }
}
