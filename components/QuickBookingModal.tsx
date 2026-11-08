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

function formatShortHourLabel(h: number): string {
  if (h === 0 || h === 24) return "12:00 ص";
  if (h === 12) return "12:00 م";
  const hour12 = h > 12 ? h - 12 : h;
  const suffix = h >= 12 ? "م" : "ص";
  return `${hour12}:00 ${suffix}`;
}

function addDaysToIsoDate(isoDate: string, daysToAdd: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d + daysToAdd);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
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
    openHour: 0,
    closeHour: 24,
    featuresJson: "[]",
    isActive: true,
    mediaList: [],
  });

  const [today] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  });

  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());
  const [monthAvailability, setMonthAvailability] = useState<HourlyAvailabilityResponse | null>(null);
  const [nextMonthAvailability, setNextMonthAvailability] = useState<HourlyAvailabilityResponse | null>(null);

  const isPastDay = (day: number, month = currentMonth, year = currentYear): boolean => {
    if (year < today.year) return true;
    if (year > today.year) return false;
    if (month < today.month) return true;
    if (month > today.month) return false;
    return day < today.day;
  };

  // Range selector
  const [startHour, setStartHour] = useState<number>(16);
  const [endHour, setEndHour] = useState<number>(18);
  const [selectingRangeStep, setSelectingRangeStep] = useState<"START" | "END">("START");

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
        }
      })
      .catch((err) => {
        console.warn("Could not load halls for modal:", err);
      });
  }, []);

  const refreshModalAvailability = React.useCallback(() => {
    if (!activeHall?.id || !isOpen) return;
    getHallAvailability(activeHall.id, currentYear, currentMonth)
      .then((res) => setMonthAvailability(res))
      .catch((err) => console.warn("Could not load availability for modal:", err));

    const nextM = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextY = currentMonth === 12 ? currentYear + 1 : currentYear;
    getHallAvailability(activeHall.id, nextY, nextM)
      .then((res) => setNextMonthAvailability(res))
      .catch(() => setNextMonthAvailability(null));
  }, [activeHall?.id, currentYear, currentMonth, isOpen]);

  useEffect(() => {
    refreshModalAvailability();
  }, [refreshModalAvailability, bookingType]);

  const dhuhrHour = monthAvailability?.dhuhrHour ?? 12;
  const maghribHour = monthAvailability?.maghribHour ?? 18;
  const effectiveOpenHour = bookingType === "3aza" ? dhuhrHour : 0;
  const effectiveCloseHour = bookingType === "3aza" ? maghribHour : 24;
  const daysCount = bookingType === "3aza" ? 3 : 1;

  useEffect(() => {
    if (bookingType === "3aza") {
      setStartHour(dhuhrHour);
      setEndHour(maghribHour);
    } else {
      if (startHour < 0 || endHour > 24 || startHour >= endHour) {
        setStartHour(18);
        setEndHour(22);
      }
    }
    setSelectingRangeStep("START");
  }, [bookingType, dhuhrHour, maghribHour]);

  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth, 0).getDate(), [currentYear, currentMonth]);
  const startDayOffset = useMemo(() => new Date(currentYear, currentMonth - 1, 1).getDay(), [currentYear, currentMonth]);
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const currentMonthName = `${monthNames[currentMonth - 1]} ${currentYear}`;

  useEffect(() => {
    if (selectedDay > daysInMonth || isPastDay(selectedDay, currentMonth, currentYear)) {
      for (let d = 1; d <= daysInMonth; d++) {
        if (!isPastDay(d, currentMonth, currentYear)) {
          setSelectedDay(d);
          return;
        }
      }
    }
  }, [currentYear, currentMonth, daysInMonth]);

  const daysAvailabilityMap = useMemo(() => {
    const map = new Map<number, DayAvailabilityResponse>();
    if (monthAvailability?.days) {
      monthAvailability.days.forEach((d) => map.set(d.dayNumber, d));
    }
    return map;
  }, [monthAvailability]);

  const allLoadedDaysByDate = useMemo(() => {
    const map = new Map<string, DayAvailabilityResponse>();
    monthAvailability?.days?.forEach((d) => map.set(d.date, d));
    nextMonthAvailability?.days?.forEach((d) => map.set(d.date, d));
    return map;
  }, [monthAvailability, nextMonthAvailability]);

  const selectedIsoDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
  const selectedIsoDates = useMemo(() => {
    if (bookingType === "3aza") {
      return [
        selectedIsoDate,
        addDaysToIsoDate(selectedIsoDate, 1),
        addDaysToIsoDate(selectedIsoDate, 2),
      ];
    }
    return [selectedIsoDate];
  }, [bookingType, selectedIsoDate]);

  const selectedEndIsoDate = selectedIsoDates[selectedIsoDates.length - 1];

  const combinedSlotsMap = useMemo(() => {
    const map = new Map<number, { status: string; label?: string }>();
    for (let h = 0; h < 24; h++) {
      let combinedStatus = "AVAILABLE";
      let combinedLabel = "متاح";
      for (const iso of selectedIsoDates) {
        const dData = allLoadedDaysByDate.get(iso);
        const slot = dData?.hours?.find((s) => s.hour === h);
        if (slot) {
          if (slot.status === "BOOKED" || slot.status === "BLACKOUT") {
            combinedStatus = slot.status;
            combinedLabel = "محجوز";
            break;
          } else if (slot.status === "BUFFER" && combinedStatus === "AVAILABLE") {
            combinedStatus = "BUFFER";
            combinedLabel = "فترة تجهيز";
          }
        }
      }
      map.set(h, { status: combinedStatus, label: combinedLabel });
    }
    return map;
  }, [selectedIsoDates, allLoadedDaysByDate]);

  const visibleHourBlocks = useMemo(() => {
    const blocks: number[] = [];
    for (let h = effectiveOpenHour; h < effectiveCloseHour; h++) {
      blocks.push(h);
    }
    return blocks;
  }, [effectiveOpenHour, effectiveCloseHour]);

  const isCurrentRangeAvailable = useMemo(() => {
    if (startHour < effectiveOpenHour || endHour > effectiveCloseHour || startHour >= endHour) {
      return false;
    }
    for (let h = startHour; h < endHour; h++) {
      const st = combinedSlotsMap.get(h)?.status;
      if (st && st !== "AVAILABLE") return false;
    }
    return true;
  }, [startHour, endHour, effectiveOpenHour, effectiveCloseHour, combinedSlotsMap]);

  const handleHourBlockClick = (h: number) => {
    const slotInfo = combinedSlotsMap.get(h);
    if (slotInfo && slotInfo.status !== "AVAILABLE") return;

    if (bookingType === "3aza") {
      setStartHour(dhuhrHour);
      setEndHour(maghribHour);
      setSelectingRangeStep("START");
      return;
    }

    if (selectingRangeStep === "START") {
      setStartHour(h);
      setEndHour(Math.min(effectiveCloseHour, h + 1));
      setSelectingRangeStep("END");
    } else {
      if (h < startHour) {
        setStartHour(h);
        setEndHour(Math.min(effectiveCloseHour, h + 1));
        setSelectingRangeStep("END");
      } else {
        let hasConflict = false;
        for (let checkH = startHour; checkH <= h; checkH++) {
          const st = combinedSlotsMap.get(checkH)?.status;
          if (st && st !== "AVAILABLE") {
            hasConflict = true;
            break;
          }
        }
        if (hasConflict) {
          setStartHour(h);
          setEndHour(Math.min(effectiveCloseHour, h + 1));
          setSelectingRangeStep("END");
        } else {
          setEndHour(h + 1);
          setSelectingRangeStep("START");
        }
      }
    }
  };

  const durationHours = Math.max(0, endHour - startHour);
  const totalPrice = durationHours * daysCount * (activeHall.hourlyRate || 25);
  const durationText = durationHours === 1 ? "ساعة واحدة" : durationHours === 2 ? "ساعتان" : `${durationHours} ساعات`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !nationalId.trim() || !email.trim()) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (!isCurrentRangeAvailable) {
      setErrorMessage(
        "القاعة محجوزة بالفعل في هذه الفترة (توجد قاعة واحدة فقط مشتركة لعقد القران والعزاء) — يرجى اختيار تاريخ أو وقت متاح."
      );
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
        endDate: selectedEndIsoDate,
        daysCount,
        startHour,
        endHour,
        notes: notes.trim() || undefined,
      });
      setPendingInitiation(res);
      refreshModalAvailability();
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
      refreshModalAvailability();
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
                  {pendingInitiation.booking.endDate && pendingInitiation.booking.endDate !== pendingInitiation.booking.eventDate
                    ? `من ${pendingInitiation.booking.eventDate} إلى ${pendingInitiation.booking.endDate} (3 أيام)`
                    : pendingInitiation.booking.eventDate}{" "}
                  (من {pendingInitiation.booking.startHour}:00 إلى {pendingInitiation.booking.endHour}:00)
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
                  {confirmedBooking.endDate && confirmedBooking.endDate !== confirmedBooking.eventDate
                    ? `من ${confirmedBooking.eventDate} إلى ${confirmedBooking.endDate} (3 أيام)`
                    : confirmedBooking.eventDate}{" "}
                  (من {confirmedBooking.startHour}:00 إلى {confirmedBooking.endHour}:00)
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
                حجز موعد {bookingType === "3aza" ? "عزاء (3 أيام متتالية)" : "عقد قران (يوم واحد)"}
              </h2>
              <p className="text-xs text-[#8A9BB3] mt-0.5">
                {bookingType === "3aza"
                  ? `اختر تاريخ البدء ليتم تحديد 3 أيام تلقائياً، والوقت متاح حتى أذان المغرب (${formatHourLabel(maghribHour)}).`
                  : "اختر اليوم والفترة المطلوبة على مدار 24 ساعة وسيتم تخصيص فاصل التجهيز التلقائي."}
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
                <span>حجز عزاء (3 أيام)</span>
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
                <span>حجز عقد قران (24 ساعة)</span>
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 text-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-900">{currentMonthName}</span>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    disabled={currentYear < today.year || (currentYear === today.year && currentMonth <= today.month)}
                    onClick={() => {
                      if (currentYear < today.year || (currentYear === today.year && currentMonth <= today.month)) return;
                      if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
                      else setCurrentMonth((m) => m - 1);
                    }}
                    className={`p-1 rounded bg-white shadow-xs ${
                      currentYear < today.year || (currentYear === today.year && currentMonth <= today.month)
                        ? "text-slate-300 cursor-not-allowed"
                        : "hover:bg-slate-50 text-slate-700 cursor-pointer"
                    }`}
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
                  <div key={`offset-${i}`} className="h-8" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isoForCell = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayData = daysAvailabilityMap.get(day);
                  const isPast = isPastDay(day, currentMonth, currentYear);
                  const isFullyBooked = dayData?.status === "FULLY_BOOKED";
                  const isPartially = dayData?.status === "PARTIALLY_BOOKED";

                  let isRangeBlocked = isPast || isFullyBooked;
                  if (!isPast && bookingType === "3aza") {
                    for (let offset = 0; offset < 3; offset++) {
                      const dCheck = allLoadedDaysByDate.get(addDaysToIsoDate(isoForCell, offset));
                      if (!dCheck) continue;
                      if (dCheck.status === "FULLY_BOOKED") {
                        isRangeBlocked = true;
                        break;
                      }
                      const dhuhrMaghribSlots = (dCheck.hours || []).filter(
                        (h) => h.hour >= dhuhrHour && h.hour < maghribHour
                      );
                      if (dhuhrMaghribSlots.some((h) => h.status !== "AVAILABLE")) {
                        isRangeBlocked = true;
                        break;
                      }
                    }
                  }

                  const selectedIdx = !isRangeBlocked ? selectedIsoDates.indexOf(isoForCell) : -1;
                  const isSelected = selectedIdx !== -1;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isRangeBlocked}
                      onClick={() => {
                        if (!isRangeBlocked) setSelectedDay(day);
                      }}
                      className={`h-8 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center relative ${
                        isSelected
                          ? "bg-[#1E447B] border border-[#D4AF85] text-[#FFF2D2] shadow-sm font-black scale-105 z-10 cursor-pointer"
                          : isPast
                          ? "bg-slate-200/70 text-slate-400 border border-slate-200 cursor-not-allowed select-none"
                          : isRangeBlocked
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                          : isPartially
                          ? "bg-amber-50 text-slate-800 border border-amber-200 cursor-pointer"
                          : "bg-white text-slate-800 border border-slate-200 hover:border-[#1E447B] cursor-pointer"
                      }`}
                    >
                      <span>{day}</span>
                      {isSelected && bookingType === "3aza" && (
                        <span className="text-[7px] leading-none text-[#FFE8B8]">
                          يوم {selectedIdx + 1}
                        </span>
                      )}
                      {isPartially && !isSelected && !isPast && (
                        <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {bookingType === "3aza" && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700 font-bold">
                  <span>فترة العزاء المختارة (3 أيام):</span>
                  <span className="text-[#1E447B] font-mono">
                    من {selectedIsoDate} إلى {selectedEndIsoDate}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Hour Tile Grid Selector (Like Date Picker) */}
            <div className="bg-[#050C18] border border-[#1E3A63] rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#FFE8B8] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D4AF85]" />
                  <span>
                    {bookingType === "3aza"
                      ? `توقيت العزاء (من الظهر ${formatShortHourLabel(dhuhrHour)} إلى المغرب ${formatShortHourLabel(maghribHour)}):`
                      : "اختر ساعات عقد القران (متاح 24 ساعة):"}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  من {formatShortHourLabel(startHour)} إلى {formatShortHourLabel(endHour)} ({durationText}
                  {bookingType === "3aza" ? " × 3 أيام" : ""}) • {totalPrice} {activeHall.currency || "ر.ع"}
                </span>
              </div>

              <p className="text-[11px] text-[#8EA3BF]">
                {bookingType === "3aza"
                  ? "مجلس العزاء يُحجز من وقت صلاة الظهر حتى أذان المغرب لمدة 3 أيام متتالية:"
                  : selectingRangeStep === "START"
                  ? "اضغط على ساعة البدء ثم اضغط على ساعة الانتهاء لتحديد الفترة:"
                  : `تم اختيار البدء (${formatShortHourLabel(startHour)}) — اضغط الآن على ساعة الانتهاء:`}
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {visibleHourBlocks.map((h) => {
                  const slotInfo = combinedSlotsMap.get(h);
                  const status = slotInfo?.status || "AVAILABLE";
                  const isUnavailable = status !== "AVAILABLE";
                  const isSelected = h >= startHour && h < endHour;
                  const isStart = h === startHour;
                  const isEnd = h === endHour - 1;

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => handleHourBlockClick(h)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold transition flex flex-col items-center justify-center border cursor-pointer ${
                        isSelected
                          ? "bg-[#1E447B] border-[#D4AF85] text-[#FFF2D2] shadow-sm scale-[1.02]"
                          : status === "BOOKED" || status === "BLACKOUT"
                          ? "bg-red-950/30 border-red-500/30 text-red-300/50 cursor-not-allowed line-through"
                          : status === "BUFFER"
                          ? "bg-amber-950/30 border-amber-500/30 text-amber-300/60 cursor-not-allowed"
                          : "bg-[#091527] hover:bg-[#122849] border-[#1E3A63] text-white"
                      }`}
                    >
                      <span className="dir-ltr">{formatShortHourLabel(h)}</span>
                      <span className="text-[9px] opacity-75">
                        {isStart && isEnd
                          ? "ساعة واحدة"
                          : isStart
                          ? "البدء"
                          : isEnd
                          ? "الانتهاء"
                          : isSelected
                          ? "ضمن الفترة"
                          : status === "BUFFER"
                          ? "تجهيز"
                          : status !== "AVAILABLE"
                          ? "محجوز"
                          : `← ${formatShortHourLabel(h + 1)}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {bookingType === "3aza" && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed">
                  تنبيه هام: حجز العزاء يشمل <strong>3 أيام متتالية</strong> تلقائياً، ولا يُسمح بحجز العزاء بعد وقت صلاة المغرب ({formatHourLabel(maghribHour)}).
                </div>
              )}

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
