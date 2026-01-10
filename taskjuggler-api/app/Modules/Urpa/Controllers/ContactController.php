<?php

namespace App\Modules\Urpa\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urpa\Models\UrpaContact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Get contacts for user
     * GET /api/urpa/contacts
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = UrpaContact::where('user_id', $user->id);

        // Search
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Filters
        if ($request->has('source')) {
            $query->bySource($request->query('source'));
        }

        if ($request->has('email')) {
            $query->byEmail($request->query('email'));
        }

        // Pagination
        $perPage = $request->query('per_page', 15);
        $contacts = $query->orderBy('last_contacted_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $contacts->items(),
            'total' => $contacts->total(),
            'page' => $contacts->currentPage(),
            'per_page' => $contacts->perPage(),
        ]);
    }

    /**
     * Get contact by ID
     * GET /api/urpa/contacts/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $contact = UrpaContact::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with(['activities', 'phoneCalls'])
            ->firstOrFail();

        return response()->json($contact);
    }

    /**
     * Create contact
     * POST /api/urpa/contacts
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:50',
            'external_id' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
            'avatar_url' => 'nullable|url',
        ]);

        $contact = UrpaContact::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json($contact, 201);
    }

    /**
     * Update contact
     * PUT /api/urpa/contacts/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $contact = UrpaContact::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:50',
            'company' => 'sometimes|string|max:255',
            'job_title' => 'sometimes|string|max:255',
            'tags' => 'sometimes|array',
            'notes' => 'sometimes|string',
            'avatar_url' => 'sometimes|url',
        ]);

        $contact->update($validated);

        return response()->json($contact);
    }

    /**
     * Delete contact
     * DELETE /api/urpa/contacts/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $contact = UrpaContact::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $contact->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Import contacts
     * POST /api/urpa/contacts/import
     */
    public function import(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'contacts' => 'required|array',
            'contacts.*.first_name' => 'nullable|string|max:100',
            'contacts.*.last_name' => 'nullable|string|max:100',
            'contacts.*.email' => 'nullable|email|max:255',
            'contacts.*.phone' => 'nullable|string|max:50',
            'contacts.*.company' => 'nullable|string|max:255',
            'source' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $imported = 0;
        $skipped = 0;

        foreach ($validated['contacts'] as $contactData) {
            // Check if contact already exists by email
            if (!empty($contactData['email'])) {
                $existing = UrpaContact::where('user_id', $user->id)
                    ->where('email', $contactData['email'])
                    ->first();

                if ($existing) {
                    $skipped++;
                    continue;
                }
            }

            UrpaContact::create([
                'user_id' => $user->id,
                'source' => $validated['source'],
                ...$contactData,
            ]);

            $imported++;
        }

        return response()->json([
            'imported' => $imported,
            'skipped' => $skipped,
        ]);
    }
}

