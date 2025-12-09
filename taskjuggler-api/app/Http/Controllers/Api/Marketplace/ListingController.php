<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceListing;
use App\Models\MarketplaceBid;
use App\Models\Task;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $listings = MarketplaceListing::query()
            ->with(['requestor', 'task', 'assignedVendor', 'bids'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->category, fn($q, $category) => $q->where('category', $category))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($listings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|uuid|exists:tasks,id',
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'location_required' => 'nullable|boolean',
            'location' => 'nullable|array',
            'location_radius_miles' => 'nullable|numeric|min:0',
            'budget_type' => 'required|in:fixed,hourly,quote',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0|gte:budget_min',
            'needed_by' => 'nullable|date',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $task = Task::findOrFail($validated['task_id']);
        $this->authorize('update', $task);

        $listing = MarketplaceListing::create([
            ...$validated,
            'requestor_id' => $request->user()->id,
            'status' => MarketplaceListing::STATUS_OPEN,
        ]);

        return response()->json($listing, 201);
    }

    public function show(MarketplaceListing $listing)
    {
        $listing->load(['requestor', 'task', 'assignedVendor', 'bids.vendor']);

        return response()->json($listing);
    }

    public function bid(Request $request, MarketplaceListing $listing)
    {
        if ($listing->status !== MarketplaceListing::STATUS_OPEN) {
            return response()->json(['error' => 'Listing is not open for bids'], 400);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'message' => 'nullable|string',
            'estimated_completion' => 'nullable|date|after:now',
        ]);

        // Get vendor for authenticated user
        $vendor = $request->user()->marketplaceVendors()->where('is_active', true)->first();
        
        if (!$vendor) {
            return response()->json(['error' => 'No active vendor profile found'], 400);
        }

        $bid = MarketplaceBid::create([
            ...$validated,
            'listing_id' => $listing->id,
            'vendor_id' => $vendor->id,
            'status' => MarketplaceBid::STATUS_PENDING,
        ]);

        return response()->json($bid, 201);
    }

    public function assign(Request $request, MarketplaceListing $listing)
    {
        $this->authorize('update', $listing);

        $validated = $request->validate([
            'vendor_id' => 'required|uuid|exists:marketplace_vendors,id',
        ]);

        $vendor = \App\Models\MarketplaceVendor::findOrFail($validated['vendor_id']);
        
        $listing->assignTo($vendor);

        // Update task
        if ($listing->task) {
            $listing->task->update([
                'marketplace_vendor_id' => $vendor->id,
                'status' => Task::STATUS_ACCEPTED,
            ]);

            // If AI tool, execute immediately
            if ($vendor->canAutoExecute()) {
                \App\Jobs\ExecuteAiTool::dispatch($listing->task, $vendor);
            }
        }

        return response()->json($listing->fresh());
    }
}
