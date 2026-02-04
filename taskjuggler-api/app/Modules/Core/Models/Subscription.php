<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $table = 'subscriptions';

    protected $fillable = [
        'team_id',
        'user_id', // Optional if individual
        'plan',
        'status',
        'stripe_subscription_id',
        'stripe_customer_id',
        'current_period_start',
        'current_period_end',
        'metadata',
    ];

    protected $casts = [
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'metadata' => 'array',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
