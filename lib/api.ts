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
  status: "AVAILABLE" | "BOOKED" | "BUFFER" | "BLACKOUT" | string;
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
  status: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  paymentExpiresAt?: string;
  paymentId?: number;
  paypalOrderId?: string;
  paymentStatus?: string;
  createdAt: string;
}

export interface BookingInitiationResponse {
  booking: BookingResponse;
  paypalOrderId: string;
  approvalUrl: string;
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
// Shared Single-Hall Reservation Cache & Sync
// Ensures any reservation (katbketab or 3aza) on the 1 shared hall immediately
// blocks overlapping hours for both katbketab and 3aza across all covered days.
// ==========================================
const SHARED_HALL_BOOKINGS_KEY = "dar_monasbat_shared_hall_bookings";

interface SharedHallReservationRecord {
  id?: number;
  code?: string;
  paypalOrderId?: string;
  hallId: number;
  hallName?: string;
  fullName?: string;
  nationalId?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  bookingType: string;
  eventLabel?: string;
  eventDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reservedDates?: string[];
  daysCount: number;
  startHour: number;
  endHour: number;
  durationHours?: number;
  formattedTimeRange?: string;
  bufferHours: number;
  hourlyRate?: number;
  totalAmount?: number;
  currency?: string;
  notes?: string;
  status: string;
  createdAt?: string;
  expiresAt?: number;
}

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

function loadSharedHallReservations(): SharedHallReservationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHARED_HALL_BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SharedHallReservationRecord[];
    const now = Date.now();
    return parsed.filter((r) => {
      if (r.status === "CANCELLED" || r.status === "EXPIRED") return false;
      if (r.status === "PENDING_PAYMENT" && r.expiresAt && r.expiresAt < now) return false;
      return true;
    });
  } catch {
    return [];
  }
}

function saveSharedHallReservations(records: SharedHallReservationRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHARED_HALL_BOOKINGS_KEY, JSON.stringify(records));
  } catch {
    // ignore storage errors
  }
}

function upsertSharedHallReservation(rec: SharedHallReservationRecord): void {
  const list = loadSharedHallReservations();
  const idx = list.findIndex(
    (item) =>
      (rec.id && item.id === rec.id) ||
      (rec.code && item.code === rec.code) ||
      (rec.paypalOrderId && item.paypalOrderId === rec.paypalOrderId)
  );
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...rec };
  } else {
    list.push(rec);
  }
  saveSharedHallReservations(list);
}

function bookingResponseToSharedRecord(b: BookingResponse, fallbackOrderId?: string): SharedHallReservationRecord {
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
  const durationHours = b.durationHours || Math.max(1, endHour - startHour);
  return {
    id: b.id,
    code: b.code,
    paypalOrderId: b.paypalOrderId || fallbackOrderId,
    hallId: b.hallId || 1,
    hallName: b.hallName || "قاعة المجلس العام",
    fullName: b.fullName,
    nationalId: b.nationalId,
    phone: b.phone,
    secondaryPhone: b.secondaryPhone,
    email: b.email,
    bookingType: isAza ? "3aza" : "katbketab",
    eventLabel: isAza ? "عزاء (3 أيام)" : "عقد قران",
    eventDate: b.eventDate,
    endDate: effectiveEnd,
    reservedDates,
    daysCount: isAza ? 3 : Math.max(1, reservedDates.length),
    startHour,
    endHour,
    durationHours,
    formattedTimeRange: buildFormattedTimeRange(isAza, startHour, endHour),
    bufferHours: b.appliedBufferHours ?? 1,
    hourlyRate: b.hourlyRate,
    totalAmount: b.totalAmount,
    currency: b.currency || "ر.ع",
    notes: b.notes,
    status: b.status || "CONFIRMED",
    createdAt: b.createdAt || new Date().toISOString(),
    expiresAt:
      b.status === "PENDING_PAYMENT"
        ? Date.now() + 15 * 60 * 1000
        : undefined,
  };
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
  };
}

function normalizeAndMergeAvailability(
  raw: HourlyAvailabilityResponse,
  hallId: number,
  year: number,
  month: number
): HourlyAvailabilityResponse {
  const buffer = raw.bufferHours !== undefined ? raw.bufferHours : 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const rawDaysByNum = new Map<number, DayAvailabilityResponse>();
  (raw.days || []).forEach((d) => rawDaysByNum.set(d.dayNumber, d));

  const localReservations = loadSharedHallReservations().filter(
    (r) => !r.hallId || r.hallId === hallId
  );

  const normalizedDays: DayAvailabilityResponse[] = [];
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const existingDay = rawDaysByNum.get(dayNum);
    const existingHoursMap = new Map<number, HourSlotStatus>();
    (existingDay?.hours || []).forEach((h) => {
      existingHoursMap.set(h.hour, h);
    });

    // If backend previously started at openHour=13 and hour 13 is BOOKED, mark hour 12 as BUFFER
    if (
      !existingHoursMap.has(12) &&
      existingHoursMap.get(13)?.status === "BOOKED" &&
      buffer >= 1
    ) {
      const slot13 = existingHoursMap.get(13);
      for (let b = 1; b <= buffer; b++) {
        if (13 - b >= 0) {
          existingHoursMap.set(13 - b, {
            hour: 13 - b,
            formattedHour: formatHourAr(13 - b),
            status: "BUFFER",
            bookingType: slot13?.bookingType,
            eventLabel: slot13?.eventLabel,
            bookingCode: slot13?.bookingCode,
          });
        }
      }
    }

    // Find all local reservations covering isoDate
    const dayLocalReservations = localReservations.filter(
      (r) => r.eventDate <= isoDate && r.endDate >= isoDate
    );

    // Build combined day reservation summaries (backend + local)
    const daySummaries: DayReservationSummary[] = [...(existingDay?.reservations || [])];
    for (const r of dayLocalReservations) {
      const alreadyExists = daySummaries.some(
        (s) =>
          (r.code && s.code === r.code) ||
          (r.id && s.bookingId === r.id) ||
          (s.eventDate === r.eventDate && s.startHour === r.startHour && s.endHour === r.endHour)
      );
      if (!alreadyExists) {
        const isAza = isAzaBookingType(r.bookingType);
        const reservedDates = r.reservedDates || buildReservedDatesRange(r.eventDate, r.endDate);
        const dayIdx = Math.max(1, reservedDates.indexOf(isoDate) + 1);
        daySummaries.push({
          bookingId: r.id,
          code: r.code,
          fullName: r.fullName,
          bookingType: isAza ? "3aza" : "katbketab",
          eventLabel: isAza ? "عزاء (3 أيام)" : "عقد قران",
          eventDate: r.eventDate,
          endDate: r.endDate,
          reservedDates,
          daysCount: isAza ? 3 : Math.max(1, reservedDates.length),
          dayIndex: dayIdx,
          startHour: r.startHour,
          endHour: r.endHour,
          formattedTimeRange:
            r.formattedTimeRange || buildFormattedTimeRange(isAza, r.startHour, r.endHour),
          status: r.status || "CONFIRMED",
        });
      }
    }

    const hours: HourSlotStatus[] = [];
    for (let h = 0; h < 24; h++) {
      const existingSlot = existingHoursMap.get(h);
      let status = existingSlot?.status || "AVAILABLE";
      let bookingType = existingSlot?.bookingType;
      let eventLabel = existingSlot?.eventLabel;
      let bookingCode = existingSlot?.bookingCode;

      if (existingDay?.status === "FULLY_BOOKED" && (existingDay.hours || []).length === 0) {
        status = "BLACKOUT";
      }

      // Overlay shared hall reservations (both katbketab and 3-day 3aza)
      for (const r of dayLocalReservations) {
        const isAza = isAzaBookingType(r.bookingType);
        if (h >= r.startHour && h < r.endHour) {
          status = "BOOKED";
          bookingType = isAza ? "3aza" : "katbketab";
          eventLabel = isAza ? "عزاء" : "عقد قران";
          bookingCode = r.code;
          break;
        }
        const rBuf = r.bufferHours ?? buffer;
        if (
          status === "AVAILABLE" &&
          rBuf > 0 &&
          ((h >= r.startHour - rBuf && h < r.startHour) ||
            (h >= r.endHour && h < r.endHour + rBuf))
        ) {
          status = "BUFFER";
          bookingType = isAza ? "3aza" : "katbketab";
          eventLabel = isAza ? "عزاء" : "عقد قران";
          bookingCode = r.code;
        }
      }

      hours.push({
        hour: h,
        formattedHour: formatHourAr(h),
        status,
        bookingType,
        eventLabel,
        bookingCode,
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
      reservations: daySummaries,
    });
  }

  return {
    ...raw,
    hallId,
    year,
    month,
    bufferHours: buffer,
    openHour: 0,
    closeHour: 24,
    dhuhrHour: raw.dhuhrHour ?? 12,
    dhuhrTime: raw.dhuhrTime ?? "12:15",
    maghribHour: raw.maghribHour ?? 18,
    maghribTime: raw.maghribTime ?? "18:05",
    days: normalizedDays,
  };
}

// Availability
export async function getHallAvailability(
  hallId: number,
  year: number,
  month: number
): Promise<HourlyAvailabilityResponse> {
  const raw = await request<HourlyAvailabilityResponse>(
    `/api/v1/bookings/availability?hallId=${hallId}&year=${year}&month=${month}`
  );
  return normalizeAndMergeAvailability(raw, hallId, year, month);
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

  // Validate against shared 1-hall reservations (katbketab and 3aza share the same hall)
  const existingReservations = loadSharedHallReservations().filter(
    (r) => !r.hallId || r.hallId === data.hallId
  );
  for (let dIso = startIso; dIso <= endIso; dIso = addDaysToIso(dIso, 1)) {
    for (const r of existingReservations) {
      if (r.eventDate <= dIso && r.endDate >= dIso) {
        const buf = r.bufferHours ?? 1;
        if (data.startHour < r.endHour + buf && data.endHour + buf > r.startHour) {
          throw new ApiError(
            `القاعة محجوزة بالفعل في تاريخ (${dIso}) خلال هذا التوقيت — توجد قاعة واحدة فقط مشتركة لعقد القران والعزاء.`,
            409
          );
        }
      }
    }
  }

  const res = await requestWithAuth<BookingInitiationResponse>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      endDate: endIso,
      daysCount: isAza ? 3 : 1,
    }),
  });

  if (res?.booking) {
    const patchedBooking = normalizeBookingResponse({
      ...res.booking,
      eventDate: res.booking.eventDate || startIso,
      endDate:
        res.booking.endDate && res.booking.endDate > startIso
          ? res.booking.endDate
          : endIso,
      daysCount: isAza ? 3 : res.booking.daysCount || 1,
    });
    res.booking = patchedBooking;
    upsertSharedHallReservation(
      bookingResponseToSharedRecord(patchedBooking, res.paypalOrderId)
    );
  }

  return res;
}

export async function getBookingByCode(code: string): Promise<BookingResponse> {
  const b = await request<BookingResponse>(
    `/api/v1/bookings/code/${encodeURIComponent(code)}`
  );
  return b ? normalizeBookingResponse(b) : b;
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
  const normalizedList = (list || []).map((b) => normalizeBookingResponse(b));
  normalizedList.forEach((b) => {
    upsertSharedHallReservation(bookingResponseToSharedRecord(b));
  });

  // Also merge any active local shared-hall reservations not yet in normalizedList
  const localRecords = loadSharedHallReservations();
  for (const r of localRecords) {
    if (status && status !== "ALL" && r.status !== status) continue;
    const exists = normalizedList.some(
      (b) =>
        (r.id && b.id === r.id) ||
        (r.code && b.code === r.code) ||
        (b.eventDate === r.eventDate && b.startHour === r.startHour && b.endHour === r.endHour)
    );
    if (!exists) {
      normalizedList.push(
        normalizeBookingResponse({
          id: r.id || Math.floor(Math.random() * 100000),
          code: r.code || "DAR-LOCAL",
          hallId: r.hallId || 1,
          hallName: r.hallName || "قاعة المجلس العام",
          fullName: r.fullName || "حجز مسجل",
          nationalId: r.nationalId || "-",
          phone: r.phone || "-",
          secondaryPhone: r.secondaryPhone,
          email: r.email || "-",
          bookingType: r.bookingType,
          eventLabel: r.eventLabel,
          eventDate: r.eventDate,
          endDate: r.endDate,
          reservedDates: r.reservedDates,
          daysCount: r.daysCount,
          startHour: r.startHour,
          endHour: r.endHour,
          durationHours: r.durationHours || Math.max(1, r.endHour - r.startHour),
          formattedTimeRange: r.formattedTimeRange,
          appliedBufferHours: r.bufferHours ?? 1,
          hourlyRate: r.hourlyRate || 25,
          totalAmount:
            r.totalAmount ||
            Math.max(1, r.endHour - r.startHour) * r.daysCount * (r.hourlyRate || 25),
          currency: r.currency || "ر.ع",
          notes: r.notes,
          status: r.status || "CONFIRMED",
          paypalOrderId: r.paypalOrderId,
          createdAt: r.createdAt || new Date().toISOString(),
        })
      );
    }
  }

  return normalizedList;
}

export async function updateBookingStatus(
  id: number,
  status: string
): Promise<BookingResponse> {
  const updated = await requestWithAuth<BookingResponse>(
    `/api/v1/bookings/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    }
  );
  if (updated) {
    const normalized = normalizeBookingResponse(updated);
    upsertSharedHallReservation(bookingResponseToSharedRecord(normalized));
    return normalized;
  }
  return updated;
}

export async function deleteBooking(id: number): Promise<void> {
  await requestWithAuth<void>(`/api/v1/bookings/${id}`, {
    method: "DELETE",
  });
  const remaining = loadSharedHallReservations().filter((r) => r.id !== id);
  saveSharedHallReservations(remaining);
}

// PayPal Payments
export async function createPayPalOrder(
  bookingId: number
): Promise<BookingInitiationResponse> {
  return request<BookingInitiationResponse>(
    `/api/v1/payments/paypal/order/${bookingId}`,
    {
      method: "POST",
    }
  );
}

export async function capturePayPalOrder(
  orderId: string
): Promise<BookingResponse> {
  const confirmed = await request<BookingResponse>(
    `/api/v1/payments/paypal/capture/${encodeURIComponent(orderId)}`,
    {
      method: "POST",
    }
  );
  if (confirmed) {
    const isAza = isAzaBookingType(confirmed.bookingType);
    const patched: BookingResponse = {
      ...confirmed,
      endDate:
        confirmed.endDate && confirmed.endDate >= confirmed.eventDate
          ? confirmed.endDate
          : isAza
          ? addDaysToIso(confirmed.eventDate, 2)
          : confirmed.eventDate,
      daysCount: isAza ? 3 : confirmed.daysCount || 1,
    };
    upsertSharedHallReservation(bookingResponseToSharedRecord(patched, orderId));
    return patched;
  }
  return confirmed;
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
