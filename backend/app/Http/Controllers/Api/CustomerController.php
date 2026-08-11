<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\CodeGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Customer::withCount('orders')->latest()->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'customer_code' => 'nullable|string|unique:customers,customer_code',
            'name' => 'required|string|max:150',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $data['customer_code'] = empty($data['customer_code'] ?? null)
            ? CodeGeneratorService::customerCode()
            : $data['customer_code'];

        $customer = Customer::create($data);

        return response()->json([
            'success' => true,
            'data' => $customer,
        ], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        $customer->loadCount('orders');

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);

        $data = $request->validate([
            'name' => 'sometimes|string|max:150',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $customer->update($data);

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $this->authorize('delete', $customer);

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer dihapus.',
        ]);
    }
}
