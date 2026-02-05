export const UserRole = {
    PROVIDER: 'provider',
    ADMIN: 'admin',
    STAFF: 'staff',
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    RECEPTIONIST: 'receptionist',
    NURSE: 'nurse',
    MA: 'ma'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
    roles?: string[]; // List of role slugs/names
    permissions?: string[]; // List of permission codes
    specialty?: string;
    avatar_url?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}
