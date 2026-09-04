<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Company;
use App\Models\Product;
use App\Models\Review;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ApplicationSettingController extends Controller
{
    private const DEFAULT_SETTINGS = [
        'appearance' => [
            'default_theme' => 'system',
            'default_period' => 'this_month',
        ],
        'business' => [
            'company_name' => 'FRNDLY',
            'company_phone' => null,
            'company_email' => null,
            'company_address' => null,
        ],
        'order' => [
            'default_status' => 'draft',
            'require_dp' => true,
            'dp_percent' => 50,
        ],
        'invoice' => [
            'prefix' => 'INV',
        ],
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->resolved(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        Gate::authorize('manage');

        $data = $request->validate([
            'settings' => 'required|array:appearance,business,order,invoice',
            'settings.appearance' => 'sometimes|array:default_theme,default_period',
            'settings.appearance.default_theme' => 'sometimes|required|in:light,dark,system',
            'settings.appearance.default_period' => 'sometimes|required|in:this_month,last_month,last_3_months,this_year,all_time',
            'settings.business' => 'sometimes|array:company_name,company_phone,company_email,company_address',
            'settings.business.company_name' => 'sometimes|required|string|max:255',
            'settings.business.company_phone' => 'sometimes|nullable|string|max:40',
            'settings.business.company_email' => 'sometimes|nullable|email|max:255',
            'settings.business.company_address' => 'sometimes|nullable|string|max:2000',
            'settings.order' => 'sometimes|array:default_status,require_dp,dp_percent',
            'settings.order.default_status' => 'sometimes|required|in:draft,waiting_dp,dp_received,processing,paid',
            'settings.order.require_dp' => 'sometimes|required|boolean',
            'settings.order.dp_percent' => 'sometimes|required|numeric|min:0|max:100',
            'settings.invoice' => 'sometimes|array:prefix',
            'settings.invoice.prefix' => 'sometimes|required|string|max:20|regex:/^[A-Za-z0-9-]+$/',
        ]);

        $groups = $data['settings'];

        foreach ($groups as $group => $values) {
            if (! is_array($values)) {
                continue;
            }

            foreach ($values as $key => $value) {
                ApplicationSetting::updateOrCreate(
                    ['key' => "{$group}.{$key}"],
                    [
                        'value' => $value,
                        'group' => $group,
                        'updated_by' => $request->user()?->id,
                    ],
                );
            }
        }

        return response()->json([
            'success' => true,
            'data' => $this->resolved(),
        ]);
    }

    public function company(): JsonResponse
    {
        $company = Company::where('active', true)->first();

        return response()->json([
            'success' => true,
            'data' => $company ? $this->companyPayload($company) : null,
        ]);
    }

    public function publicProfile(): JsonResponse
    {
        $savedName = ApplicationSetting::where('key', 'business.company_name')->value('value');
        $brandName = is_string($savedName) && trim($savedName) !== '' ? trim($savedName) : 'FRNDLY';

        $company = Company::where('active', true)->first();

        $products = $company
            ? Product::where('company_id', $company->id)
                ->where('status', 'active')
                ->latest()
                ->get(['id', 'name', 'category', 'price', 'image_path'])
            : collect();

        $reviews = $company
            ? Review::where('is_published', true)
                ->whereHas('order', fn ($query) => $query->where('company_id', $company->id))
                ->with('customer:id,name')
                ->latest()
                ->get(['id', 'order_id', 'customer_id', 'rating', 'review_text', 'is_published'])
                ->map(fn (Review $review) => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'customer_name' => $review->customer?->name,
                    'is_published' => $review->is_published,
                ])
            : collect();

        $testimonials = $company
            ? Testimonial::where('is_published', true)
                ->whereHas('review.order', fn ($query) => $query->where('company_id', $company->id))
                ->latest()
                ->get(['id', 'quote', 'is_published'])
            : collect();

        return response()->json([
            'success' => true,
            'data' => [
                'name' => $brandName,
                'logo_url' => $company?->logo_path ? '/storage/' . $company->logo_path : null,
                'phone' => $company?->phone,
                'email' => $company?->email,
                'address' => $company?->address,
                'products' => $products,
                'reviews' => $reviews,
                'testimonials' => $testimonials,
            ],
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        Gate::authorize('manage');

        $request->validate([
            'logo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ]);

        $company = Company::where('active', true)->first();

        if (! $company) {
            return response()->json([
                'success' => false,
                'message' => 'Data bisnis belum tersedia.',
            ], 422);
        }

        $previousPath = $company->logo_path;
        $disk = Storage::disk('public');
        if (! $disk->exists('logos')) {
            $disk->makeDirectory('logos');
        }

        $path = $request->file('logo')->store('logos', 'public');
        abort_unless(is_string($path) && $path !== '', 500, 'Upload logo gagal.');
        $company->update(['logo_path' => $path]);
        if ($previousPath) {
            $disk->delete($previousPath);
        }

        return response()->json([
            'success' => true,
            'data' => $this->companyPayload($company->fresh()),
        ]);
    }

    public function deleteLogo(): JsonResponse
    {
        Gate::authorize('manage');

        $company = Company::where('active', true)->first();

        if ($company && $company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
            $company->update(['logo_path' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => $company ? $this->companyPayload($company->fresh()) : null,
        ]);
    }

    private function companyPayload(Company $company): array
    {
        return [
            'id' => $company->id,
            'name' => $company->name,
            'phone' => $company->phone,
            'email' => $company->email,
            'address' => $company->address,
            'logo_url' => $company->logo_path ? '/storage/' . $company->logo_path : null,
        ];
    }

    private function resolved(): array
    {
        $settings = self::DEFAULT_SETTINGS;
        $rows = ApplicationSetting::all();

        foreach ($rows as $row) {
            [$group, $key] = array_pad(explode('.', $row->key, 2), 2, null);

            if ($key === null || ! isset($settings[$group])) {
                continue;
            }

            $settings[$group][$key] = $row->value;
        }

        return $settings;
    }
}
