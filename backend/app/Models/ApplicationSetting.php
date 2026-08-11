<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationSetting extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicationSettingFactory> */
    use HasFactory;

    protected $fillable = ['key', 'value', 'group', 'updated_by'];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function value(string $key, mixed $default = null): mixed
    {
        $row = self::where('key', $key)->first();

        return $row?->value ?? $default;
    }
}
