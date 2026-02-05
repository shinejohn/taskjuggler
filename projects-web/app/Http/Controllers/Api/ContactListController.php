<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactList;
use App\Models\ContactListMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactListController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $contactLists = ContactList::where('organization_id', $request->user()->organization_id)
            ->where('user_id', $request->user()->id)
            ->with('members')
            ->get();

        return response()->json($contactLists);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contactList = ContactList::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'organization_id' => $request->user()->organization_id,
        ]);

        return response()->json($contactList, 201);
    }

    public function show(ContactList $contactList): JsonResponse
    {
        // Check organization access
        if ($contactList->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $contactList->load('members');

        return response()->json($contactList);
    }

    public function update(Request $request, ContactList $contactList): JsonResponse
    {
        // Check organization access
        if ($contactList->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contactList->update($validated);

        return response()->json($contactList);
    }

    public function destroy(ContactList $contactList): JsonResponse
    {
        // Check organization access
        if ($contactList->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $contactList->delete();

        return response()->json(null, 204);
    }

    public function addMember(Request $request, ContactList $contactList): JsonResponse
    {
        // Check organization access
        if ($contactList->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'metadata' => 'nullable|array',
        ]);

        $member = $contactList->members()->create($validated);

        return response()->json($member, 201);
    }

    public function removeMember(ContactList $contactList, ContactListMember $member): JsonResponse
    {
        // Check organization access
        if ($contactList->organization_id !== request()->user()->organization_id) {
            abort(403, 'Unauthorized');
        }

        // Verify member belongs to list
        if ($member->list_id !== $contactList->id) {
            abort(404, 'Member not found');
        }

        $member->delete();

        return response()->json(null, 204);
    }
}
