<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactList;
use App\Models\ContactListMember;
use Illuminate\Http\Request;

class ContactListController extends Controller
{
    public function index(Request $request)
    {
        $contactLists = $request->user()
            ->contactLists()
            ->with('members')
            ->get();

        return response()->json($contactLists);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contactList = ContactList::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($contactList, 201);
    }

    public function show(ContactList $contactList)
    {
        $this->authorize('view', $contactList);
        
        $contactList->load('members');

        return response()->json($contactList);
    }

    public function update(Request $request, ContactList $contactList)
    {
        $this->authorize('update', $contactList);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contactList->update($validated);

        return response()->json($contactList);
    }

    public function destroy(ContactList $contactList)
    {
        $this->authorize('delete', $contactList);
        
        $contactList->delete();

        return response()->json(null, 204);
    }

    public function addMember(Request $request, ContactList $contactList)
    {
        $this->authorize('update', $contactList);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'metadata' => 'nullable|array',
        ]);

        $member = ContactListMember::create([
            ...$validated,
            'list_id' => $contactList->id,
        ]);

        return response()->json($member, 201);
    }

    public function removeMember(ContactList $contactList, ContactListMember $member)
    {
        $this->authorize('update', $contactList);

        if ($member->list_id !== $contactList->id) {
            return response()->json(['error' => 'Member does not belong to this list'], 400);
        }

        $member->delete();

        return response()->json(null, 204);
    }
}
