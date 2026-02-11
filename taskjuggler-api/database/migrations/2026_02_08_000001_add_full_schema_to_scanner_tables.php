<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('scanner_sites')) {
            Schema::table('scanner_sites', function (Blueprint $table) {
                if (!Schema::hasColumn('scanner_sites', 'team_id')) {
                    $table->uuid('team_id')->nullable()->after('id');
                }
                if (!Schema::hasColumn('scanner_sites', 'name')) {
                    $table->string('name')->after('team_id');
                }
                if (!Schema::hasColumn('scanner_sites', 'url')) {
                    $table->string('url', 500)->after('name');
                }
                if (!Schema::hasColumn('scanner_sites', 'auth_type')) {
                    $table->string('auth_type', 50)->default('none')->after('url');
                }
                if (!Schema::hasColumn('scanner_sites', 'auth_config')) {
                    $table->json('auth_config')->nullable()->after('auth_type');
                }
                if (!Schema::hasColumn('scanner_sites', 'max_pages')) {
                    $table->integer('max_pages')->default(25)->after('auth_config');
                }
                if (!Schema::hasColumn('scanner_sites', 'health_score')) {
                    $table->integer('health_score')->nullable()->after('max_pages');
                }
                if (!Schema::hasColumn('scanner_sites', 'issue_count')) {
                    $table->integer('issue_count')->default(0)->after('health_score');
                }
            });
        }

        if (Schema::hasTable('scanner_scans')) {
            Schema::table('scanner_scans', function (Blueprint $table) {
                if (!Schema::hasColumn('scanner_scans', 'site_id')) {
                    $table->unsignedBigInteger('site_id')->after('id');
                }
                if (!Schema::hasColumn('scanner_scans', 'team_id')) {
                    $table->uuid('team_id')->nullable()->after('site_id');
                }
                if (!Schema::hasColumn('scanner_scans', 'status')) {
                    $table->string('status', 50)->default('pending')->after('team_id');
                }
                if (!Schema::hasColumn('scanner_scans', 'started_at')) {
                    $table->timestamp('started_at')->nullable()->after('status');
                }
                if (!Schema::hasColumn('scanner_scans', 'completed_at')) {
                    $table->timestamp('completed_at')->nullable()->after('started_at');
                }
                if (!Schema::hasColumn('scanner_scans', 'pages_scanned')) {
                    $table->integer('pages_scanned')->default(0)->after('completed_at');
                }
                if (!Schema::hasColumn('scanner_scans', 'total_pages')) {
                    $table->integer('total_pages')->nullable()->after('pages_scanned');
                }
                if (!Schema::hasColumn('scanner_scans', 'health_score')) {
                    $table->integer('health_score')->default(0)->after('total_pages');
                }
                if (!Schema::hasColumn('scanner_scans', 'category_scores')) {
                    $table->json('category_scores')->nullable()->after('health_score');
                }
                if (!Schema::hasColumn('scanner_scans', 'issue_count')) {
                    $table->integer('issue_count')->default(0)->after('category_scores');
                }
                if (!Schema::hasColumn('scanner_scans', 'error')) {
                    $table->text('error')->nullable()->after('issue_count');
                }
                if (!Schema::hasColumn('scanner_scans', 'created_by')) {
                    $table->uuid('created_by')->nullable()->after('error');
                }
                if (!Schema::hasColumn('scanner_scans', 'max_pages')) {
                    $table->integer('max_pages')->nullable()->after('created_by');
                }
            });
        }

        if (Schema::hasTable('scanner_issues')) {
            Schema::table('scanner_issues', function (Blueprint $table) {
                if (!Schema::hasColumn('scanner_issues', 'scan_id')) {
                    $table->unsignedBigInteger('scan_id')->after('id');
                }
                if (!Schema::hasColumn('scanner_issues', 'site_id')) {
                    $table->unsignedBigInteger('site_id')->after('scan_id');
                }
                if (!Schema::hasColumn('scanner_issues', 'team_id')) {
                    $table->uuid('team_id')->nullable()->after('site_id');
                }
                if (!Schema::hasColumn('scanner_issues', 'task_id')) {
                    $table->uuid('task_id')->nullable()->after('team_id');
                }
                if (!Schema::hasColumn('scanner_issues', 'category')) {
                    $table->string('category', 50)->after('task_id');
                }
                if (!Schema::hasColumn('scanner_issues', 'severity')) {
                    $table->string('severity', 20)->after('category');
                }
                if (!Schema::hasColumn('scanner_issues', 'status')) {
                    $table->string('status', 20)->default('open')->after('severity');
                }
                if (!Schema::hasColumn('scanner_issues', 'title')) {
                    $table->string('title', 500)->after('status');
                }
                if (!Schema::hasColumn('scanner_issues', 'message')) {
                    $table->text('message')->after('title');
                }
                if (!Schema::hasColumn('scanner_issues', 'page_url')) {
                    $table->string('page_url', 1000)->after('message');
                }
                if (!Schema::hasColumn('scanner_issues', 'selector')) {
                    $table->string('selector', 500)->nullable()->after('page_url');
                }
                if (!Schema::hasColumn('scanner_issues', 'html_context')) {
                    $table->text('html_context')->nullable()->after('selector');
                }
                if (!Schema::hasColumn('scanner_issues', 'wcag_criteria')) {
                    $table->json('wcag_criteria')->nullable()->after('html_context');
                }
                if (!Schema::hasColumn('scanner_issues', 'fix_code')) {
                    $table->text('fix_code')->nullable()->after('wcag_criteria');
                }
                if (!Schema::hasColumn('scanner_issues', 'fix_explanation')) {
                    $table->text('fix_explanation')->nullable()->after('fix_code');
                }
                if (!Schema::hasColumn('scanner_issues', 'fix_confidence')) {
                    $table->integer('fix_confidence')->nullable()->after('fix_explanation');
                }
                if (!Schema::hasColumn('scanner_issues', 'screenshot_url')) {
                    $table->string('screenshot_url', 500)->nullable()->after('fix_confidence');
                }
            });
        }
    }

    public function down(): void
    {
        // Do not drop columns - too invasive for rollback
    }
};
