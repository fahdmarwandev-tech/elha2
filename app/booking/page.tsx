"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
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
  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [selectedHours, setSelectedHours] = useState<string[]>([
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ]);
  const [selectedHall, setSelectedHall] = useState<string>("قاعة المجلس العام");

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
    setIsSubmitted(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#0B1220]">
      <Navbar />

      {/* Main Reservation Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Toggle Occasion Type */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3 mb-8 p-1.5 bg-[#081222] border border-[#1E3A63]/80 rounded-2xl shadow-xl">
          <button
            onClick={() => setBookingType("katbketab")}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              bookingType === "katbketab"
                ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border border-[#D4AF85] font-black shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_16px_rgba(212,175,133,0.3)] scale-[1.02]"
                : "text-[#8EA3BF] hover:text-[#FAF7F0] hover:bg-[#0D1A2E]"
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#D4AF85]" />
            <span>حجز عقد قران</span>
          </button>
          <button
            onClick={() => setBookingType("3aza")}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              bookingType === "3aza"
                ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border border-[#D4AF85] font-black shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_16px_rgba(212,175,133,0.3)] scale-[1.02]"
                : "text-[#8EA3BF] hover:text-[#FAF7F0] hover:bg-[#0D1A2E]"
            }`}
          >
            <Building2 className="w-4 h-4 text-[#D4AF85]" />
            <span>حجز عزاء</span>
            <span className="text-[10px] hidden sm:inline text-[#D4AF85]/80">(دار التعازي)</span>
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#D4AF85]/50 rounded-3xl p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-20 h-20 rounded-full bg-[#0A1628] border-2 border-[#D4AF85] text-[#D4AF85] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,133,0.35)]">
              <CheckCircle2 className="w-10 h-10 text-[#D4AF85]" />
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-[#0A1628] text-[#D4AF85] rounded-full border border-[#D4AF85]/50">
              تم إرسال بريد التأكيد بنجاح
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-aref text-[#FAF7F0] mt-4 mb-2">
              {bookingType === "katbketab"
                ? "بارك الله لكما وبارك عليكما وجمع بينكما في خير"
                : "عظم الله أجركم ورحم ميتكم وألهمكم الصبر والسلوان"}
            </h2>

            <p className="text-[#8EA3BF] text-xs sm:text-sm leading-relaxed mb-6">
              تم تثبيت طلبك في جدول حجوزات المجلس وإرسال رسالة التأكيد وتفاصيل الحجز إلى بريدك الإلكتروني:
              <strong className="block text-[#D4AF85] font-mono text-sm sm:text-base mt-2 dir-ltr">
                {email}
              </strong>
              كود الحجز المرجعي:
              <span className="inline-block text-xl font-mono font-bold text-[#FAF7F0] mr-1 mt-1">
                {reservationCode}
              </span>
            </p>

            {/* Summary Details */}
            <div className="bg-[#050C18] border border-[#1E3A63] rounded-2xl p-5 text-right text-xs space-y-3 mb-8">
              <div className="flex justify-between border-b border-[#1E3A63]/60 pb-2">
                <span className="text-[#8EA3BF]">نوع المناسبة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {bookingType === "katbketab" ? "عقد قران" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/60 pb-2">
                <span className="text-[#8EA3BF]">التاريخ المحدد:</span>
                <span className="font-bold text-[#FAF7F0]">
                  اليوم {selectedDay} من {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/60 pb-2">
                <span className="text-[#8EA3BF]">الوقت والقاعة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {formattedTimeRange} ({countText}) • {selectedHall}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/60 pb-2">
                <span className="text-[#8EA3BF]">صاحب الحجز:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {fullName} ({phone})
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/60 pb-2">
                <span className="text-[#8EA3BF]">البريد الإلكتروني:</span>
                <span className="font-bold text-[#FAF7F0] font-mono dir-ltr">
                  {email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8EA3BF]">الرقم المدني:</span>
                <span className="font-bold text-[#FAF7F0] font-mono">
                  {nationalId}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${email}`}
                className="w-full py-3.5 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] text-[#FFF2D2] font-bold text-xs flex items-center justify-center gap-2 border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_8px_20px_rgba(0,0,0,0.7),0_0_15px_rgba(212,175,133,0.3)] transition"
              >
                <Mail className="w-4 h-4 text-[#D4AF85]" />
                <span>فتح البريد الإلكتروني لمراجعة التأكيد</span>
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0A1628] hover:bg-[#12243D] text-[#FAF7F0] border border-[#1E3A63] font-bold text-xs transition"
              >
                تعديل أو حجز جديد
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Reservation Steps */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Calendar Widget (Step 1) */}
              <div className="lg:col-span-7">
              {/* Step 1: Calendar Widget (Normal White Calendar) */}
              <div className="bg-white border border-slate-200 rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-aref text-slate-900 flex items-center">
                      <span className="text-[#1E447B] font-mono font-black ml-2">1.</span>
                      <span>اختر تاريخ المناسبة من التقويم</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      اضغط على اليوم المطلوب لتحديده ومتابعة الحجز
                    </p>
                  </div>

                  {/* Month controls */}
                  <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 rounded-xl px-2 py-1 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentMonthIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-700 transition shadow-sm"
                      title="الشهر السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 px-3 font-aref min-w-[90px] text-center">
                      {currentMonth.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                      }
                      disabled={currentMonthIndex === months.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-700 transition shadow-sm"
                      title="الشهر التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday names */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 mb-3 py-2 bg-slate-50 rounded-xl">
                  <span>الأحد</span>
                  <span>الإثنين</span>
                  <span>الثلاثاء</span>
                  <span>الأربعاء</span>
                  <span>الخميس</span>
                  <span>الجمعة</span>
                  <span>السبت</span>
                </div>

                {/* Day Buttons */}
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
                        className={`h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center relative ${
                          isSelected
                            ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border-2 border-[#D4AF85] font-black shadow-[0_8px_20px_rgba(18,40,73,0.4)] scale-105 z-10"
                            : isBooked
                            ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through border border-slate-100"
                            : isPartiallyBooked
                            ? "bg-amber-50 text-slate-800 border border-amber-200 hover:border-[#D4AF85] hover:bg-amber-100/60"
                            : "bg-white text-slate-800 border border-slate-200/90 hover:border-[#1E447B] hover:bg-slate-50 shadow-sm"
                        }`}
                      >
                        <span>{day}</span>
                        {isPartiallyBooked && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#1E447B_100%)] border border-[#D4AF85]" />
                    المحدد ({selectedDay} {currentMonth.name})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
                    متاح للحجز
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
                    متاح جزئياً
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-200" />
                    محجوز
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 & Step 3: Time Slots & Hall (Next to the calendar) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Step 2: Custom Hours Multi-Select (Grid only as requested) */}
              <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-[28px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold font-aref flex items-center">
                    <span className="text-[#FFF2D2] font-mono font-black ml-2 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                      2.
                    </span>
                    <span className="text-[#FFF2D2] font-black drop-shadow-[0_0_10px_rgba(212,175,133,0.35)]">
                      اختر ساعات الحجز المناسبة
                    </span>
                  </h2>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#050C18] border border-[#D4AF85]/50 text-[#D4AF85] flex items-center gap-1.5 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF85]" />
                    <span>تحديد أكثر من ساعة</span>
                  </span>
                </div>

                {/* Duration Highlight Banner */}
                <div className="p-4 rounded-2xl border border-[#D4AF85]/80 bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] shadow-[0_8px_25px_rgba(0,0,0,0.7),0_0_15px_rgba(212,175,133,0.25)] ring-1 ring-[#D4AF85]/40 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-full bg-[#050C18] border border-[#D4AF85] flex items-center justify-center shrink-0 shadow-inner">
                      <Clock className="w-5 h-5 text-[#D4AF85]" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#8EA3BF]">الساعات المحجوزة:</span>
                      <span className="block text-sm sm:text-base font-black text-[#FFF2D2] drop-shadow-sm">
                        {formattedTimeRange}
                      </span>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-[#050C18] border border-[#D4AF85] text-xs font-black text-[#D4AF85] shadow-inner whitespace-nowrap">
                    إجمالي المدة: {countText}
                  </div>
                </div>

                {/* Interactive Hourly Multi-Select Grid (The exact component user requested) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8EA3BF] mb-3 font-semibold">
                    <span>انقر على أي ساعة لاختيارها (يمكنك اختيار عدة ساعات):</span>
                    <span className="text-[11px] text-[#D4AF85]">الساعات المظللة هي فترة حجزك</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                    {HOUR_BLOCKS.map((block) => {
                      const isSelected = selectedHours.includes(block.value);
                      return (
                        <button
                          key={block.value}
                          type="button"
                          onClick={() => toggleHour(block.value)}
                          className={`py-3 px-2 rounded-2xl text-center transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? "bg-[linear-gradient(to_left,#0A1628_0%,#122849_50%,#1E447B_100%)] border-2 border-[#D4AF85] text-[#FFF2D2] shadow-[0_0_16px_rgba(212,175,133,0.35)] ring-1 ring-[#D4AF85] scale-[1.03]"
                              : "bg-[#050C18] border border-[#1E3A63]/80 text-[#8EA3BF] hover:border-[#D4AF85]/50 hover:text-[#FAF7F0] hover:bg-[#091527]"
                          }`}
                        >
                          <span className="block text-sm sm:text-base font-black font-mono tracking-wider">
                            {block.timeOnly}
                          </span>
                          <span className={`block text-[10px] font-bold ${isSelected ? "text-[#D4AF85]" : "text-[#8EA3BF]"}`}>
                            {block.period}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Single Hall Showcase */}
              <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-[28px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <h2 className="text-lg sm:text-xl font-bold font-aref flex items-center mb-3">
                  <span className="text-[#FFF2D2] font-mono font-black ml-2 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                    3.
                  </span>
                  <span className="text-[#FFF2D2] font-black drop-shadow-[0_0_10px_rgba(212,175,133,0.35)]">
                    اختيار قاعة المجلس
                  </span>
                </h2>

                <div className="p-4 sm:p-5 rounded-2xl border border-[#D4AF85] bg-[linear-gradient(to_left,#060E1C_0%,#0C1B33_40%,#153059_100%)] shadow-[0_8px_25px_rgba(0,0,0,0.7),0_0_16px_rgba(212,175,133,0.25)] ring-1 ring-[#D4AF85]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-[#D4AF85] bg-[#D4AF85] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#050B14]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#FAF7F0]">
                          {hall.name}
                        </h3>
                        <span className="text-[11px] px-3 py-0.5 rounded-full bg-[#060D1A] text-[#D4AF85] border border-[#D4AF85]/50 font-semibold shadow-inner">
                          {hall.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-[#8EA3BF] mt-1.5">{hall.suitability}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#1E3A63]/60">
                    {hall.features.map((f, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#060D1A] border border-[#1E3A63] px-2.5 py-1 rounded-lg text-[#D4AF85] font-medium"
                      >
                        • {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Personal Details Form (The LAST thing) */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E3A63]/60">
                <h2 className="text-xl sm:text-2xl font-bold font-aref flex items-center">
                  <span className="text-[#FFF2D2] font-mono font-black ml-2.5 drop-shadow-[0_0_12px_rgba(212,175,133,0.5)]">
                    4.
                  </span>
                  <span className="text-[#FFF2D2] font-black drop-shadow-[0_0_10px_rgba(212,175,133,0.35)]">
                    بيانات صاحب الحجز
                  </span>
                </h2>
                <span className="text-xs text-[#D4AF85] font-semibold bg-[#050C18] px-3.5 py-1.5 rounded-full border border-[#1E3A63]">
                  الخطوة الأخيرة لإتمام الحجز
                </span>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                      الاسم الثلاثي أو الرباعي *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسم صاحب الحجز"
                      className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                    />
                  </div>

                  {/* National ID (Requested!) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                      الرقم المدني / الهوية الوطنية *
                    </label>
                    <input
                      type="text"
                      required
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="أدخل الرقم المدني أو رقم الهوية"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                      البريد الإلكتروني (لاستلام التأكيد) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                      رقم الهاتف للتواصل *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="968XXXXXXXX"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                    />
                  </div>

                  {/* Secondary Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                      رقم هاتف إضافي (اختياري)
                    </label>
                    <input
                      type="tel"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="اختياري"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5">
                    {bookingType === "katbketab" ? "اسما العروسين" : "اسم المتوفى رحمه الله"}
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
                    className="w-full px-4 py-3 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] text-right"
                  />
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-[#050C18] border border-[#1E3A63] text-xs text-[#8EA3BF] space-y-2">
                  <div className="flex justify-between">
                    <span>المناسبة:</span>
                    <span className="font-bold text-[#FAF7F0]">
                      {bookingType === "katbketab" ? "عقد قران" : "عزاء"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الموعد المحدد:</span>
                    <span className="font-bold text-[#D4AF85]">
                      اليوم {selectedDay} من {currentMonth.name} - {formattedTimeRange} ({countText})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>القاعة:</span>
                    <span className="font-bold text-[#FAF7F0]">{selectedHall}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="relative group w-full py-4 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] text-sm font-black text-[#FFF2D2] border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,133,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.25)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.95),0_0_26px_rgba(212,175,133,0.5)] active:scale-95 transition-all duration-300 cursor-pointer tracking-wide"
                >
                  تأكيد وتسجيل الحجز الآن
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
    </div>
  );
}
