<?php

namespace App\Modules\Coordinator\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Coordinator\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Get contacts for organization
     * GET /api/coordinator/organizations/{orgId}/contacts
     */
    public function index(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $query = Contact::where('organization_id', $organization->id);

        // Search
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('source')) {
            $query->where('source', $request->query('source'));
        }

        if ($request->has('tags')) {
            $tags = is_array($request->query('tags')) 
                ? $request->query('tags') 
                : explode(',', $request->query('tags'));
            $query->whereJsonContains('tags', $tags);
        }

        // Pagination
        $perPage = $request->query('per_page', 15);
        $contacts = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $contacts->items(),
            'total' => $contacts->total(),
            'page' => $contacts->currentPage(),
            'per_page' => $contacts->perPage(),
        ]);
    }

    /**
     * Get contact by ID
     * GET /api/coordinator/organizations/{orgId}/contacts/{id}
     */
    public function show(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $contact = Contact::where('id', $id)
            ->where('organization_id', $organization->id)
            ->with(['appointments', 'interactions'])
            ->firstOrFail();

        return response()->json($contact);
    }

    /**
     * Create contact
     * POST /api/coordinator/organizations/{orgId}/contacts
     */
    public function store(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2|default:US',
            'source' => 'nullable|string',
            'status' => 'nullable|string|default:active',
            'tags' => 'nullable|array',
            'custom_fields' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $validated['organization_id'] = $organization->id;
        $contact = Contact::create($validated);

        return response()->json($contact, 201);
    }

    /**
     * Update contact
     * PUT /api/coordinator/organizations/{orgId}/contacts/{id}
     */
    public function update(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $contact = Contact::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2',
            'source' => 'nullable|string',
            'status' => 'sometimes|string',
            'tags' => 'nullable|array',
            'custom_fields' => 'nullable|array',
            'notes' => 'nullable|string',
            'lifetime_value' => 'nullable|numeric',
        ]);

        $contact->update($validated);

        return response()->json($contact);
    }

    /**
     * Delete contact
     * DELETE /api/coordinator/organizations/{orgId}/contacts/{id}
     */
    public function destroy(Request $request, string $orgId, string $id): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $contact = Contact::where('id', $id)
            ->where('organization_id', $organization->id)
            ->firstOrFail();

        $contact->delete();

        return response()->json(['message' => 'Contact deleted']);
    }

    /**
     * Bulk delete contacts
     * POST /api/coordinator/organizations/{orgId}/contacts/bulk-delete
     */
    public function bulkDelete(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|uuid|exists:coord_contacts,id',
        ]);

        Contact::where('organization_id', $organization->id)
            ->whereIn('id', $validated['ids'])
            ->delete();

        return response()->json(['message' => 'Contacts deleted']);
    }

    /**
     * Bulk tag contacts
     * POST /api/coordinator/organizations/{orgId}/contacts/bulk-tag
     */
    public function bulkTag(Request $request, string $orgId): JsonResponse
    {
        $organization = Organization::where('id', $orgId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|uuid|exists:coord_contacts,id',
            'tags' => 'required|array',
            'tags.*' => 'required|string',
        ]);

        $contacts = Contact::where('organization_id', $organization->id)
            ->whereIn('id', $validated['ids'])
            ->get();

        foreach ($contacts as $contact) {
            $existingTags = $contact->tags ?? [];
            $newTags = array_unique(array_merge($existingTags, $validated['tags']));
            $contact->update(['tags' => $newTags]);
        }

        return response()->json(['message' => 'Tags added']);
    }
}




