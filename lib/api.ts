/**
 * API client for Game3 Al-Haq / Dar Monasbat platform.
 * Modeled after Re-Sapori client architecture.
 */

export interface UserResponse {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface LoginRequest {
  identifier: string; // phone or email
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "http://localhost:8080";
}

export const ACCESS_TOKEN_KEY = "dar_monasbat_access_token";
export const REFRESH_TOKEN_KEY = "dar_monasbat_refresh_token";
export const USER_KEY = "dar_monasbat_user";

function parseJwt(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const claims = parseJwt(token);
  if (!claims || typeof claims.exp !== "number") return true;
  // Exp is in seconds; check with 30s buffer
  return claims.exp * 1000 <= Date.now() + 30000;
}

let refreshPromise: Promise<string | null> | null = null;

export async function performTokenRefresh(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const res = (await response.json()) as AuthTokenResponse;
          localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
          if (res.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
          }
          if (res.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          }
          window.dispatchEvent(
            new CustomEvent("auth:token_refreshed", {
              detail: { accessToken: res.accessToken, refreshToken: res.refreshToken || refreshToken },
            })
          );
          return res.accessToken;
        }

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.dispatchEvent(new CustomEvent("auth:logout"));
          return null;
        }

        return null;
      } catch (err: unknown) {
        console.warn("[Auth] Network error during token refresh:", err);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (storedToken && !isTokenExpired(storedToken)) {
    return storedToken;
  }

  return await performTokenRefresh();
}

/**
 * Register a new user on the Spring Boot backend
 */
export async function register(data: RegisterRequest): Promise<AuthTokenResponse> {
  const url = `${getApiBaseUrl()}/auth/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      body?.message ||
      body?.error ||
      (res.status === 409
        ? "رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً"
        : "فشل إنشاء الحساب، يرجى المحاولة مرة أخرى");
    throw new ApiError(errorMsg, res.status, body);
  }

  const authData = body as AuthTokenResponse;
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    window.dispatchEvent(new CustomEvent("auth:login", { detail: authData }));
  }

  return authData;
}

/**
 * Login with phone or email and password
 */
export async function login(data: LoginRequest): Promise<AuthTokenResponse> {
  const url = `${getApiBaseUrl()}/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      body?.message ||
      body?.error ||
      (res.status === 401
        ? "رقم الهاتف/البريد أو كلمة المرور غير صحيحة"
        : "تعذر تسجيل الدخول، يرجى المحاولة مرة أخرى");
    throw new ApiError(errorMsg, res.status, body);
  }

  const authData = body as AuthTokenResponse;
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    window.dispatchEvent(new CustomEvent("auth:login", { detail: authData }));
  }

  return authData;
}

/**
 * Logout the user and notify listeners
 */
export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore network errors on logout
    }
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("auth:logout"));
}

/**
 * Get current logged in user from localStorage
 */
export function getStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? (JSON.parse(userJson) as UserResponse) : null;
  } catch {
    return null;
  }
}

/**
 * Check if the user is authenticated with a valid token
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return !!token && !isTokenExpired(token);
}

/**
 * Make an authenticated HTTP request to the backend with Bearer token
 */
export async function requestWithAuth<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getValidAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const endpoint = path.startsWith("http") ? path : `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
    });
  } catch (err: unknown) {
    throw new ApiError(
      "تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت.",
      0,
      { originalError: err }
    );
  }

  // Retry once if token expired and was refreshed
  if (response.status === 401 && typeof window !== "undefined") {
    const refreshedToken = await performTokenRefresh();
    if (refreshedToken) {
      headers["Authorization"] = `Bearer ${refreshedToken}`;
      try {
        response = await fetch(endpoint, {
          ...options,
          headers,
        });
      } catch (retryErr: unknown) {
        throw new ApiError(
          "تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت.",
          0,
          { originalError: retryErr }
        );
      }
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || `طلب غير ناجح (${response.status})`,
      response.status,
      data
    );
  }

  return data as T;
}
