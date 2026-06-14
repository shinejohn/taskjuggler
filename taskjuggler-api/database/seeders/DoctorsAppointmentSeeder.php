<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Modules\Doctors\Models\Appointment;
use App\Modules\Doctors\Models\Patient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DoctorsAppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Disable Foreign Key Checks for SQLite (since organizations table is missing/mismatched)
        DB::statement('PRAGMA foreign_keys=OFF;');

        // Find or create a patient
        $patient = Patient::first();
        if (!$patient) {
            // Need a user first
            $user = User::first() ?? User::factory()->create();
            $patient = Patient::create([
                'id' => Str::uuid(),
                'organization_id' => Str::uuid(), // Fake Org ID
                'user_id' => $user->id,
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'dob' => '1985-06-15',
                'phone' => '555-0123',
                'email' => 'sarah@example.com'
            ]);
        }

        // Find a provider
        $provider = User::where('email', 'like', '%doctor%')->first() ?? User::first();

        // Create Upcoming Appointment
        Appointment::create([
            'id' => Str::uuid(),
            'organization_id' => Str::uuid(), // Fake Org ID
            'patient_id' => $patient->id,
            'provider_id' => $provider->id,
            'start_time' => Carbon::now()->addDays(2)->setHour(10)->setMinute(0),
            'end_time' => Carbon::now()->addDays(2)->setHour(10)->setMinute(30),
            'status' => 'confirmed',
            'notes' => 'Follow-up on bloodwork results.',
        ]);

        // Create Past Appointment
        Appointment::create([
            'id' => Str::uuid(),
            'organization_id' => Str::uuid(), // Fake Org ID
            'patient_id' => $patient->id,
            'provider_id' => $provider->id,
            'start_time' => Carbon::now()->subMonths(1)->setHour(14)->setMinute(0),
            'end_time' => Carbon::now()->subMonths(1)->setHour(14)->setMinute(30),
            'status' => 'completed',
            'notes' => 'Initial consultation to discuss fatigue.',
        ]);

        // Create Lab Results (Visit Items) if missing
        if (DB::table('patient_visit_items')->where('item_type', 'test')->count() == 0) {
            DB::table('patient_visit_items')->insert([
                [
                    'id' => Str::uuid(),
                    'patient_id' => $patient->id,
                    'visit_id' => Str::uuid(), // Placeholder
                    'item_type' => 'test',
                    'title' => 'Comprehensive Metabolic Panel (CMP)',
                    'description' => 'Glucose: 98, BUN: 14, Creatinine: 0.9',
                    'why_explanation' => 'We ordered this to check your kidney and liver function as a baseline.',
                    'status' => 'ready',
                    'created_at' => Carbon::now()->subDays(5),
                    'updated_at' => Carbon::now()->subDays(2),
                ],
                [
                    'id' => Str::uuid(),
                    'patient_id' => $patient->id,
                    'visit_id' => Str::uuid(),
                    'item_type' => 'test',
                    'title' => 'Lipid Panel',
                    'description' => 'Pending lab processing.',
                    'why_explanation' => 'Monitoring cholesterol levels due to family history.',
                    'status' => 'processing',
                    'created_at' => Carbon::now()->subDays(1),
                    'updated_at' => Carbon::now()->subDays(1),
                ]
            ]);
        }

        // Create Messages if missing
        if (DB::table('direct_messages')->count() == 0) {
            DB::table('direct_messages')->insert([
                'id' => Str::uuid(),
                'sender_id' => $provider->id,
                'recipient_id' => $patient->user_id, // Messages go to User ID, not Patient ID
                'content' => 'Please bring your previous records to the next visit.',
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ]);
        }
        
        DB::statement('PRAGMA foreign_keys=ON;');
    }
}
