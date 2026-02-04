<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * 
     * Creates DocConnect tables for professional networking and collaboration.
     */
    public function up(): void
    {
        // =====================================================
        // DOCCONNECT POSTS (Clinical Discussions Feed)
        // =====================================================
        Schema::create('docconnect_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->foreignUuid('organization_id')->constrained('organizations')->onDelete('cascade');
            
            $table->text('content');
            
            // Visibility: 'public' (all providers), 'network' (my org/connections), 'private' (draft)
            $table->string('visibility', 20)->default('public');
            
            // Interaction counts (denormalized for performance)
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index('provider_id');
            $table->index('visibility');
            $table->index('created_at');
        });

        // =====================================================
        // DOCCONNECT POST ATTACHMENTS
        // =====================================================
        Schema::create('docconnect_post_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('docconnect_posts')->onDelete('cascade');
            
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type', 50); // 'pdf', 'image', 'dicom', etc.
            $table->integer('file_size'); // in bytes
            
            $table->timestamps();
            
            $table->index('post_id');
        });

        // =====================================================
        // DOCCONNECT COMMENTS (Threaded discussions)
        // =====================================================
        Schema::create('docconnect_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('docconnect_posts')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            $table->uuid('parent_id')->nullable(); // For threading
            
            $table->text('content');
            
            $table->timestamps();
            
            $table->index('post_id');
            $table->index('parent_id');
        });

        // =====================================================
        // DOCCONNECT LIKES ("Insightful" reactions)
        // =====================================================
        Schema::create('docconnect_likes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained('docconnect_posts')->onDelete('cascade');
            $table->foreignUuid('provider_id')->constrained('doctors_providers')->onDelete('cascade');
            
            $table->timestamps();
            
            $table->unique(['post_id', 'provider_id']);
            $table->index('post_id');
        });

        // =====================================================
        // DOCCONNECT ONLINE STATUS (Real-time tracking)
        // =====================================================
        Schema::create('docconnect_online_status', function (Blueprint $table) {
            $table->foreignUuid('provider_id')->primary()->constrained('doctors_providers')->onDelete('cascade');
            $table->string('status', 20)->default('off'); // 'on', 'off', 'busy', 'away'
            $table->timestamp('last_seen_at')->useCurrent();
            
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docconnect_online_status');
        Schema::dropIfExists('docconnect_likes');
        Schema::dropIfExists('docconnect_comments');
        Schema::dropIfExists('docconnect_post_attachments');
        Schema::dropIfExists('docconnect_posts');
    }
};
