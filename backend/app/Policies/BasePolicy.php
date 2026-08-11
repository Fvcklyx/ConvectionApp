<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Kebijakan dasar untuk semua resource.
 *
 * Aturan MVP (single admin):
 * - Semua user terautentikasi boleh melihat dan mengubah data operasional.
 * - Hapus permanen dan aksi sensitif (publish, settings) khusus admin.
 * - Admin diloloskan semua ability melalui Gate::before di AuthServiceProvider.
 */
class BasePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Model $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Model $model): bool
    {
        return true;
    }

    public function delete(User $user, Model $model): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Model $model): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Model $model): bool
    {
        return $user->isAdmin();
    }
}
