<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Enhance Organizations Table
        if (Schema::hasTable('coord_organizations')) {
            Schema::table('coord_organizations', function (Blueprint $table) {
                if (!Schema::hasColumn('coord_organizations', 'enabled_modules')) {
                    $table->json('enabled_modules')->nullable()->after('settings');
                }
                if (!Schema::hasColumn('coord_organizations', 'enabled_features')) {
                    $table->json('enabled_features')->nullable()->after('enabled_modules');
                }
                if (!Schema::hasColumn('coord_organizations', 'logo_url')) {
                    $table->string('logo_url')->nullable()->after('name');
                }
            });
        }

        // 2. Enhance Roles Table
        // Spatie tables are defined in config/permission.php, but typically 'roles'.
        // We assume standard 'roles' table exists from previous migration.
        if (Schema::hasTable('roles')) {
            Schema::table('roles', function (Blueprint $table) {
                if (!Schema::hasColumn('roles', 'organization_id')) {
                    $table->uuid('organization_id')->nullable()->after('id');
                    $table->foreign('organization_id')->references('id')->on('coord_organizations')->onDelete('cascade');
                }
                if (!Schema::hasColumn('roles', 'slug')) {
                    $table->string('slug')->nullable()->after('name');
                }
                if (!Schema::hasColumn('roles', 'description')) {
                    $table->text('description')->nullable()->after('slug');
                }
                if (!Schema::hasColumn('roles', 'is_system_role')) {
                    $table->boolean('is_system_role')->default(false)->after('description');
                }
                if (!Schema::hasColumn('roles', 'color')) {
                    $table->string('color', 7)->nullable()->after('is_system_role');
                }
                if (!Schema::hasColumn('roles', 'display_order')) {
                    $table->integer('display_order')->default(0)->after('color');
                }
                
                // Index for org-specific role lookups
                $table->index(['organization_id', 'slug']);
            });
        }

        // 3. Enhance Permissions Table
        if (Schema::hasTable('permissions')) {
            Schema::table('permissions', function (Blueprint $table) {
                if (!Schema::hasColumn('permissions', 'display_name')) {
                    $table->string('display_name')->nullable()->after('name');
                }
                if (!Schema::hasColumn('permissions', 'module')) {
                    $table->string('module', 50)->nullable()->after('display_name');
                }
                if (!Schema::hasColumn('permissions', 'category')) {
                    $table->string('category', 50)->nullable()->after('module');
                }
                if (!Schema::hasColumn('permissions', 'description')) {
                    $table->text('description')->nullable()->after('category');
                }
                if (!Schema::hasColumn('permissions', 'is_sensitive')) {
                    $table->boolean('is_sensitive')->default(false)->after('description');
                }
                if (!Schema::hasColumn('permissions', 'subscription_tier')) {
                    $table->string('subscription_tier', 50)->nullable()->after('is_sensitive');
                }
                if (!Schema::hasColumn('permissions', 'display_order')) {
                    $table->integer('display_order')->default(0)->after('subscription_tier');
                }

                $table->index('module');
            });
        }

        // 4. Enhance Role Has Permissions (Pivot)
        if (Schema::hasTable('role_has_permissions')) {
            Schema::table('role_has_permissions', function (Blueprint $table) {
                if (!Schema::hasColumn('role_has_permissions', 'granted')) {
                    $table->boolean('granted')->default(true);
                }
                if (!Schema::hasColumn('role_has_permissions', 'scope_type')) {
                    $table->string('scope_type', 50)->nullable();
                }
                if (!Schema::hasColumn('role_has_permissions', 'scope_value')) {
                    $table->text('scope_value')->nullable();
                }
            });
        }

        // 5. Enhance User Roles (Pivot - model_has_roles)
        if (Schema::hasTable('model_has_roles')) {
            Schema::table('model_has_roles', function (Blueprint $table) {
                if (!Schema::hasColumn('model_has_roles', 'is_primary')) {
                    $table->boolean('is_primary')->default(false);
                }
                if (!Schema::hasColumn('model_has_roles', 'assigned_by')) {
                    $table->uuid('assigned_by')->nullable();
                }
            });
        }

        // 6. Create User Permission Overrides Table
        Schema::create('user_permission_overrides', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id'); // Relating to core users table (assumed UUID)
            $table->unsignedBigInteger('permission_id'); // Spatie permissions uses BigInt ID
            $table->string('override_type', 10); // 'grant' or 'deny'
            $table->text('reason')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // Foreign keys
            // Assuming users table uses UUIDs. If BIGINT, this needs adjustment. 
            // Previous user migration check showed users uses UUIDs (via HasUuids trait in model).
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

            $table->unique(['user_id', 'permission_id']);
        });

        // 7. Create Audit Log Table
        Schema::create('audit_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_role')->nullable();
            $table->string('action', 100);
            $table->string('category', 50);
            $table->string('severity', 20)->default('info');
            $table->string('resource_type', 100)->nullable();
            $table->uuid('resource_id')->nullable(); // Using UUID for resources generally
            $table->string('resource_name')->nullable();
            $table->text('description')->nullable();
            $table->json('changes')->nullable();
            $table->json('metadata')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_log');
        Schema::dropIfExists('user_permission_overrides');

        if (Schema::hasTable('model_has_roles')) {
            Schema::table('model_has_roles', function (Blueprint $table) {
                $table->dropColumn(['is_primary', 'assigned_by']);
            });
        }

        if (Schema::hasTable('role_has_permissions')) {
            Schema::table('role_has_permissions', function (Blueprint $table) {
                $table->dropColumn(['granted', 'scope_type', 'scope_value']);
            });
        }

        if (Schema::hasTable('permissions')) {
            Schema::table('permissions', function (Blueprint $table) {
                $table->dropColumn(['display_name', 'module', 'category', 'description', 'is_sensitive', 'subscription_tier', 'display_order']);
            });
        }

        if (Schema::hasTable('roles')) {
            Schema::table('roles', function (Blueprint $table) {
                $table->dropForeign(['organization_id']);
                $table->dropColumn(['organization_id', 'slug', 'description', 'is_system_role', 'color', 'display_order']);
            });
        }

        if (Schema::hasTable('coord_organizations')) {
            Schema::table('coord_organizations', function (Blueprint $table) {
                $table->dropColumn(['enabled_modules', 'enabled_features', 'logo_url']);
            });
        }
    }
};
