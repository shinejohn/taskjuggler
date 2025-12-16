<?php

namespace App\Policies;

use App\Models\MarketplaceListing;
use App\Models\User;

class MarketplaceListingPolicy
{
    public function view(User $user, MarketplaceListing $listing): bool
    {
        // Anyone can view listings
        return true;
    }

    public function update(User $user, MarketplaceListing $listing): bool
    {
        return $listing->requestor_id === $user->id;
    }

    public function delete(User $user, MarketplaceListing $listing): bool
    {
        return $listing->requestor_id === $user->id;
    }
}
