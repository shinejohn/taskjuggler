<?php

namespace App\Modules\SiteHealth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SiteHealth\Models\Site;
use App\Modules\SiteHealth\Http\Requests\StoreSiteRequest;
use App\Modules\SiteHealth\Http\Requests\UpdateSiteRequest;
use App\Modules\SiteHealth\Http\Resources\SiteResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SiteController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $sites = Site::where('user_id', auth()->id())
            ->with(['latestScan'])
            ->get();

        return SiteResource::collection($sites);
    }

    public function store(StoreSiteRequest $request): SiteResource
    {
        $site = Site::create([
            'user_id' => auth()->id(),
            ...$request->validated(),
        ]);

        return new SiteResource($site->load('latestScan'));
    }

    public function show(Site $site): SiteResource
    {
        $this->authorize('view', $site);

        return new SiteResource($site->load(['scans', 'issues']));
    }

    public function update(UpdateSiteRequest $request, Site $site): SiteResource
    {
        $this->authorize('update', $site);

        $site->update($request->validated());

        return new SiteResource($site->fresh());
    }

    public function destroy(Site $site): JsonResponse
    {
        $this->authorize('delete', $site);

        $site->delete();

        return response()->json(['message' => 'Site deleted successfully']);
    }
}
