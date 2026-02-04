<?php

namespace App\Modules\OfficialNotice\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\OfficialNotice\Models\DocumentArea;
use App\Modules\OfficialNotice\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OfficialNoticeController extends Controller
{
    /**
     * List all Document Areas for the current user
     */
    public function listAreas(Request $request)
    {
        // For now, return all areas where user is owner or member
        // Assuming we rely on a shared Auth system, referencing `auth()->id()`
        $userId = auth()->id(); // Or however the platform identifies users

        $areas = DocumentArea::where('owner_id', $userId)
            ->withCount('documents')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $areas
        ]);
    }

    /**
     * Create a new Document Area
     */
    public function createArea(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $area = DocumentArea::create([
            'owner_id' => auth()->id() ?? Str::uuid(), // Fallback for dev if no auth
            'name' => $validated['name'],
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'data' => $area
        ], 201);
    }

    /**
     * Get details of a specific area and its documents
     */
    public function getArea($id)
    {
        $area = DocumentArea::with(['documents', 'members'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $area
        ]);
    }

    /**
     * Upload a document to an area
     */
    public function uploadDocument(Request $request, $areaId)
    {
        $request->validate([
            'file' => 'required|file',
            'title' => 'required|string'
        ]);

        $file = $request->file('file');
        // In real app, store to S3
        $path = $file->store('official-notice/docs');

        $doc = Document::create([
            'area_id' => $areaId,
            'uploader_id' => auth()->id() ?? Str::uuid(),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
        ]);

        // Trigger AI Analysis Job
        \App\Modules\OfficialNotice\Jobs\AnalyzeContractJob::dispatch($doc);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded and queued for analysis',
            'data' => $doc
        ], 201);
    }

    /**
     * Get document details including analysis and dates
     */
    public function getDocument($id)
    {
        $document = Document::with(['sections', 'criticalDates', 'area'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $document
        ]);
    }

    /**
     * Serve the document file for viewing
     */
    public function viewDocumentFile($id)
    {
        $document = Document::findOrFail($id);
        
        if (!\Storage::exists($document->file_path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->file(storage_path('app/' . $document->file_path));
    }
}
