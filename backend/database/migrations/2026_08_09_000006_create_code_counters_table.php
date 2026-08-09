<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_counters', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('prefix', 10);
            $table->string('counter_date', 10);
            $table->unsignedBigInteger('last_value')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_counters');
    }
};
