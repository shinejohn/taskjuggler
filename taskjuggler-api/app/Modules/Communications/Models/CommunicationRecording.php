<?php

namespace App\Modules\Communications\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunicationRecording extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'communication_recordings';

    protected $fillable = [
        'call_id',
        's3_bucket',
        's3_key',
        'duration_seconds',
        'transcription_id',
        'transcription_text',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // Relationships
    public function call(): BelongsTo
    {
        return $this->belongsTo(CommunicationCall::class, 'call_id');
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeTranscribed($query)
    {
        return $query->where('status', 'transcribed');
    }

    // Methods
    public function markAsAvailable(): void
    {
        $this->update(['status' => 'available']);
    }

    public function markAsTranscribing(string $transcriptionId): void
    {
        $this->update([
            'status' => 'transcribing',
            'transcription_id' => $transcriptionId,
        ]);
    }

    public function markAsTranscribed(string $transcriptionText): void
    {
        $this->update([
            'status' => 'transcribed',
            'transcription_text' => $transcriptionText,
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    /**
     * Get the full S3 URL for this recording
     */
    public function getS3Url(): string
    {
        return "s3://{$this->s3_bucket}/{$this->s3_key}";
    }
}

