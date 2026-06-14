<?php

namespace App\Modules\Workflows\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WorkflowEdge extends Model
{
    use HasUuids;

    protected $table = 'workflow_edges';

    protected $fillable = [
        'workflow_id',
        'source_node_id',
        'target_node_id',
        'condition_expression',
        'label',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function sourceNode()
    {
        return $this->belongsTo(WorkflowNode::class, 'source_node_id');
    }

    public function targetNode()
    {
        return $this->belongsTo(WorkflowNode::class, 'target_node_id');
    }
}
