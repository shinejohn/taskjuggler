<?php

namespace App\Models;

use App\Enums\QuestionStatus;
use App\Enums\TaskPriority;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'project_id',
        'author_id',
        'accepted_answer_id',
        'converted_task_id',
        'title',
        'body',
        'status',
        'priority',
        'tags',
        'view_count',
        'vote_count',
    ];

    protected $casts = [
        'status' => QuestionStatus::class,
        'priority' => TaskPriority::class,
        'tags' => 'array',
    ];

    // Relationships
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function acceptedAnswer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'accepted_answer_id');
    }

    public function convertedTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'converted_task_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class)->orderByDesc('vote_count');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(QuestionVote::class, 'voteable');
    }

    // Helpers
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function acceptAnswer(Answer $answer): void
    {
        $this->update([
            'accepted_answer_id' => $answer->id,
            'status' => QuestionStatus::RESOLVED,
        ]);
    }

    public function convertToTask(User $requestor): Task
    {
        $task = Task::create([
            'organization_id' => $this->organization_id,
            'project_id' => $this->project_id,
            'requestor_id' => $requestor->id,
            'title' => $this->title,
            'description' => "Converted from question:\n\n{$this->body}",
            'state' => 'pending',
            'source_channel' => 'web',
            'priority' => $this->priority->value,
        ]);

        $this->update([
            'converted_task_id' => $task->id,
            'status' => QuestionStatus::CLOSED,
        ]);

        return $task;
    }
}


