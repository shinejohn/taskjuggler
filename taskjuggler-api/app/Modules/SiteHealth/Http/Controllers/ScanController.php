<?php

namespace App\Modules\SiteHealth\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SiteHealth\Models\Site;
use App\Modules\SiteHealth\Models\Scan;
use App\Modules\SiteHealth\Http\Requests\StoreScanRequest;
use App\Modules\SiteHealth\Http\Resources\ScanResource;
use App\Modules\SiteHealth\Jobs\ProcessScan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class ScanController extends Controller
{
    public function index(Site $site): AnonymousResourceCollection
    {
        $this->authorize('view', $site);

        $scans = $site->scans()
            ->orderBy('started_at', 'desc')
            ->get();

        return ScanResource::collection($scans);
    }

    public function store(StoreScanRequest $request, Site $site): ScanResource
    {
        $this->authorize('view', $site);

        $scan = Scan::create([
            'site_id' => $site->id,
            'status' => 'pending',
            'started_at' => now(),
        ]);

        ProcessScan::dispatch($scan->id);

        return new ScanResource($scan);
    }

    public function show(Scan $scan): ScanResource
    {
        $this->authorize('view', $scan->site);

        return new ScanResource($scan->load(['site', 'issues']));
    }

    public function report(Scan $scan): JsonResponse
    {
        $this->authorize('view', $scan->site);

        // TODO: Implement PDF report generation
        // Use a PDF library (e.g., dompdf, tcpdf) to generate the scan report
        $reportPath = "reports/scan-{$scan->id}.pdf";
        
        if (!Storage::exists($reportPath)) {
            // Generate PDF report with scan details, findings, and recommendations
            // $pdfContent = $this->generatePdfReport($scan);
            // Storage::put($reportPath, $pdfContent);
        }

        return response()->json([
            'url' => Storage::url($reportPath),
        ]);
    }
}
