"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

const HOUR_BLOCKS = [
  { value: "13:00", nextHour: "14:00", timeOnly: "01:00", period: "ظهراً", fullLabel: "01:00 ظهراً", endLabel: "02:00 ظهراً" },
  { value: "14:00", nextHour: "15:00", timeOnly: "02:00", period: "ظهراً", fullLabel: "02:00 ظهراً", endLabel: "03:00 عصراً" },
  { value: "15:00", nextHour: "16:00", timeOnly: "03:00", period: "عصراً", fullLabel: "03:00 عصراً", endLabel: "04:00 عصراً" },
  { value: "16:00", nextHour: "17:00", timeOnly: "04:00", period: "عصراً", fullLabel: "04:00 عصراً", endLabel: "05:00 مساءً" },
  { value: "17:00", nextHour: "18:00", timeOnly: "05:00", period: "مساءً", fullLabel: "05:00 مساءً", endLabel: "06:00 مساءً" },
  { value: "18:00", nextHour: "19:00", timeOnly: "06:00", period: "مساءً", fullLabel: "06:00 مساءً", endLabel: "07:00 مساءً" },
  { value: "19:00", nextHour: "20:00", timeOnly: "07:00", period: "مساءً", fullLabel: "07:00 مساءً", endLabel: "08:00 مساءً" },
  { value: "20:00", nextHour: "21:00", timeOnly: "08:00", period: "مساءً", fullLabel: "08:00 مساءً", endLabel: "09:00 مساءً" },
  { value: "21:00", nextHour: "22:00", timeOnly: "09:00", period: "مساءً", fullLabel: "09:00 مساءً", endLabel: "10:00 مساءً" },
  { value: "22:00", nextHour: "23:00", timeOnly: "10:00", period: "مساءً", fullLabel: "10:00 مساءً", endLabel: "11:00 مساءً" },
  { value: "23:00", nextHour: "24:00", timeOnly: "11:00", period: "ليلاً", fullLabel: "11:00 ليلاً", endLabel: "12:00 منتصف الليل" },
  { value: "24:00", nextHour: "01:00", timeOnly: "12:00", period: "ليلاً", fullLabel: "12:00 منتصف الليل", endLabel: "01:00 ص" },
];

export default function BookingPage() {
  const [bookingType, setBookingType] = useState<"katbketab" | "3aza">("katbketab");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type === "3aza" || type === "katbketab") {
        setBookingType(type);
      }
    }
  }, []);
  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [selectedHours, setSelectedHours] = useState<string[]>([
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ]);
  const [selectedHall, setSelectedHall] = useState<string>("قاعة المجلس العام");

  // صور الجامع والمجلس (تمت إضافة الصور الجديدة المرفوعة)
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

  const toggleHour = (val: string) => {
    setSelectedHours((prev) => {
      if (prev.includes(val)) {
        if (prev.length === 1) return prev; // Keep at least one hour
        return prev.filter((h) => h !== val).sort();
      } else {
        return [...prev, val].sort();
      }
    });
  };

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mx", `${x}px`);
    e.currentTarget.style.setProperty("--my", `${y}px`);
  };

  const sortedHours = [...selectedHours].sort();
  const count = sortedHours.length;
  const countText =
    count === 1 ? "ساعة واحدة" : count === 2 ? "ساعتان" : `${count} ساعات`;

  const earliest = sortedHours[0];
  const latest = sortedHours[sortedHours.length - 1];
  const earliestBlock = HOUR_BLOCKS.find((b) => b.value === earliest);
  const latestBlock = HOUR_BLOCKS.find((b) => b.value === latest);

  const isContiguous = sortedHours.every((val, idx) => {
    if (idx === 0) return true;
    const prevBlock = HOUR_BLOCKS.find((b) => b.value === sortedHours[idx - 1]);
    return prevBlock && prevBlock.nextHour === val;
  });

  const formattedTimeRange = isContiguous
    ? `من ${earliestBlock?.fullLabel || earliest} حتى ${latestBlock?.endLabel || latest}`
    : sortedHours.map((h) => HOUR_BLOCKS.find((b) => b.value === h)?.fullLabel || h).join(" ، ");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  const months = [
    { name: "أكتوبر 2026", daysInMonth: 31, startDayOffset: 4 },
    { name: "نوفمبر 2026", daysInMonth: 30, startDayOffset: 0 },
    { name: "ديسمبر 2026", daysInMonth: 31, startDayOffset: 2 },
  ];

  const currentMonth = months[currentMonthIndex];
  const bookedDays = [2, 6, 12, 19, 26];
  const partiallyBookedDays = [4, 10, 15, 23];

  const timeSlots = [
    {
      id: "عصر",
      title: "فترة العصر",
      time: "من 03:45 عصراً حتى 05:30 مساءً",
      desc: "مناسبة هادئة في أوقات النهار",
    },
    {
      id: "مغرب",
      title: "فترة المغرب",
      time: "من 06:00 مساءً حتى 07:30 مساءً",
      desc: "ما بين صلاتي المغرب والعشاء",
    },
    {
      id: "عشاء",
      title: "فترة العشاء والمساء",
      time: "من 08:00 مساءً حتى 11:30 ليلاً",
      desc: "الفترة الرئيسية للمناسبات الكبرى",
    },
  ];

  const hall = {
    id: "قاعة المجلس",
    name: "قاعة المجلس العام",
    capacity: "تتسع حتى 500 فرد",
    image: "/landing_last_frame.jpg",
    features: ["مدخل خاص مستقل", "تكييف مركزي متطور", "نظام صوت رقمي نقي", "شاشات عرض LED", "خدمة ضيافة وتجهيز"],
    suitability: "مجهزة بالكامل لكافة مناسبات عقد القران ومجالس العزاء",
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !nationalId.trim() || !email.trim()) return;
    const code = `DAR-${Math.floor(100000 + Math.random() * 900000)}`;
    setReservationCode(code);

    try {
      const monthNum = String(currentMonthIndex + 10).padStart(2, "0");
      const dayNum = String(selectedDay).padStart(2, "0");
      const newBooking = {
        id: `b_${Date.now()}`,
        code,
        fullName: fullName.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim(),
        email: email.trim(),
        bookingType,
        date: `2026-${monthNum}-${dayNum}`,
        monthIndex: currentMonthIndex,
        day: selectedDay,
        monthName: currentMonth.name,
        hours: selectedHours,
        timeFormatted: formattedTimeRange,
        hoursCountText: countText,
        hallName: selectedHall,
        notes: notes.trim(),
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      };
      const existingStr = typeof window !== "undefined" ? localStorage.getItem("game3_bookings") : null;
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem("game3_bookings", JSON.stringify([newBooking, ...existing]));
    } catch (err) {
      console.error("Failed to store booking:", err);
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#0B1220] overflow-x-hidden">
      {/* Interactive WebGL Shader Background with Majlis Hall photo */}
      <MajlisShaderBackground imageSrc="/majlis-hall.jpg" />

      <Navbar />

      {/* Main Reservation Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24 w-full flex-1">
        {/* Toggle Occasion Type (Liquid Glass) */}
        <div data-glass-card="true" className="glass-card max-w-md mx-auto grid grid-cols-2 gap-3 mb-12 sm:mb-16 p-1.5 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]">
          <button
            onClick={() => setBookingType("katbketab")}
            onMouseMove={handleButtonMouseMove}
            className={`relative group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              bookingType === "katbketab"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 backdrop-blur-xl border border-[#FFF0C8] text-[#FFF9E6] font-black shadow-[0_4px_20px_rgba(212,175,133,0.45),inset_0_1px_2px_rgba(255,255,255,0.7)] scale-[1.02]"
                : "bg-white/[0.06] hover:bg-white/[0.16] backdrop-blur-md border border-white/10 hover:border-white/30 text-white/80 hover:text-white"
            }`}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: "radial-gradient(circle 80px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.15) 50%, transparent 80%)",
              }}
            />
            <HeartHandshake className="w-4 h-4 text-[#D4AF85] relative z-10" />
            <span className="relative z-10">حجز عقد قران</span>
          </button>
          <button
            onClick={() => setBookingType("3aza")}
            onMouseMove={handleButtonMouseMove}
            className={`relative group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              bookingType === "3aza"
                ? "bg-gradient-to-r from-[#D4AF85]/40 via-white/20 to-[#1E447B]/60 backdrop-blur-xl border border-[#FFF0C8] text-[#FFF9E6] font-black shadow-[0_4px_20px_rgba(212,175,133,0.45),inset_0_1px_2px_rgba(255,255,255,0.7)] scale-[1.02]"
                : "bg-white/[0.06] hover:bg-white/[0.16] backdrop-blur-md border border-white/10 hover:border-white/30 text-white/80 hover:text-white"
            }`}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: "radial-gradient(circle 80px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.15) 50%, transparent 80%)",
              }}
            />
            <Building2 className="w-4 h-4 text-[#D4AF85] relative z-10" />
            <span className="relative z-10">حجز عزاء</span>
            <span className="relative z-10 text-[10px] hidden sm:inline text-[#D4AF85]/90">(دار التعازي)</span>
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State (Liquid Glass) */
          <div data-glass-card="true" className="glass-card max-w-2xl mx-auto bg-slate-950/35 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-white/[0.12] border-2 border-[#FFE8B8] text-[#FFE8B8] flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(212,175,133,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]">
              <CheckCircle2 className="w-10 h-10 text-[#FFE8B8]" />
            </div>

            <span className="text-xs font-bold px-3.5 py-1 bg-white/[0.1] text-[#FFE8B8] rounded-full border border-white/30 backdrop-blur-md">
              تم إرسال بريد التأكيد بنجاح
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-sans bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent mt-4 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {bookingType === "katbketab"
                ? "بارك الله لكما وبارك عليكما وجمع بينكما في خير"
                : "عظم الله أجركم ورحم ميتكم وألهمكم الصبر والسلوان"}
            </h2>

            <p className="text-[#DCE6F2] text-xs sm:text-sm leading-relaxed mb-6">
              تم تثبيت طلبك في جدول حجوزات المجلس وإرسال رسالة التأكيد وتفاصيل الحجز إلى بريدك الإلكتروني:
              <strong className="block text-[#FFE8B8] font-mono text-sm sm:text-base mt-2 dir-ltr">
                {email}
              </strong>
              كود الحجز المرجعي:
              <span className="inline-block text-xl font-mono font-bold text-white mr-1 mt-1 drop-shadow-sm">
                {reservationCode}
              </span>
            </p>

            {/* Summary Details */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-right text-xs space-y-3 mb-8 shadow-inner">
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#DCE6F2]">نوع المناسبة:</span>
                <span className="font-bold text-[#FFF2D2]">
                  {bookingType === "katbketab" ? "عقد قران" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#DCE6F2]">التاريخ المحدد:</span>
                <span className="font-bold text-white">
                  اليوم {selectedDay} من {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#DCE6F2]">الوقت والقاعة:</span>
                <span className="font-bold text-white">
                  {formattedTimeRange} ({countText}) • {selectedHall}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#DCE6F2]">صاحب الحجز:</span>
                <span className="font-bold text-white">
                  {fullName} ({phone})
                </span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#DCE6F2]">البريد الإلكتروني:</span>
                <span className="font-bold text-white font-mono dir-ltr">
                  {email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#DCE6F2]">الرقم المدني:</span>
                <span className="font-bold text-white font-mono">
                  {nationalId}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${email}`}
                onMouseMove={handleButtonMouseMove}
                className="relative group overflow-hidden w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF85]/85 via-[#FFE8B8]/90 to-[#C59B63]/85 text-[#0A1628] font-black text-xs flex items-center justify-center gap-2 border border-white shadow-[0_8px_25px_rgba(212,175,133,0.4)] transition"
              >
                <Mail className="w-4 h-4 text-[#0A1628] relative z-10" />
                <span className="relative z-10">فتح البريد الإلكتروني لمراجعة التأكيد</span>
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-[#FFF2D2] border border-white/30 font-bold text-xs backdrop-blur-md transition cursor-pointer"
              >
                تعديل أو حجز جديد
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Reservation Steps */
          <div className="space-y-12 sm:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-10 xl:gap-14 items-start">
              {/* Calendar Widget (Step 1) */}
              <div className="lg:col-span-7">
              {/* Step 1: Calendar Widget (Crystal-Clear Liquid Glass) */}
              <div
                data-glass-card="true"
                onMouseMove={handleButtonMouseMove}
                className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] text-[#FAF7F0] relative overflow-hidden"
              >
                {/* Top specular edge reflection */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                      <span className="text-[#FFE8B8] font-mono font-black ml-2 drop-shadow-[0_0_10px_rgba(212,175,133,0.5)]">1.</span>
                      <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                        اختر تاريخ المناسبة من التقويم
                      </span>
                    </h2>
                    <p className="text-xs text-[#DCE6F2] mt-0.5">
                      اضغط على اليوم المطلوب لتحديده ومتابعة الحجز
                    </p>
                  </div>

                  {/* Month controls */}
                  <div className="flex items-center gap-1.5 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-xl px-2 py-1 self-start sm:self-auto shadow-inner">
                    <button
                      type="button"
                      onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentMonthIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 text-[#FFE8B8] hover:text-[#FFF2D2] transition shadow-sm cursor-pointer"
                      title="الشهر السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold font-sans text-[#FFF2D2] px-3 min-w-[95px] text-center drop-shadow-sm">
                      {currentMonth.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                      }
                      disabled={currentMonthIndex === months.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 text-[#D4AF85] hover:text-[#FFF2D2] transition shadow-sm cursor-pointer"
                      title="الشهر التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday names */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#FFE8B8] mb-3 py-2.5 bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-xl shadow-inner">
                  <span>الأحد</span>
                  <span>الإثنين</span>
                  <span>الثلاثاء</span>
                  <span>الأربعاء</span>
                  <span>الخميس</span>
                  <span>الجمعة</span>
                  <span>السبت</span>
                </div>

                {/* Day Buttons with liquid glass cursor shine */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: currentMonth.startDayOffset }).map((_, i) => (
                    <div key={`offset-${i}`} className="h-10 sm:h-12" />
                  ))}

                  {Array.from({ length: currentMonth.daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isBooked = bookedDays.includes(day);
                    const isPartiallyBooked = partiallyBookedDays.includes(day);
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedDay(day)}
                        onMouseMove={handleButtonMouseMove}
                        className={`relative group overflow-hidden h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-br from-[#D4AF85]/55 via-white/30 to-[#122849]/70 backdrop-blur-xl border-2 border-[#FFF0C8] text-[#FFF9E6] font-black shadow-[0_0_20px_rgba(212,175,133,0.6),inset_0_1px_2px_rgba(255,255,255,0.9)] scale-105 z-10"
                            : isBooked
                            ? "bg-black/30 backdrop-blur-sm text-white/30 cursor-not-allowed line-through border border-white/5"
                            : isPartiallyBooked
                            ? "bg-amber-400/[0.12] hover:bg-amber-400/[0.25] backdrop-blur-md text-[#FFF3D6] border border-amber-300/40 hover:border-amber-300/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105"
                            : "bg-white/[0.08] hover:bg-white/[0.22] backdrop-blur-md text-white border border-white/20 hover:border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.25)] hover:scale-105"
                        }`}
                      >
                        {/* Moving liquid glass reflection inside the button */}
                        {!isBooked && (
                          <span
                            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                              background: "radial-gradient(circle 50px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.55), rgba(212,175,133,0.2) 50%, transparent 80%)",
                            }}
                          />
                        )}
                        <span className="relative z-10">{day}</span>
                        {isPartiallyBooked && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1.5 shadow-[0_0_8px_rgba(251,191,36,0.9)] z-10" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-white/15 text-xs text-[#DCE6F2]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#D4AF85] to-[#1E447B] border border-white shadow-[0_0_8px_rgba(212,175,133,0.6)]" />
                    <span className="text-[#FFF2D2] font-semibold">المحدد ({selectedDay} {currentMonth.name})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white/20 border border-white/40" />
                    <span>متاح للحجز</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <span>متاح جزئياً</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-black/40 border border-white/20" />
                    <span className="text-white/40">محجوز</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 & Step 3: Time Slots & Hall (Liquid Glass) */}
            <div className="lg:col-span-5 space-y-10 sm:space-y-14">
              {/* Step 2: Custom Hours Multi-Select (Liquid Glass) */}
              <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-black font-sans flex items-center">
                    <span className="text-[#FFE8B8] font-mono font-black ml-2 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                      2.
                    </span>
                    <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                      اختر ساعات الحجز المناسبة
                    </span>
                  </h2>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/[0.08] backdrop-blur-md border border-white/25 text-[#FFF2D2] flex items-center gap-1.5 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFE8B8]" />
                    <span>تحديد أكثر من ساعة</span>
                  </span>
                </div>

                {/* Duration Highlight Banner */}
                <div className="p-4 rounded-2xl border border-white/30 bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-white/[0.1] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-full bg-white/[0.1] border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                      <Clock className="w-5 h-5 text-[#D4AF85]" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#DCE6F2]">الساعات المحجوزة:</span>
                      <span className="block text-sm sm:text-base font-black text-[#FFF2D2] drop-shadow-sm">
                        {formattedTimeRange}
                      </span>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-white/[0.12] border border-white/30 text-xs font-black text-[#FFE8B8] shadow-inner whitespace-nowrap">
                    إجمالي المدة: {countText}
                  </div>
                </div>

                {/* Interactive Hourly Multi-Select Grid with liquid glass mouse shine */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#DCE6F2] mb-3 font-semibold">
                    <span>انقر على أي ساعة لاختيارها (يمكنك اختيار عدة ساعات):</span>
                    <span className="text-[11px] text-[#FFE8B8]">الساعات المظللة هي فترة حجزك</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                    {HOUR_BLOCKS.map((block) => {
                      const isSelected = selectedHours.includes(block.value);
                      return (
                        <button
                          key={block.value}
                          type="button"
                          onClick={() => toggleHour(block.value)}
                          onMouseMove={handleButtonMouseMove}
                          className={`relative group overflow-hidden py-3 px-2 rounded-2xl text-center transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? "bg-gradient-to-b from-[#D4AF85]/55 via-white/30 to-[#1E447B]/70 backdrop-blur-xl border-2 border-[#FFF0C8] text-[#FFF9E6] shadow-[0_0_20px_rgba(212,175,133,0.55),inset_0_1px_2px_rgba(255,255,255,0.85)] scale-[1.04]"
                              : "bg-white/[0.08] hover:bg-white/[0.22] backdrop-blur-md border border-white/20 hover:border-white/60 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.2)]"
                          }`}
                        >
                          <span
                            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                              background: "radial-gradient(circle 50px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.55), rgba(212,175,133,0.2) 50%, transparent 80%)",
                            }}
                          />
                          <span className="relative z-10 block text-sm sm:text-base font-black font-mono tracking-wider">
                            {block.timeOnly}
                          </span>
                          <span className={`relative z-10 block text-[10px] font-bold ${isSelected ? "text-[#FFE8B8]" : "text-[#DCE6F2]"}`}>
                            {block.period}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Single Hall Showcase (Liquid Glass) */}
              <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <h2 className="text-lg sm:text-xl font-black font-sans flex items-center mb-3">
                  <span className="text-[#FFE8B8] font-mono font-black ml-2 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                    3.
                  </span>
                  <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                    اختيار قاعة المجلس
                  </span>
                </h2>

                <div className="p-4 sm:p-5 rounded-2xl border border-white/30 bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-white/[0.1] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-[#FFE8B8] bg-[#D4AF85] flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-[#050B14]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#FFF2D2]">
                          {hall.name}
                        </h3>
                        <span className="text-[11px] px-3 py-0.5 rounded-full bg-white/[0.1] text-[#FFE8B8] border border-white/25 font-semibold shadow-inner">
                          {hall.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-[#DCE6F2] mt-1.5">{hall.suitability}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/15">
                    <div className="flex flex-wrap gap-2">
                      {hall.features.map((f, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-white/[0.08] backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-lg text-[#FFE8B8] font-medium"
                        >
                          • {f}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGallery((prev) => !prev)}
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-[#D4AF85] text-xs font-bold text-[#FFF2D2] flex items-center gap-2 transition cursor-pointer self-end sm:self-auto shadow-inner"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#D4AF85]" />
                      <span>{showGallery ? "إخفاء صور الجامع" : "استعراض صور الجامع والمجلس"}</span>
                      <span className="text-[10px] bg-[#D4AF85]/20 text-[#FFE8B8] px-2 py-0.5 rounded-full border border-[#D4AF85]/40 font-mono">
                        {galleryImages.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Option to see Mosque & Majlis Images (Scrollport) - FULL WIDTH ON LAPTOP & MOBILE */}
          {showGallery && (
            <div
              data-glass-card="true"
              className="w-full glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] relative overflow-hidden transition-all duration-300"
            >
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Camera className="w-5 h-5 text-[#D4AF85]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black font-sans bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                      صور الجامع والمجلس العام
                    </h3>
                    <p className="text-xs text-[#DCE6F2] mt-0.5">
                      معرض صور تفاعلي لمرافق وتجهيزات صرح جامع الحق وقاعة المجلس العام
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#DCE6F2] font-semibold bg-white/[0.08] px-4 py-1.5 rounded-full border border-white/20 shadow-inner self-start sm:self-auto">
                  اسحب أفقياً للتنقل بين الصور
                </span>
              </div>

              {/* Scrollport Container with linear gradient mask across full laptop width */}
              <div className="scrollport">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedLightboxImage(img.src)}
                    onMouseMove={handleButtonMouseMove}
                    className="relative group shrink-0 w-72 sm:w-96 md:w-[420px] lg:w-[480px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 hover:border-[#D4AF85] shadow-[0_12px_32px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                      <span className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                        {img.title}
                      </span>
                      {img.subtitle && (
                        <span className="text-xs text-[#DCE6F2]/90 mt-1 line-clamp-1">
                          {img.subtitle}
                        </span>
                      )}
                      <span className="text-xs text-[#D4AF85] mt-1.5 flex items-center gap-1.5 font-medium">
                        <Maximize2 className="w-4 h-4" />
                        <span>انقر للتكبير والمشاهدة بدقة عالية</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Personal Details Form (The LAST thing) */}
          <div className="mt-14 sm:mt-20 max-w-4xl mx-auto">
            <div data-glass-card="true" className="glass-card bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
                <h2 className="text-xl sm:text-2xl font-black font-sans flex items-center">
                  <span className="text-[#FFE8B8] font-mono font-black ml-2.5 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                    4.
                  </span>
                  <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                    بيانات صاحب الحجز
                  </span>
                </h2>
                <span className="text-xs text-[#FFE8B8] font-semibold bg-white/[0.08] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-inner">
                  الخطوة الأخيرة لإتمام الحجز
                </span>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      الاسم الثلاثي أو الرباعي *
                    </label>
                    <div
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أدخل اسم صاحب الحجز"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                        style={{
                          background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* National ID (Requested!) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      الرقم المدني / الهوية الوطنية *
                    </label>
                    <div
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <input
                        type="text"
                        required
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="أدخل الرقم المدني أو رقم الهوية"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                        style={{
                          background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      البريد الإلكتروني (لاستلام التأكيد) *
                    </label>
                    <div
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                        style={{
                          background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      رقم الهاتف للتواصل *
                    </label>
                    <div
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="968XXXXXXXX"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                        style={{
                          background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Secondary Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                      رقم هاتف إضافي (اختياري)
                    </label>
                    <div
                      onMouseMove={handleButtonMouseMove}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <input
                        type="tel"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="اختياري"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                      />
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                        style={{
                          background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                    {bookingType === "katbketab" ? "اسما العروسين" : "اسم المتوفى رحمه الله"}
                  </label>
                  <div
                    onMouseMove={handleButtonMouseMove}
                    className="relative group overflow-hidden rounded-xl"
                  >
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        bookingType === "katbketab"
                          ? "مثال: اسم العروسين، طلب مأذون..."
                          : "مثال: المرحوم بإذن الله فلان الفلاني..."
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.16] backdrop-blur-xl border border-white/25 focus:border-[#FFE8B8] text-white text-xs placeholder:text-white/40 focus:outline-none text-right shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition relative z-10"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                      style={{
                        background: "radial-gradient(circle 90px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), rgba(212,175,133,0.18) 50%, transparent 80%)",
                      }}
                    />
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/20 text-xs text-[#DCE6F2] space-y-2">
                  <div className="flex justify-between">
                    <span>المناسبة:</span>
                    <span className="font-bold text-[#FFF2D2]">
                      {bookingType === "katbketab" ? "عقد قران" : "عزاء"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الموعد المحدد:</span>
                    <span className="font-bold text-[#FFE8B8]">
                      اليوم {selectedDay} من {currentMonth.name} - {formattedTimeRange} ({countText})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>القاعة:</span>
                    <span className="font-bold text-[#FFF2D2]">{selectedHall}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  onMouseMove={handleButtonMouseMove}
                  className="relative group overflow-hidden w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF85]/90 via-[#FFE8B8]/95 to-[#C59B63]/90 hover:from-[#FFE8B8] hover:to-[#D4AF85] text-[#0A1628] text-sm sm:text-base font-black border border-white shadow-[0_10px_35px_rgba(212,175,133,0.45),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer tracking-wide"
                >
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: "radial-gradient(circle 120px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.7), transparent 70%)",
                    }}
                  />
                  <span className="relative z-10">تأكيد وتسجيل الحجز الآن</span>
                </button>
              </form>
            </div>
          </div>
          </div>
        )}
      </main>

      {/* Footer Note */}
      <footer className="border-t border-[#1E3A63]/50 bg-[#040810] py-8 text-center text-xs text-[#8EA3BF]">
        <p>© جامع الحق والمجلس العام — خدمة المجتمع والسكينة الإيمانية.</p>
      </footer>

      {/* Image Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedLightboxImage(null)}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer z-10"
            title="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedLightboxImage}
            alt="صورة مكبرة"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[82vh] rounded-2xl object-contain border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
          />
          {(() => {
            const currentImg = galleryImages.find((img) => img.src === selectedLightboxImage);
            return currentImg ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-3 px-5 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-center text-xs sm:text-sm font-bold text-[#FFF2D2] shadow-lg max-w-lg"
              >
                <span>{currentImg.title}</span>
                {currentImg.subtitle && (
                  <span className="text-[#DCE6F2]/80 font-normal mr-2">
                    — {currentImg.subtitle}
                  </span>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
