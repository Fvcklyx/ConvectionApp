<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Traits\ScopesByCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    use ScopesByCompany;

    public function index(Request $request): JsonResponse
    {
        $query = Review::query()->with(['order.customer', 'customer']);

        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->whereHas('order', fn ($orders) => $orders->where('company_id', $companyId));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate($this->perPage($request)),
        ]);
    }

    public function orderIndex(Request $request, Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, $request);

        return response()->json([
            'success' => true,
            'data' => $order->review()
                ? $order->review()->with(['order.customer', 'customer'])->get()
                : [],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'nullable|string',
            'is_published' => 'nullable|boolean',
        ]);

        $order = Order::findOrFail($data['order_id']);

        $this->assertSameCompany($order->company_id, $request);

        return $this->createForOrder($request, $order, $data);
    }

    public function storeForOrder(Request $request, Order $order): JsonResponse
    {
        $this->assertSameCompany($order->company_id, $request);

        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'nullable|string',
            'is_published' => 'nullable|boolean',
        ]);

        return $this->createForOrder($request, $order, $data);
    }

    private function createForOrder(Request $request, Order $order, array $data): JsonResponse
    {
        if ($order->status !== 'paid') {
            throw ValidationException::withMessages([
                'order_id' => ['Review hanya dapat diberikan untuk order yang sudah lunas.'],
            ]);
        }

        if ($order->review()->exists()) {
            throw ValidationException::withMessages([
                'order_id' => ['Order ini sudah memiliki review.'],
            ]);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'rating' => $data['rating'],
            'review_text' => $data['review_text'] ?? null,
            'is_published' => $data['is_published'] ?? false,
        ]);

        $review->load(['order.customer', 'customer']);

        return response()->json([
            'success' => true,
            'data' => $review,
        ], 201);
    }

    public function show(Review $review): JsonResponse
    {
        $review->load(['order', 'customer']);

        $this->assertSameCompany($review->order->company_id, request());

        $review->load(['order.customer', 'customer']);

        return response()->json([
            'success' => true,
            'data' => $review,
        ]);
    }

    public function publish(Request $request, Review $review): JsonResponse
    {
        $this->authorize('publish', $review);

        $review->load('order');

        $this->assertSameCompany($review->order->company_id, $request);

        $review->update(['is_published' => true]);

        return response()->json([
            'success' => true,
            'data' => $review->load(['order.customer', 'customer']),
        ]);
    }

    public function unpublish(Request $request, Review $review): JsonResponse
    {
        $this->authorize('publish', $review);

        $review->load('order');

        $this->assertSameCompany($review->order->company_id, $request);

        $review->update(['is_published' => false]);

        return response()->json([
            'success' => true,
            'data' => $review->load(['order.customer', 'customer']),
        ]);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        $this->authorize('delete', $review);

        $review->load('order');

        $this->assertSameCompany($review->order->company_id, $request);

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review dihapus.',
        ]);
    }
}
