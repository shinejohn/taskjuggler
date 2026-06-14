<?php

namespace App\Modules\Workflows\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Workflow extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'workflows';

    protected $fillable = [
        'name',
        'slug',
        'trigger_event',
        'is_active',
        'version',
        'input_schema',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'input_schema' => 'array',
    ];

    public function nodes()
    {
        return $this->hasMany(WorkflowNode::class);
    }

    public function edges()
    {
        return $this->hasMany(WorkflowEdge::class);
    }

    public function executions()
    {
        return $this->hasMany(WorkflowExecution::class);
    }
}
