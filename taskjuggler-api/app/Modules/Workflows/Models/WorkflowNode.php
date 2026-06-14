<?php

namespace App\Modules\Workflows\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WorkflowNode extends Model
{
    use HasUuids;

    protected $table = 'workflow_nodes';

    protected $fillable = [
        'workflow_id',
        'key',
        'type',
        'label',
        'config',
        'retry_policy',
        'next_node_id',
    ];

    protected $casts = [
        'config' => 'array',
        'retry_policy' => 'array',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function nextNode()
    {
        return $this->belongsTo(WorkflowNode::class, 'next_node_id');
    }

    public function outgoingEdges()
    {
        return $this->hasMany(WorkflowEdge::class, 'source_node_id');
    }
}
