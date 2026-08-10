<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Testimonial::with(['customer', 'review.order.customer'])
                ->latest()
                ->paginate(20),
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

        $data['customer_id'] = $data['customer_id']
            ?? Review::findOrFail($data['review_id'])->customer_id;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['is_published'] = $data['is_published'] ?? false;

        $testimonial = Testimonial::create($data);

        $testimonial->load(['customer', 'review.order.customer']);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ], 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        $testimonial->load(['customer', 'review.order.customer']);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
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

    public function publish(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['is_published' => true]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function unpublish(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['is_published' => false]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function feature(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['is_featured' => ! $testimonial->is_featured]);

        return response()->json([
            'success' => true,
            'data' => $testimonial->load(['customer', 'review.order.customer']),
        ]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial dihapus.',
        ]);
    }
}
