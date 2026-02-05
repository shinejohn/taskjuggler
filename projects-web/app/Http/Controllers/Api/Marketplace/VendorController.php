<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceVendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MarketplaceVendor::where('organization_id', $request->user()->organization_id)
            ->where('is_active', true);

        if ($request->has('vendor_type')) {
            $query->where('vendor_type', $request->vendor_type);
        }

        if ($request->has('category')) {
            $query->whereJsonContains('categories', $request->category);
        }

        $vendors = $query->orderBy('average_rating', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($vendors);
    }

    public function show(MarketplaceVendor $vendor): JsonResponse
    {
        // Check organization access
        if ($vendor->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $vendor->load(['user']);

        return response()->json($vendor);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vendor_type' => 'required|in:human,ai_tool',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url|max:500',
            'categories' => 'required|array',
            'services' => 'nullable|array',
            'address' => 'nullable|string|max:500',
            'pricing_model' => 'nullable|in:fixed,hourly,quote',
            'base_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'ai_config' => 'nullable|array',
        ]);

        $vendor = MarketplaceVendor::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
            'is_active' => true,
            'is_verified' => false,
        ]);

        return response()->json($vendor, 201);
    }

    public function update(Request $request, MarketplaceVendor $vendor): JsonResponse
    {
        // Check organization access
        if ($vendor->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url|max:500',
            'categories' => 'sometimes|array',
            'services' => 'nullable|array',
            'address' => 'nullable|string|max:500',
            'pricing_model' => 'nullable|in:fixed,hourly,quote',
            'base_rate' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $vendor->update($validated);

        return response()->json($vendor);
    }
}
