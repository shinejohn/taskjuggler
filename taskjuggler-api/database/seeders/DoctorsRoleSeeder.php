<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DoctorsRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Define Platform permissions
        $permissions = [
            'view_patients',
            'create_patients',
            'edit_patients',
            'delete_patients',
            'view_schedule',
            'manage_schedule',
            'view_clinical_records',
            'edit_clinical_records',
            'view_billing',
            'manage_billing',
            'manage_users',
            'manage_organization',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // 1. Admin (Practice Administrator)
        $admin = Role::firstOrCreate(['name' => 'practice_admin', 'guard_name' => 'sanctum']);
        $admin->syncPermissions(Permission::all());

        // 2. Doctor (Provider)
        $doctor = Role::firstOrCreate(['name' => 'doctor', 'guard_name' => 'sanctum']);
        $doctor->givePermissionTo([
            'view_patients',
            'create_patients',
            'edit_patients',
            'view_schedule',
            'manage_schedule',
            'view_clinical_records',
            'edit_clinical_records',
            'view_billing'
        ]);

        // 3. Nurse (Clinical Staff)
        $nurse = Role::firstOrCreate(['name' => 'nurse', 'guard_name' => 'sanctum']);
        $nurse->givePermissionTo([
            'view_patients',
            'create_patients',
            'edit_patients',
            'view_schedule',
            'view_clinical_records',
            'edit_clinical_records'
        ]);

        // 4. Receptionist (Front Desk)
        $receptionist = Role::firstOrCreate(['name' => 'receptionist', 'guard_name' => 'sanctum']);
        $receptionist->givePermissionTo([
            'view_patients',
            'create_patients',
            'edit_patients',
            'view_schedule',
            'manage_schedule',
            'view_billing' // For copay collection
        ]);

        // 5. Biller (RCM Staff)
        $biller = Role::firstOrCreate(['name' => 'biller', 'guard_name' => 'sanctum']);
        $biller->givePermissionTo([
            'view_patients',
            'view_schedule',
            'view_clinical_records', // Needed for coding
            'view_billing',
            'manage_billing'
        ]);

        // 6. Patient (Portal User)
        $patient = Role::firstOrCreate(['name' => 'patient', 'guard_name' => 'sanctum']);
        // Patients have limited scope, usually managed by custom logic, but can have basic permissions
        $patient->givePermissionTo([
            'view_schedule', // View own appointments
            'view_billing'   // View own bills
        ]);
    }
}
