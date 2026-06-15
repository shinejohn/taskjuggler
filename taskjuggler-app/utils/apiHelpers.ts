/**
 * Unwrap Laravel API responses that use the { success, data, message } envelope.
 */
export function unwrapApiData<T>(responseData: unknown): T {
  if (
    responseData !== null &&
    typeof responseData === 'object' &&
    'data' in responseData &&
    (responseData as { success?: boolean }).success !== false
  ) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

export interface AuthPayload {
  token: string;
  user: {
    enabled_modules?: string[];
    [key: string]: unknown;
  };
}
