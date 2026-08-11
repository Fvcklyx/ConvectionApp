<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'array',
        ]);

        $groups = $request->input('settings');

        foreach ($groups as $group => $values) {
            if (! is_array($values)) {
                continue;
            }

            foreach ($values as $key => $value) {
                if (is_null($value)) {
                    continue;
                }

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

        return response()->json([
            'success' => true,
            'data' => [
                'name' => $brandName,
                'logo_url' => $company?->logo_path ? '/storage/' . $company->logo_path : null,
            ],
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
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

        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $path = $request->file('logo')->store('logos', 'public');
        $company->update(['logo_path' => $path]);

        return response()->json([
            'success' => true,
            'data' => $this->companyPayload($company),
        ]);
    }

    public function deleteLogo(): JsonResponse
    {
        $company = Company::where('active', true)->first();

        if ($company && $company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
            $company->update(['logo_path' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => $company ? $this->companyPayload($company) : null,
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
