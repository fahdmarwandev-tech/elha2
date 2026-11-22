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
  if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "";
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

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleProactiveTokenRefresh() {
  if (typeof window === "undefined") return;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || !refreshToken) return;

  const claims = parseJwt(token);
  if (!claims || typeof claims.exp !== "number") {
    performTokenRefresh();
    return;
  }

  // Proactively refresh 1 minute before access token expiry (or immediately if <= 1 min left)
  const msUntilExpiry = claims.exp * 1000 - Date.now();
  const refreshInMs = Math.max(msUntilExpiry - 60000, 5000);

  refreshTimer = setTimeout(() => {
    performTokenRefresh().then(() => {
      scheduleProactiveTokenRefresh();
    });
  }, refreshInMs);
}

if (typeof window !== "undefined") {
  window.addEventListener("auth:login", () => scheduleProactiveTokenRefresh());
  window.addEventListener("auth:token_refreshed", () => scheduleProactiveTokenRefresh());
  window.addEventListener("auth:logout", () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  });

  if (document.readyState === "complete" || document.readyState === "interactive") {
    scheduleProactiveTokenRefresh();
  } else {
    window.addEventListener("DOMContentLoaded", () => scheduleProactiveTokenRefresh());
  }
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
 * Check if the stored user has admin role
 */
export function isAdminUser(): boolean {
  const user = getStoredUser();
  if (!user || !user.role) return false;
  return user.role === "ROLE_ADMIN" || user.role === "ADMIN";
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

  const endpoint = path.startsWith("http")
    ? path
    : `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

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

/**
 * Public request helper for unauthenticated GET/POST endpoints
 */
export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const endpoint = path.startsWith("http")
    ? path
    : `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

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

/**
 * Upload video with multipart/form-data and Bearer token
 */
export async function uploadVideoWithAuth(
  path: string,
  formData: FormData
): Promise<VideoResponse> {
  const token = await getValidAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const endpoint = path.startsWith("http")
    ? path
    : `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch (err: unknown) {
    throw new ApiError(
      "تعذر الاتصال بالخادم أثناء رفع الملف.",
      0,
      { originalError: err }
    );
  }

  if (response.status === 401 && typeof window !== "undefined") {
    const refreshedToken = await performTokenRefresh();
    if (refreshedToken) {
      headers["Authorization"] = `Bearer ${refreshedToken}`;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: formData,
        });
      } catch (retryErr: unknown) {
        throw new ApiError("تعذر الاتصال بالخادم بعد تجديد الجلسة.", 0, {
          originalError: retryErr,
        });
      }
    }
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || `فشل رفع الملف (${response.status})`,
      response.status,
      data
    );
  }

  return data as VideoResponse;
}

// ==========================================
// Domain Interfaces
// ==========================================

export interface HallMediaResponse {
  id: number;
  mediaUrl: string;
  title?: string;
  subtitle?: string;
  sortOrder?: number;
}

export interface HallResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  hourlyRate: number;
  currency: string;
  bufferHours: number;
  openHour: number;
  closeHour: number;
  featuresJson: string;
  isActive: boolean;
  mediaList: HallMediaResponse[];
}

export interface UpdateHallConfigRequest {
  name?: string;
  description?: string;
  capacity?: number;
  hourlyRate?: number;
  currency?: string;
  bufferHours?: number;
  openHour?: number;
  closeHour?: number;
  featuresJson?: string;
}

export interface HourSlotStatus {
  hour: number;
  formattedHour: string;
  status: "AVAILABLE" | "PENDING" | "BOOKED" | "BUFFER" | "BLACKOUT" | string;
  bookingStatus?: string;
  bookingType?: string;
  eventLabel?: string;
  bookingCode?: string;
}

export interface DayReservationSummary {
  bookingId?: number;
  code?: string;
  fullName?: string;
  bookingType: string;
  eventLabel: string;
  eventDate: string;
  endDate: string;
  reservedDates: string[];
  daysCount: number;
  dayIndex: number;
  startHour: number;
  endHour: number;
  formattedTimeRange: string;
  status: string;
}

export interface DayAvailabilityResponse {
  date: string;
  dayNumber: number;
  status: "AVAILABLE" | "PARTIALLY_BOOKED" | "FULLY_BOOKED" | string;
  hours: HourSlotStatus[];
  reservations?: DayReservationSummary[];
}

export interface HourlyAvailabilityResponse {
  hallId: number;
  hallName: string;
  year: number;
  month: number;
  bufferHours: number;
  openHour: number;
  closeHour: number;
  dhuhrHour?: number;
  dhuhrTime?: string;
  maghribHour?: number;
  maghribTime?: string;
  days: DayAvailabilityResponse[];
}

export interface CreateBookingRequest {
  hallId: number;
  fullName: string;
  nationalId: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  bookingType: string;
  eventDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  daysCount?: number;
  startHour: number;
  endHour: number;
  notes?: string;
  paymentReceiptImageUrl?: string;
}

export interface BookingResponse {
  id: number;
  code: string;
  hallId: number;
  hallName: string;
  userId?: number;
  fullName: string;
  nationalId: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  bookingType: string;
  eventLabel?: string;
  eventDate: string;
  endDate?: string;
  reservedDates?: string[];
  daysCount?: number;
  startHour: number;
  endHour: number;
  durationHours: number;
  formattedTimeRange?: string;
  appliedBufferHours: number;
  hourlyRate: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  status: "PENDING_APPROVAL" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED" | string;
  orderStatus?: string;
  paymentReceiptImageUrl?: string;
  createdAt: string;
}

export interface BookingInitiationResponse {
  booking: BookingResponse;
}

export interface BlackoutResponse {
  id: number;
  hallId: number;
  blackoutDate: string;
  startHour?: number;
  endHour?: number;
  reason?: string;
}

export interface CreateBlackoutRequest {
  hallId: number;
  blackoutDate: string;
  startHour?: number;
  endHour?: number;
  reason?: string;
}

export interface VideoResponse {
  id: number;
  videoSourceType: "YOUTUBE" | "LOCAL" | string;
  youtubeUrl?: string;
  youtubeId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  title: string;
  description?: string;
  category: string;
  categoryName?: string;
  duration?: string;
  viewsCount?: string;
  customPoster?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CreateVideoRequest {
  videoSourceType?: string;
  youtubeUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  title?: string;
  description?: string;
  category: string;
  categoryName?: string;
  duration?: string;
  viewsCount?: string;
  customPoster?: string;
  isFeatured?: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface PrayerTimesResponse {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  manualOverride?: boolean;
  effectiveDate?: string;
  nextPrayer?: string;
}

export interface PrayerTimesUpdateRequest {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  manualOverride?: boolean;
}

export interface HistoryResponse {
  mosqueName: string;
  location: string;
  inaugurationYear: number;
  landArea: string;
  worshippersCapacity: number;
  majlisCapacity: number;
  minarets: string;
  gatesCount: number;
  overview: string;
  facilities: string[];
  waqfProjects: string[];
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// ==========================================
// API Client Functions
// ==========================================

// Halls
export async function getHalls(): Promise<HallResponse[]> {
  return request<HallResponse[]>("/api/v1/halls");
}

export async function getHallById(id: number): Promise<HallResponse> {
  return request<HallResponse>(`/api/v1/halls/${id}`);
}

export async function updateHall(
  id: number,
  data: Partial<UpdateHallConfigRequest>
): Promise<HallResponse> {
  return requestWithAuth<HallResponse>(`/api/v1/halls/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Booking & Availability Helpers (Backend as Single Source of Truth)
// ==========================================
function isAzaBookingType(bt?: string): boolean {
  if (!bt) return false;
  const norm = bt.trim().toLowerCase();
  return norm === "3aza" || norm === "aza" || norm.includes("عزاء");
}

function addDaysToIso(isoDate: string, daysToAdd: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d + daysToAdd);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function buildReservedDatesRange(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  if (!startIso) return dates;
  const safeEnd = endIso && endIso >= startIso ? endIso : startIso;
  for (let d = startIso; d <= safeEnd; d = addDaysToIso(d, 1)) {
    dates.push(d);
    if (dates.length >= 10) break;
  }
  return dates;
}

function formatHourAr(hour: number): string {
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  const period = hour >= 12 && hour < 24 ? "م" : "ص";
  return `${String(h12).padStart(2, "0")}:00 ${period}`;
}

function buildFormattedTimeRange(isAza: boolean, startHour: number, endHour: number): string {
  if (isAza && startHour === 12 && endHour === 18) {
    return "من 12:00 ظهراً (الظهر) إلى 06:00 مساءً (المغرب)";
  }
  return `من ${formatHourAr(startHour)} إلى ${formatHourAr(endHour)}`;
}

export function resolveReceiptImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const base = getApiBaseUrl();
  if (base && trimmed.startsWith("/")) {
    return `${base}${trimmed}`;
  }
  return trimmed;
}

function normalizeBookingResponse(b: BookingResponse): BookingResponse {
  const isAza = isAzaBookingType(b.bookingType);
  const effectiveEnd =
    b.endDate && b.endDate > b.eventDate
      ? b.endDate
      : isAza
      ? addDaysToIso(b.eventDate, 2)
      : b.eventDate;
  const reservedDates = buildReservedDatesRange(b.eventDate, effectiveEnd);
  const startHour = b.startHour ?? (isAza ? 12 : 18);
  const endHour = b.endHour ?? (isAza ? 18 : 22);
  return {
    ...b,
    bookingType: isAza ? "3aza" : "katbketab",
    eventLabel: isAza ? "عزاء (3 أيام)" : "عقد قران",
    endDate: effectiveEnd,
    reservedDates,
    daysCount: isAza ? 3 : Math.max(1, reservedDates.length),
    startHour,
    endHour,
    durationHours: b.durationHours || Math.max(1, endHour - startHour),
    formattedTimeRange: buildFormattedTimeRange(isAza, startHour, endHour),
    orderStatus: b.orderStatus || b.status,
    paymentReceiptImageUrl: resolveReceiptImageUrl(b.paymentReceiptImageUrl),
  };
}

function normalizeAvailabilityResponse(
  raw: HourlyAvailabilityResponse,
  hallId: number,
  year: number,
  month: number
): HourlyAvailabilityResponse {
  const buffer = raw.bufferHours !== undefined ? raw.bufferHours : 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const rawDaysByNum = new Map<number, DayAvailabilityResponse>();
  (raw.days || []).forEach((d) => rawDaysByNum.set(d.dayNumber, d));

  const normalizedDays: DayAvailabilityResponse[] = [];
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const existingDay = rawDaysByNum.get(dayNum);
    const existingHoursMap = new Map<number, HourSlotStatus>();
    (existingDay?.hours || []).forEach((h) => {
      existingHoursMap.set(h.hour, h);
    });

    const hours: HourSlotStatus[] = [];
    for (let h = 0; h < 24; h++) {
      const existingSlot = existingHoursMap.get(h);
      let status = existingSlot?.status || "AVAILABLE";
      if (existingDay?.status === "FULLY_BOOKED" && (existingDay.hours || []).length === 0) {
        status = "BLACKOUT";
      }
      hours.push({
        hour: h,
        formattedHour: existingSlot?.formattedHour || formatHourAr(h),
        status,
        bookingStatus: existingSlot?.bookingStatus,
        bookingType: existingSlot?.bookingType,
        eventLabel: existingSlot?.eventLabel,
        bookingCode: existingSlot?.bookingCode,
      });
    }

    const availCount = hours.filter((s) => s.status === "AVAILABLE").length;
    const dayStatus =
      availCount === 0
        ? "FULLY_BOOKED"
        : availCount === 24
        ? "AVAILABLE"
        : "PARTIALLY_BOOKED";

    normalizedDays.push({
      date: isoDate,
      dayNumber: dayNum,
      status: dayStatus,
      hours,
      reservations: existingDay?.reservations || [],
    });
  }

  return {
    ...raw,
    hallId,
    year,
    month,
    bufferHours: buffer,
    openHour: raw.openHour ?? 0,
    closeHour: raw.closeHour ?? 24,
    dhuhrHour: raw.dhuhrHour ?? 12,
    dhuhrTime: raw.dhuhrTime ?? "12:15",
    maghribHour: raw.maghribHour ?? 18,
    maghribTime: raw.maghribTime ?? "18:05",
    days: normalizedDays,
  };
}

// Availability (includes auth header when signed in so admins receive reservation summaries)
export async function getHallAvailability(
  hallId: number,
  year: number,
  month: number
): Promise<HourlyAvailabilityResponse> {
  const path = `/api/v1/bookings/availability?hallId=${hallId}&year=${year}&month=${month}`;
  const hasSession = typeof window !== "undefined" && !!localStorage.getItem(ACCESS_TOKEN_KEY);
  const raw = hasSession
    ? await requestWithAuth<HourlyAvailabilityResponse>(path)
    : await request<HourlyAvailabilityResponse>(path);
  return normalizeAvailabilityResponse(raw, hallId, year, month);
}

// Bookings
export async function createBooking(
  data: CreateBookingRequest
): Promise<BookingInitiationResponse> {
  const isAza = isAzaBookingType(data.bookingType);
  const startIso = data.eventDate;
  const endIso = isAza
    ? addDaysToIso(data.eventDate, 2)
    : data.endDate && data.endDate >= data.eventDate
    ? data.endDate
    : data.eventDate;

  const res = await requestWithAuth<BookingInitiationResponse>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      endDate: endIso,
      daysCount: isAza ? 3 : 1,
    }),
  });

  if (res?.booking) {
    res.booking = normalizeBookingResponse({
      ...res.booking,
      eventDate: res.booking.eventDate || startIso,
      endDate:
        res.booking.endDate && res.booking.endDate > startIso
          ? res.booking.endDate
          : endIso,
      daysCount: isAza ? 3 : res.booking.daysCount || 1,
      paymentReceiptImageUrl:
        res.booking.paymentReceiptImageUrl || data.paymentReceiptImageUrl,
    });
  }

  return res;
}

export async function getBookingByCode(code: string): Promise<BookingResponse> {
  const b = await request<BookingResponse>(
    `/api/v1/bookings/code/${encodeURIComponent(code)}`
  );
  if (!b) return b;
  return normalizeBookingResponse(b);
}

export async function getAllBookingsAdmin(
  status?: string,
  date?: string
): Promise<BookingResponse[]> {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (date) {
    params.append("fromDate", date);
    params.append("toDate", date);
  }
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const list = await requestWithAuth<BookingResponse[]>(`/api/v1/bookings${queryString}`);
  return (list || []).map(normalizeBookingResponse);
}

export async function updateBookingStatus(
  id: number,
  status: string,
  rejectionReason?: string
): Promise<BookingResponse> {
  const updated = await requestWithAuth<BookingResponse>(
    `/api/v1/bookings/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({
        status,
        ...(rejectionReason && rejectionReason.trim()
          ? { rejectionReason: rejectionReason.trim() }
          : {}),
      }),
    }
  );
  return updated ? normalizeBookingResponse(updated) : updated;
}

export async function deleteBooking(id: number): Promise<void> {
  await requestWithAuth<void>(`/api/v1/bookings/${id}`, {
    method: "DELETE",
  });
}

export async function uploadPaymentReceiptFile(
  file: File,
  bookingId?: number,
  bookingCode?: string
): Promise<{ imageUrl: string; booking?: BookingResponse }> {
  const toBase64 = (f: File): Promise<string> =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const rawDataUrl = (reader.result as string) || "";
        if (typeof window === "undefined" || !rawDataUrl) {
          resolve(rawDataUrl);
          return;
        }
        const img = new window.Image();
        img.onload = () => {
          try {
            const maxDim = 1000;
            let width = img.width || 800;
            let height = img.height || 800;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL("image/jpeg", 0.78);
              resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl);
              return;
            }
          } catch {
            // fallback to rawDataUrl
          }
          resolve(rawDataUrl);
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(f);
    });

  const formData = new FormData();
  formData.append("file", file);

  let path = "/api/v1/bookings/upload-receipt";
  if (bookingId) {
    path = `/api/v1/bookings/${bookingId}/receipt`;
  } else if (bookingCode) {
    path = `/api/v1/bookings/code/${encodeURIComponent(bookingCode)}/receipt`;
  }

  const token = await getValidAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const endpoint = `${getApiBaseUrl()}${path}`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await response.json().catch(() => null);

    if (response.ok) {
      if (bookingId || bookingCode) {
        const b = normalizeBookingResponse(data as BookingResponse);
        return { imageUrl: b.paymentReceiptImageUrl || "", booking: b };
      }
      const rawUrl = (data?.imageUrl || data?.url || data?.receiptUrl || "").trim();
      if (rawUrl) {
        return { imageUrl: rawUrl };
      }
    }

    if (response.status === 400) {
      throw new ApiError(
        data?.message || "صيغة أو حجم إيصال التحويل غير صالح",
        response.status,
        data
      );
    }

    console.warn(`[Receipt] Server upload responded ${response.status}, falling back to compressed Base64 data URL`);
    const base64Url = await toBase64(file);
    return { imageUrl: base64Url };
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    console.warn("[Receipt] Network exception during upload, falling back to compressed Base64 data URL:", err);
    const base64Url = await toBase64(file);
    return { imageUrl: base64Url };
  }
}

// Blackouts
export async function getBlackouts(
  hallId?: number
): Promise<BlackoutResponse[]> {
  const query = hallId !== undefined ? `?hallId=${hallId}` : "";
  return request<BlackoutResponse[]>(`/api/v1/blackouts${query}`);
}

export async function createBlackout(
  data: CreateBlackoutRequest
): Promise<BlackoutResponse> {
  return requestWithAuth<BlackoutResponse>("/api/v1/blackouts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteBlackout(id: number): Promise<void> {
  return requestWithAuth<void>(`/api/v1/blackouts/${id}`, {
    method: "DELETE",
  });
}

// Videos & Categories
export async function getVideos(): Promise<VideoResponse[]> {
  return request<VideoResponse[]>("/api/v1/videos");
}

export async function createVideo(
  data: CreateVideoRequest
): Promise<VideoResponse> {
  return requestWithAuth<VideoResponse>("/api/v1/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadVideo(formData: FormData): Promise<VideoResponse> {
  return uploadVideoWithAuth("/api/v1/videos/upload", formData);
}

export async function setFeaturedVideo(id: number): Promise<VideoResponse> {
  return requestWithAuth<VideoResponse>(`/api/v1/videos/${id}/featured`, {
    method: "PUT",
  });
}

export async function deleteVideo(id: number): Promise<MessageResponse> {
  return requestWithAuth<MessageResponse>(`/api/v1/videos/${id}`, {
    method: "DELETE",
  });
}

export async function getCategories(): Promise<CategoryResponse[]> {
  return request<CategoryResponse[]>("/api/v1/media-categories");
}

export async function createCategory(
  data: Partial<CategoryResponse>
): Promise<CategoryResponse> {
  return requestWithAuth<CategoryResponse>("/api/v1/media-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return requestWithAuth<void>(`/api/v1/media-categories/${id}`, {
    method: "DELETE",
  });
}

// Content & Prayer Times
export async function getPrayerTimes(): Promise<PrayerTimesResponse> {
  return request<PrayerTimesResponse>("/api/v1/content/prayer-times");
}

export async function updatePrayerTimes(
  data: PrayerTimesUpdateRequest
): Promise<PrayerTimesResponse> {
  return requestWithAuth<PrayerTimesResponse>("/api/v1/content/prayer-times", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getHistory(): Promise<HistoryResponse> {
  return request<HistoryResponse>("/api/v1/content/history");
}

// Auth
export async function forgotPassword(
  identifier: string
): Promise<MessageResponse> {
  return request<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(
  identifier: string,
  otpCode: string,
  newPassword: string
): Promise<MessageResponse> {
  return request<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ identifier, otpCode, newPassword }),
  });
}

// Staff Emails Management (Option 1 DB Table)
export interface StaffEmailResponse {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface CreateStaffEmailRequest {
  fullName: string;
  email: string;
}

export async function getStaffMembers(): Promise<StaffEmailResponse[]> {
  const res = await requestWithAuth<StaffEmailResponse[]>("/api/v1/staff");
  return res || [];
}

export async function createStaffMember(
  data: CreateStaffEmailRequest
): Promise<StaffEmailResponse> {
  return requestWithAuth<StaffEmailResponse>("/api/v1/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteStaffMember(id: number): Promise<void> {
  return requestWithAuth<void>(`/api/v1/staff/${id}`, {
    method: "DELETE",
  });
}

