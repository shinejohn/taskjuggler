<?php

namespace App\Modules\OfficialNotice\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Modules\OfficialNotice\Models\Document;
use App\Modules\OfficialNotice\Models\DocumentSection;
use App\Modules\OfficialNotice\Models\CriticalDate;
use App\Modules\OfficialNotice\Services\ContractAnalysisService;
use App\Modules\OfficialNotice\Services\DateExtractionService;
use Illuminate\Support\Facades\Storage;

class AnalyzeContractJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $document;

    public function __construct(Document $document)
    {
        $this->document = $document;
    }

    public function handle(
        ContractAnalysisService $analysisService,
        DateExtractionService $dateService
    ) {
        $path = Storage::path($this->document->file_path);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $text = '';

        if ($extension === 'pdf') {
            $parser = new \Smalot\PdfParser\Parser();
            $pdf = $parser->parseFile($path);
            $text = $pdf->getText();
        } else {
            // Fallback for txt/md
            $text = Storage::get($this->document->file_path);
        }

        // 1. Analyze Structure & Risks
        $analysis = $analysisService->analyze($text);

        // Save Sections
        foreach ($analysis['sections'] ?? [] as $section) {
            DocumentSection::create([
                'document_id' => $this->document->id,
                'section_type' => $section['type'],
                'content' => $section['content'],
                'risk_score' => $section['risk_score'] ?? 0,
                'analysis' => $section['analysis'] ?? null,
            ]);
        }

        // 2. Extract Dates
        $dates = $dateService->extract($text);

        // Save Critical Dates
        foreach ($dates as $date) {
            if ($date['is_critical']) {
                CriticalDate::create([
                    'document_id' => $this->document->id,
                    'title' => $date['description'],
                    'due_date' => $date['iso_date'],
                    'notification_type' => 'email'
                ]);
            }
        }

        // 3. Mark as Analyzed
        $this->document->update(['is_analyzed' => true]);
    }
}
