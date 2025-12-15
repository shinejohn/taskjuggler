<?php

namespace App\Modules\Core\Models;

use App\Models\Task;
use App\Models\TeamMember;
use App\Models\RoutingRule;
use App\Models\ContactList;
use App\Models\AssistantChannel;
use App\Models\InboxItem;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\MarketplaceVendor;
use App\Models\AppointmentType;
use App\Models\AvailabilitySlot;
use App\Models\Appointment;
use App\Modules\Core\Models\Profile;
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
        'avatar_url',
        'current_team_id',
        'current_profile_id',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'settings' => 'array',
        'plan_expires_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships - using aliases for now, will be updated as modules are moved
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
        return $this->belongsToMany(\App\Models\Team::class, 'team_members')
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

    /**
     * User profiles
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class)->orderBy('is_default', 'desc')->orderBy('name');
    }

    /**
     * Get default profile
     */
    public function defaultProfile()
    {
        return $this->profiles()->where('is_default', true)->first();
    }

    /**
     * Get profile limit based on subscription plan
     */
    public function getProfileLimit(): int
    {
        $plan = $this->plan ?? 'free';
        $limits = config('modules.profile_limits', []);
        $limit = $limits[$plan] ?? 1;
        
        // -1 means unlimited
        return $limit === -1 ? PHP_INT_MAX : $limit;
    }

    /**
     * Check if user can create more profiles
     */
    public function canCreateProfile(): bool
    {
        $currentCount = $this->profiles()->count();
        $limit = $this->getProfileLimit();
        
        return $currentCount < $limit;
    }

    /**
     * Get current profile count
     */
    public function getProfileCount(): int
    {
        return $this->profiles()->count();
    }
}

