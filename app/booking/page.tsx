"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MajlisShaderBackground from "@/components/MajlisShaderBackground";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Info,
  ChevronRight,
  ChevronLeft,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Sparkles,
  Camera,
  Maximize2,
  X,
  CreditCard,
  Printer,
  AlertCircle,
  Sun,
} from "lucide-react";
import {
  getHalls,
  getHallAvailability,
  getPrayerTimes,
  createBooking,
  capturePayPalOrder,
  getStoredUser,
  HallResponse,
  HourlyAvailabilityResponse,
  BookingResponse,
  BookingInitiationResponse,
  DayAvailabilityResponse,
} from "@/lib/api";

function formatHourLabel(h: number): string {
  if (h === 0) return "12:00 منتصف الليل (بداية اليوم)";
  if (h === 24) return "12:00 منتصف الليل (نهاية اليوم)";
  if (h === 12) return "12:00 ظهراً";
  const hour12 = h > 12 ? h - 12 : h;
  const period = h >= 12 ? (h >= 17 ? "مساءً" : h >= 15 ? "عصراً" : "ظهراً") : h >= 4 ? "صباحاً" : "ليلاً";
  return `${String(hour12).padStart(2, "0")}:00 ${period}`;
}

function formatShortHour(h: number): string {
  if (h === 0 || h === 24) return "12:00 ص";
  if (h === 12) return "12:00 م";
  const hour12 = h > 12 ? h - 12 : h;
  const period = h >= 12 ? "م" : "ص";
  return `${String(hour12).padStart(2, "0")}:00 ${period}`;
}

interface SelectedDateItem {
  year: number;
  month: number;
  day: number;
  iso: string;
  label: string;
}

export default function BookingPage() {
  const [bookingType, setBookingType] = useState<"katbketab" | "3aza">("katbketab");
  const [activeHall, setActiveHall] = useState<HallResponse>({
    id: 1,
    name: "قاعة المجلس العام",
    slug: "main-majlis-hall",
    description: "قاعة المجلس العام مجهزة بالكامل لكافة مناسبات عقد القران ومجالس العزاء",
    capacity: 500,
    hourlyRate: 25,
    currency: "ر.ع",
    bufferHours: 1,
    openHour: 0,
    closeHour: 24,
    featuresJson: "[]",
    isActive: true,
    mediaList: [],
  });

  // Calendar year and month navigation
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(11); // 1-12
  const [selectedDay, setSelectedDay] = useState<number>(6);
  const [monthAvailability, setMonthAvailability] = useState<HourlyAvailabilityResponse | null>(null);
  const [nextMonthAvailability, setNextMonthAvailability] = useState<HourlyAvailabilityResponse | null>(null);

  // Maghrib cutoff for 3aza (default 18 = 06:00 PM)
  const [maghribHour, setMaghribHour] = useState<number>(18);
  const [maghribTimeStr, setMaghribTimeStr] = useState<string>("06:05 مساءً");

  // Interactive Hour Grid range selector (startHour..endHour)
  const [startHour, setStartHour] = useState<number>(18);
  const [endHour, setEndHour] = useState<number>(22);
  const [isPickingEndHour, setIsPickingEndHour] = useState<boolean>(false);

  // Gallery
  const [galleryImages] = useState([
    {
      id: "1",
      src: "/majlis-entrance.jpg",
      title: "مدخل وبوابة مجلس جامع الحق الرئيسية",
      subtitle: "الواجهة المعمارية الإسلامية الفاخرة والأعمدة الرخامية",
    },
    {
      id: "2",
      src: "/majlis-interior.jpg",
      title: "قاعة المجلس العام والجدار التذكاري",
      subtitle: "اللوحات التذكارية والجلسة الملكية الفاخرة",
    },
    {
      id: "3",
      src: "/majlis-hall.jpg",
      title: "بهو القاعة والإنارة والزخارف",
      subtitle: "الأسقف المزخرفة والتجهيزات الفندقية الكاملة",
    },
    {
      id: "4",
      src: "/majlis-courtyard.jpg",
      title: "الساحة الخارجية ومرافق جامع الحق",
      subtitle: "الساحة الرحبة والمرافق الخارجية المجهزة لراحة الزوار",
    },
    {
      id: "5",
      src: "/majlis-ablution.jpg",
      title: "ميضأة ومرافق الجامع الحديثة",
      subtitle: "أرقى تشطيبات الرخام والمرافق الصحية فائقة النظافة",
    },
  ]);
  const [showGallery, setShowGallery] = useState(true);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  // Client form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [notes, setNotes] = useState("");

  // Booking Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingInitiation, setPendingInitiation] = useState<BookingInitiationResponse | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);
  const [isCapturingPayment, setIsCapturingPayment] = useState(false);

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  const currentMonthName = `${monthNames[currentMonth - 1]} ${currentYear}`;

  // Load URL query params & stored user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type === "3aza" || type === "katbketab") {
        setBookingType(type);
      }
    }
    const user = getStoredUser();
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, []);

  // Fetch prayer times to get Maghrib time accurately
  useEffect(() => {
    getPrayerTimes()
      .then((pt) => {
        if (pt?.maghrib) {
          const clean = pt.maghrib.trim().split(" ")[0];
          const parts = clean.split(":");
          const h = parseInt(parts[0], 10);
          const m = parts.length > 1 ? parseInt(parts[1], 10) : 0;
          if (!isNaN(h) && h >= 16 && h <= 20) {
            setMaghribHour(h);
            const h12 = h > 12 ? h - 12 : h;
            setMaghribTimeStr(`${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} مساءً`);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch active halls from backend
  useEffect(() => {
    getHalls()
      .then((halls) => {
        if (halls && halls.length > 0) {
          const primary = halls[0];
          setActiveHall({
            ...primary,
            openHour: 0,
            closeHour: 24,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load halls, using default hall configuration", err);
      });
  }, []);

  // Fetch availability for current month & next month (for 3-day 3aza rollover across month end)
  useEffect(() => {
    if (!activeHall?.id) return;
    getHallAvailability(activeHall.id, currentYear, currentMonth)
      .then((res) => {
        setMonthAvailability(res);
        if (res?.maghribHour && res.maghribHour >= 16 && res.maghribHour <= 20) {
          setMaghribHour(res.maghribHour);
        }
      })
      .catch((err) => {
        console.warn("Could not load availability:", err);
      });

    const nextM = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextY = currentMonth === 12 ? currentYear + 1 : currentYear;
    getHallAvailability(activeHall.id, nextY, nextM)
      .then((res) => setNextMonthAvailability(res))
      .catch(() => setNextMonthAvailability(null));
  }, [activeHall?.id, currentYear, currentMonth]);

  // Calendar calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 0).getDate();
  }, [currentYear, currentMonth]);

  const startDayOffset = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1).getDay();
  }, [currentYear, currentMonth]);

  // Availability lookup by YYYY-MM-DD across current & next month
  const availabilityByIsoDate = useMemo(() => {
    const map = new Map<string, DayAvailabilityResponse>();
    const addDays = (avail: HourlyAvailabilityResponse | null) => {
      if (!avail?.days) return;
      avail.days.forEach((d) => {
        const iso = d.date || `${avail.year}-${String(avail.month).padStart(2, "0")}-${String(d.dayNumber).padStart(2, "0")}`;
        map.set(iso, d);
      });
    };
    addDays(monthAvailability);
    addDays(nextMonthAvailability);
    return map;
  }, [monthAvailability, nextMonthAvailability]);

  // Selected Dates: 1 day for katbketab, 3 consecutive days at once for 3aza
  const daysCount = bookingType === "3aza" ? 3 : 1;

  const selectedDates = useMemo<SelectedDateItem[]>(() => {
    const list: SelectedDateItem[] = [];
    for (let i = 0; i < daysCount; i++) {
      const dt = new Date(currentYear, currentMonth - 1, selectedDay + i);
      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({
        year: y,
        month: m,
        day: d,
        iso,
        label: `${d} ${monthNames[m - 1]} ${y}`,
      });
    }
    return list;
  }, [currentYear, currentMonth, selectedDay, daysCount]);

  // Allowed hour range based on bookingType:
  // - katbketab: full 24 hours (0 to 24, slots 0..23)
  // - 3aza: only until Maghrib time (0 to maghribHour, slots 0..maghribHour-1)
  const maxAllowedEndHour = bookingType === "3aza" ? maghribHour : 24;

  // Compute status of each hour (0 .. maxAllowedEndHour - 1) across all selectedDates
  const visibleHourSlots = useMemo(() => {
    const slots: {
      hour: number;
      status: "AVAILABLE" | "BOOKED" | "BUFFER" | "BLACKOUT";
    }[] = [];

    for (let h = 0; h < maxAllowedEndHour; h++) {
      let combinedStatus: "AVAILABLE" | "BOOKED" | "BUFFER" | "BLACKOUT" = "AVAILABLE";

      for (const sd of selectedDates) {
        const dayAvail = availabilityByIsoDate.get(sd.iso);
        if (!dayAvail) continue;
        if (dayAvail.status === "FULLY_BOOKED" && (!dayAvail.hours || dayAvail.hours.length === 0)) {
          combinedStatus = "BLACKOUT";
          break;
        }
        const slotObj = dayAvail.hours?.find((s) => s.hour === h);
        if (slotObj && slotObj.status !== "AVAILABLE") {
          if (slotObj.status === "BOOKED") {
            combinedStatus = "BOOKED";
            break;
          } else if (slotObj.status === "BLACKOUT") {
            combinedStatus = "BLACKOUT";
            break;
          } else if (slotObj.status === "BUFFER") {
            combinedStatus = "BUFFER";
          }
        }
      }

      slots.push({ hour: h, status: combinedStatus });
    }
    return slots;
  }, [maxAllowedEndHour, selectedDates, availabilityByIsoDate]);

  // Helper to check if a range [s, e) is completely available
  const isRangeAvailable = (s: number, e: number): boolean => {
    if (s < 0 || e > maxAllowedEndHour || s >= e) return false;
    for (let h = s; h < e; h++) {
      const slot = visibleHourSlots.find((item) => item.hour === h);
      if (!slot || slot.status !== "AVAILABLE") return false;
    }
    return true;
  };

  // Auto-adjust startHour & endHour when switching bookingType or selectedDay if current selection is invalid
  useEffect(() => {
    setIsPickingEndHour(false);
    if (isRangeAvailable(startHour, endHour)) {
      return;
    }

    // Preferred default window: 9:00 AM - 12:00 PM for 3aza, 6:00 PM - 10:00 PM for katbketab
    const prefStart = bookingType === "3aza" ? 9 : 18;
    const prefEnd = bookingType === "3aza" ? Math.min(12, maxAllowedEndHour) : 22;

    if (isRangeAvailable(prefStart, prefEnd)) {
      setStartHour(prefStart);
      setEndHour(prefEnd);
      return;
    }

    // Otherwise find first available slot
    const firstAvail = visibleHourSlots.find((s) => s.status === "AVAILABLE");
    if (firstAvail) {
      const s = firstAvail.hour;
      let e = s + 1;
      while (e < Math.min(s + 3, maxAllowedEndHour) && isRangeAvailable(s, e + 1)) {
        e++;
      }
      setStartHour(s);
      setEndHour(e);
    }
  }, [bookingType, maxAllowedEndHour, selectedDay, currentMonth, currentYear, visibleHourSlots]);

  // Handle clicking an hour tile in the interactive grid (works just like selecting dates)
  const handleHourTileClick = (clickedHour: number) => {
    const slot = visibleHourSlots.find((s) => s.hour === clickedHour);
    if (!slot || slot.status !== "AVAILABLE") return;

    setErrorMessage(null);

    if (!isPickingEndHour || clickedHour < startHour) {
      // First click (or clicked an earlier hour): start a new selection at clickedHour
      setStartHour(clickedHour);
      setEndHour(clickedHour + 1);
      setIsPickingEndHour(true);
      return;
    }

    if (clickedHour === startHour) {
      // Clicked same hour again: confirm 1-hour booking
      setStartHour(clickedHour);
      setEndHour(clickedHour + 1);
      setIsPickingEndHour(false);
      return;
    }

    // clickedHour > startHour: check if all hours in [startHour, clickedHour] are available
    if (isRangeAvailable(startHour, clickedHour + 1)) {
      setEndHour(clickedHour + 1);
      setIsPickingEndHour(false);
    } else {
      // Blocked slot in between -> start fresh selection at clickedHour
      setStartHour(clickedHour);
      setEndHour(clickedHour + 1);
      setIsPickingEndHour(true);
    }
  };

  // Helper to check if a calendar day `day` can be selected
  const getCalendarDayStatus = (day: number): "AVAILABLE" | "PARTIALLY_BOOKED" | "FULLY_BOOKED" => {
    const checkCount = bookingType === "3aza" ? 3 : 1;
    let anyPartial = false;

    for (let i = 0; i < checkCount; i++) {
      const dt = new Date(currentYear, currentMonth - 1, day + i);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      const dayData = availabilityByIsoDate.get(iso);
      if (!dayData) continue;

      const relevantHours = (dayData.hours || []).filter((h) => h.hour < maxAllowedEndHour);
      if (relevantHours.length > 0) {
        const availCount = relevantHours.filter((h) => h.status === "AVAILABLE").length;
        if (availCount === 0) return "FULLY_BOOKED";
        if (availCount < relevantHours.length) anyPartial = true;
      } else if (dayData.status === "FULLY_BOOKED") {
        return "FULLY_BOOKED";
      } else if (dayData.status === "PARTIALLY_BOOKED") {
        anyPartial = true;
      }
    }

    return anyPartial ? "PARTIALLY_BOOKED" : "AVAILABLE";
  };

  // Dynamic calculation of duration and price
  const dailyDurationHours = Math.max(0, endHour - startHour);
  const totalDurationHours = dailyDurationHours * daysCount;
  const totalPrice = totalDurationHours * (activeHall.hourlyRate || 25);

  const dailyDurationText =
    dailyDurationHours === 1
      ? "ساعة واحدة"
      : dailyDurationHours === 2
      ? "ساعتان"
      : `${dailyDurationHours} ساعات`;

  const selectedDateSummaryText =
    bookingType === "3aza" && selectedDates.length === 3
      ? `من ${selectedDates[0].label} إلى ${selectedDates[2].label} (3 أيام متتالية)`
      : `${selectedDates[0]?.label || ""}`;

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mx", `${x}px`);
    e.currentTarget.style.setProperty("--my", `${y}px`);
  };

  // Handle Booking Form Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !nationalId.trim() || !email.trim()) {
      setErrorMessage("يرجى ملء جميع الحقول الإلزامية المطلوبة.");
      return;
    }

    if (endHour <= startHour) {
      setErrorMessage("ساعة الانتهاء يجب أن تكون بعد ساعة البدء.");
      return;
    }

    if (bookingType === "3aza" && endHour > maghribHour) {
      setErrorMessage(`لا يمكن حجز مجلس عزاء بعد وقت أذان المغرب (${formatShortHour(maghribHour)}).`);
      return;
    }

    if (!isRangeAvailable(startHour, endHour)) {
      setErrorMessage("الفترة الزمنية المحددة تتضمن ساعات محجوزة أو غير متاحة، يرجى اختيار ساعات متاحة.");
      return;
    }

    const eventDate = selectedDates[0].iso;
    const endDate = selectedDates[selectedDates.length - 1].iso;

    try {
      setIsSubmitting(true);
      const res = await createBooking({
        hallId: activeHall.id,
        fullName: fullName.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim() || undefined,
        email: email.trim(),
        bookingType,
        eventDate,
        endDate,
        daysCount,
        startHour,
        endHour,
        notes: notes.trim() || undefined,
      });

      setPendingInitiation(res);
      window.scrollTo({ top: 150, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل تسجيل الحجز، يرجى مراجعة البيانات والمحاولة مجدداً.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Mock or Live PayPal capture
  const handleCapturePayPal = async () => {
    if (!pendingInitiation) return;
    try {
      setIsCapturingPayment(true);
      const confirmed = await capturePayPalOrder(pendingInitiation.paypalOrderId);
      setConfirmedBooking(confirmed);
      setPendingInitiation(null);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل تأكيد عملية الدفع عبر بايبال.";
      setErrorMessage(msg);
    } finally {
      setIsCapturingPayment(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#0B1220] overflow-x-hidden">
      <MajlisShaderBackground imageSrc="/majlis-hall.jpg" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24 w-full flex-1">
        {/* Toggle Occasion Type */}
        <div data-glass-card="true" className="glass-card max-w-md mx-auto grid grid-cols-2 gap-3 mb-10 sm:mb-14 p-1.5 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <button
            onClick={() => setBookingType("katbketab")}
            onMouseMove={handleButtonMouseMove}
            className={`relative group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              bookingType === "katbketab"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 backdrop-blur-xl border border-[#FFF0C8] text-[#FFF9E6] font-black shadow-lg scale-[1.02]"
                : "bg-white/[0.06] hover:bg-white/[0.16] border border-white/10 text-white/80"
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#D4AF85] relative z-10" />
            <span className="relative z-10">حجز عقد قران</span>
          </button>
          <button
            onClick={() => setBookingType("3aza")}
            onMouseMove={handleButtonMouseMove}
            className={`relative group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              bookingType === "3aza"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 backdrop-blur-xl border border-[#FFF0C8] text-[#FFF9E6] font-black shadow-lg scale-[1.02]"
                : "bg-white/[0.06] hover:bg-white/[0.16] border border-white/10 text-white/80"
            }`}
          >
            <Building2 className="w-4 h-4 text-[#D4AF85] relative z-10" />
            <span className="relative z-10">حجز عزاء (3 أيام)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP A: PayPal Payment Gateway Modal / Confirmation */}
        {pendingInitiation && (
          <div data-glass-card="true" className="glass-card max-w-2xl mx-auto bg-slate-950/40 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#D4AF85]/20 border-2 border-[#FFE8B8] text-[#FFE8B8] flex items-center justify-center mx-auto shadow-lg">
              <CreditCard className="w-8 h-8 text-[#FFE8B8]" />
            </div>

            <div>
              <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                بانتظار سداد رسوم الحجز (PayPal)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFF2D2] mt-3">
                تأكيد حجز المجلس عبر PayPal
              </h2>
              <p className="text-xs text-[#DCE6F2] mt-1">
                رقم الحجز المرجعي: <strong className="text-white font-mono">{pendingInitiation.booking.code}</strong>
              </p>
            </div>

            <div className="bg-white/[0.06] border border-white/20 rounded-2xl p-5 text-right text-xs space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">القاعة والمناسبة:</span>
                <span className="font-bold text-white">
                  {pendingInitiation.booking.hallName} • {bookingType === "katbketab" ? "عقد قران" : "مجلس عزاء (3 أيام)"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">التاريخ المحدد:</span>
                <span className="font-bold text-white">
                  {pendingInitiation.booking.endDate && pendingInitiation.booking.endDate !== pendingInitiation.booking.eventDate
                    ? `من ${pendingInitiation.booking.eventDate} إلى ${pendingInitiation.booking.endDate} (${pendingInitiation.booking.daysCount || 3} أيام)`
                    : pendingInitiation.booking.eventDate}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">التوقيت اليومي:</span>
                <span className="font-bold text-[#FFE8B8]">
                  من {formatShortHour(pendingInitiation.booking.startHour)} حتى {formatShortHour(pendingInitiation.booking.endHour)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">فاصل التجهيز المخصص تلقائياً:</span>
                <span className="font-bold text-[#FFE8B8]">
                  {pendingInitiation.booking.appliedBufferHours} ساعة قبل وبعد الحجز
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8EA3BF]">إجمالي الرسوم المستحقة:</span>
                <span className="font-black text-emerald-400 font-mono text-base">
                  {pendingInitiation.booking.totalAmount} {pendingInitiation.booking.currency || "ر.ع"}
                </span>
              </div>
            </div>

            {/* PayPal Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCapturePayPal}
                disabled={isCapturingPayment}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-sm shadow-[0_8px_25px_rgba(212,175,133,0.4)] hover:scale-[1.01] active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCapturingPayment ? (
                  <span>جاري تسجيل وتأكيد الدفع عبر PayPal...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-[#0A1628]" />
                    <span>سداد الرسوم وتأكيد الحجز فورياً (Sandbox Capture)</span>
                  </>
                )}
              </button>

              {pendingInitiation.approvalUrl && (
                <a
                  href={pendingInitiation.approvalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-bold transition"
                >
                  فتح بوابة الدفع عبر موقع PayPal المباشر ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* STEP B: CONFIRMED BOOKING VOUCHER (DAR-XXXXXX) */}
        {confirmedBooking && (
          <div data-glass-card="true" className="glass-card max-w-2xl mx-auto bg-slate-950/40 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="text-xs font-bold px-3.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                الحجز مؤكد ومسجل رسمياً (CONFIRMED)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFF2D2] mt-3">
                {confirmedBooking.bookingType === "katbketab"
                  ? "بارك الله لكما وبارك عليكما وجمع بينكما في خير"
                  : "عظم الله أجركم وأحسن عزاءكم ورحم ميتكم"}
              </h2>
              <p className="text-[#DCE6F2] text-xs sm:text-sm mt-1">
                تم اعتماد وتأكيد حجزكم في مجلس جامع الحق وتم إرسال تفاصيل السند إلى بريدك الإلكتروني:
                <strong className="block text-[#FFE8B8] font-mono text-sm mt-1 dir-ltr">{confirmedBooking.email}</strong>
              </p>
            </div>

            {/* Official Voucher Card */}
            <div className="bg-white/[0.06] border border-white/20 rounded-2xl p-6 text-right text-xs space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-white/15 pb-3">
                <div>
                  <span className="text-[#8EA3BF] block text-[10px]">كود السند المرجعي</span>
                  <span className="text-xl font-mono font-bold text-white">{confirmedBooking.code}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  الحالة: مؤكد CONFIRMED
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">اسم القاعة:</span>
                <span className="font-bold text-white">{confirmedBooking.hallName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">صاحب الحجز:</span>
                <span className="font-bold text-white">{confirmedBooking.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">الرقم المدني:</span>
                <span className="font-bold text-white font-mono">{confirmedBooking.nationalId}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">الهاتف:</span>
                <span className="font-bold text-white font-mono dir-ltr">{confirmedBooking.phone}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">تاريخ المناسبة:</span>
                <span className="font-bold text-white font-mono">
                  {confirmedBooking.endDate && confirmedBooking.endDate !== confirmedBooking.eventDate
                    ? `من ${confirmedBooking.eventDate} إلى ${confirmedBooking.endDate} (${confirmedBooking.daysCount || 3} أيام)`
                    : confirmedBooking.eventDate}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">الساعات المحجوزة يومياً:</span>
                <span className="font-bold text-white">
                  من {formatShortHour(confirmedBooking.startHour)} حتى {formatShortHour(confirmedBooking.endHour)} ({confirmedBooking.durationHours} ساعات يومياً)
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">فترة التجهيز المطبقة (Buffer):</span>
                <span className="font-bold text-[#FFE8B8]">
                  {confirmedBooking.appliedBufferHours} ساعة مخصصة تلقائياً قبل وبعد الحجز
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#8EA3BF]">المبلغ الإجمالي المدفوع:</span>
                <span className="font-black text-emerald-400 font-mono text-base">
                  {confirmedBooking.totalAmount} {confirmedBooking.currency || "ر.ع"}
                </span>
              </div>
            </div>

            {/* Print Voucher & Reset Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-95 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#0A1628]" />
                <span>طباعة / تحميل سند الحجز الرسمي</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setPendingInitiation(null);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-[#FFF2D2] border border-white/30 font-bold text-xs transition cursor-pointer"
              >
                تسجيل حجز جديد
              </button>
            </div>
          </div>
        )}

        {/* STEP C: ACTIVE RESERVATION WIZARD */}
        {!pendingInitiation && !confirmedBooking && (
          <div className="space-y-12 sm:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-10 xl:gap-14 items-start">
              {/* Step 1: Calendar Widget */}
              <div className="lg:col-span-6">
                <div
                  data-glass-card="true"
                  className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.45)] text-[#FAF7F0] relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                        <span className="text-[#FFE8B8] font-mono font-black ml-2">1.</span>
                        <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent inline-block pe-2 ps-1 py-0.5 leading-normal">
                          {bookingType === "3aza"
                            ? "اختر تاريخ بداية العزاء (٣ أيام متتالية)"
                            : "اختر تاريخ المناسبة من التقويم"}
                        </span>
                      </h2>
                      <p className="text-xs text-[#DCE6F2] mt-0.5">
                        {bookingType === "3aza"
                          ? "اضغط على اليوم الأول ليتم تحديد 3 أيام متتالية لمجلس العزاء تلقائياً"
                          : "اضغط على اليوم المطلوب لتحديده والاطلاع على الساعات المتاحة"}
                      </p>
                    </div>

                    {/* Month Controls */}
                    <div className="flex items-center gap-1.5 bg-white/[0.08] border border-white/20 rounded-xl px-2 py-1">
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
                        title="الشهر السابق"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-[#FFF2D2] px-3 min-w-[105px] text-center">
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
                        title="الشهر التالي"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3-Day Selection Banner for 3aza */}
                  {bookingType === "3aza" && (
                    <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-[#D4AF85]/15 border border-[#D4AF85]/40 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#FFF2D2] font-bold">
                        <CalendarIcon className="w-4 h-4 text-[#FFE8B8] shrink-0" />
                        <span>تحديد 3 أيام متتالية للعزاء:</span>
                      </div>
                      <span className="font-bold text-[#FFE8B8]">
                        {selectedDateSummaryText}
                      </span>
                    </div>
                  )}

                  {/* Weekday names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#FFE8B8] mb-3 py-2.5 bg-white/[0.06] rounded-xl">
                    <span>الأحد</span>
                    <span>الإثنين</span>
                    <span>الثلاثاء</span>
                    <span>الأربعاء</span>
                    <span>الخميس</span>
                    <span>الجمعة</span>
                    <span>السبت</span>
                  </div>

                  {/* Day Buttons with backend live availability status & 3-day selection highlight */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayOffset }).map((_, i) => (
                      <div key={`offset-${i}`} className="h-11 sm:h-12" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayStatus = getCalendarDayStatus(day);
                      const isFullyBooked = dayStatus === "FULLY_BOOKED";
                      const isPartiallyBooked = dayStatus === "PARTIALLY_BOOKED";

                      const selectedIdx = selectedDates.findIndex(
                        (sd) => sd.year === currentYear && sd.month === currentMonth && sd.day === day
                      );
                      const isSelected = selectedIdx !== -1;

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isFullyBooked}
                          onClick={() => setSelectedDay(day)}
                          onMouseMove={handleButtonMouseMove}
                          className={`relative group overflow-hidden h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-br from-[#D4AF85]/60 via-white/30 to-[#122849]/75 border-2 border-[#FFF0C8] text-[#FFF9E6] shadow-lg scale-105 z-10"
                              : isFullyBooked
                              ? "bg-black/40 text-white/30 cursor-not-allowed line-through border border-white/5"
                              : isPartiallyBooked
                              ? "bg-amber-400/[0.15] text-[#FFF3D6] border border-amber-300/40 hover:bg-amber-400/[0.25]"
                              : "bg-white/[0.08] hover:bg-white/[0.2] text-white border border-white/20"
                          }`}
                        >
                          <span className="relative z-10 leading-none">{day}</span>
                          {isSelected && bookingType === "3aza" && (
                            <span className="relative z-10 text-[9px] font-extrabold text-[#FFE8B8] mt-0.5 leading-none">
                              اليوم {selectedIdx + 1}
                            </span>
                          )}
                          {isPartiallyBooked && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1.5 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Spillover notice if Day 2 or Day 3 is in next month */}
                  {bookingType === "3aza" &&
                    selectedDates.some((sd) => sd.month !== currentMonth || sd.year !== currentYear) && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-[11px] text-[#FFE8B8] text-center">
                        يمتد الحجز إلى الشهر التالي:{" "}
                        {selectedDates.map((sd, idx) => `اليوم ${idx + 1} (${sd.label})`).join(" • ")}
                      </div>
                    )}

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-white/15 text-xs text-[#DCE6F2]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D4AF85] to-[#1E447B] border border-white" />
                      <span className="text-[#FFF2D2] font-semibold">
                        {bookingType === "3aza" ? "الأيام الـ 3 المحددة" : `المحدد (${selectedDay} ${currentMonthName})`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-white/20 border border-white/40" />
                      <span>متاح بالكامل</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span>متاح جزئياً</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-black/50 border border-white/20" />
                      <span className="text-white/40">محجوز / مغلق</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 & Step 3: Interactive Hour Tile Grid (Like Calendar) + Hall Overview */}
              <div className="lg:col-span-6 space-y-8">
                {/* Step 2: Interactive Hour Grid Selector */}
                <div
                  data-glass-card="true"
                  className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] relative overflow-hidden space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                        <span className="text-[#FFE8B8] font-mono font-black ml-2">2.</span>
                        <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black inline-block pe-2 ps-1 py-0.5 leading-normal">
                          اختر الساعات بنفس طريقة اختيار التاريخ
                        </span>
                      </h2>
                      <p className="text-xs text-[#DCE6F2] mt-0.5">
                        {isPickingEndHour
                          ? `تم تحديد البداية (${formatShortHour(startHour)}) — اضغط الآن على ساعة النهاية لتوسيع الفترة`
                          : "اضغط على ساعة البدء ثم اضغط على ساعة الانتهاء لتحديد الفترة المطلوبة"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#D4AF85]/20 text-[#FFE8B8] border border-[#D4AF85]/30">
                      {activeHall.hourlyRate} {activeHall.currency || "ر.ع"} / ساعة
                    </span>
                  </div>

                  {/* Mode Banner: 24 Hours for Katb Ketab vs Until Maghrib Only for 3aza */}
                  {bookingType === "3aza" ? (
                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs text-[#FFE8B8] flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>
                        مواعيد العزاء متاحة <strong>حتى أذان المغرب فقط ({maghribTimeStr})</strong> — لا يوجد عزاء بعد صلاة المغرب.
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 text-xs text-[#DCE6F2] flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#D4AF85] shrink-0" />
                      <span>
                        جميع ساعات اليوم (<strong>٢٤ ساعة</strong>) متاحة للاختيار المباشر لحجز عقد القران.
                      </span>
                    </div>
                  )}

                  {/* Interactive Hour Tiles Grid (matching the Calendar date picker) */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {visibleHourSlots.map(({ hour, status }) => {
                      const isAvailable = status === "AVAILABLE";
                      const isSelected = hour >= startHour && hour < endHour;
                      const isStart = hour === startHour;
                      const isEnd = hour === endHour - 1;
                      const isSingleHour = isStart && isEnd;

                      let subLabel = `إلى ${formatShortHour(hour + 1)}`;
                      if (!isAvailable) {
                        subLabel = status === "BUFFER" ? "تجهيز" : status === "BLACKOUT" ? "مغلق" : "محجوز";
                      } else if (isSelected) {
                        if (isSingleHour) {
                          subLabel = isPickingEndHour ? "نقطة البدء" : "ساعة واحدة";
                        } else if (isStart) {
                          subLabel = "وقت البدء";
                        } else if (isEnd) {
                          subLabel = "وقت الانتهاء";
                        } else {
                          subLabel = "ضمن الفترة";
                        }
                      } else if (bookingType === "3aza" && hour === maghribHour - 1) {
                        subLabel = "حتى المغرب";
                      }

                      return (
                        <button
                          key={hour}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleHourTileClick(hour)}
                          onMouseMove={handleButtonMouseMove}
                          className={`relative group overflow-hidden h-14 rounded-xl px-1.5 py-1.5 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-br from-[#D4AF85]/60 via-white/30 to-[#122849]/75 border-2 border-[#FFF0C8] text-[#FFF9E6] shadow-lg scale-[1.03] z-10"
                              : !isAvailable
                              ? status === "BUFFER"
                                ? "bg-amber-950/30 text-amber-300/40 cursor-not-allowed line-through border border-amber-500/20"
                                : "bg-black/40 text-white/30 cursor-not-allowed line-through border border-white/5"
                              : "bg-white/[0.08] hover:bg-white/[0.2] text-white border border-white/20"
                          }`}
                        >
                          <span className="relative z-10 text-xs font-black tracking-tight leading-tight">
                            {formatShortHour(hour)}
                          </span>
                          <span
                            className={`relative z-10 text-[9px] mt-0.5 leading-none font-bold ${
                              isSelected
                                ? "text-[#FFE8B8]"
                                : !isAvailable
                                ? "text-white/30"
                                : "text-[#8EA3BF]"
                            }`}
                          >
                            {subLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Turnaround Buffer Notice Requirement */}
                  <div className="p-3.5 rounded-2xl bg-[#D4AF85]/10 border border-[#D4AF85]/30 text-xs text-[#FFE8B8] space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Sparkles className="w-4 h-4 text-[#FFE8B8] shrink-0" />
                      <span>تجهيز واستراحة تلقائية (Buffer):</span>
                    </div>
                    <p className="text-[11px] text-[#DCE6F2] leading-relaxed">
                      ملاحظة: يتم تخصيص وقت استراحة وفاصل تجهيز (بفر) تلقائي قبل وبعد الحجز لضمان النظافة والترتيب
                      ({activeHall.bufferHours || 1} ساعة تلقائياً).
                    </p>
                  </div>

                  {/* Dynamic Price & Duration Calculation */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="block text-[11px] text-[#8EA3BF]">
                        {bookingType === "3aza" ? "الفترة اليومية (لمدة 3 أيام متتالية):" : "إجمالي مدة الحجز:"}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white block">
                        {dailyDurationText} يومياً (من {formatShortHour(startHour)} إلى {formatShortHour(endHour)})
                      </span>
                      {bookingType === "3aza" && (
                        <span className="text-[11px] text-[#FFE8B8] font-semibold block">
                          إجمالي الساعات لـ 3 أيام: {totalDurationHours} ساعة ({selectedDateSummaryText})
                        </span>
                      )}
                    </div>
                    <div className="text-right sm:text-left shrink-0">
                      <span className="block text-[11px] text-[#8EA3BF]">إجمالي الرسوم:</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {totalPrice} {activeHall.currency || "ر.ع"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Hall Overview */}
                <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                      <span className="text-[#FFE8B8] font-mono font-black ml-2">3.</span>
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black inline-block pe-2 ps-1 py-0.5 leading-normal">
                        قاعة المجلس المعتمدة
                      </span>
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-[#FFE8B8] border border-white/20 font-bold">
                      تتسع حتى {activeHall.capacity} فرد
                    </span>
                  </div>

                  <p className="text-xs text-[#DCE6F2] leading-relaxed">
                    {activeHall.description || "قاعة المجلس العام مجهزة بأحدث وسائل التكييف، الصوتيات الرقمية، وشاشات العرض."}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <span className="text-[11px] text-[#FFE8B8]">
                      {bookingType === "3aza"
                        ? `مواعيد العزاء: متاح حتى أذان المغرب (${maghribTimeStr})`
                        : "ساعات الاستقبال لعقد القران: متاح ٢٤ ساعة"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGallery((prev) => !prev)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
                    >
                      {showGallery ? "إخفاء الصور" : "عرض صور القاعة"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {showGallery && (
              <div data-glass-card="true" className="w-full glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-[#FFF2D2] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#D4AF85]" />
                    <span>معرض صور جامع الحق والمجلس العام</span>
                  </h3>
                  <span className="text-xs text-[#8EA3BF]">اسحب أفقياً للتنقل بين الصور</span>
                </div>

                <div className="scrollport">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedLightboxImage(img.src)}
                      className="relative group shrink-0 w-72 sm:w-96 aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 hover:border-[#D4AF85] shadow-lg cursor-pointer transition hover:scale-[1.02]"
                    >
                      <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-sm font-bold text-white">{img.title}</span>
                        <span className="text-xs text-[#D4AF85] mt-1 flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>انقر للتكبير</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Client Info & Submit */}
            <div className="max-w-4xl mx-auto">
              <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] space-y-6">
                <div className="border-b border-white/15 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-sans flex items-center">
                      <span className="text-[#FFE8B8] font-mono font-black ml-2.5">4.</span>
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black inline-block pe-2 ps-1 py-0.5 leading-normal">
                        بيانات صاحب الحجز واعتماد الطلب
                      </span>
                    </h2>
                    <p className="text-xs text-[#8EA3BF] mt-1">
                      الخطوة النهائية لتسجيل الحجز والانتقال لبوابة السداد
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    الإجمالي: {totalPrice} {activeHall.currency || "ر.ع"}
                  </span>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                        الاسم الثلاثي أو الرباعي *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أدخل اسم صاحب الحجز"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                        الرقم المدني / الهوية الوطنية *
                      </label>
                      <input
                        type="text"
                        required
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="أدخل الرقم المدني"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                        البريد الإلكتروني (لاستلام السند والتأكيد) *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                        رقم الهاتف للتواصل *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="968XXXXXXXX"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                        رقم هاتف إضافي (اختياري)
                      </label>
                      <input
                        type="tel"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="رقم للتواصل الإضافي"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      {bookingType === "katbketab" ? "اسما العروسين وملاحظات الحفل" : "اسم المتوفى رحمه الله وملاحظات العزاء"}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        bookingType === "katbketab"
                          ? "مثال: اسم العروسين، طلب مأذون..."
                          : "مثال: المرحوم بإذن الله فلان الفلاني..."
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#FFE8B8] transition"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/20 text-xs text-[#DCE6F2] space-y-2">
                    <div className="flex justify-between">
                      <span>المناسبة وتاريخها:</span>
                      <span className="font-bold text-[#FFF2D2]">
                        {bookingType === "katbketab" ? "عقد قران" : "مجلس عزاء (3 أيام)"} • {selectedDateSummaryText}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>الساعات المحجوزة يومياً:</span>
                      <span className="font-bold text-[#FFE8B8]">
                        من {formatShortHour(startHour)} إلى {formatShortHour(endHour)} ({dailyDurationText} يومياً)
                      </span>
                    </div>
                    {bookingType === "3aza" && (
                      <div className="flex justify-between">
                        <span>إجمالي عدد الأيام والساعات:</span>
                        <span className="font-bold text-[#FFE8B8]">
                          3 أيام متتالية × {dailyDurationHours} ساعات = {totalDurationHours} ساعة
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>فترة التجهيز المخصصة (Buffer):</span>
                      <span className="font-bold text-[#FFE8B8]">
                        {activeHall.bufferHours || 1} ساعة قبل وبعد الحجز
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="font-bold">المبلغ المطلوب سداده:</span>
                      <span className="font-black text-emerald-400 text-sm font-mono">
                        {totalPrice} {activeHall.currency || "ر.ع"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseMove={handleButtonMouseMove}
                    className="relative group overflow-hidden w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF85]/90 via-[#FFE8B8]/95 to-[#C59B63]/90 text-[#0A1628] text-sm sm:text-base font-black border border-white shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "جاري تسجيل الحجز..." : "تأكيد وتسجيل الحجز ومتابعة الدفع عبر PayPal"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedLightboxImage(null)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedLightboxImage}
            alt="صورة مكبرة"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[82vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
