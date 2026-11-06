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
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  getHalls,
  getHallAvailability,
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
  if (h === 0 || h === 24) return "12:00 منتصف الليل";
  if (h === 12) return "12:00 ظهراً";
  const hour12 = h > 12 ? h - 12 : h;
  const period = h >= 12 ? (h >= 17 ? "مساءً" : (h >= 15 ? "عصراً" : "ظهراً")) : (h >= 4 ? "صباحاً" : "ليلاً");
  return `${String(hour12).padStart(2, "0")}:00 ${period}`;
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
    openHour: 13,
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

  // Start Hour and End Hour range selector
  const [startHour, setStartHour] = useState<number>(18);
  const [endHour, setEndHour] = useState<number>(22);

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

  // Load URL query params
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

  // Fetch active halls from backend
  useEffect(() => {
    getHalls()
      .then((halls) => {
        if (halls && halls.length > 0) {
          const primary = halls[0];
          setActiveHall(primary);
          if (primary.openHour !== undefined && primary.closeHour !== undefined) {
            setStartHour(Math.max(primary.openHour, 18));
            setEndHour(Math.min(primary.closeHour, 22));
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load halls, using default hall configuration", err);
      });
  }, []);

  // Fetch availability for current month & hall
  useEffect(() => {
    if (!activeHall?.id) return;
    getHallAvailability(activeHall.id, currentYear, currentMonth)
      .then((res) => {
        setMonthAvailability(res);
      })
      .catch((err) => {
        console.warn("Could not load availability:", err);
      });
  }, [activeHall?.id, currentYear, currentMonth]);

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

  // Availability lookup for each day
  const daysAvailabilityMap = useMemo(() => {
    const map = new Map<number, DayAvailabilityResponse>();
    if (monthAvailability?.days) {
      monthAvailability.days.forEach((d) => {
        map.set(d.dayNumber, d);
      });
    }
    return map;
  }, [monthAvailability]);

  // Selected Day's availability
  const selectedDayAvailability = useMemo(() => {
    return daysAvailabilityMap.get(selectedDay);
  }, [daysAvailabilityMap, selectedDay]);

  // Dynamic calculation of duration and price
  const durationHours = Math.max(0, endHour - startHour);
  const totalPrice = durationHours * (activeHall.hourlyRate || 25);
  const durationText =
    durationHours === 1
      ? "ساعة واحدة"
      : durationHours === 2
      ? "ساعتان"
      : `${durationHours} ساعات`;

  // Start hour options within hall limits
  const startHourOptions = useMemo(() => {
    const open = activeHall.openHour !== undefined ? activeHall.openHour : 13;
    const close = activeHall.closeHour !== undefined ? activeHall.closeHour : 24;
    const opts: number[] = [];
    for (let h = open; h < close; h++) {
      opts.push(h);
    }
    return opts;
  }, [activeHall.openHour, activeHall.closeHour]);

  // End hour options (strictly > startHour)
  const endHourOptions = useMemo(() => {
    const close = activeHall.closeHour !== undefined ? activeHall.closeHour : 24;
    const opts: number[] = [];
    for (let h = startHour + 1; h <= close; h++) {
      opts.push(h);
    }
    return opts;
  }, [startHour, activeHall.closeHour]);

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

    const eventDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

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
            <span className="relative z-10">حجز عزاء (دار العزاء)</span>
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
                  {pendingInitiation.booking.hallName} • {bookingType === "katbketab" ? "عقد قران" : "عزاء"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">التاريخ والوقت:</span>
                <span className="font-bold text-white">
                  {pendingInitiation.booking.eventDate} (من {pendingInitiation.booking.startHour}:00 حتى {pendingInitiation.booking.endHour}:00)
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
                <span className="font-bold text-white font-mono">{confirmedBooking.eventDate}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#8EA3BF]">الساعات المحجوزة:</span>
                <span className="font-bold text-white">
                  من {confirmedBooking.startHour}:00 حتى {confirmedBooking.endHour}:00 ({confirmedBooking.durationHours} ساعات)
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
              <div className="lg:col-span-7">
                <div
                  data-glass-card="true"
                  className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.45)] text-[#FAF7F0] relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                        <span className="text-[#FFE8B8] font-mono font-black ml-2">1.</span>
                        <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent">
                          اختر تاريخ المناسبة من التقويم
                        </span>
                      </h2>
                      <p className="text-xs text-[#DCE6F2] mt-0.5">
                        اضغط على اليوم المطلوب لتحديده والاطلاع على فترات الحجز المتاحة
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

                  {/* Day Buttons with backend live availability status */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayOffset }).map((_, i) => (
                      <div key={`offset-${i}`} className="h-10 sm:h-12" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayData = daysAvailabilityMap.get(day);
                      const isFullyBooked = dayData?.status === "FULLY_BOOKED";
                      const isPartiallyBooked = dayData?.status === "PARTIALLY_BOOKED";
                      const isSelected = selectedDay === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isFullyBooked}
                          onClick={() => setSelectedDay(day)}
                          onMouseMove={handleButtonMouseMove}
                          className={`relative group overflow-hidden h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-br from-[#D4AF85]/55 via-white/30 to-[#122849]/70 border-2 border-[#FFF0C8] text-[#FFF9E6] shadow-lg scale-105 z-10"
                              : isFullyBooked
                              ? "bg-black/40 text-white/30 cursor-not-allowed line-through border border-white/5"
                              : isPartiallyBooked
                              ? "bg-amber-400/[0.15] text-[#FFF3D6] border border-amber-300/40 hover:bg-amber-400/[0.25]"
                              : "bg-white/[0.08] hover:bg-white/[0.2] text-white border border-white/20"
                          }`}
                        >
                          <span className="relative z-10">{day}</span>
                          {isPartiallyBooked && !isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1.5 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-white/15 text-xs text-[#DCE6F2]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D4AF85] to-[#1E447B] border border-white" />
                      <span className="text-[#FFF2D2] font-semibold">المحدد ({selectedDay} {currentMonthName})</span>
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

              {/* Step 2 & Step 3: Proper Start Hour -> End Hour Range Selector with Buffer Notice */}
              <div className="lg:col-span-5 space-y-8">
                {/* Step 2: Proper Start Hour -> End Hour Range Selector */}
                <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                      <span className="text-[#FFE8B8] font-mono font-black ml-2">2.</span>
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black">
                        تحديد فترة وساعات الحجز
                      </span>
                    </h2>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#D4AF85]/20 text-[#FFE8B8] border border-[#D4AF85]/30">
                      {activeHall.hourlyRate} {activeHall.currency || "ر.ع"} / ساعة
                    </span>
                  </div>

                  {/* Start Hour -> End Hour Range Selectors */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                        وقت بدء الفعالية *
                      </label>
                      <select
                        value={startHour}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setStartHour(val);
                          if (endHour <= val) {
                            setEndHour(Math.min(activeHall.closeHour || 24, val + 2));
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                      >
                        {startHourOptions.map((h) => (
                          <option key={h} value={h} className="bg-[#050A14]">
                            {formatHourLabel(h)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#DCE6F2] mb-1.5">
                        وقت انتهاء الفعالية *
                      </label>
                      <select
                        value={endHour}
                        onChange={(e) => setEndHour(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.08] border border-white/25 text-white text-xs focus:outline-none focus:border-[#D4AF85] transition"
                      >
                        {endHourOptions.map((h) => (
                          <option key={h} value={h} className="bg-[#050A14]">
                            {formatHourLabel(h)}
                          </option>
                        ))}
                      </select>
                    </div>
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

                  {/* Dynamic Price Calculation */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] text-[#8EA3BF]">إجمالي مدة الحجز:</span>
                      <span className="text-sm font-bold text-white">
                        {durationText} (من {formatHourLabel(startHour)} إلى {formatHourLabel(endHour)})
                      </span>
                    </div>
                    <div className="text-left">
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
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black">
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
                      ساعات الاستقبال: من {activeHall.openHour}:00 حتى {activeHall.closeHour}:00
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
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black">
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
                        {bookingType === "katbketab" ? "عقد قران" : "عزاء"} • اليوم {selectedDay} من {currentMonthName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>الساعات المحجوزة:</span>
                      <span className="font-bold text-[#FFE8B8]">
                        من {formatHourLabel(startHour)} إلى {formatHourLabel(endHour)} ({durationText})
                      </span>
                    </div>
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
