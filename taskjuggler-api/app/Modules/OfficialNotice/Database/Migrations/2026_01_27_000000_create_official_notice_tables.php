<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Document Areas (Workspaces)
        Schema::create('on_document_areas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('owner_id')->index(); // Team Leader
            $table->uuid('alt_leader_id')->nullable();
            $table->string('name');
            $table->string('status')->default('active'); // active, archived
            $table->timestamps();
        });

        // Documents
        Schema::create('on_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('area_id')->index();
            $table->uuid('uploader_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type')->nullable(); // pdf, docx
            $table->boolean('is_analyzed')->default(false);
            $table->timestamps();

            $table->foreign('area_id')->references('id')->on('on_document_areas')->onDelete('cascade');
        });

        // Document Sections (AI Analysis Segments)
        Schema::create('on_document_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id')->index();
            $table->string('section_type'); // clause, party, term, payment
            $table->text('content'); // The actual text
            $table->text('analysis')->nullable(); // AI reasoning/notes
            $table->integer('risk_score')->default(0); // 0-100
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('on_documents')->onDelete('cascade');
        });

        // Critical Dates
        Schema::create('on_critical_dates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id')->index();
            $table->string('title'); // e.g., "Lease Renewal", "Payment Due"
            $table->dateTime('due_date');
            $table->string('notification_type')->default('email'); // email, sms, push
            $table->integer('reminder_days_before')->default(30);
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('on_documents')->onDelete('cascade');
        });

        // Area Members (Team)
        Schema::create('on_area_members', function (Blueprint $table) {
            $table->id();
            $table->uuid('area_id');
            $table->uuid('user_id');
            $table->string('role')->default('member'); // leader, alt_leader, member
            $table->json('contact_info')->nullable(); // Stores phone, email override, etc.
            $table->timestamps();

            $table->unique(['area_id', 'user_id']);
            $table->foreign('area_id')->references('id')->on('on_document_areas')->onDelete('cascade');
        });

        // Subscriptions
        Schema::create('on_subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->string('plan_type'); // single, unlimited
            $table->string('stripe_subscription_id')->nullable();
            $table->timestamp('renews_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('on_subscriptions');
        Schema::dropIfExists('on_area_members');
        Schema::dropIfExists('on_critical_dates');
        Schema::dropIfExists('on_document_sections');
        Schema::dropIfExists('on_documents');
        Schema::dropIfExists('on_document_areas');
    }
};
