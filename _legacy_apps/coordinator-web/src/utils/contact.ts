/**
 * Contact-related utility functions
 */

/**
 * Extract contact name from an object with contact relationship
 * @param item - Object with optional contact property
 * @returns Full name string or 'Unknown'
 */
export function getContactName(item: {
  contact?: {
    first_name?: string;
    last_name?: string;
  } | null;
}): string {
  if (!item.contact) return 'Unknown';
  const { first_name, last_name } = item.contact;
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();
  return fullName || 'Unknown';
}

/**
 * Get contact initial for avatar display
 * @param item - Object with optional contact property
 * @returns Single uppercase character
 */
export function getContactInitial(item: {
  contact?: {
    first_name?: string;
    last_name?: string;
  } | null;
}): string {
  const name = getContactName(item);
  return name.charAt(0).toUpperCase();
}

/**
 * Extract coordinator name from an object with coordinator relationship
 * @param item - Object with optional coordinator property
 * @returns Display name string or default
 */
export function getCoordinatorName(item: {
  coordinator?: {
    display_name?: string;
  } | null;
}, defaultName = '4 Call'): string {
  if (!item.coordinator) return defaultName;
  return item.coordinator.display_name || defaultName;
}

/**
 * Get coordinator initial for avatar display
 * @param item - Object with optional coordinator property
 * @returns Single uppercase character
 */
export function getCoordinatorInitial(item: {
  coordinator?: {
    display_name?: string;
  } | null;
}): string {
  const name = getCoordinatorName(item);
  return name.charAt(0).toUpperCase();
}

