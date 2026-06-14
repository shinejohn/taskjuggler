// Shared date/time display formatting.
// Use these instead of bare toLocaleDateString()/toLocaleTimeString()
// so dates render consistently across the app.

export function formatDate(date?: string | number | Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(date?: string | number | Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(date?: string | number | Date | null): string {
    const datePart = formatDate(date);
    if (!datePart) return '';
    return `${datePart}, ${formatTime(date)}`;
}
