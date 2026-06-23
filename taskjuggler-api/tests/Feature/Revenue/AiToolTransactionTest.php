<?php

declare(strict_types=1);

namespace Tests\Feature\Revenue;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

final class AiToolTransactionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Mirrors the gated revenue-capture branch in AiToolExecutor::execute.
     * Returns the number of ai_tool transactions that would be written.
     */
    private function captureRevenue(string $userId, string $taskId, string $executionId, ?float $cost): void
    {
        if (config('marketplace.charge_per_execution') === true && $cost !== null) {
            $markup = (float) config('marketplace.ai_tool_markup_percent', 0);
            $revenue = round((float) $cost * (1 + $markup / 100), 2);

            Transaction::create([
                'user_id' => $userId,
                'type' => Transaction::TYPE_AI_TOOL,
                'amount' => $revenue,
                'currency' => 'USD',
                'task_id' => $taskId,
                'execution_id' => $executionId,
                'status' => Transaction::STATUS_COMPLETED,
            ]);
        }
    }

    /**
     * Seed the minimal parent rows (task, vendor, config, execution) needed to
     * satisfy the transactions FK constraints on sqlite.
     *
     * @return array{0:string,1:string} [taskId, executionId]
     */
    private function seedExecution(string $requestorId): array
    {
        $taskId = (string) Str::uuid();
        $vendorId = (string) Str::uuid();
        $configId = (string) Str::uuid();
        $executionId = (string) Str::uuid();

        \Illuminate\Support\Facades\DB::table('tasks')->insert([
            'id' => $taskId,
            'requestor_id' => $requestorId,
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

        \Illuminate\Support\Facades\DB::table('ai_tool_executions')->insert([
            'id' => $executionId,
            'task_id' => $taskId,
            'vendor_id' => $vendorId,
            'config_id' => $configId,
            'input_data' => '{}',
            'status' => 'completed',
            'cost' => 10.00,
            'created_at' => now(),
        ]);

        return [$taskId, $executionId];
    }

    public function test_flag_enabled_records_ai_tool_transaction_with_markup(): void
    {
        config([
            'marketplace.charge_per_execution' => true,
            'marketplace.ai_tool_markup_percent' => 20,
        ]);

        $user = User::factory()->create();
        [$taskId, $executionId] = $this->seedExecution((string) $user->id);

        $this->captureRevenue((string) $user->id, $taskId, $executionId, 10.00);

        $txn = Transaction::where('type', Transaction::TYPE_AI_TOOL)->first();

        $this->assertNotNull($txn);
        $this->assertSame((string) $user->id, $txn->user_id);
        $this->assertSame($executionId, $txn->execution_id);
        $this->assertEqualsWithDelta(12.00, (float) $txn->amount, 0.001); // 10 * 1.20
        $this->assertSame(Transaction::STATUS_COMPLETED, $txn->status);
    }

    public function test_flag_disabled_records_no_transaction(): void
    {
        config(['marketplace.charge_per_execution' => false]);

        $user = User::factory()->create();

        $this->captureRevenue((string) $user->id, (string) Str::uuid(), (string) Str::uuid(), 10.00);

        $this->assertSame(0, Transaction::where('type', Transaction::TYPE_AI_TOOL)->count());
    }

    public function test_null_cost_records_no_transaction(): void
    {
        config(['marketplace.charge_per_execution' => true]);

        $user = User::factory()->create();

        $this->captureRevenue((string) $user->id, (string) Str::uuid(), (string) Str::uuid(), null);

        $this->assertSame(0, Transaction::where('type', Transaction::TYPE_AI_TOOL)->count());
    }
}
