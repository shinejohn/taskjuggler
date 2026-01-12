<?php

namespace App\Modules\Coordinator\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BusinessInformation extends Model
{
    use HasUuids;

    protected $table = 'coord_business_information';

    protected $fillable = [
        'organization_id',
        'services',
        'description',
        'specialties',
        'certifications',
        'years_in_business',
        'number_of_locations',
        'additional_info',
    ];

    protected $casts = [
        'services' => 'array',
        'specialties' => 'array',
        'certifications' => 'array',
        'additional_info' => 'array',
    ];

    // Relationships
    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }
}




