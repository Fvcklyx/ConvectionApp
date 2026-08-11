<?php

namespace App\Traits;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Scope data operasional per company (multi-tenant).
 *
 * Aturan MVP:
 * - Company ditentukan dari user yang terautentikasi (company_id user),
 *   dengan fallback ke company aktif tunggal bila user belum dipetakan.
 * - Index query selalu di-scope ke company terpilih.
 * - Resource milik company lain diperlakukan sebagai 404.
 */
trait ScopesByCompany
{
    protected function companyId(?Request $request = null): ?int
    {
        $request ??= request();

        if ($request->user()?->company_id) {
            return (int) $request->user()->company_id;
        }

        $active = Company::query()->where('active', true)->value('id');

        return $active !== null ? (int) $active : null;
    }

    protected function perPage(?Request $request = null, int $default = 20, int $max = 500): int
    {
        $request ??= request();
        $perPage = $request->integer('per_page', $default);

        return min(max($perPage, 1), $max);
    }

    protected function scopeCompany(Builder $query, ?Request $request = null): Builder
    {
        $companyId = $this->companyId($request);

        if ($companyId !== null) {
            $query->where('company_id', $companyId);
        }

        return $query;
    }

    protected function assertSameCompany(?int $modelCompanyId, ?Request $request = null): void
    {
        $companyId = $this->companyId($request);

        if ($modelCompanyId !== null && $companyId !== null && (int) $modelCompanyId !== $companyId) {
            abort(404);
        }
    }
}
