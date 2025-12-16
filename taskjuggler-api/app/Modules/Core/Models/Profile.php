<?php

namespace App\Modules\Core\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Profile extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'is_default',
        'settings',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * User who owns this profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot method - auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($profile) {
            if (empty($profile->slug)) {
                $profile->slug = Str::slug($profile->name);
            }
        });

        static::saving(function ($profile) {
            // If this is being set as default, unset other defaults
            if ($profile->is_default && $profile->isDirty('is_default')) {
                static::where('user_id', $profile->user_id)
                    ->where('id', '!=', $profile->id)
                    ->update(['is_default' => false]);
            }
        });
    }

    /**
     * Set this profile as the default
     */
    public function setAsDefault(): void
    {
        static::where('user_id', $this->user_id)
            ->update(['is_default' => false]);
        
        $this->update(['is_default' => true]);
    }
}

