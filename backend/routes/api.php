<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationSettingController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/profile/avatar', [AuthController::class, 'updateAvatar']);
        Route::delete('/auth/profile/avatar', [AuthController::class, 'deleteAvatar']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'pdf']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('orders', OrderController::class);
        Route::apiResource('payments', PaymentController::class);
        Route::apiResource('invoices', InvoiceController::class);

        Route::get('/productions', [ProductionController::class, 'index']);
        Route::post('/orders/{order}/production', [ProductionController::class, 'store']);
        Route::get('/orders/{order}/production', [ProductionController::class, 'show']);
        Route::patch('/orders/{order}/production/status', [ProductionController::class, 'updateStatus']);
        Route::get('/orders/{order}/production/events', [ProductionController::class, 'events']);
        Route::post('/orders/{order}/production/events', [ProductionController::class, 'storeEvent']);

        Route::get('/shipments', [ShipmentController::class, 'index']);
        Route::get('/orders/{order}/shipments', [ShipmentController::class, 'orderIndex']);
        Route::post('/orders/{order}/shipments', [ShipmentController::class, 'store']);
        Route::get('/orders/{order}/shipments/{shipment}', [ShipmentController::class, 'show']);
        Route::put('/orders/{order}/shipments/{shipment}', [ShipmentController::class, 'update']);
        Route::get('/orders/{order}/shipments/{shipment}/events', [ShipmentController::class, 'events']);
        Route::post('/orders/{order}/shipments/{shipment}/events', [ShipmentController::class, 'storeEvent']);
        Route::delete('/orders/{order}/shipments/{shipment}', [ShipmentController::class, 'destroy']);

        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::get('/orders/{order}/reviews', [ReviewController::class, 'orderIndex']);
        Route::post('/orders/{order}/reviews', [ReviewController::class, 'storeForOrder']);
        Route::get('/reviews/{review}', [ReviewController::class, 'show']);
        Route::patch('/reviews/{review}/publish', [ReviewController::class, 'publish']);
        Route::patch('/reviews/{review}/unpublish', [ReviewController::class, 'unpublish']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        Route::get('/testimonials', [TestimonialController::class, 'index']);
        Route::post('/testimonials', [TestimonialController::class, 'store']);
        Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
        Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
        Route::patch('/testimonials/{testimonial}/publish', [TestimonialController::class, 'publish']);
        Route::patch('/testimonials/{testimonial}/unpublish', [TestimonialController::class, 'unpublish']);
        Route::patch('/testimonials/{testimonial}/feature', [TestimonialController::class, 'feature']);
        Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

        Route::get('/settings', [ApplicationSettingController::class, 'index']);
        Route::put('/settings', [ApplicationSettingController::class, 'update']);
        Route::get('/settings/company', [ApplicationSettingController::class, 'company']);
        Route::post('/settings/company/logo', [ApplicationSettingController::class, 'uploadLogo']);
        Route::delete('/settings/company/logo', [ApplicationSettingController::class, 'deleteLogo']);

        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/profit', [ReportController::class, 'profit']);
        Route::get('/reports/customers', [ReportController::class, 'customers']);
        Route::get('/reports/products', [ReportController::class, 'products']);
        Route::get('/reports/{type}/export', [ReportController::class, 'export']);
    });

    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'data' => ['status' => 'ok'],
        ]);
    });
});
