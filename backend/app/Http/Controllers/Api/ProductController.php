<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Product::with('company')->latest()->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'sku' => 'required|string|unique:products,sku',
            'name' => 'required|string|max:150',
            'category' => 'nullable|string',
            'material' => 'nullable|string',
            'model' => 'nullable|string',
            'color' => 'nullable|string',
            'size' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load('company');

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
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
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product dihapus.',
        ]);
    }
}
