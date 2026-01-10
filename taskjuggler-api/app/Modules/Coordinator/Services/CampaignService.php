<?php

namespace App\Modules\Coordinator\Services;

use App\Modules\Coordinator\Models\Campaign;
use App\Modules\Coordinator\Models\Contact;
use App\Modules\Coordinator\Models\CallLog;
use App\Modules\Coordinator\Models\Appointment;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CampaignService
{
    /**
     * Execute a campaign - process contacts and make calls
     */
    public function execute(Campaign $campaign): void
    {
        if ($campaign->status !== 'running') {
            throw new \Exception("Campaign {$campaign->id} is not in running status");
        }

        // Get target contacts
        $contacts = $this->getTargetContacts($campaign);

        // Process each contact
        foreach ($contacts as $contact) {
            if ($campaign->status !== 'running') {
                break; // Campaign was paused or cancelled
            }

            $this->processContact($campaign, $contact);
            
            // Update processed count
            $campaign->increment('contacts_processed');
        }

        // Update campaign statistics
        $this->updateStatistics($campaign);

        // Check if campaign should be completed
        if ($this->shouldComplete($campaign)) {
            $campaign->complete();
        }
    }

    /**
     * Get target contacts for campaign
     */
    protected function getTargetContacts(Campaign $campaign): \Illuminate\Database\Eloquent\Collection
    {
        $query = Contact::where('organization_id', $campaign->organization_id);

        // Apply filters
        if ($campaign->filters) {
            if (isset($campaign->filters['status'])) {
                $query->where('status', $campaign->filters['status']);
            }
            if (isset($campaign->filters['tags'])) {
                $tags = is_array($campaign->filters['tags']) 
                    ? $campaign->filters['tags'] 
                    : [$campaign->filters['tags']];
                $query->whereJsonContains('tags', $tags);
            }
            if (isset($campaign->filters['source'])) {
                $query->where('source', $campaign->filters['source']);
            }
        }

        // Use specific target contacts if provided
        if ($campaign->target_contacts && count($campaign->target_contacts) > 0) {
            $query->whereIn('id', $campaign->target_contacts);
        }

        // Limit by target count
        $limit = $campaign->target_count ?? 100;
        
        // Exclude already processed contacts
        $processedIds = CallLog::where('organization_id', $campaign->organization_id)
            ->where('metadata->campaign_id', $campaign->id)
            ->pluck('contact_id')
            ->filter();

        if ($processedIds->isNotEmpty()) {
            $query->whereNotIn('id', $processedIds);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Process a single contact for the campaign
     */
    protected function processContact(Campaign $campaign, Contact $contact): void
    {
        try {
            // Make call (would integrate with Twilio or similar)
            // For now, simulate call outcome
            $outcome = $this->simulateCall($campaign, $contact);

            // Create call log entry
            CallLog::create([
                'organization_id' => $campaign->organization_id,
                'coordinator_id' => $campaign->coordinator_id,
                'contact_id' => $contact->id,
                'direction' => 'outbound',
                'from_number' => $campaign->organization->phone ?? 'Unknown',
                'to_number' => $contact->phone ?? '',
                'status' => 'completed',
                'duration_seconds' => rand(30, 300),
                'outcome' => $outcome,
                'provider' => 'campaign',
                'cost' => 0.01, // Estimated cost per call
                'started_at' => now(),
                'ended_at' => now(),
                'metadata' => [
                    'campaign_id' => $campaign->id,
                    'campaign_type' => $campaign->type,
                ],
            ]);

            // Update campaign counters
            $campaign->increment('contacts_contacted');

            if ($outcome === 'Appointment Booked' || $outcome === 'Appointment Scheduled') {
                $campaign->increment('contacts_answered');
                $campaign->increment('appointments_booked');
            } elseif (in_array($outcome, ['Answered', 'Message Left', 'Voicemail'])) {
                $campaign->increment('contacts_answered');
            }

        } catch (\Exception $e) {
            Log::error("Failed to process contact {$contact->id} for campaign {$campaign->id}: " . $e->getMessage());
        }
    }

    /**
     * Simulate call outcome (would be replaced with actual Twilio integration)
     */
    protected function simulateCall(Campaign $campaign, Contact $contact): string
    {
        // Simulate different outcomes based on campaign type
        $outcomes = [
            'appointment_confirmation' => ['Appointment Confirmed', 'Appointment Rescheduled', 'No Answer', 'Voicemail'],
            'appointment_booking' => ['Appointment Booked', 'Not Interested', 'Call Back Later', 'No Answer'],
            'survey' => ['Survey Completed', 'Refused', 'No Answer', 'Voicemail'],
            'sales' => ['Appointment Booked', 'Not Interested', 'Call Back Later', 'No Answer'],
        ];

        $typeOutcomes = $outcomes[$campaign->type] ?? ['Completed', 'No Answer', 'Voicemail'];
        return $typeOutcomes[array_rand($typeOutcomes)];
    }

    /**
     * Update campaign statistics
     */
    protected function updateStatistics(Campaign $campaign): void
    {
        $stats = [
            'answer_rate' => 0,
            'booking_rate' => 0,
            'confirmation_rate' => 0,
        ];

        if ($campaign->contacts_contacted > 0) {
            $stats['answer_rate'] = round(($campaign->contacts_answered / $campaign->contacts_contacted) * 100, 2);
        }

        if ($campaign->contacts_answered > 0) {
            $stats['booking_rate'] = round(($campaign->appointments_booked / $campaign->contacts_answered) * 100, 2);
        }

        if ($campaign->appointments_booked > 0) {
            $stats['confirmation_rate'] = round(($campaign->appointments_confirmed / $campaign->appointments_booked) * 100, 2);
        }

        $campaign->update($stats);
    }

    /**
     * Check if campaign should be completed
     */
    protected function shouldComplete(Campaign $campaign): bool
    {
        // Complete if target count reached
        if ($campaign->target_count && $campaign->contacts_processed >= $campaign->target_count) {
            return true;
        }

        // Complete if scheduled end time reached
        if ($campaign->scheduled_end_at && now()->gte($campaign->scheduled_end_at)) {
            return true;
        }

        // Complete if all target contacts processed
        if ($campaign->target_contacts && count($campaign->target_contacts) > 0) {
            $remaining = array_diff($campaign->target_contacts, 
                CallLog::where('organization_id', $campaign->organization_id)
                    ->where('metadata->campaign_id', $campaign->id)
                    ->pluck('contact_id')
                    ->toArray()
            );
            if (empty($remaining)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Schedule campaign execution
     */
    public function schedule(Campaign $campaign): void
    {
        if ($campaign->scheduled_start_at && $campaign->scheduled_start_at->isFuture()) {
            $campaign->update(['status' => 'scheduled']);
            // Would dispatch a job to start the campaign at scheduled time
            // dispatch(new StartCampaignJob($campaign))->delay($campaign->scheduled_start_at);
        } else {
            $campaign->start();
        }
    }
}

