"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Mail,
} from "lucide-react";
import Link from "next/link";

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "3aza" | "katbketab";
}

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

export default function QuickBookingModal({
  isOpen,
  onClose,
  initialType = "katbketab",
}: QuickBookingModalProps) {
  const [bookingType, setBookingType] = useState<"3aza" | "katbketab">(initialType);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = current month, 1 = next month
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [selectedHours, setSelectedHours] = useState<string[]>([
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ]);
  const [selectedHall, setSelectedHall] = useState<string>("قاعة المجلس العام");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleHour = (val: string) => {
    setSelectedHours((prev) => {
      if (prev.includes(val)) {
        if (prev.length === 1) return prev;
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

  if (!isOpen) return null;

  // Calendar dates mock for October / November 2026
  const months = [
    { name: "أكتوبر 2026", daysInMonth: 31, startDayOffset: 4 }, // Thu start
    { name: "نوفمبر 2026", daysInMonth: 30, startDayOffset: 0 }, // Sun start
  ];

  const currentMonth = months[currentMonthIndex];

  // Specific booked or busy dates
  const bookedDays = [3, 9, 14, 22, 28];
  const partiallyBookedDays = [5, 11, 16, 25];

  const timeSlots = [
    { id: "عصر", label: "فترة العصر", time: "03:45 م - 05:30 م", available: true },
    { id: "مغرب", label: "فترة المغرب", time: "06:00 م - 07:30 م", available: true },
    { id: "عشاء", label: "فترة العشاء", time: "08:00 م - 11:30 م", available: true },
  ];

  const hall = {
    id: "قاعة المجلس العام",
    name: "قاعة المجلس العام",
    capacity: "حتى 500 فرد",
    suitableFor: "مجهزة بالكامل لعقد القران ومجالس العزاء",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) return;
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FAF7F0] p-5 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 rounded-full bg-[#050C18] hover:bg-[#122849] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation View */
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#050C18] border-2 border-[#D4AF85] flex items-center justify-center text-[#D4AF85] mb-5 shadow-[0_0_20px_rgba(212,175,133,0.3)] animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-[#D4AF85]" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63] mb-2">
              تم إرسال بريد التأكيد بنجاح
            </span>

            <h3 className="text-2xl font-black text-[#FAF7F0] font-aref mb-2">
              {bookingType === "katbketab" ? "مبارك مقدماً عقد القران" : "عظم الله أجركم وأحسن عزاءكم"}
            </h3>

            <p className="text-[#8A9BB3] text-sm max-w-md mx-auto mb-6 leading-relaxed">
              تم استلام حجزك المبدئي وإرسال إشعار التأكيد ورقم المرجع إلى بريدك الإلكتروني:
              <strong className="block text-[#D4AF85] font-mono mt-1 text-sm dir-ltr">
                {email}
              </strong>
              رقم الحجز المرجعي:
              <strong className="block text-[#FAF7F0] text-lg font-mono mt-0.5">
                MN-{Math.floor(100000 + Math.random() * 900000)}
              </strong>
            </p>

            <div className="bg-[#050C18] border border-[#1E3A63]/80 rounded-2xl p-4 w-full max-w-md text-right text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">نوع المناسبة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {bookingType === "katbketab" ? "عقد قران" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">التاريخ المحدد:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {selectedDay} {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">الوقت والقاعة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {formattedTimeRange} ({countText}) • {selectedHall}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1E3A63]/50 pb-2">
                <span className="text-[#8A9BB3]">البريد الإلكتروني:</span>
                <span className="font-bold text-[#FAF7F0] font-mono dir-ltr">
                  {email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9BB3]">صاحب الحجز:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {fullName} ({phone})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <a
                href={`mailto:${email}`}
                className="w-full py-3 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85]/80 hover:border-[#D4AF85] font-black text-xs text-[#FFF2D2] flex items-center justify-center gap-2 transition shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)]"
              >
                <Mail className="w-4 h-4 text-[#D4AF85]" />
                <span>فتح البريد الإلكتروني لمراجعة التأكيد</span>
              </a>
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] font-bold text-xs text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/50 transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          /* Booking Step View */
          <div>
            {/* Header */}
            <div className="text-right mb-5 pr-1">
              <div className="text-[#FFF2D2] font-black text-xs mb-1 drop-shadow-sm">
                <span>حجز مباشر للمجلس مع التقويم</span>
              </div>
              <h2 className="text-2xl font-black font-aref text-[#FFF2D2] drop-shadow-[0_0_15px_rgba(212,175,133,0.35)]">
                حجز موعد {bookingType === "3aza" ? "عزاء" : "عقد قران"}
              </h2>
              <p className="text-xs text-[#8A9BB3] mt-1">
                اختر نوع المناسبة واليوم من التقويم لتحديد الفترة والقاعة المناسبة لك بكل سهولة.
              </p>
            </div>

            {/* Occasion Switcher: 3aza vs عقد قران */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#050C18] border border-[#1E3A63] rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setBookingType("3aza")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  bookingType === "3aza"
                    ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-[0_0_15px_rgba(212,175,133,0.3)] font-black"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#0D1A2D] border border-transparent"
                }`}
              >
                <Building2 className={`w-4 h-4 ${bookingType === "3aza" ? "text-[#D4AF85]" : ""}`} />
                <span>حجز عزاء</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">(دار العزاء)</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingType("katbketab")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  bookingType === "katbketab"
                    ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-[0_0_15px_rgba(212,175,133,0.3)] font-black"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#0D1A2D] border border-transparent"
                }`}
              >
                <HeartHandshake className={`w-4 h-4 ${bookingType === "katbketab" ? "text-[#D4AF85]" : ""}`} />
                <span>حجز عقد قران</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">(المجلس)</span>
              </button>
            </div>

            {/* Interactive Calendar Part (Normal White Calendar) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-5 text-slate-800 shadow-md">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-3 text-sm pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 font-aref text-base">
                  {currentMonth.name}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex(0)}
                    disabled={currentMonthIndex === 0}
                    className="p-1 rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition text-slate-700 border border-slate-200 shadow-sm"
                    title="الشهر السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex(1)}
                    disabled={currentMonthIndex === 1}
                    className="p-1 rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition text-slate-700 border border-slate-200 shadow-sm"
                    title="الشهر التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 mb-2 py-1.5 bg-slate-50 rounded-lg">
                <span>أحد</span>
                <span>إثنين</span>
                <span>ثلاثاء</span>
                <span>أربعاء</span>
                <span>خميس</span>
                <span>جمعة</span>
                <span>سبت</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty offset days */}
                {Array.from({ length: currentMonth.startDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8 sm:h-9" />
                ))}

                {/* Actual Month Days */}
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
                      className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center relative ${
                        isSelected
                          ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border-2 border-[#D4AF85] text-[#FFF2D2] font-black shadow-md scale-105 z-10"
                          : isBooked
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                          : isPartiallyBooked
                          ? "bg-amber-50 text-slate-800 border border-amber-200 hover:bg-amber-100/60"
                          : "bg-white text-slate-800 border border-slate-200 hover:border-[#1E447B] hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      <span>{day}</span>
                      {isPartiallyBooked && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#1E447B_100%)] border border-[#D4AF85]" />
                  المحدد ({selectedDay} {currentMonth.name})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300" />
                  متاح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  متاح جزئياً
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  محجوز
                </span>
              </div>
            </div>

            {/* Custom Hours Multi-Select Grid */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-[#FFF2D2] drop-shadow-sm flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF85]" />
                  <span>اختر ساعات الحجز:</span>
                </label>
                <span className="text-[10px] font-bold text-[#D4AF85] px-2.5 py-0.5 rounded-full bg-[#050C18] border border-[#D4AF85]/40">
                  المدة: {countText}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2.5">
                {HOUR_BLOCKS.map((block) => {
                  const isSelected = selectedHours.includes(block.value);
                  return (
                    <button
                      key={block.value}
                      type="button"
                      onClick={() => toggleHour(block.value)}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-[linear-gradient(to_left,#0A1628_0%,#122849_50%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-[0_0_10px_rgba(212,175,133,0.3)] ring-1 ring-[#D4AF85]"
                          : "bg-[#050C18] border border-[#1E3A63]/80 text-[#8EA3BF] hover:border-[#D4AF85]/50 hover:text-[#FAF7F0]"
                      }`}
                    >
                      <span className="block text-xs font-mono font-bold">{block.timeOnly}</span>
                      <span className={`block text-[9px] ${isSelected ? "text-[#D4AF85]" : "text-[#8EA3BF]"}`}>
                        {block.period}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Range pill */}
              <div className="p-2 rounded-xl bg-[#091527] border border-[#1E3A63] text-center text-xs font-bold text-[#FFF2D2]">
                {formattedTimeRange} ({countText})
              </div>
            </div>

            {/* Hall Showcase (Single Hall) */}
            <div className="mb-5">
              <label className="block text-xs font-black text-[#FFF2D2] mb-2 text-right drop-shadow-sm">
                قاعة المجلس المجهزة للحجز:
              </label>
              <div className="p-3.5 rounded-xl border border-[#D4AF85] bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] shadow-[0_0_15px_rgba(212,175,133,0.2)] ring-1 ring-[#D4AF85] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF85] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#050B14]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-[#FAF7F0]">{hall.name}</span>
                    <span className="text-[10px] text-[#8EA3BF] block mt-0.5">{hall.suitableFor}</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#D4AF85] font-semibold bg-[#050C18] px-2.5 py-0.5 rounded-full border border-[#D4AF85]/40 shrink-0">
                  {hall.capacity}
                </span>
              </div>
            </div>

            {/* Client Info Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8A9BB3] mb-1 text-right">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد أحمد علي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85]/40 text-right transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8A9BB3] mb-1 text-right">
                    البريد الإلكتروني (لاستلام التأكيد) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85]/40 text-right transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A9BB3] mb-1 text-right">
                  رقم الهاتف للتواصل *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85]/40 text-right transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A9BB3] mb-1 text-right">
                  ملاحظات أو طلبات خاصة (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    bookingType === "katbketab"
                      ? "مثال: اسم العروسين، طلب مأذون، تجهيز تصوير"
                      : "مثال: اسم المتوفى، طلب قارئ إذاعي محدد، تجهيز قهوة وضيافة"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85]/40 text-right transition"
                />
              </div>

              {/* Submit & Link to full page */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85]/80 hover:border-[#D4AF85] text-[#FFF2D2] font-black text-xs shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] active:scale-95 transition"
                >
                  تأكيد حجز {bookingType === "3aza" ? "العزاء" : "عقد القران"} لـ ({selectedDay}{" "}
                  {currentMonth.name})
                </button>
                <Link
                  href="/booking"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/50 text-xs font-bold text-center transition whitespace-nowrap"
                >
                  صفحة المجلس والتقويم الكاملة
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
