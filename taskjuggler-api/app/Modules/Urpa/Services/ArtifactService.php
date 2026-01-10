<?php

namespace App\Modules\Urpa\Services;

use App\Modules\Urpa\Models\UrpaArtifact;
use App\Modules\Urpa\Models\UrpaUserProfile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ArtifactService
{
    /**
     * Store artifact file
     */
    public function storeArtifact(UrpaArtifact $artifact, string $content, string $extension = 'txt'): string
    {
        $filename = $artifact->id . '.' . $extension;
        $path = 'artifacts/' . $artifact->user_id . '/' . $filename;

        Storage::put($path, $content);

        $artifact->update([
            'storage_path' => $path,
            'file_size_bytes' => strlen($content),
        ]);

        return $path;
    }

    /**
     * Get artifact content
     */
    public function getArtifactContent(UrpaArtifact $artifact): ?string
    {
        if ($artifact->storage_path && Storage::exists($artifact->storage_path)) {
            return Storage::get($artifact->storage_path);
        }

        // Fallback to content field
        return $artifact->content;
    }

    /**
     * Delete artifact file
     */
    public function deleteArtifact(UrpaArtifact $artifact): void
    {
        if ($artifact->storage_path && Storage::exists($artifact->storage_path)) {
            Storage::delete($artifact->storage_path);
        }

        // Update user storage usage
        $profile = UrpaUserProfile::where('user_id', $artifact->user_id)->first();
        if ($profile && $artifact->file_size_bytes) {
            $sizeGb = $artifact->file_size_bytes / 1024 / 1024 / 1024;
            $profile->decrement('storage_used_gb', $sizeGb);
        }

        $artifact->delete();
    }

    /**
     * Generate artifact from AI response
     */
    public function generateArtifact(
        string $userId,
        string $type,
        string $title,
        string $content,
        ?string $sessionId = null,
        ?string $language = null
    ): UrpaArtifact {
        $profile = UrpaUserProfile::where('user_id', $userId)->first();

        // Check storage limit
        $sizeBytes = strlen($content);
        $sizeGb = $sizeBytes / 1024 / 1024 / 1024;

        if ($profile && !$profile->hasStorageSpace($sizeGb)) {
            throw new \Exception('Storage limit exceeded');
        }

        $artifact = UrpaArtifact::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'artifact_type' => $type,
            'title' => $title,
            'content' => $content,
            'language' => $language,
            'storage_provider' => 'local',
            'file_size_bytes' => $sizeBytes,
        ]);

        // Store file
        $extension = $this->getExtensionForType($type, $language);
        $this->storeArtifact($artifact, $content, $extension);

        // Update storage usage
        if ($profile) {
            $profile->increment('storage_used_gb', $sizeGb);
        }

        return $artifact;
    }

    /**
     * Get file extension for artifact type
     */
    private function getExtensionForType(string $type, ?string $language = null): string
    {
        if ($type === 'code' && $language) {
            return match(strtolower($language)) {
                'javascript', 'typescript' => 'js',
                'python' => 'py',
                'php' => 'php',
                'java' => 'java',
                'html' => 'html',
                'css' => 'css',
                'json' => 'json',
                default => 'txt',
            };
        }

        return match($type) {
            'code' => 'txt',
            'document' => 'md',
            'image' => 'png',
            'file' => 'txt',
            default => 'txt',
        };
    }
}

