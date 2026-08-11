<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy extends BasePolicy
{
    public function publish(User $user, Review $review): bool
    {
        return $user->isAdmin();
    }
}
