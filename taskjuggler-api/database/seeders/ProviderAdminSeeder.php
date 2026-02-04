<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Modules\Coordinator\Models\Organization;
use App\Modules\Doctors\Models\Provider; // [FIX] Correct Model Name
use App\Modules\Doctors\Models\DocConnectProfile;
use Spatie\Permission\PermissionRegistrar;

class ProviderAdminSeeder extends Seeder
{
    public function run()
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        // 1. Reset Permissions & Roles
        // app()[PermissionRegistrar::class]->forgetCachedPermissions();
        // $this->setupRolesAndPermissions();

        // 2. Seed Medical Profiles
        $this->seedMedicalProfiles();

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
    }

    private function setupRolesAndPermissions()
    {
        // ... (Keep existing role/permission logic or simplified call if needed)
        // For brevity in this edit, assuming roles/permissions are handled or we can include the critical ones.
        // Actually, let's keep the existing logic at the top of the file to ensure the environment is valid.
        
        $roles = ['Provider Admin', 'Physician', 'Nurse/MA', 'Front Desk', 'Billing Staff'];
        foreach ($roles as $name) {
             Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
    }

    private function seedMedicalProfiles()
    {
        $profiles = [
            // 1. Family Medicine - Dr. Sarah Chen
            [
                'email' => 'schen@clearwaterfamilymed.com',
                'name' => 'Sarah Chen',
                'specialty' => 'Family Medicine',
                'org_name' => 'Clearwater Family Medicine',
                'profile_data' => [
                    'practice_info' => [
                        'practice_name' => "Clearwater Family Medicine",
                        'practice_type' => "family_medicine",
                        'specialties' => ["Family Medicine", "Preventive Care"],
                        'contact' => [
                            'main_phone' => "(727) 555-0101",
                            'email' => "info@clearwaterfamilymed.com",
                            'website' => "https://clearwaterfamilymed.com"
                        ],
                        'locations' => [
                            [
                                'location_id' => 'loc_001',
                                'name' => 'Main Office',
                                'address' => '1250 Cleveland Street, Suite 200',
                                'city' => 'Clearwater',
                                'state' => 'FL',
                                'zip' => '33755'
                            ]
                        ]
                    ],
                    'services' => [
                        'primary_services' => ["Annual Physicals", "Sick Visits", "Chronic Disease Management"],
                        'telehealth_available' => true
                    ],
                    'insurance_billing' => [
                        'accepts_insurance' => true,
                        'medicare_participating' => true,
                        'insurance_accepted' => [
                            ['carrier' => 'Aetna', 'plans' => ['PPO', 'HMO']],
                            ['carrier' => 'Blue Cross Blue Shield', 'plans' => ['PPO', 'HMO']]
                        ]
                    ],
                    'communication' => [
                        'ai_enabled' => true,
                        'ai_personality' => 'warm_professional',
                        'channels_enabled' => ["phone", "chat", "email", "sms"],
                        'fourcalls_config' => [
                            'account_id' => "4c_cfm_001",
                            'voice_enabled' => true
                        ]
                    ]
                ]
            ],
            // 2. Dentistry - Dr. Marcus Williams
            [
                'email' => 'mwilliams@clearwatersmiles.com',
                'name' => 'Marcus Williams',
                'specialty' => 'Dentistry',
                'org_name' => 'Clearwater Smiles Dentistry',
                'profile_data' => [
                    'practice_info' => [
                        'practice_name' => "Clearwater Smiles Dentistry",
                        'practice_type' => "dentistry",
                        'specialties' => ["General Dentistry", "Cosmetic Dentistry"],
                        'contact' => [
                            'main_phone' => "(727) 555-0202",
                            'email' => "smile@clearwatersmiles.com"
                        ]
                    ],
                    'services' => [
                        'primary_services' => ["Routine Cleanings", "Fillings", "Crowns", "Implants"],
                        'telehealth_available' => false
                    ],
                    'insurance_billing' => [
                        'accepts_insurance' => true,
                        'medicaid_participating' => true
                    ]
                ]
            ],
            // 3. Pediatrics - Dr. Jennifer Park
            [
                'email' => 'jpark@sunshinepeds.com',
                'name' => 'Jennifer Park',
                'specialty' => 'Pediatrics',
                'org_name' => 'Sunshine Pediatrics',
                'profile_data' => [
                    'practice_info' => [
                        'practice_name' => "Sunshine Pediatrics",
                        'practice_type' => "pediatrics",
                        'specialties' => ["Pediatrics", "Newborn Care"],
                        'contact' => [
                            'main_phone' => "(727) 555-0303",
                            'email' => "care@sunshinepeds.com"
                        ]
                    ],
                    'communication' => [
                        'ai_personality' => 'warm_nurturing'
                    ]
                ]
            ],
            // 4. Orthopedics - Dr. Michael Torres
            [
                'email' => 'mtorres@tbosm.com',
                'name' => 'Michael Torres',
                'specialty' => 'Orthopedics',
                'org_name' => 'Tampa Bay Orthopedic',
                'profile_data' => [
                    'practice_info' => [
                        'practice_name' => "Tampa Bay Orthopedic",
                        'practice_type' => "orthopedics",
                        'specialties' => ["Orthopedic Surgery", "Sports Medicine"],
                        'contact' => [
                            'main_phone' => "(727) 555-0404",
                            'email' => "info@tbosm.com"
                        ]
                    ],
                    'communication' => [
                        'ai_personality' => 'expert_reassuring'
                    ]
                ]
            ]
        ];

        foreach ($profiles as $p) {
            // 1. Create User FIRST (Organization needs owner)
            $user = User::firstOrCreate(
                ['email' => $p['email']],
                [
                    'name' => $p['name'],
                    'password' => bcrypt('password')
                ]
            );

            // 2. Create Organization
            // Use 'industry' instead of 'type', and provide user_id
            $org = Organization::firstOrCreate(
                ['name' => $p['org_name']],
                [
                    'slug' => \Illuminate\Support\Str::slug($p['org_name']),
                    'industry' => 'healthcare', // Fixed column name
                    'user_id' => $user->id // Required owner
                ]
            );

            // 3. Create Doctor Provider Linked to Org
            // Check if provider exists to avoid duplicates
            $provider = Provider::where('user_id', $user->id)->first();
            if (!$provider) {
                $provider = Provider::create([
                    'user_id' => $user->id,
                    'organization_id' => $org->id,
                    'specialty' => $p['specialty'],
                    'npi_number' => 'NPI_' . rand(100000, 999999), 
                    'bio' => "Dr. {$p['name']} is a specialist in {$p['specialty']}."
                ]);
            }

            // 4. Create Rich DocConnect Profile
            $profilePayload = $p['profile_data'];
            
            DocConnectProfile::updateOrCreate(
                ['provider_id' => $provider->id],
                [
                    'bio' => $provider->bio,
                    'is_accepting_referrals' => true,
                    'is_visible_in_directory' => true,
                    'practice_info' => $profilePayload['practice_info'] ?? null,
                    'services' => $profilePayload['services'] ?? null,
                    'insurance_billing' => $profilePayload['insurance_billing'] ?? null,
                    'communication' => $profilePayload['communication'] ?? null
                ]
            );
        }
    }
}
