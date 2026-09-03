/**
 * Safe API Client for Silicon Quiz Club
 *
 * All API requests go through this utility to ensure:
 * 1. HTTP status is checked
 * 2. Content-Type is validated
 * 3. JSON is parsed only when appropriate
 * 4. HTML / plain-text error responses never crash the UI
 * 5. A consistent application error is returned
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

const GENERIC_ERROR = 'Unable to connect to the Quiz Club service. Please try again.';

export async function safeApiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);

    // Check Content-Type header
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (isJson) {
      try {
        const data = await response.json();
        return {
          ok: response.ok,
          status: response.status,
          data: data as T,
          error: response.ok ? null : (data as any)?.message || (data as any)?.errors?.[0] || `Request failed (${response.status})`
        };
      } catch {
        return {
          ok: false,
          status: response.status,
          data: null,
          error: 'Server returned invalid JSON. Please try again.'
        };
      }
    }

    // Non-JSON response — try to parse as JSON anyway (some servers omit Content-Type)
    const rawText = await response.text();
    try {
      const parsed = JSON.parse(rawText);
      return {
        ok: response.ok,
        status: response.status,
        data: parsed as T,
        error: response.ok ? null : (parsed as any)?.message || `Request failed (${response.status})`
      };
    } catch {
      // Truly non-JSON (HTML error page, plain text, etc.)
      console.warn(`[API] Non-JSON response from ${url}:`, response.status, rawText.slice(0, 200));
      return {
        ok: false,
        status: response.status,
        data: null,
        error: GENERIC_ERROR
      };
    }
  } catch (networkErr: any) {
    // Network failure, CORS blocked, DNS resolution failed, etc.
    console.error(`[API] Network error for ${url}:`, networkErr);
    return {
      ok: false,
      status: 0,
      data: null,
      error: GENERIC_ERROR
    };
  }
}
