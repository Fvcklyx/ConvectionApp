<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationSetting;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'data' => $company ? [
                'id' => $company->id,
                'name' => $company->name,
                'phone' => $company->phone,
                'email' => $company->email,
                'address' => $company->address,
            ] : null,
        ]);
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
