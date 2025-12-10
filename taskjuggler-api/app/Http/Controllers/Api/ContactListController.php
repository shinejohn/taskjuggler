<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactList;
use App\Models\ContactListMember;
use App\Services\Contacts\ContactImportService;
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

    /**
     * Import contacts from file (vCard or CSV)
     */
    public function importContacts(Request $request, ContactImportService $importService)
    {
        $request->validate([
            'list_id' => 'required|uuid|exists:contact_lists,id',
            'file' => 'required|file|mimes:vcf,csv,txt|max:10240', // 10MB max
        ]);

        $contactList = ContactList::findOrFail($request->list_id);
        
        // Check authorization
        if ($contactList->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        $filename = $file->getClientOriginalName();

        try {
            $contacts = $importService->parseFile($content, $filename);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to parse file: ' . $e->getMessage()
            ], 400);
        }

        if (empty($contacts)) {
            return response()->json([
                'error' => 'No contacts found in file'
            ], 400);
        }

        $imported = 0;
        $skipped = 0;
        $errors = [];

        foreach ($contacts as $contactData) {
            try {
                // Skip if no name
                if (empty($contactData['name'])) {
                    $skipped++;
                    continue;
                }

                // Check if member already exists (by email or phone)
                $existing = ContactListMember::where('list_id', $contactList->id)
                    ->where(function ($query) use ($contactData) {
                        if (!empty($contactData['email'])) {
                            $query->where('email', $contactData['email']);
                        }
                        if (!empty($contactData['phone'])) {
                            $query->orWhere('phone', $contactData['phone']);
                        }
                    })
                    ->first();

                if ($existing) {
                    $skipped++;
                    continue;
                }

                ContactListMember::create([
                    'list_id' => $contactList->id,
                    'name' => $contactData['name'],
                    'email' => $contactData['email'] ?? null,
                    'phone' => $contactData['phone'] ?? null,
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Failed to import {$contactData['name']}: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => "Import completed",
            'imported' => $imported,
            'skipped' => $skipped,
            'total' => count($contacts),
            'errors' => $errors,
        ]);
    }
}
