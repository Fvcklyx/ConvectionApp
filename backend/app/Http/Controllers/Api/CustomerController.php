<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\CodeGeneratorService;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    use ScopesByCompany;

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->scopeCompany(Customer::query(), $request)
                ->withCount('orders')
                ->latest()
                ->paginate($this->perPage($request)),
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

        // Company ditentukan dari konteks user (multi-tenant), bukan dari klien.
        $data['company_id'] = $this->companyId($request);

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
        $this->assertSameCompany($customer->company_id);

        $customer->loadCount('orders');

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);
        $this->assertSameCompany($customer->company_id);

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
        $this->assertSameCompany($customer->company_id);

        if ($customer->orders()->exists()) {
            throw ValidationException::withMessages([
                'customer_id' => ['Customer yang memiliki order tidak dapat dihapus.'],
            ]);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer dihapus.',
        ]);
    }
}
