<?php

namespace App\Policies;

use App\Models\MarketplaceVendor;
use App\Models\User;

class MarketplaceVendorPolicy
{
    public function view(User $user, MarketplaceVendor $vendor): bool
    {
        // Anyone can view active vendors
        return $vendor->is_active || $vendor->user_id === $user->id;
    }

    public function update(User $user, MarketplaceVendor $vendor): bool
    {
        return $vendor->user_id === $user->id;
    }

    public function delete(User $user, MarketplaceVendor $vendor): bool
    {
        return $vendor->user_id === $user->id;
    }
}
