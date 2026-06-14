// PHI display masking helpers for list/summary views.
// Full values should only be shown in detail views (e.g. the patient chart).

export function maskPhone(phone?: string | null): string {
    if (!phone) return 'N/A';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return '***';
    return `(***) ***-${digits.slice(-4)}`;
}

export function maskEmail(email?: string | null): string {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***';
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
}
