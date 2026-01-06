/**
 * Status-related utility functions
 */

/**
 * Get Tailwind CSS classes for appointment status badges
 * @param status - Appointment status
 * @returns Tailwind CSS class string
 */
export function getAppointmentStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    confirmed: 'bg-green-50 text-green-700',
    scheduled: 'bg-blue-50 text-blue-700',
    pending: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-red-50 text-red-700',
    completed: 'bg-slate-100 text-slate-600',
  };
  return statusMap[status] || 'bg-slate-100 text-slate-600';
}

/**
 * Get Tailwind CSS classes for campaign status badges
 * @param status - Campaign status
 * @returns Tailwind CSS class string
 */
export function getCampaignStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    running: 'bg-green-50 text-green-700 border border-green-200',
    completed: 'bg-blue-50 text-blue-700 border border-blue-200',
    scheduled: 'bg-amber-50 text-amber-700 border border-amber-200',
    draft: 'bg-slate-100 text-slate-600 border border-slate-200',
    paused: 'bg-slate-100 text-slate-600 border border-slate-200',
  };
  return statusMap[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
}

/**
 * Get Tailwind CSS classes for call outcome badges
 * @param outcome - Call outcome string
 * @returns Tailwind CSS class string
 */
export function getCallOutcomeClass(outcome?: string): string {
  if (!outcome) return 'bg-slate-100 text-slate-600';
  const lower = outcome.toLowerCase();
  if (lower.includes('booked') || lower.includes('confirmed')) {
    return 'bg-green-50 text-green-700';
  }
  if (lower.includes('info')) {
    return 'bg-blue-50 text-blue-700';
  }
  if (lower.includes('transferred')) {
    return 'bg-amber-50 text-amber-700';
  }
  if (lower.includes('spam') || lower.includes('dropped')) {
    return 'bg-red-50 text-red-700';
  }
  return 'bg-slate-100 text-slate-600';
}

