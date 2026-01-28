<?php

namespace App\Modules\OfficialNotice\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocumentSection extends Model
{
    use HasUuids;

    protected $table = 'on_document_sections';

    protected $fillable = [
        'document_id',
        'section_type',
        'content',
        'analysis',
        'risk_score'
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
