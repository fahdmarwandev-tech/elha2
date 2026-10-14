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
  Send,
} from "lucide-react";
import Link from "next/link";

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "3aza" | "katbketab";
}

export default function QuickBookingModal({
  isOpen,
  onClose,
  initialType = "katbketab",
}: QuickBookingModalProps) {
  const [bookingType, setBookingType] = useState<"3aza" | "katbketab">(initialType);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = current month, 1 = next month
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [selectedSlot, setSelectedSlot] = useState<string>("عشاء");
  const [selectedHall, setSelectedHall] = useState<string>("القاعة الكبرى");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const halls = [
    {
      id: "القاعة الكبرى",
      name: "قاعة الفردوس الكبرى",
      capacity: "حتى 500 فرد",
      suitableFor: "مناسبات كتب الكتاب والعزاء الموسع",
    },
    {
      id: "قاعة النور",
      name: "قاعة النور والسكينة",
      capacity: "حتى 250 فرد",
      suitableFor: "عزاء ومجالس عقد القران الخاصة",
    },
    {
      id: "قاعة الهدى",
      name: "قاعة الهدى (سيدات)",
      capacity: "حتى 180 فرد",
      suitableFor: "مجالس العزاء وكتب الكتاب الخاصة بالسيدات",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#152132] border border-[#22334A] rounded-3xl shadow-2xl text-[#FAF7F0] p-5 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 rounded-full bg-[#0B1220] hover:bg-[#182436] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation View */
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#0B1220] border-2 border-[#C49A6C] flex items-center justify-center text-[#C49A6C] mb-5 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-[#C49A6C]" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#182436] text-[#C49A6C] border border-[#22334A] mb-2">
              تم تسجيل طلب الحجز بنجاح
            </span>

            <h3 className="text-2xl font-black text-[#FAF7F0] font-aref mb-2">
              {bookingType === "katbketab" ? "مبارك مقدماً عقد القران" : "عظم الله أجركم وأحسن عزاءكم"}
            </h3>

            <p className="text-[#8A9BB3] text-sm max-w-md mx-auto mb-6 leading-relaxed">
              تم استلام حجزك المبدئي لدار المناسبات بجامع الحق. رقم الحجز المرجعي:
              <strong className="block text-[#FAF7F0] text-lg font-mono mt-1">
                MN-{Math.floor(100000 + Math.random() * 900000)}
              </strong>
            </p>

            <div className="bg-[#0B1220] border border-[#22334A] rounded-2xl p-4 w-full max-w-md text-right text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">نوع المناسبة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {bookingType === "katbketab" ? "عقد قران (كتب كتاب)" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">التاريخ المحدد:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {selectedDay} {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">الفترة والقاعة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  فترة {selectedSlot} • {selectedHall}
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
                href={`https://wa.me/201000000000?text=${encodeURIComponent(
                  `مرحباً إدارة جامع الحق، أود تأكيد حجز ${
                    bookingType === "katbketab" ? "كتب كتاب" : "عزاء"
                  } ليوم ${selectedDay} ${currentMonth.name} باسم ${fullName}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] font-black text-xs text-[#0B1220] flex items-center justify-center gap-2 transition shadow-md shadow-[#C49A6C]/20"
              >
                <Send className="w-4 h-4" />
                تأكيد فوري عبر واتساب
              </a>
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-full bg-[#182436] hover:bg-[#0B1220] font-bold text-xs text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A] transition"
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
              <div className="flex items-center gap-2 text-[#C49A6C] font-bold text-xs mb-1">
                <CalendarIcon className="w-4 h-4 text-[#C49A6C]" />
                <span>حجز مباشر لدار المناسبات مع التقويم</span>
              </div>
              <h2 className="text-2xl font-bold font-aref text-[#FAF7F0]">
                حجز موعد {bookingType === "3aza" ? "عزاء" : "كتب كتاب"}
              </h2>
              <p className="text-xs text-[#8A9BB3] mt-1">
                اختر نوع المناسبة واليوم من التقويم لتحديد الفترة والقاعة المناسبة لك بكل سهولة.
              </p>
            </div>

            {/* Occasion Switcher: 3aza vs Katb Ketab */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B1220] border border-[#22334A] rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setBookingType("3aza")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  bookingType === "3aza"
                    ? "bg-[#C49A6C] text-[#0B1220] shadow-sm font-black"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#182436]"
                }`}
              >
                <span>🕊️ حجز عزاء</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">(دار العزاء)</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingType("katbketab")}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                  bookingType === "katbketab"
                    ? "bg-[#C49A6C] text-[#0B1220] shadow-sm font-black"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#182436]"
                }`}
              >
                <span>💍 حجز كتب كتاب</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">(عقد قران)</span>
              </button>
            </div>

            {/* Interactive Calendar Part */}
            <div className="bg-[#0B1220] border border-[#22334A] rounded-2xl p-4 mb-5">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-bold text-[#FAF7F0] font-aref text-base">
                  {currentMonth.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex(0)}
                    disabled={currentMonthIndex === 0}
                    className="p-1 rounded-lg bg-[#152132] disabled:opacity-30 hover:bg-[#182436] transition text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A]"
                    title="الشهر السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex(1)}
                    disabled={currentMonthIndex === 1}
                    className="p-1 rounded-lg bg-[#152132] disabled:opacity-30 hover:bg-[#182436] transition text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A]"
                    title="الشهر التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#8A9BB3] mb-2">
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
                      className={`h-8 sm:h-9 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center relative ${
                        isSelected
                          ? "bg-[#C49A6C] text-[#0B1220] font-black shadow-md shadow-[#C49A6C]/30 scale-105"
                          : isBooked
                          ? "bg-white/5 text-[#8A9BB3]/40 cursor-not-allowed line-through"
                          : isPartiallyBooked
                          ? "bg-[#182436] text-[#FAF7F0] border border-[#7D5E3B] hover:bg-[#152132]"
                          : "bg-[#152132] text-[#FAF7F0] border border-[#22334A] hover:border-[#C49A6C] hover:bg-[#182436]"
                      }`}
                    >
                      <span>{day}</span>
                      {isPartiallyBooked && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#7D5E3B] absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-[#22334A] text-[10px] text-[#8A9BB3]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C49A6C]" />
                  المحدد ({selectedDay} {currentMonth.name})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border border-[#22334A]" />
                  متاح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7D5E3B]" />
                  متاح جزئياً
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2A374A]" />
                  محجوز
                </span>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#8A9BB3] mb-2 text-right">
                الفترة الزمنية المطلوبة:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedSlot === slot.id
                        ? "bg-[#182436] border-[#C49A6C] text-[#FAF7F0] font-bold shadow-sm ring-1 ring-[#C49A6C]"
                        : "bg-[#0B1220] border-[#22334A] text-[#8A9BB3] hover:bg-[#182436]"
                    }`}
                  >
                    <span className="text-xs block font-bold">{slot.label}</span>
                    <span className="text-[10px] text-[#C49A6C] block mt-0.5">{slot.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hall Selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#8A9BB3] mb-2 text-right">
                اختيار القاعة المناسبة:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {halls.map((hall) => (
                  <button
                    key={hall.id}
                    type="button"
                    onClick={() => setSelectedHall(hall.id)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      selectedHall === hall.id
                        ? "bg-[#182436] border-[#C49A6C] text-[#FAF7F0] shadow-sm ring-1 ring-[#C49A6C]"
                        : "bg-[#0B1220] border-[#22334A] text-[#8A9BB3] hover:bg-[#182436]"
                    }`}
                  >
                    <span className="text-xs font-bold block">{hall.name}</span>
                    <span className="text-[10px] text-[#8A9BB3] block mt-0.5">
                      {hall.capacity}
                    </span>
                  </button>
                ))}
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1220] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#C49A6C] focus:bg-[#182436] text-right transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8A9BB3] mb-1 text-right">
                    رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1220] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#C49A6C] focus:bg-[#182436] text-right transition"
                  />
                </div>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1220] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#C49A6C] focus:bg-[#182436] text-right transition"
                />
              </div>

              {/* Submit & Link to full page */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-black text-xs shadow-md shadow-[#C49A6C]/20 active:scale-95 transition"
                >
                  تأكيد حجز {bookingType === "3aza" ? "العزاء" : "كتب الكتاب"} لـ ({selectedDay}{" "}
                  {currentMonth.name})
                </button>
                <Link
                  href="/booking"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 rounded-full bg-[#0B1220] hover:bg-[#182436] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A] text-xs font-bold text-center transition whitespace-nowrap"
                >
                  صفحة الحجوزات الكاملة
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
