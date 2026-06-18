/** Wire shape of every API response — shared so the frontend's client and the backend's
 * `sendSuccess`/`sendError` envelope can never drift out of sync. */

export interface ApiResponseError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponseMeta {
  timestamp: string;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error: ApiResponseError | null;
  meta: ApiResponseMeta;
}
