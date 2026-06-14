<?php

namespace App\Modules\Workflows\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WorkflowExecution extends Model
{
    use HasUuids;

    protected $table = 'workflow_executions';

    protected $fillable = [
        'workflow_id',
        'trigger_source',
        'trigger_id',
        'correlation_id',
        'status',
        'current_node_id',
        'context_data',
        'trigger_payload',
        'started_at',
        'completed_at',
        'error_message',
    ];

    protected $casts = [
        'context_data' => 'array',
        'trigger_payload' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function currentNode()
    {
        return $this->belongsTo(WorkflowNode::class, 'current_node_id');
    }

    public function logs()
    {
        return $this->hasMany(WorkflowLog::class, 'execution_id');
    }
}
