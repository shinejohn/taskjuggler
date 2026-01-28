<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CriticalDate extends Model
{
    use HasUuids;

    protected $table = 'on_critical_dates';

    protected $fillable = [
        'document_id',
        'title',
        'due_date',
        'notification_type',
        'reminder_days_before',
        'is_resolved'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'is_resolved' => 'boolean',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
