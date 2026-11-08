"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminHeader from "@/components/AdminHeader";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Trash2,
  X,
  AlertCircle,
  MessageCircle,
  Maximize2,
  Check,
  Building2,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Ribbon,
  Settings,
  Ban,
  DollarSign,
  Layers,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAllBookingsAdmin,
  updateBookingStatus,
  deleteBooking,
  getHalls,
  updateHall,
  getBlackouts,
  createBlackout,
  deleteBlackout,
  isAdminUser,
  BookingResponse,
  HallResponse,
  BlackoutResponse,
} from "@/lib/api";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdminUser()) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Navigation sub-tabs: Bookings vs Hall Settings vs Blackouts
  const [adminSection, setAdminSection] = useState<"BOOKINGS" | "HALL_SETTINGS" | "BLACKOUTS">("BOOKINGS");

  // Live Bookings state
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Month navigation
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 1-12
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate() || 6);

  // Filters
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "katbketab" | "3aza">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");

  // Selected Booking details modal
  const [selectedBookingModal, setSelectedBookingModal] = useState<BookingResponse | null>(null);

  // Hall Settings state
  const [hall, setHall] = useState<HallResponse | null>(null);
  const [loadingHall, setLoadingHall] = useState(false);
  const [savingHall, setSavingHall] = useState(false);
  const [hallForm, setHallForm] = useState({
    name: "قاعة المجلس العام",
    capacity: 500,
    hourlyRate: 25,
    bufferHours: 1,
    openHour: 13,
    closeHour: 24,
    description: "قاعة المجلس العام مجهزة بالكامل للمناسبات ومجالس العزاء",
  });

  // Blackouts state
  const [blackouts, setBlackouts] = useState<BlackoutResponse[]>([]);
  const [loadingBlackouts, setLoadingBlackouts] = useState(false);
  const [newBlackoutForm, setNewBlackoutForm] = useState({
    blackoutDate: new Date().toISOString().split("T")[0],
    startHour: 8,
    endHour: 24,
    reason: "أعمال صيانة دورية ونظافة",
  });
  const [creatingBlackout, setCreatingBlackout] = useState(false);

  // Fetch live bookings
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await getAllBookingsAdmin(filterStatus !== "ALL" ? filterStatus : undefined);
      setBookings(data || []);
    } catch (err: unknown) {
      console.warn("Could not load admin bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch hall data
  const loadHall = async () => {
    try {
      setLoadingHall(true);
      const halls = await getHalls();
      if (halls && halls.length > 0) {
        const primary = halls[0];
        setHall(primary);
        setHallForm({
          name: primary.name || "قاعة المجلس العام",
          capacity: primary.capacity || 500,
          hourlyRate: primary.hourlyRate || 25,
          bufferHours: primary.bufferHours !== undefined ? primary.bufferHours : 1,
          openHour: primary.openHour !== undefined ? primary.openHour : 13,
          closeHour: primary.closeHour !== undefined ? primary.closeHour : 24,
          description: primary.description || "",
        });
      }
    } catch (err) {
      console.warn("Could not load hall:", err);
    } finally {
      setLoadingHall(false);
    }
  };

  // Fetch blackouts
  const loadBlackouts = async () => {
    try {
      setLoadingBlackouts(true);
      const data = await getBlackouts();
      setBlackouts(data || []);
    } catch (err) {
      console.warn("Could not load blackouts:", err);
    } finally {
      setLoadingBlackouts(false);
    }
  };

  useEffect(() => {
    loadBookings();
    loadHall();
    loadBlackouts();
  }, [filterStatus]);

  // Handle status update
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const updated = await updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (selectedBookingModal?.id === id) {
        setSelectedBookingModal(updated);
      }
      setStatusMessage({ type: "success", text: `تم تحديث حالة الحجز إلى: ${newStatus}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل تحديث حالة الحجز";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً من قاعدة البيانات؟")) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBookingModal?.id === id) {
        setSelectedBookingModal(null);
      }
      setStatusMessage({ type: "success", text: "تم حذف الحجز بنجاح." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل حذف الحجز";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  // Handle save hall settings
  const handleSaveHall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hall) return;
    try {
      setSavingHall(true);
      const updated = await updateHall(hall.id, {
        name: hallForm.name,
        capacity: Number(hallForm.capacity),
        hourlyRate: Number(hallForm.hourlyRate),
        bufferHours: Number(hallForm.bufferHours),
        openHour: Number(hallForm.openHour),
        closeHour: Number(hallForm.closeHour),
        description: hallForm.description,
      });
      setHall(updated);
      setStatusMessage({ type: "success", text: "تم حفظ إعدادات القاعة وفترة التجهيز بنجاح!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل حفظ إعدادات القاعة";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setSavingHall(false);
    }
  };

  // Handle create blackout
  const handleCreateBlackout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hall) return;
    try {
      setCreatingBlackout(true);
      const created = await createBlackout({
        hallId: hall.id,
        blackoutDate: newBlackoutForm.blackoutDate,
        startHour: Number(newBlackoutForm.startHour),
        endHour: Number(newBlackoutForm.endHour),
        reason: newBlackoutForm.reason,
      });
      setBlackouts((prev) => [...prev, created]);
      setStatusMessage({ type: "success", text: "تم تسجيل فترة الإغلاق/الصيانة بنجاح!" });
      setNewBlackoutForm({
        blackoutDate: new Date().toISOString().split("T")[0],
        startHour: 8,
        endHour: 24,
        reason: "أعمال صيانة دورية ونظافة",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل إنشاء فترة الإغلاق";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setCreatingBlackout(false);
    }
  };

  // Handle delete blackout
  const handleDeleteBlackout = async (id: number) => {
    if (!confirm("هل أنت متأكد من إلغاء فترة الإغلاق هذه؟")) return;
    try {
      await deleteBlackout(id);
      setBlackouts((prev) => prev.filter((b) => b.id !== id));
      setStatusMessage({ type: "success", text: "تم حذف فترة الإغلاق بنجاح." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل حذف فترة الإغلاق";
      setStatusMessage({ type: "error", text: msg });
    }
  };

  // Calendar calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 0).getDate();
  }, [currentYear, currentMonth]);

  const startDayOffset = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1).getDay();
  }, [currentYear, currentMonth]);

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const currentMonthName = `${monthNames[currentMonth - 1]} ${currentYear}`;

  // Filtered Bookings for the current month by day
  const bookingsByDay = useMemo(() => {
    const map = new Map<number, BookingResponse[]>();
    const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    bookings.forEach((b) => {
      if (b.eventDate && b.eventDate.startsWith(monthPrefix)) {
        const day = parseInt(b.eventDate.split("-")[2], 10);
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day)!.push(b);
      }
    });
    return map;
  }, [bookings, currentYear, currentMonth]);

  const selectedDayBookings = useMemo(() => {
    return bookingsByDay.get(selectedDay) || [];
  }, [bookingsByDay, selectedDay]);

  // Table Filtered Bookings
  const todayStr = new Date().toISOString().split("T")[0];
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === "UPCOMING" && (b.eventDate < todayStr || b.status === "COMPLETED")) return false;
      if (activeTab === "PAST" && (b.eventDate >= todayStr && b.status !== "COMPLETED")) return false;

      // Type filter
      if (filterType !== "ALL" && b.bookingType !== filterType) return false;

      // Status filter
      if (filterStatus !== "ALL" && b.status !== filterStatus) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (b.fullName || "").toLowerCase().includes(q);
        const matchesCode = (b.code || "").toLowerCase().includes(q);
        const matchesPhone = (b.phone || "").includes(q);
        const matchesId = (b.nationalId || "").includes(q);
        const matchesNotes = (b.notes || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesPhone && !matchesId && !matchesNotes) return false;
      }

      return true;
    });
  }, [bookings, activeTab, filterType, filterStatus, searchQuery, todayStr]);

  // Statistics KPIs
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING_PAYMENT").length;
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    const katbCount = bookings.filter((b) => b.bookingType === "katbketab").length;
    const azaCount = bookings.filter((b) => b.bookingType === "3aza").length;
    return { total, confirmed, pending, completed, katbCount, azaCount };
  }, [bookings]);

  // Status badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مؤكد</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>منتهي ومكتمل</span>
          </span>
        );
      case "PENDING_PAYMENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>بانتظار الدفع</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <X className="w-3.5 h-3.5" />
            <span>ملغى</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/70 border border-white/20">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#040812] flex items-center justify-center text-[#FAF7F0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF85] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#8EA3BF]">جاري التحقق من صلاحيات الإدارة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#0B1220] overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#122849]/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[550px] h-[550px] bg-[#C59B63]/10 rounded-full blur-[160px]" />
      </div>

      <AdminHeader />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 w-full flex-1 space-y-8">
        {/* Breadcrumb Back to Admin Hub */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8EA3BF] hover:text-[#FFE8B8] bg-[#0A1628]/80 border border-[#1E3A63] hover:border-[#D4AF85]/60 px-3.5 py-1.5 rounded-full transition"
          >
            <span>← العودة إلى لوحة تحكم الإدارة</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF85]/20 text-[#FFE8B8] border border-[#D4AF85]/40 flex items-center gap-1.5 shadow-inner">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFE8B8]" />
                <span>لوحة تحكم إدارة جامع الحق والمجلس العام</span>
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] inline-block pe-3 ps-1 py-1 leading-normal">
                إدارة الحجوزات، إعدادات القاعة، وفترات الإغلاق
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#DCE6F2] mt-1.5">
              إدارة الحجوزات المباشرة وتعديل فترات الاستراحة والتجهيز (Buffer Time) وضبط الإغلاقات الدورية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => { loadBookings(); loadHall(); loadBlackouts(); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#FFF2D2] text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#FFE8B8]" />
              <span>تحديث البيانات</span>
            </button>
            <Link
              href="/admin/videos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#FFF2D2] text-xs font-bold transition"
            >
              <span>إدارة المرئيات</span>
            </Link>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition ${
              statusMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/40 border-red-500/50 text-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Primary Sub-Tabs Navigation */}
        <div className="flex items-center gap-3 border-b border-white/15 pb-4 overflow-x-auto">
          <button
            onClick={() => setAdminSection("BOOKINGS")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              adminSection === "BOOKINGS"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 border border-[#FFF0C8] text-[#FFF9E6] shadow-lg"
                : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70"
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-[#FFE8B8]" />
            <span>جدول الحجوزات والتقويم</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 font-mono">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setAdminSection("HALL_SETTINGS")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              adminSection === "HALL_SETTINGS"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 border border-[#FFF0C8] text-[#FFF9E6] shadow-lg"
                : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70"
            }`}
          >
            <Settings className="w-4 h-4 text-[#FFE8B8]" />
            <span>إعدادات القاعة وتوقيت التجهيز (Buffer Time)</span>
          </button>

          <button
            onClick={() => setAdminSection("BLACKOUTS")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              adminSection === "BLACKOUTS"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 border border-[#FFF0C8] text-[#FFF9E6] shadow-lg"
                : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70"
            }`}
          >
            <Ban className="w-4 h-4 text-red-400" />
            <span>فترات الإغلاق والصيانة (Blackout Slots)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 font-mono">
              {blackouts.length}
            </span>
          </button>
        </div>

        {/* SECTION 1: BOOKINGS MANAGEMENT */}
        {adminSection === "BOOKINGS" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/15">
                <span className="text-[11px] font-semibold text-[#8EA3BF] block mb-1">إجمالي الحجوزات</span>
                <span className="text-2xl font-black text-[#FFF2D2] font-mono">{stats.total}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/25 backdrop-blur-xl border border-emerald-500/25">
                <span className="text-[11px] font-semibold text-emerald-300/80 block mb-1">المؤكدة</span>
                <span className="text-2xl font-black text-emerald-300 font-mono">{stats.confirmed}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/25 backdrop-blur-xl border border-amber-500/25">
                <span className="text-[11px] font-semibold text-amber-300/80 block mb-1">بانتظار الدفع</span>
                <span className="text-2xl font-black text-amber-300 font-mono">{stats.pending}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/15">
                <span className="text-[11px] font-semibold text-[#8EA3BF] block mb-1">المكتملة</span>
                <span className="text-2xl font-black text-[#DCE6F2] font-mono">{stats.completed}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#C59B63]/15 backdrop-blur-xl border border-[#D4AF85]/30">
                <span className="text-[11px] font-semibold text-[#FFE8B8] block mb-1">عقد قران</span>
                <span className="text-2xl font-black text-[#FFE8B8] font-mono">{stats.katbCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-950/25 backdrop-blur-xl border border-sky-500/25">
                <span className="text-[11px] font-semibold text-sky-300/80 block mb-1">عزاء</span>
                <span className="text-2xl font-black text-sky-300 font-mono">{stats.azaCount}</span>
              </div>
            </div>

            {/* Calendar + Selected Day details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Calendar */}
              <div className="lg:col-span-7 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                  <h2 className="text-lg sm:text-xl font-black font-sans flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#FFE8B8]" />
                    <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent">
                      تقويم الحجوزات الفعلي
                    </span>
                  </h2>

                  <div className="flex items-center gap-2 bg-white/[0.08] border border-white/20 rounded-xl px-2 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentMonth === 1) {
                          setCurrentMonth(12);
                          setCurrentYear((y) => y - 1);
                        } else {
                          setCurrentMonth((m) => m - 1);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-[#FFE8B8] transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-[#FFF2D2] px-2 min-w-[110px] text-center">
                      {currentMonthName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentMonth === 12) {
                          setCurrentMonth(1);
                          setCurrentYear((y) => y + 1);
                        } else {
                          setCurrentMonth((m) => m + 1);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/20 text-[#D4AF85] transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#FFE8B8] mb-3 py-2 bg-white/[0.06] rounded-xl">
                  <span>الأحد</span>
                  <span>الإثنين</span>
                  <span>الثلاثاء</span>
                  <span>الأربعاء</span>
                  <span>الخميس</span>
                  <span>الجمعة</span>
                  <span>السبت</span>
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`offset-${i}`} className="h-10 sm:h-12" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayBookings = bookingsByDay.get(day) || [];
                    const isSelected = selectedDay === day;
                    const hasConfirmed = dayBookings.some((b) => b.status === "CONFIRMED");
                    const hasPending = dayBookings.some((b) => b.status === "PENDING_PAYMENT");

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`relative h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-br from-[#D4AF85]/55 via-white/30 to-[#122849]/70 border-2 border-[#FFF0C8] text-[#FFF9E6] shadow-lg scale-105 z-10"
                            : dayBookings.length > 0
                            ? "bg-amber-400/[0.15] text-[#FFF2D2] border border-amber-300/40 hover:bg-amber-400/[0.25]"
                            : "bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/20"
                        }`}
                      >
                        <span>{day}</span>
                        {dayBookings.length > 0 && !isSelected && (
                          <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 ${
                            hasConfirmed ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day View */}
              <div className="lg:col-span-5 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#FFF2D2]">
                      حجوزات اليوم المحدد ({selectedDay} {currentMonthName})
                    </h3>
                    <p className="text-xs text-[#8EA3BF]">
                      {selectedDayBookings.length} حجز مسجل في هذا التاريخ
                    </p>
                  </div>
                </div>

                {selectedDayBookings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#8EA3BF] bg-white/[0.03] rounded-2xl border border-white/10">
                    لا توجد أي حجوزات مسجلة في هذا اليوم.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-white/[0.06] border border-white/20 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#FFE8B8] block">
                              {b.code}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-0.5">{b.fullName}</h4>
                            <p className="text-xs text-[#8EA3BF]">
                              {b.bookingType === "katbketab" ? "عقد قران" : "عزاء"} • من {b.startHour}:00 حتى {b.endHour}:00 ({b.durationHours} ساعات)
                            </p>
                            <p className="text-[11px] text-[#FFE8B8]/80 mt-0.5">
                              فترة التجهيز المطبقة: {b.appliedBufferHours || 1} ساعة
                            </p>
                          </div>
                          {renderStatusBadge(b.status)}
                        </div>

                        {/* Quick Status Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
                          {b.status !== "CONFIRMED" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition cursor-pointer"
                            >
                              تأكيد الحجز
                            </button>
                          )}
                          {b.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "COMPLETED")}
                              className="px-2.5 py-1 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 text-[11px] font-bold border border-slate-500/30 transition cursor-pointer"
                            >
                              إكمال
                            </button>
                          )}
                          {b.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "CANCELLED")}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/30 transition cursor-pointer"
                            >
                              إلغاء
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/20 transition cursor-pointer mr-auto"
                          >
                            التفاصيل
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                            title="حذف الحجز"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bookings Table with Search and Status Filter */}
            <div className="bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-sans text-white">
                    قائمة جميع الحجوزات ({filteredBookings.length})
                  </h3>
                  <p className="text-xs text-[#8EA3BF] mt-0.5">
                    بحث وتصفية وتعديل حالات الحجوزات وإصدار السندات
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Dropdown */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/25 text-xs text-white focus:outline-none focus:border-[#D4AF85] transition"
                  >
                    <option value="ALL" className="bg-[#050A14]">جميع الحالات</option>
                    <option value="CONFIRMED" className="bg-[#050A14]">مؤكد (CONFIRMED)</option>
                    <option value="PENDING_PAYMENT" className="bg-[#050A14]">بانتظار الدفع (PENDING)</option>
                    <option value="COMPLETED" className="bg-[#050A14]">منتهي (COMPLETED)</option>
                    <option value="CANCELLED" className="bg-[#050A14]">ملغى (CANCELLED)</option>
                  </select>

                  {/* Occasion Dropdown */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/25 text-xs text-white focus:outline-none focus:border-[#D4AF85] transition"
                  >
                    <option value="ALL" className="bg-[#050A14]">جميع المناسبات</option>
                    <option value="katbketab" className="bg-[#050A14]">عقد قران</option>
                    <option value="3aza" className="bg-[#050A14]">مجلس عزاء</option>
                  </select>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#D4AF85] absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث بالاسم أو الكود أو الهاتف..."
                      className="pr-9 pl-3 py-2 rounded-xl bg-white/[0.08] border border-white/25 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF85] transition w-56 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              {loadingBookings ? (
                <div className="py-16 text-center text-xs text-[#8EA3BF]">
                  جاري تحميل الحجوزات من الخادم...
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#8EA3BF] bg-white/[0.02] rounded-2xl border border-white/10">
                  لا توجد نتائج تطابق معايير البحث والتصفية.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/15 text-[#8EA3BF] font-bold">
                        <th className="py-3 px-3">كود الحجز</th>
                        <th className="py-3 px-3">صاحب الحجز</th>
                        <th className="py-3 px-3">الرقم المدني والهاتف</th>
                        <th className="py-3 px-3">المناسبة</th>
                        <th className="py-3 px-3">تاريخ الفعالية</th>
                        <th className="py-3 px-3">الساعات والمبلغ</th>
                        <th className="py-3 px-3">الحالة</th>
                        <th className="py-3 px-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.04] transition">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#FFE8B8]">
                            {b.code}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-white">
                            {b.fullName}
                          </td>
                          <td className="py-3.5 px-3 text-[#DCE6F2]">
                            <span className="block font-mono text-[11px]">{b.nationalId}</span>
                            <span className="block font-mono text-[11px] text-[#8EA3BF] dir-ltr text-right">{b.phone}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#FFF2D2]">
                              {b.bookingType === "katbketab" ? "عقد قران" : "عزاء"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-white">
                            {b.eventDate}
                          </td>
                          <td className="py-3.5 px-3 text-[#DCE6F2]">
                            <span>{b.startHour}:00 - {b.endHour}:00 ({b.durationHours} س)</span>
                            <span className="block font-bold text-[#FFE8B8]">{b.totalAmount} {b.currency || "ر.ع"}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            {renderStatusBadge(b.status)}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedBookingModal(b)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                title="عرض السند والتفاصيل"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
                                title="حذف الحجز"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: HALL SETTINGS & BUFFER CONFIGURATION */}
        {adminSection === "HALL_SETTINGS" && (
          <div className="max-w-3xl mx-auto bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-6">
            <div className="border-b border-white/15 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#FFF2D2] flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#D4AF85]" />
                <span>إعدادات القاعة وتوقيت التجهيز والاستراحة (Buffer Hours)</span>
              </h2>
              <p className="text-xs text-[#8EA3BF] mt-1">
                تحديد مواعيد العمل اليومية للمجلس، سعة الحضور، سعر الساعة، وفاصل التجهيز التلقائي لضمان عدم تداخل المناسبات.
              </p>
            </div>

            <form onSubmit={handleSaveHall} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    اسم القاعة *
                  </label>
                  <input
                    type="text"
                    required
                    value={hallForm.name}
                    onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    السعة الاستيعابية (فرد) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={hallForm.capacity}
                    onChange={(e) => setHallForm({ ...hallForm, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    سعر حجز الساعة (ر.ع) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.5"
                    value={hallForm.hourlyRate}
                    onChange={(e) => setHallForm({ ...hallForm, hourlyRate: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                </div>

                {/* Buffer Hours (Turnaround buffer time) */}
                <div>
                  <label className="block text-xs font-bold text-[#FFE8B8] mb-1.5 flex items-center justify-between">
                    <span>فاصل التجهيز والاستراحة (Buffer Hours) *</span>
                    <span className="text-[10px] text-[#D4AF85]">تلقائي قبل وبعد الحجز</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={5}
                    value={hallForm.bufferHours}
                    onChange={(e) => setHallForm({ ...hallForm, bufferHours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#D4AF85]/10 border border-[#D4AF85]/40 text-[#FFF2D2] font-bold text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                  />
                  <p className="text-[10px] text-[#8EA3BF] mt-1">
                    مثال: إذا كانت القيمة 1 ساعة، فإن حجز من 6 إلى 9 مساءً يمنع أي حجز آخر بين 5-6 م (تجهيز قبلي) وبين 9-10 م (تنظيف واستراحة بعدية).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    ساعة بدء فتح المجلس يومياً (نظام 24 ساعة) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={23}
                    value={hallForm.openHour}
                    onChange={(e) => setHallForm({ ...hallForm, openHour: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                  <span className="text-[10px] text-[#8EA3BF]">مثال: 13 تعني الواحدة ظهراً</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    ساعة إغلاق المجلس يومياً (نظام 24 ساعة) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={24}
                    value={hallForm.closeHour}
                    onChange={(e) => setHallForm({ ...hallForm, closeHour: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                  <span className="text-[10px] text-[#8EA3BF]">مثال: 24 تعني منتصف الليل</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                  الوصف والملاحظات
                </label>
                <textarea
                  rows={3}
                  value={hallForm.description}
                  onChange={(e) => setHallForm({ ...hallForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingHall}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-sm shadow-lg hover:scale-[1.01] active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {savingHall ? "جاري حفظ التعديلات..." : "حفظ إعدادات القاعة وتحديث النظام"}
              </button>
            </form>
          </div>
        )}

        {/* SECTION 3: BLACKOUT SLOTS MANAGEMENT */}
        {adminSection === "BLACKOUTS" && (
          <div className="space-y-8">
            {/* Create Blackout Box */}
            <div className="max-w-3xl mx-auto bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-5">
              <div className="border-b border-white/15 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFF2D2] flex items-center gap-2">
                  <Ban className="w-6 h-6 text-red-400" />
                  <span>تسجيل فترة إغلاق أو صيانة جديدة (Blackout Slot)</span>
                </h2>
                <p className="text-xs text-[#8EA3BF] mt-1">
                  حجب يوم أو ساعات معينة من الحجز العام بسبب الصيانة، النظافة، أو المناسبات الرسمية.
                </p>
              </div>

              <form onSubmit={handleCreateBlackout} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                      تاريخ الإغلاق *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBlackoutForm.blackoutDate}
                      onChange={(e) => setNewBlackoutForm({ ...newBlackoutForm, blackoutDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                      ساعة البدء (اختياري)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={newBlackoutForm.startHour}
                      onChange={(e) => setNewBlackoutForm({ ...newBlackoutForm, startHour: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                      ساعة الانتهاء (اختياري)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={newBlackoutForm.endHour}
                      onChange={(e) => setNewBlackoutForm({ ...newBlackoutForm, endHour: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                    سبب الإغلاق أو الصيانة *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlackoutForm.reason}
                    onChange={(e) => setNewBlackoutForm({ ...newBlackoutForm, reason: e.target.value })}
                    placeholder="مثال: غسيل السجاد، صيانة نظام التكييف المركزي، إجازة رسمية..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingBlackout}
                  className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {creatingBlackout ? "جاري التسجيل..." : "تأكيد إغلاق الفترة وحجبها من الحجز"}
                </button>
              </form>
            </div>

            {/* Existing Blackouts List */}
            <div className="bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-4">
              <h3 className="text-lg font-bold text-[#FFF2D2]">
                فترات الإغلاق المسجلة حالياً ({blackouts.length})
              </h3>

              {loadingBlackouts ? (
                <div className="py-8 text-center text-xs text-[#8EA3BF]">
                  جاري تحميل فترات الإغلاق...
                </div>
              ) : blackouts.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8EA3BF] bg-white/[0.02] rounded-2xl border border-white/10">
                  لا توجد فترات إغلاق مسجلة حالياً. جميع التواريخ مفتوحة حسب التوقيت المعتمد.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {blackouts.map((bo) => (
                    <div
                      key={bo.id}
                      className="p-4 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-red-300 text-sm">
                            {bo.blackoutDate}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30">
                            من {bo.startHour || 0}:00 إلى {bo.endHour || 24}:00
                          </span>
                        </div>
                        <p className="text-xs text-[#DCE6F2]">{bo.reason || "إغلاق مبرمج"}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteBlackout(bo.id)}
                        className="p-2 rounded-xl bg-red-950/50 hover:bg-red-900/70 text-red-300 border border-red-500/30 transition cursor-pointer shrink-0"
                        title="إلغاء الإغلاق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: View Voucher / Full Details */}
        {selectedBookingModal && (
          <div
            onClick={() => setSelectedBookingModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-right space-y-5"
            >
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center border-b border-white/15 pb-4">
                <span className="text-xs font-bold px-3 py-1 bg-[#D4AF85]/20 text-[#FFE8B8] rounded-full border border-[#D4AF85]/40 inline-block mb-2">
                  سند حجز رسمي — جامع الحق والمجلس العام
                </span>
                <h3 className="text-2xl font-black text-[#FFF2D2] font-mono">
                  {selectedBookingModal.code}
                </h3>
                <div className="mt-2">{renderStatusBadge(selectedBookingModal.status)}</div>
              </div>

              <div className="bg-white/[0.05] border border-white/15 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">اسم صاحب الحجز:</span>
                  <span className="font-bold text-white">{selectedBookingModal.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">الرقم المدني:</span>
                  <span className="font-bold text-white font-mono">{selectedBookingModal.nationalId}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">رقم الهاتف:</span>
                  <span className="font-bold text-white font-mono dir-ltr">{selectedBookingModal.phone}</span>
                </div>
                {selectedBookingModal.secondaryPhone && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-[#8EA3BF]">هاتف إضافي:</span>
                    <span className="font-bold text-white font-mono dir-ltr">{selectedBookingModal.secondaryPhone}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">البريد الإلكتروني:</span>
                  <span className="font-bold text-white font-mono dir-ltr">{selectedBookingModal.email}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">نوع المناسبة:</span>
                  <span className="font-bold text-[#FFF2D2]">
                    {selectedBookingModal.bookingType === "katbketab" ? "عقد قران" : "عزاء"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">تاريخ الفعالية:</span>
                  <span className="font-bold text-white font-mono">{selectedBookingModal.eventDate}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">الساعات المحجوزة:</span>
                  <span className="font-bold text-white">
                    من {selectedBookingModal.startHour}:00 حتى {selectedBookingModal.endHour}:00 ({selectedBookingModal.durationHours} ساعات)
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">فترة التجهيز المطبقة (Buffer):</span>
                  <span className="font-bold text-[#FFE8B8]">
                    {selectedBookingModal.appliedBufferHours || 1} ساعة قبل وبعد الحجز
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#8EA3BF]">إجمالي المبلغ:</span>
                  <span className="font-bold text-[#FFE8B8] font-mono text-sm">
                    {selectedBookingModal.totalAmount} {selectedBookingModal.currency || "ر.ع"}
                  </span>
                </div>
                {selectedBookingModal.paypalOrderId && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-[#8EA3BF]">رقم عملية PayPal:</span>
                    <span className="font-bold text-emerald-300 font-mono text-[11px] dir-ltr">
                      {selectedBookingModal.paypalOrderId}
                    </span>
                  </div>
                )}
                {selectedBookingModal.notes && (
                  <div className="pt-1">
                    <span className="text-[#8EA3BF] block mb-1">الملاحظات:</span>
                    <p className="text-white bg-black/30 p-2.5 rounded-xl border border-white/10">
                      {selectedBookingModal.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Status change in modal */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(selectedBookingModal.id, "CONFIRMED")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBookingModal.id, "COMPLETED")}
                    className="px-3 py-1.5 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 text-xs font-bold border border-slate-500/30 transition cursor-pointer"
                  >
                    إكمال
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBookingModal.id, "CANCELLED")}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF85] to-[#FFE8B8] text-[#0A1628] font-bold text-xs transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#0A1628]" />
                  <span>طباعة السند</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
