<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Core\Models\User;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaModeSettings;
use Carbon\Carbon;

class UrpaSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get or Create Main Doctor User
        $user = User::firstOrCreate(
            ['email' => 'dr.shine@4healthcare.com'],
            [
                'name' => 'John Shine', // [FIX] Combined name
                'password' => bcrypt('password'), // Dev password
                // 'specialty' => 'Cardiology', // [NOTE] Not in fillable, removing to avoid error if column doesn't exist
                // 'is_active' => true, // [NOTE] Not in fillable
            ]
        );

        // 2. Ensure Mode Settings exist
        UrpaModeSettings::firstOrCreate(
            ['user_id' => $user->id],
            [
                'current_mode' => 'practice',
                'default_mode' => 'practice',
                'unified_view_enabled' => true
            ]
        );

        // 3. Clear existing URPA activities for clean slate (optional, but good for dev)
        // UrpaActivity::where('user_id', $user->id)->delete(); 

        $this->seedPracticeData($user);
        $this->seedBusinessData($user);
        $this->seedPersonalData($user);
    }

    private function seedPracticeData($user)
    {
        // --- CALENDAR EVENTS ---
        $this->createActivity($user, 'event', 'practice', 'New Patient Consult', 'Sarah Johnson • Cardiology Referral', [
            'type' => 'patient',
            'duration' => '30m',
            'location' => 'Exam Room 1'
        ], Carbon::today()->setHour(9));

        $this->createActivity($user, 'event', 'practice', 'Follow-up', 'Mike Ross • Review Labs', [
            'type' => 'patient',
            'duration' => '30m',
            'location' => 'Exam Room 2'
        ], Carbon::today()->setHour(9)->addMinutes(30));

        $this->createActivity($user, 'event', 'practice', 'Annual Physical', 'James Wilson', [
            'type' => 'patient',
            'duration' => '30m',
            'location' => 'Exam Room 1'
        ], Carbon::today()->setHour(14));

        // --- TASKS ---
        $this->createActivity($user, 'task', 'practice', 'Sign 3 patient charts', 'Pending from yesterday', [
            'priority' => 'high',
            'due' => 'Today'
        ]);

        $this->createActivity($user, 'task', 'practice', 'Review lab results', 'Critical values for J. Smith', [
            'priority' => 'high',
            'due' => 'Today'
        ]);

        // --- EMAILS ---
        $this->createActivity($user, 'email', 'practice', 'Lab results for Johnson ready', 'Quest Diagnostics: Results are attached.', [
            'from' => 'Quest Diagnostics',
            'is_read' => false
        ], Carbon::now()->subMinutes(30));

        // --- VOICEMAILS ---
        $this->createActivity($user, 'voicemail', 'practice', 'Mrs. Garcia', 'Hi Doctor, I wanted to ask about my medication side effects...', [
            'caller_name' => 'Mrs. Garcia',
            'duration' => '0:45',
            'line' => 'Main Clinic',
            'is_read' => false
        ], Carbon::now()->subHour());
    }

    private function seedBusinessData($user)
    {
        // --- EVENTS ---
        $this->createActivity($user, 'event', 'business', 'Staff Meeting', 'Monthly Operations Review', [
            'type' => 'meeting',
            'duration' => '1h',
            'location' => 'Conference Room'
        ], Carbon::today()->setHour(11));

        // --- TASKS ---
        $this->createActivity($user, 'task', 'business', 'Process payroll', 'Approve timesheets for Feb 1-15', [
            'priority' => 'medium',
            'due' => 'Friday'
        ]);

        // --- EMAILS ---
        $this->createActivity($user, 'email', 'business', 'Equipment quote from Medline', 'Please review the attached invoice #4923.', [
            'from' => 'Medline Sales',
            'is_read' => false
        ], Carbon::now()->subHours(2));
        
        $this->createActivity($user, 'email', 'business', 'PTO request from front desk', 'Sarah is requesting next Friday off.', [
            'from' => 'Staff HR',
            'is_read' => true
        ], Carbon::now()->subDay());

         // --- VOICEMAILS ---
         $this->createActivity($user, 'voicemail', 'business', 'Medical Supply Co', 'Following up on your equipment order status...', [
            'caller_name' => 'Medical Supply Co',
            'duration' => '1:12',
            'line' => 'Admin Office',
            'is_read' => true
        ], Carbon::now()->subHours(3));
    }

    private function seedPersonalData($user)
    {
        // --- EVENTS ---
        $this->createActivity($user, 'event', 'personal', 'Lunch with spouse', 'Downtown Bistro', [
            'type' => 'social',
            'duration' => '1h',
            'location' => 'Downtown Bistro'
        ], Carbon::today()->setHour(12)->addMinutes(30));

        // --- TASKS ---
        $this->createActivity($user, 'task', 'personal', 'Book hotel for conference', 'SFO Medical Conf', [
            'priority' => 'low',
            'due' => 'Next Week'
        ]);

         $this->createActivity($user, 'task', 'personal', 'Call mom', 'Her birthday is coming up', [
            'priority' => 'low',
            'status' => 'completed'
        ]);

        // --- EMAILS ---
        $this->createActivity($user, 'email', 'personal', 'Flight confirmation', 'United Airlines: Your flight to SFO is confirmed.', [
            'from' => 'United Airlines',
            'is_read' => true
        ], Carbon::now()->subHours(5));
    }

    private function createActivity($user, $type, $mode, $title, $desc, $meta = [], $timestamp = null)
    {
        UrpaActivity::create([
            'user_id' => $user->id,
            'activity_type' => $type,
            'mode' => $mode,
            'is_hipaa' => $mode === 'practice',
            'title' => $title,
            'description' => $desc,
            'raw_content' => $meta,
            'activity_timestamp' => $timestamp ?? Carbon::now(),
            'status' => $meta['status'] ?? 'pending',
            'is_read' => $meta['is_read'] ?? false,
        ]);
    }
}
