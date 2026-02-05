<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceListing;
use App\Models\MarketplaceBid;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MarketplaceListing::where('organization_id', $request->user()->organization_id)
            ->with(['requestor', 'task', 'assignedVendor', 'bids']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $listings = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($listings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task_id' => 'nullable|uuid|exists:tasks,id',
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'location_required' => 'nullable|boolean',
            'location' => 'nullable|array',
            'location_radius_miles' => 'nullable|numeric|min:0',
            'budget_type' => 'required|in:fixed,hourly,quote',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0',
            'needed_by' => 'nullable|date',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $listing = MarketplaceListing::create([
            ...$validated,
            'requestor_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'status' => MarketplaceListing::STATUS_OPEN,
        ]);

        return response()->json($listing, 201);
    }

    public function show(MarketplaceListing $listing): JsonResponse
    {
        // Check organization access
        if ($listing->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $listing->load(['requestor', 'task', 'assignedVendor', 'bids.vendor']);

        return response()->json($listing);
    }

    public function bid(Request $request, MarketplaceListing $listing): JsonResponse
    {
        // Check organization access
        if ($listing->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        if ($listing->status !== MarketplaceListing::STATUS_OPEN) {
            return response()->json(['error' => 'Listing is not open for bids'], 400);
        }

        $validated = $request->validate([
            'vendor_id' => 'required|uuid|exists:marketplace_vendors,id',
            'amount' => 'required|numeric|min:0',
            'message' => 'nullable|string',
            'estimated_completion' => 'nullable|date|after:now',
        ]);

        $bid = MarketplaceBid::create([
            ...$validated,
            'listing_id' => $listing->id,
            'status' => MarketplaceBid::STATUS_PENDING,
        ]);

        return response()->json($bid, 201);
    }

    public function assign(Request $request, MarketplaceListing $listing): JsonResponse
    {
        // Check organization access
        if ($listing->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'vendor_id' => 'required|uuid|exists:marketplace_vendors,id',
            'bid_id' => 'nullable|uuid|exists:marketplace_bids,id',
        ]);

        $listing->update([
            'assigned_vendor_id' => $validated['vendor_id'],
            'assigned_at' => now(),
            'status' => MarketplaceListing::STATUS_ASSIGNED,
        ]);

        if ($validated['bid_id']) {
            MarketplaceBid::where('id', $validated['bid_id'])->update(['status' => MarketplaceBid::STATUS_ACCEPTED]);
            MarketplaceBid::where('listing_id', $listing->id)
                ->where('id', '!=', $validated['bid_id'])
                ->update(['status' => MarketplaceBid::STATUS_REJECTED]);
        }

        return response()->json($listing);
    }
}
