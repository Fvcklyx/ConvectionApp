<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\Review;
use App\Models\Shipment;
use App\Models\Testimonial;
use App\Models\User;
use App\Policies\CompanyPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\OrderItemPolicy;
use App\Policies\OrderPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ProductionOrderPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\ShipmentPolicy;
use App\Policies\TestimonialPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate as GateFacade;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Company::class => CompanyPolicy::class,
        Customer::class => CustomerPolicy::class,
        Invoice::class => InvoicePolicy::class,
        Order::class => OrderPolicy::class,
        OrderItem::class => OrderItemPolicy::class,
        Payment::class => PaymentPolicy::class,
        Product::class => ProductPolicy::class,
        ProductionOrder::class => ProductionOrderPolicy::class,
        Review::class => ReviewPolicy::class,
        Shipment::class => ShipmentPolicy::class,
        Testimonial::class => TestimonialPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        GateFacade::before(function (User $user) {
            return $user->isAdmin() ? true : null;
        });

        GateFacade::define('manage', fn (User $user) => $user->isAdmin());
    }
}
