<?php

namespace App\Services;

use App\Models\ApplicationSetting;
use App\Models\CodeCounter;
use Illuminate\Support\Facades\DB;

class CodeGeneratorService
{
    public const PREFIX_ORDER = 'ORD';
    public const PREFIX_INVOICE = 'INV';
    public const PREFIX_CUSTOMER = 'CUS';
    public const PREFIX_PRODUCT = 'PRD';

    /**
     * Generate nomor order: ORD-YYYYMMDD-000.
     */
    public static function orderNumber(): string
    {
        return self::next(self::PREFIX_ORDER);
    }

    /**
     * Generate nomor invoice: {PREFIX}-YYYYMMDD-000 (counter reset harian).
     * Prefix diambil dari application settings (invoice.prefix, default INV).
     */
    public static function invoiceNumber(): string
    {
        $prefix = ApplicationSetting::value('invoice.prefix', self::PREFIX_INVOICE);

        if (! is_string($prefix) || trim($prefix) === '') {
            $prefix = self::PREFIX_INVOICE;
        }

        return self::next(strtoupper(trim($prefix)));
    }

    /**
     * Generate kode customer: CUS-YYYYMMDD-000.
     */
    public static function customerCode(): string
    {
        return self::next(self::PREFIX_CUSTOMER);
    }

    /**
     * Generate kode/SKU produk: PRD-YYYYMMDD-000.
     */
    public static function productCode(): string
    {
        return self::next(self::PREFIX_PRODUCT);
    }

    /**
     * Generate kode berurutan per-hari dengan format {PREFIX}-YYYYMMDD-000.
     * Concurrency-safe: counter disimpan di tabel code_counters dan di-lock
     * di dalam transaksi database.
     */
    public static function next(string $prefix, ?string $date = null): string
    {
        $date ??= now()->format('Ymd');
        $key = $prefix . '-' . $date;

        $value = DB::transaction(function () use ($key, $prefix, $date) {
            $counter = CodeCounter::where('key', $key)->lockForUpdate()->first();

            $value = $counter ? $counter->last_value + 1 : 1;

            CodeCounter::updateOrCreate(
                ['key' => $key],
                ['prefix' => $prefix, 'counter_date' => $date, 'last_value' => $value]
            );

            return $value;
        });

        return $prefix . '-' . $date . '-' . str_pad($value, 3, '0', STR_PAD_LEFT);
    }
}
