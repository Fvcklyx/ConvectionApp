<?php

namespace App\Policies;

use App\Models\Testimonial;
use App\Models\User;

class TestimonialPolicy extends BasePolicy
{
    public function publish(User $user, Testimonial $testimonial): bool
    {
        return $user->isAdmin();
    }

    public function unpublish(User $user, Testimonial $testimonial): bool
    {
        return $user->isAdmin();
    }
}
