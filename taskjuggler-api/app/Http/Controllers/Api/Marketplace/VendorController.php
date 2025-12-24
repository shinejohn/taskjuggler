<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceVendor;
use App\Models\AiToolConfig;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $vendors = MarketplaceVendor::query()
            ->where('is_active', true)
            ->when($request->type, fn($q, $type) => $q->where('vendor_type', $type))
            ->when($request->category, fn($q, $category) => $q->whereJsonContains('categories', $category))
            ->orderBy('average_rating', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($vendors);
    }

    public function show(MarketplaceVendor $vendor)
    {
        $vendor->load(['user', 'aiToolConfig']);

        return response()->json($vendor);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_type' => 'required|in:human,ai,hybrid',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_name' => 'nullable|string|max:255',
            'logo_url' => 'nullable|url|max:500',
            'categories' => 'required|array',
            'services' => 'nullable|array',
            'address' => 'nullable|string|max:500',
            'pricing_model' => 'nullable|in:fixed,hourly,quote,per_task',
            'base_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'ai_provider' => 'nullable|in:internal,botjob,alphasite,fourprojects,external',
            'ai_config' => 'nullable|array',
        ]);

        $vendor = MarketplaceVendor::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'is_active' => true,
            'is_verified' => false,
        ]);

        // Create AI tool config if AI vendor
        if (in_array($validated['vendor_type'], ['ai', 'hybrid']) && $validated['ai_provider']) {
            $this->createAiToolConfig($vendor, $request);
        }

        return response()->json($vendor, 201);
    }

    public function update(Request $request, MarketplaceVendor $vendor)
    {
        $this->authorize('update', $vendor);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'business_name' => 'nullable|string|max:255',
            'logo_url' => 'nullable|url|max:500',
            'categories' => 'sometimes|array',
            'services' => 'nullable|array',
            'address' => 'nullable|string|max:500',
            'pricing_model' => 'nullable|in:fixed,hourly,quote,per_task',
            'base_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'is_active' => 'sometimes|boolean',
        ]);

        $vendor->update($validated);

        return response()->json($vendor);
    }

    public function dashboard(Request $request)
    {
        $vendor = $request->user()->marketplaceVendors()->where('is_active', true)->first();

        if (!$vendor) {
            return response()->json(['error' => 'No active vendor profile'], 404);
        }

        $stats = [
            'total_jobs' => $vendor->tasks()->count(),
            'completed_jobs' => $vendor->tasks()->where('status', 'completed')->count(),
            'pending_jobs' => $vendor->tasks()->where('status', 'pending')->count(),
            'active_listings' => $vendor->listings()->where('status', 'open')->count(),
            'total_bids' => $vendor->bids()->count(),
            'accepted_bids' => $vendor->bids()->where('status', 'accepted')->count(),
        ];

        return response()->json(['vendor' => $vendor, 'stats' => $stats]);
    }

    public function jobs(Request $request)
    {
        $vendor = $request->user()->marketplaceVendors()->where('is_active', true)->first();

        if (!$vendor) {
            return response()->json(['error' => 'No active vendor profile'], 404);
        }

        $jobs = $vendor->tasks()
            ->with(['requestor', 'marketplaceListing'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($jobs);
    }

    public function earnings(Request $request)
    {
        $vendor = $request->user()->marketplaceVendors()->where('is_active', true)->first();

        if (!$vendor) {
            return response()->json(['error' => 'No active vendor profile'], 404);
        }

        // Calculate earnings from transactions
        $transactions = \App\Models\Transaction::where('vendor_id', $vendor->id)->get();
        
        $earnings = [
            'total' => $transactions->where('status', 'completed')->sum('amount'),
            'pending' => $transactions->where('status', 'pending')->sum('amount'),
            'completed' => $transactions->where('status', 'completed')->sum('amount'),
            'currency' => 'USD',
            'transaction_count' => $transactions->count(),
        ];

        return response()->json(['vendor' => $vendor, 'earnings' => $earnings]);
    }

    private function createAiToolConfig(MarketplaceVendor $vendor, Request $request): void
    {
        $validated = $request->validate([
            'ai_config.provider' => 'required|in:internal,botjob,alphasite,fourprojects,external',
            'ai_config.model' => 'nullable|string',
            'ai_config.api_endpoint' => 'nullable|url',
            'ai_config.api_key' => 'nullable|string',
            'ai_config.input_schema' => 'nullable|array',
            'ai_config.output_schema' => 'nullable|array',
            'ai_config.prompt_template' => 'nullable|string',
            'ai_config.max_execution_time' => 'nullable|integer|min:1',
            'ai_config.max_tokens' => 'nullable|integer|min:1',
            'ai_config.retry_count' => 'nullable|integer|min:0',
            'ai_config.auto_execute' => 'nullable|boolean',
            'ai_config.requires_approval' => 'nullable|boolean',
        ]);

        $config = $validated['ai_config'] ?? [];

        AiToolConfig::create([
            'vendor_id' => $vendor->id,
            'provider' => $config['provider'],
            'model' => $config['model'] ?? null,
            'api_endpoint' => $config['api_endpoint'] ?? null,
            'api_key' => $config['api_key'] ?? null,
            'input_schema' => $config['input_schema'] ?? null,
            'output_schema' => $config['output_schema'] ?? null,
            'prompt_template' => $config['prompt_template'] ?? null,
            'max_execution_time' => $config['max_execution_time'] ?? 300,
            'max_tokens' => $config['max_tokens'] ?? 4000,
            'retry_count' => $config['retry_count'] ?? 3,
            'auto_execute' => $config['auto_execute'] ?? false,
            'requires_approval' => $config['requires_approval'] ?? false,
        ]);
    }
}
