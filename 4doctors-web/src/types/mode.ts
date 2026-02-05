/**
 * URPA Mode System Types
 * Defines the three operating modes and data classification for HIPAA compliance
 */

export type URPAMode = 'practice' | 'business' | 'personal' | 'all';

export interface DataClassification {
    mode: URPAMode;
    isHIPAA: boolean;
    requiresAudit: boolean;
    encryptionLevel: 'standard' | 'hipaa';
}

export interface ModeConfig {
    value: URPAMode;
    icon: string;
    label: string;
    description: string;
    color: string;
    gradient: string;
}

// Mode configurations
export const MODES: ModeConfig[] = [
    {
        value: 'practice',
        icon: '🔒',
        label: 'Practice Mode',
        description: 'Patient care, HIPAA compliance',
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)'
    },
    {
        value: 'business',
        icon: '💼',
        label: 'Business Mode',
        description: 'Staff, vendors, operations',
        color: '#0ea5e9',
        gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
    },
    {
        value: 'personal',
        icon: '🏠',
        label: 'Personal Mode',
        description: 'Personal life, travel, goals',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #059669)'
    }
];

// Module to mode mapping for data classification
export const MODULE_MODE_MAP: Record<string, DataClassification> = {
    // PRACTICE MODE (HIPAA)
    'patients': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'scribemd': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'prior_auth': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'eprescribing': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'clinical_schedule': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'lab_results': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'referrals': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'patient_messages': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'clinical_tasks': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },
    'medical_voicemail': { mode: 'practice', isHIPAA: true, requiresAudit: true, encryptionLevel: 'hipaa' },

    // BUSINESS MODE (Non-HIPAA)
    'staff_management': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'vendors': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'marketing': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'business_email': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'business_tasks': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'accounting': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'payroll': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'cme_education': { mode: 'business', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },

    // PERSONAL MODE (Non-HIPAA)
    'personal_email': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'personal_calendar': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'personal_tasks': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'travel': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'social': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'goals': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'personal_voicemail': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
    'files': { mode: 'personal', isHIPAA: false, requiresAudit: false, encryptionLevel: 'standard' },
};

// Shared modules available in all modes
export const SHARED_MODULES = ['calendar', 'email', 'tasks', 'voicemail', 'phone'];

// Task categories by mode
export const TASK_CATEGORIES = {
    practice: ['Chart Review', 'Lab Review', 'Refill Request', 'Prior Auth', 'Patient Call', 'Referral'],
    business: ['Payroll', 'Vendor', 'Staff', 'Marketing', 'Compliance', 'Financial'],
    personal: ['Family', 'Health', 'Travel', 'Home', 'Social', 'Learning']
};

// Helper function to get mode config
export function getModeConfig(mode: URPAMode): ModeConfig | undefined {
    return MODES.find(m => m.value === mode);
}

// Helper function to check if a module is HIPAA-controlled
export function isHIPAAModule(moduleName: string): boolean {
    return MODULE_MODE_MAP[moduleName]?.isHIPAA ?? false;
}
