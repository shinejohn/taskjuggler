<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AiToolExecution;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class MetricsEndpointTest extends TestCase
{
    use RefreshDatabase;

    private const STRUCTURE = [
        'generated_at',
        'growth' => [
            'total_users',
            'new_users_30d',
            'new_users_7d',
            'active_users_30d',
            'signups_by_day',
        ],
        'revenue' => [
            'mrr',
            'total_revenue_30d',
            'total_revenue_all',
            'revenue_by_type',
            'revenue_by_day',
        ],
        'ai_costs' => [
            'total_cost_30d',
            'total_cost_all',
            'total_tokens_30d',
            'executions_30d',
            'by_service',
        ],
        'conversion' => [
            'free_users',
            'paid_users',
            'free_to_paid_rate',
            'active_subscriptions',
            'subscriptions_by_plan',
        ],
        'unit_economics' => [
            'total_revenue_30d',
            'total_ai_cost_30d',
            'gross_margin_30d',
            'gross_margin_pct',
        ],
    ];

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/admin/metrics/summary')->assertStatus(401);
    }

    public function test_non_admin_user_is_forbidden(): void
    {
        config(['admin.emails' => ['admin@test.dev']]);

        $user = User::factory()->create(['email' => 'notadmin@test.dev']);
        Sanctum::actingAs($user);

        $this->getJson('/api/admin/metrics/summary')->assertStatus(403);
    }

    public function test_admin_user_gets_full_contract(): void
    {
        config(['admin.emails' => ['admin@test.dev']]);

        $admin = User::factory()->create(['email' => 'admin@test.dev']);
        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/metrics/summary')
            ->assertStatus(200)
            ->assertJsonStructure(self::STRUCTURE);
    }

    public function test_seeded_data_produces_nonzero_metrics(): void
    {
        config(['admin.emails' => ['admin@test.dev']]);

        $admin = User::factory()->create(['email' => 'admin@test.dev', 'plan' => 'pro']);
        $customer = User::factory()->create(['plan' => 'free']);

        // Completed subscription transaction (revenue).
        Transaction::create([
            'user_id' => $customer->id,
            'type' => Transaction::TYPE_SUBSCRIPTION,
            'amount' => 50.00,
            'currency' => 'USD',
            'stripe_payment_intent_id' => 'pi_' . Str::random(10),
            'status' => Transaction::STATUS_COMPLETED,
        ]);

        // AI tool execution with cost (ai cost). Seed minimal parent rows so
        // sqlite FK constraints are satisfied. Insert via the query builder to
        // sidestep Eloquent timestamp expectations on these tables.
        $taskId = (string) Str::uuid();
        $vendorId = (string) Str::uuid();
        $configId = (string) Str::uuid();

        \Illuminate\Support\Facades\DB::table('tasks')->insert([
            'id' => $taskId,
            'requestor_id' => $customer->id,
            'title' => 'Test task',
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('marketplace_vendors')->insert([
            'id' => $vendorId,
            'vendor_type' => 'ai',
            'name' => 'Test Vendor',
            'services' => '[]',
            'currency' => 'USD',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('ai_tool_configs')->insert([
            'id' => $configId,
            'vendor_id' => $vendorId,
            'provider' => 'internal',
            'model' => 'openai/gpt-4o-mini',
            'input_schema' => '{}',
            'output_schema' => '{}',
            'created_at' => now(),
        ]);

        AiToolExecution::create([
            'task_id' => $taskId,
            'vendor_id' => $vendorId,
            'config_id' => $configId,
            'input_data' => [],
            'status' => AiToolExecution::STATUS_COMPLETED,
            'started_at' => now(),
            'completed_at' => now(),
            'tokens_used' => 1000,
            'cost' => 5.00,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/metrics/summary')->assertStatus(200);
        $json = $response->json();

        $this->assertEqualsWithDelta(50.00, $json['revenue']['total_revenue_all'], 0.001);
        $this->assertEqualsWithDelta(50.00, $json['revenue']['total_revenue_30d'], 0.001);
        $this->assertEqualsWithDelta(50.00, $json['revenue']['mrr'], 0.001);
        $this->assertEqualsWithDelta(5.00, $json['ai_costs']['total_cost_30d'], 0.001);
        $this->assertSame(1000, $json['ai_costs']['total_tokens_30d']);
        $this->assertSame(1, $json['ai_costs']['executions_30d']);

        // gross_margin_30d == revenue_30d - ai_cost_30d
        $expectedMargin = round(
            $json['unit_economics']['total_revenue_30d'] - $json['unit_economics']['total_ai_cost_30d'],
            2
        );
        $this->assertEqualsWithDelta($expectedMargin, $json['unit_economics']['gross_margin_30d'], 0.001);
        $this->assertEqualsWithDelta(45.00, $json['unit_economics']['gross_margin_30d'], 0.001);
    }
}
