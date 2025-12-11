<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'name',
        'phone',
        'timezone',
        'plan',
        'plan_expires_at',
        'stripe_customer_id',
        'settings',
        'push_token',
        'push_platform',
        'actor_type',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'settings' => 'array',
        'plan_expires_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function tasks()
    {
        return $this->hasMany(Task::class, 'requestor_id');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'owner_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'owner_id');
    }

    public function routingRules()
    {
        return $this->hasMany(RoutingRule::class)->orderBy('priority');
    }

    public function contactLists()
    {
        return $this->hasMany(ContactList::class);
    }

    public function assistantChannels()
    {
        return $this->hasMany(AssistantChannel::class);
    }

    public function inboxItems()
    {
        return $this->hasMany(InboxItem::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function marketplaceVendors()
    {
        return $this->hasMany(MarketplaceVendor::class);
    }

    public function appointmentTypes()
    {
        return $this->hasMany(AppointmentType::class);
    }

    public function availabilitySlots()
    {
        return $this->hasMany(AvailabilitySlot::class);
    }

    public function hostedAppointments()
    {
        return $this->hasMany(Appointment::class, 'host_id');
    }

    /**
     * Teams the user belongs to
     */
    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot(['is_admin', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Teams the user administers
     */
    public function adminTeams()
    {
        return $this->teams()->wherePivot('is_admin', true);
    }

    // Helpers
    public function getPhoneChannel(): ?AssistantChannel
    {
        return $this->assistantChannels()
            ->where('channel_type', 'phone')
            ->where('is_active', true)
            ->first();
    }

    public function getEmailChannel(): ?AssistantChannel
    {
        return $this->assistantChannels()
            ->where('channel_type', 'email')
            ->where('is_active', true)
            ->first();
    }

    public function isPro(): bool
    {
        return in_array($this->plan, ['pro', 'business']);
    }
}
