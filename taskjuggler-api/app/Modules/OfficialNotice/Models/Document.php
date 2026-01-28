<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Document extends Model
{
    use HasUuids;

    protected $table = 'on_documents';

    protected $fillable = [
        'area_id',
        'uploader_id',
        'title',
        'description',
        'file_path',
        'file_type',
        'is_analyzed'
    ];

    public function area()
    {
        return $this->belongsTo(DocumentArea::class, 'area_id');
    }

    public function sections()
    {
        return $this->hasMany(DocumentSection::class, 'document_id');
    }

    public function criticalDates()
    {
        return $this->hasMany(CriticalDate::class, 'document_id');
    }
}
