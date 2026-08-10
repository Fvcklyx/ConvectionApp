<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionEvent extends Model
{
    /** @use HasFactory<\Database\Factories\ProductionEventFactory> */
    use HasFactory;

    protected $fillable = ['production_order_id', 'status', 'notes', 'created_by'];

    public function productionOrder(): BelongsTo
    {
        return $this->belongsTo(ProductionOrder::class);
    }
}
