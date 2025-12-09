<?php

namespace App\Policies;

use App\Models\ContactList;
use App\Models\User;

class ContactListPolicy
{
    public function view(User $user, ContactList $contactList): bool
    {
        return $contactList->user_id === $user->id;
    }

    public function update(User $user, ContactList $contactList): bool
    {
        return $contactList->user_id === $user->id;
    }

    public function delete(User $user, ContactList $contactList): bool
    {
        return $contactList->user_id === $user->id;
    }
}
