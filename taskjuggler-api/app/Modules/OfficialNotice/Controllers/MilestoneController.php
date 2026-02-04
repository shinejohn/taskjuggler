<?php

namespace App\Modules\OfficialNotice\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\OfficialNotice\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MilestoneController extends Controller
{
    /**
     * List milestones
     */
    public function index(Request $request)
    {
        $query = Milestone::query();

        // Filter by document if provided
        if ($request->has('document_id')) {
            $query->where('document_id', $request->input('document_id'));
        }

        // Filter by creator (optional, though arguably user should only see what they have access to)
        // For now, let's assume if you can access the API, you can see these (RBAC handled elsewhere or broad access)
        // Usually we'd scope by user or team.
        $query->where('created_by', Auth::id());

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    /**
     * Create a milestone
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'document_id' => 'nullable|exists:on_documents,id',
            'rrule' => 'nullable|string',
        ]);

        $milestone = Milestone::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'is_all_day' => $request->input('is_all_day', false),
            'rrule' => $request->input('rrule'),
            'document_id' => $request->input('document_id'),
            'created_by' => Auth::id(),
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'data' => $milestone
        ], 201);
    }

    /**
     * Update a milestone
     */
    public function update(Request $request, $id)
    {
        $milestone = Milestone::where('id', $id)->where('created_by', Auth::id())->firstOrFail();

        $milestone->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $milestone
        ]);
    }

    /**
     * Delete a milestone
     */
    public function destroy($id)
    {
        $milestone = Milestone::where('id', $id)->where('created_by', Auth::id())->firstOrFail();
        $milestone->delete();

        return response()->json([
            'success' => true,
            'message' => 'Milestone deleted'
        ]);
    }
}
