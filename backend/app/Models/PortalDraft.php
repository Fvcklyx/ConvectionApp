<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortalDraft extends Model
{
    protected $guarded = ['id'];
    protected function casts(): array
    {
        return ['items' => 'array', 'total' => 'decimal:2', 'submitted_at' => 'datetime', 'version' => 'integer'];
    }
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
}
