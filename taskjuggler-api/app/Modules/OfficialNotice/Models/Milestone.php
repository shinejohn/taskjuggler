<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Milestone extends Model
{
    use HasUuids;

    protected $table = 'on_milestones';

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'rrule',
        'document_id',
        'created_by',
        'status', // pending, completed, cancelled
        'is_all_day'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_all_day' => 'boolean',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
