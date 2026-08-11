<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Testimonial;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use ScopesByCompany;

    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query()->with(['customer', 'review.order.customer']);

        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->whereHas('review.order', fn ($orders) => $orders->where('company_id', $companyId));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate($this->perPage($request)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'review_id' => 'required|exists:reviews,id',
            'customer_id' => 'nullable|exists:customers,id',
            'quote' => 'required|string',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);

        $review = Review::with('order')->findOrFail($data['review_id']);

        $this->assertSameCompany($review->order->company_id, $request);

        $data['customer_id'] = $data['customer_id'] ?? $review->customer_id;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_published'] = $data['is_published'] ?? false;

        $testimonial = Testimonial::create($data);

        $testimonial->load(['customer', 'review.order.customer']);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ], 201);
    }

    public function show(Request $request, Testimonial $testimonial): JsonResponse
    {
        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $testimonial->load(['customer', 'review.order.customer']);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('update', $testimonial);

        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $data = $request->validate([
            'quote' => 'sometimes|required|string',
            'is_featured' => 'sometimes|boolean',
            'is_published' => 'sometimes|boolean',
        ]);

        $testimonial->update($data);

        $testimonial->load(['customer', 'review.order.customer']);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ]);
    }

    public function publish(Request $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('publish', $testimonial);

        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $testimonial->update(['is_published' => true]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function unpublish(Request $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('unpublish', $testimonial);

        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $testimonial->update(['is_published' => false]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function feature(Request $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('publish', $testimonial);

        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $testimonial->update(['is_featured' => ! $testimonial->is_featured]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function destroy(Request $request, Testimonial $testimonial): JsonResponse
    {
        $this->authorize('delete', $testimonial);

        $testimonial->load('review.order');

        $this->assertSameCompany($testimonial->review->order->company_id, $request);

        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial dihapus.',
        ]);
    }
}
