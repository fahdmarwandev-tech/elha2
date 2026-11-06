"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  HeartHandshake,
  Building2,
  Mail,
  CreditCard,
  Printer,
  AlertCircle,
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

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "3aza" | "katbketab";
}

function formatHourLabel(h: number): string {
  if (h === 0 || h === 24) return "12:00 منتصف الليل";
  if (h === 12) return "12:00 ظهراً";
  const hour12 = h > 12 ? h - 12 : h;
  const period = h >= 12 ? (h >= 17 ? "مساءً" : (h >= 15 ? "عصراً" : "ظهراً")) : (h >= 4 ? "صباحاً" : "ليلاً");
  return `${String(hour12).padStart(2, "0")}:00 ${period}`;
}

export default function QuickBookingModal({
  isOpen,
  onClose,
  initialType = "katbketab",
}: QuickBookingModalProps) {
  const [bookingType, setBookingType] = useState<"3aza" | "katbketab">(initialType);
  const [activeHall, setActiveHall] = useState<HallResponse>({
    id: 1,
    name: "قاعة المجلس العام",
    slug: "main-majlis-hall",
    description: "قاعة المجلس العام مجهزة بالكامل لعقد القران ومجالس العزاء",
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

  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(11);
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [monthAvailability, setMonthAvailability] = useState<HourlyAvailabilityResponse | null>(null);

  // Range selector
  const [startHour, setStartHour] = useState<number>(18);
  const [endHour, setEndHour] = useState<number>(22);

  // Inputs
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingInitiation, setPendingInitiation] = useState<BookingInitiationResponse | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);

  useEffect(() => {
    setBookingType(initialType);
    const user = getStoredUser();
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [initialType, isOpen]);

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
        console.warn("Could not load halls for modal:", err);
      });
  }, []);

  useEffect(() => {
    if (!activeHall?.id || !isOpen) return;
    getHallAvailability(activeHall.id, currentYear, currentMonth)
      .then((res) => setMonthAvailability(res))
      .catch((err) => console.warn("Could not load availability for modal:", err));
  }, [activeHall?.id, currentYear, currentMonth, isOpen]);

  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth, 0).getDate(), [currentYear, currentMonth]);
  const startDayOffset = useMemo(() => new Date(currentYear, currentMonth - 1, 1).getDay(), [currentYear, currentMonth]);
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const currentMonthName = `${monthNames[currentMonth - 1]} ${currentYear}`;

  const daysAvailabilityMap = useMemo(() => {
    const map = new Map<number, DayAvailabilityResponse>();
    if (monthAvailability?.days) {
      monthAvailability.days.forEach((d) => map.set(d.dayNumber, d));
    }
    return map;
  }, [monthAvailability]);

  const durationHours = Math.max(0, endHour - startHour);
  const totalPrice = durationHours * (activeHall.hourlyRate || 25);
  const durationText = durationHours === 1 ? "ساعة واحدة" : durationHours === 2 ? "ساعتان" : `${durationHours} ساعات`;

  const startHourOptions = useMemo(() => {
    const open = activeHall.openHour !== undefined ? activeHall.openHour : 13;
    const close = activeHall.closeHour !== undefined ? activeHall.closeHour : 24;
    const opts: number[] = [];
    for (let h = open; h < close; h++) opts.push(h);
    return opts;
  }, [activeHall.openHour, activeHall.closeHour]);

  const endHourOptions = useMemo(() => {
    const close = activeHall.closeHour !== undefined ? activeHall.closeHour : 24;
    const opts: number[] = [];
    for (let h = startHour + 1; h <= close; h++) opts.push(h);
    return opts;
  }, [startHour, activeHall.closeHour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !nationalId.trim() || !email.trim()) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة.");
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
        email: email.trim(),
        bookingType,
        eventDate,
        startHour,
        endHour,
        notes: notes.trim() || undefined,
      });
      setPendingInitiation(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل إنشاء الحجز، يرجى المحاولة لاحقاً.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapturePayPal = async () => {
    if (!pendingInitiation) return;
    try {
      setIsCapturing(true);
      const confirmed = await capturePayPalOrder(pendingInitiation.paypalOrderId);
      setConfirmedBooking(confirmed);
      setPendingInitiation(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل إتمام الدفع عبر بايبال.";
      setErrorMessage(msg);
    } finally {
      setIsCapturing(false);
    }
  };

  const resetForm = () => {
    setPendingInitiation(null);
    setConfirmedBooking(null);
    setFullName("");
    setNationalId("");
    setEmail("");
    setPhone("");
    setNotes("");
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 text-right">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FAF7F0] p-5 sm:p-7">
        <button
          onClick={resetForm}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 rounded-full bg-[#050C18] hover:bg-[#122849] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PayPal Capture */}
        {pendingInitiation ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#D4AF85]/20 border-2 border-[#FFE8B8] flex items-center justify-center mx-auto text-[#FFE8B8]">
              <CreditCard className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#FFF2D2]">
              سداد رسوم الحجز عبر PayPal
            </h3>
            <p className="text-xs text-[#8A9BB3]">
              رقم الحجز: <strong className="text-white font-mono">{pendingInitiation.booking.code}</strong>
            </p>

            <div className="bg-[#050C18] border border-[#1E3A63] rounded-2xl p-4 text-xs space-y-2 max-w-md mx-auto text-right">
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">التاريخ والساعات:</span>
                <span className="font-bold text-white">
                  {pendingInitiation.booking.eventDate} (من {pendingInitiation.booking.startHour}:00 إلى {pendingInitiation.booking.endHour}:00)
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">فاصل التجهيز (Buffer):</span>
                <span className="font-bold text-[#FFE8B8]">
                  {pendingInitiation.booking.appliedBufferHours} ساعة قبل وبعد الحجز
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#8A9BB3]">المبلغ المطلوب:</span>
                <span className="font-black text-emerald-400 text-base font-mono">
                  {pendingInitiation.booking.totalAmount} {pendingInitiation.booking.currency || "ر.ع"}
                </span>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-2.5">
              <button
                onClick={handleCapturePayPal}
                disabled={isCapturing}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-xs shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCapturing ? "جاري تسجيل وتأكيد الدفع..." : "سداد الرسوم وتأكيد الحجز (Sandbox Capture)"}
              </button>

              {pendingInitiation.approvalUrl && (
                <a
                  href={pendingInitiation.approvalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2.5 rounded-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-bold transition"
                >
                  الدفع عبر موقع PayPal المباشر ↗
                </a>
              )}
            </div>
          </div>
        ) : confirmedBooking ? (
          /* STEP 2: Confirmed Voucher */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#FFF2D2]">
              {confirmedBooking.bookingType === "katbketab" ? "مبارك عقد القران مقدماً" : "عظم الله أجركم وأحسن عزاءكم"}
            </h3>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block">
              سند حجز رسمي معتمد (CONFIRMED)
            </span>

            <div className="bg-[#050C18] border border-[#1E3A63] rounded-2xl p-4 text-xs space-y-2 max-w-md mx-auto text-right">
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">رقم السند:</span>
                <span className="font-mono font-bold text-white">{confirmedBooking.code}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">صاحب الحجز:</span>
                <span className="font-bold text-white">{confirmedBooking.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">الرقم المدني:</span>
                <span className="font-bold text-white font-mono">{confirmedBooking.nationalId}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">الموعد:</span>
                <span className="font-bold text-white">
                  {confirmedBooking.eventDate} (من {confirmedBooking.startHour}:00 إلى {confirmedBooking.endHour}:00)
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">فاصل التجهيز المخصص:</span>
                <span className="font-bold text-[#FFE8B8]">
                  {confirmedBooking.appliedBufferHours} ساعة قبل وبعد الحجز
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#8A9BB3]">المبلغ المدفوع:</span>
                <span className="font-black text-emerald-400 font-mono text-sm">
                  {confirmedBooking.totalAmount} {confirmedBooking.currency || "ر.ع"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF85] to-[#FFE8B8] text-[#0A1628] font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#0A1628]" />
                <span>طباعة سند الحجز</span>
              </button>
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] font-bold text-xs text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          /* STEP 3: Initial Booking Wizard Form */
          <div>
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-black font-sans text-[#FFF2D2]">
                حجز موعد {bookingType === "3aza" ? "عزاء" : "عقد قران"}
              </h2>
              <p className="text-xs text-[#8A9BB3] mt-0.5">
                اختر اليوم والفترة المطلوبة وسيتم تخصيص فاصل التجهيز التلقائي قبل وبعد الحجز.
              </p>
            </div>

            {/* Occasion Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#050C18] border border-[#1E3A63] rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => setBookingType("3aza")}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  bookingType === "3aza"
                    ? "bg-gradient-to-r from-[#D4AF85]/40 to-[#1E447B]/60 border border-[#D4AF85] text-[#FFF2D2]"
                    : "text-[#8A9BB3] hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4 text-[#D4AF85]" />
                <span>حجز عزاء</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingType("katbketab")}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  bookingType === "katbketab"
                    ? "bg-gradient-to-r from-[#D4AF85]/40 to-[#1E447B]/60 border border-[#D4AF85] text-[#FFF2D2]"
                    : "text-[#8A9BB3] hover:text-white"
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-[#D4AF85]" />
                <span>حجز عقد قران</span>
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 text-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">{currentMonthName}</span>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
                      else setCurrentMonth((m) => m - 1);
                    }}
                    className="p-1 rounded bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1); }
                      else setCurrentMonth((m) => m + 1);
                    }}
                    className="p-1 rounded bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-1.5 py-1 bg-slate-50 rounded">
                <span>أحد</span><span>إثنين</span><span>ثلاثاء</span><span>أربعاء</span><span>خميس</span><span>جمعة</span><span>سبت</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`offset-${i}`} className="h-7" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayData = daysAvailabilityMap.get(day);
                  const isFullyBooked = dayData?.status === "FULLY_BOOKED";
                  const isPartially = dayData?.status === "PARTIALLY_BOOKED";
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isFullyBooked}
                      onClick={() => setSelectedDay(day)}
                      className={`h-7 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center relative cursor-pointer ${
                        isSelected
                          ? "bg-[#1E447B] border border-[#D4AF85] text-[#FFF2D2] shadow-sm font-black scale-105 z-10"
                          : isFullyBooked
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                          : isPartially
                          ? "bg-amber-50 text-slate-800 border border-amber-200"
                          : "bg-white text-slate-800 border border-slate-200 hover:border-[#1E447B]"
                      }`}
                    >
                      <span>{day}</span>
                      {isPartially && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Hour -> End Hour Selector with Buffer Notice */}
            <div className="bg-[#050C18] border border-[#1E3A63] rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFE8B8] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D4AF85]" />
                  <span>تحديد ساعات الفعالية:</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  {durationText} • {totalPrice} {activeHall.currency || "ر.ع"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    من الساعة:
                  </label>
                  <select
                    value={startHour}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStartHour(val);
                      if (endHour <= val) setEndHour(Math.min(activeHall.closeHour || 24, val + 2));
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#091527] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  >
                    {startHourOptions.map((h) => (
                      <option key={h} value={h} className="bg-[#050A14]">{formatHourLabel(h)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    إلى الساعة:
                  </label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#091527] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  >
                    {endHourOptions.map((h) => (
                      <option key={h} value={h} className="bg-[#050A14]">{formatHourLabel(h)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buffer Notice Requirement */}
              <div className="p-2.5 rounded-xl bg-[#D4AF85]/10 border border-[#D4AF85]/30 text-[11px] text-[#FFE8B8] leading-relaxed">
                ملاحظة: يتم تخصيص وقت استراحة وفاصل تجهيز (بفر) تلقائي قبل وبعد الحجز لضمان النظافة والترتيب
                ({activeHall.bufferHours || 1} ساعة تلقائياً).
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="اسم صاحب الحجز"
                    className="w-full px-3 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    الرقم المدني *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="الرقم المدني"
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="968XXXXXXXX"
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8EA3BF] mb-1">
                  ملاحظات أو أسماء العروسين / المتوفى
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات الحجز..."
                  className="w-full px-3 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-white focus:outline-none focus:border-[#D4AF85]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "جاري تسجيل الحجز..." : `تأكيد الحجز والدفع (${totalPrice} ${activeHall.currency || "ر.ع"})`}
                </button>
                <Link
                  href="/booking"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#8EA3BF] text-xs font-bold text-center border border-[#1E3A63] whitespace-nowrap transition"
                >
                  التقويم الكامل
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
