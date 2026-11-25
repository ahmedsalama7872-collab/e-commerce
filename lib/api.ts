const API_BASE_URL = "https://ecommerce.routemisr.com/api";

export type ApiEnvelope<T> = {
  data?: T;
  results?: number;
  metadata?: { currentPage?: number; numberOfPages?: number; limit?: number };
  message?: string;
  statusMsg?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAuthToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem("freshcart-token");
}

export async function apiRequestWithMeta<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T> | T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getAuthToken();
  if (token && !headers.has("token")) headers.set("token", token);

  const versionedPath = path.startsWith("/v2/") ? path : `/v1${path}`;
  const response = await fetch(`${API_BASE_URL}${versionedPath}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });
  const body = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok) {
    throw new ApiError(body?.message || `Request failed (${response.status})`, response.status);
  }
  return body as ApiEnvelope<T> | T;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const body = await apiRequestWithMeta<T>(path, options);
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}

export function withQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const value = query.toString();
  return value ? `?${value}` : "";
}
