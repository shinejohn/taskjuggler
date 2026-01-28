<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;

class AreaMember extends Model
{
    protected $table = 'on_area_members';

    protected $fillable = [
        'area_id',
        'user_id',
        'role',
        'contact_info'
    ];

    protected $casts = [
        'contact_info' => 'array',
    ];

    public function area()
    {
        return $this->belongsTo(DocumentArea::class, 'area_id');
    }
}
