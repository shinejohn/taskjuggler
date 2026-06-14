<?php

namespace App\Modules\Workflows\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WorkflowLog extends Model
{
    use HasUuids;

    protected $table = 'workflow_logs';

    protected $fillable = [
        'execution_id',
        'node_id',
        'status',
        'input_data',
        'output_data',
        'message',
        'duration_ms',
    ];

    protected $casts = [
        'input_data' => 'array',
        'output_data' => 'array',
        'created_at' => 'datetime',
    ];

    public function execution()
    {
        return $this->belongsTo(WorkflowExecution::class, 'execution_id');
    }

    public function node()
    {
        return $this->belongsTo(WorkflowNode::class, 'node_id');
    }
}
