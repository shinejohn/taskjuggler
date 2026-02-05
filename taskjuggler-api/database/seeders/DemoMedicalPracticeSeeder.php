<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Modules\Doctors\Models\Patient;
use App\Modules\Doctors\Models\Appointment;
use App\Modules\Doctors\Models\AppointmentType;
use App\Modules\Doctors\Models\Provider;
use App\Modules\Urpa\Models\UrpaActivity;
use App\Modules\Urpa\Models\UrpaModeSettings;
use Carbon\Carbon;
use Faker\Factory as Faker;

class DemoMedicalPracticeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // 1. Create Main Demo User (Provider)
        $user = User::firstOrCreate(
            ['email' => 'demo@4doctors.ai'],
            [
                'name' => 'Dr. Sarah Bennett',
                'password' => Hash::make('password'), // Simple demo password
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole('provider'); // Ensure roles exist, or manually set if roles table not used yet

        // 2. Provider Profile
        Provider::firstOrCreate(
            ['user_id' => $user->id],
            [
                'specialty' => 'Internal Medicine',
                'license_number' => 'MD12345678',
                'npi_number' => '9876543210',
                'bio' => 'Experienced Internist focusing on preventative care and automation.',
                'phone' => '555-0123'
            ]
        );

        // 3. URPA Settings
        UrpaModeSettings::updateOrCreate(
            ['user_id' => $user->id],
            [
                'current_mode' => 'practice',
                'default_mode' => 'practice',
                'unified_view_enabled' => true,
                'voice_id' => 'alloy', // OpenAI voice
                'personality' => 'professional'
            ]
        );

        // 4. Appointment Types
        $types = [
            ['name' => 'New Patient Consult', 'duration' => 60, 'color' => 'blue'],
            ['name' => 'Follow-up', 'duration' => 30, 'color' => 'green'],
            ['name' => 'Annual Physical', 'duration' => 45, 'color' => 'purple'],
            ['name' => 'Urgent Visit', 'duration' => 15, 'color' => 'red'],
        ];

        $apptTypes = [];
        foreach ($types as $type) {
            $apptTypes[] = AppointmentType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }

        // 5. Create Patients
        $patients = [];
        for ($i = 0; $i < 10; $i++) {
            $patients[] = Patient::create([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'dob' => $faker->dateTimeBetween('-80 years', '-18 years'),
                'gender' => $faker->randomElement(['male', 'female']),
                'address' => $faker->address,
                'insurance_provider' => $faker->randomElement(['Blue Cross', 'Aetna', 'UnitedHealth', 'Medicare']),
                'insurance_id' => strtoupper($faker->bothify('???#######')),
                'primary_provider_id' => $user->id
            ]);
        }

        // 6. Create Schedule (Appointments) + URPA Activities (Mirroring)
        // Today's schedule
        $startTime = Carbon::today()->setHour(9); // Start at 9 AM
        
        foreach (array_slice($patients, 0, 5) as $index => $patient) {
            $type = $faker->randomElement($apptTypes);
            $endTime = (clone $startTime)->addMinutes($type->duration);

            // Create Appointment
            // Note: Adjusting fields based on standard Appointment model if Doctors module differs
            // Assuming Doctors\Models\Appointment uses standard fields
            $appt = Appointment::create([
                'host_id' => $user->id,
                'patient_id' => $patient->id, // If column exists, else guest columns
                'appointment_type_id' => $type->id,
                'title' => $type->name . ' - ' . $patient->first_name . ' ' . $patient->last_name, // Fallback title
                'guest_name' => $patient->first_name . ' ' . $patient->last_name,
                'guest_email' => $patient->email,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => 'scheduled',
                'notes' => $faker->sentence
            ]);

            // Mirror to URPA Dashboard (Practice Mode Event)
            UrpaActivity::create([
                'user_id' => $user->id,
                'activity_type' => 'event',
                'mode' => 'practice',
                'is_hipaa' => true,
                'title' => $type->name,
                'description' => $patient->first_name . ' ' . $patient->last_name . ' • ' . $type->name,
                'activity_timestamp' => $startTime,
                'status' => 'pending',
                'raw_content' => [
                    'patient_id' => $patient->id,
                    'appointment_id' => $appt->id,
                    'location' => 'Exam Room ' . ($index % 2 + 1)
                ]
            ]);

            $startTime->addMinutes($type->duration + 15); // Gap
        }

        // 7. Seed URPA Inbox Items (Voicemails, Emails, Tasks)
        
        // Voicemail
        UrpaActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'voicemail',
            'mode' => 'practice',
            'is_hipaa' => true,
            'title' => 'Refill Request',
            'description' => 'Pharmacy calling about Mr. Jones prescription...',
            'activity_timestamp' => Carbon::now()->subMinutes(45),
            'status' => 'pending',
            'raw_content' => [
                'caller_name' => 'CVS Pharmacy',
                'duration' => '1:04',
                'line' => 'Clinical Line',
                'transcription' => "Hi this is CVS on Main St calling for Dr. Bennett regarding a refill for patient James Jones explicitly for his Lisinopril 10mg..."
            ]
        ]);

        // Email
        UrpaActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'email',
            'mode' => 'business',
            'is_hipaa' => false,
            'title' => 'Q1 Financial Report',
            'description' => 'Attached is the summary for Q1 revenue cycle.',
            'activity_timestamp' => Carbon::now()->subHours(2),
            'status' => 'pending',
            'raw_content' => [
                'from' => 'Accountant',
                'preview' => 'Revenue is up 15% due to improved claim processing...'
            ]
        ]);

        // Task
        UrpaActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'task',
            'mode' => 'personal',
            'is_hipaa' => false,
            'title' => 'Book Anniversary Dinner',
            'description' => 'Call The French Laundry for reservation',
            'activity_timestamp' => Carbon::now(),
            'status' => 'pending',
            'raw_content' => [
                'priority' => 'high',
                'due' => 'Tomorrow'
            ]
        ]);
        
    }
}
