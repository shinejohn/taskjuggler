<?php

namespace App\Modules\SiteHealth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SiteHealth\Models\Issue;
use App\Modules\SiteHealth\Http\Resources\IssueResource;
use App\Modules\SiteHealth\Services\FixGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IssueController extends Controller
{
    public function __construct(
        private FixGeneratorService $fixGenerator
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Issue::query()
            ->whereHas('site', function ($q) {
                $q->where('user_id', auth()->id());
            })
            ->with(['site', 'scan']);

        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        }

        if ($request->has('scan_id')) {
            $query->where('scan_id', $request->scan_id);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $issues = $query->get();

        return IssueResource::collection($issues);
    }

    public function show(Issue $issue): IssueResource
    {
        $this->authorize('view', $issue->site);

        return new IssueResource($issue->load(['site', 'scan']));
    }

    public function update(Request $request, Issue $issue): IssueResource
    {
        $this->authorize('update', $issue->site);

        $issue->update($request->only(['status']));

        return new IssueResource($issue);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'issue_ids' => 'required|array',
            'status' => 'required|string|in:open,ignored,fixed,resolved',
        ]);

        Issue::whereIn('id', $request->issue_ids)
            ->whereHas('site', function ($q) {
                $q->where('user_id', auth()->id());
            })
            ->update(['status' => $request->status]);

        return response()->json(['message' => 'Issues updated successfully']);
    }

    public function generateFix(Issue $issue): JsonResponse
    {
        $this->authorize('view', $issue->site);

        $fix = $this->fixGenerator->generate($issue);

        $issue->update([
            'fix_code' => $fix['fix_code'],
            'fix_explanation' => $fix['explanation'],
            'fix_confidence' => $fix['confidence'],
        ]);

        return response()->json($fix);
    }
}
