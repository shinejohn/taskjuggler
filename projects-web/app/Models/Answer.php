<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'question_id',
        'author_id',
        'body',
        'vote_count',
        'is_ai_suggested',
    ];

    protected $casts = [
        'is_ai_suggested' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(QuestionVote::class, 'voteable');
    }

    public function isAccepted(): bool
    {
        return $this->question->accepted_answer_id === $this->id;
    }
}


