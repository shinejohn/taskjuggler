<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocumentArea extends Model
{
    use HasUuids;

    protected $table = 'on_document_areas';

    protected $fillable = [
        'owner_id',
        'alt_leader_id',
        'name',
        'status'
    ];

    public function documents()
    {
        return $this->hasMany(Document::class, 'area_id');
    }

    public function members()
    {
        return $this->hasMany(AreaMember::class, 'area_id');
    }
}
