"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  Send,
  Info,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Coffee,
  Camera,
  HeartHandshake,
  ShieldCheck,
  Building2,
} from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const [bookingType, setBookingType] = useState<"katbketab" | "3aza">("katbketab");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [selectedSlot, setSelectedSlot] = useState<string>("عشاء");
  const [selectedHall, setSelectedHall] = useState<string>("القاعة الكبرى");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "sound",
    "reciter",
  ]);

  // Form inputs
  const [fullName, setFullName] = useState("");
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

  const halls = [
    {
      id: "القاعة الكبرى",
      name: "قاعة الفردوس الكبرى",
      capacity: "500 فرد",
      image: "/golden-hour-mosque-cream-fade.png",
      features: ["مدخل خاص مستقل", "تكييف مركزي متطور", "نظام صوت رقمي", "شاشات عرض LED"],
      suitability: "مناسبة لكتب الكتاب الحاشد ومجالس العزاء الكبرى",
    },
    {
      id: "قاعة النور",
      name: "قاعة النور والسكينة",
      capacity: "250 فرد",
      image: "/Illuminated Mosque at Dusk.png",
      features: ["جلسات كلاسيكية فاخرة", "إضاءة دافئة", "صوتيات ممتازة", "خدمة ضيافة مجهزة"],
      suitability: "مثالية لعقد القران العائلي ومجالس العزاء المتوسطة",
    },
    {
      id: "قاعة الهدى",
      name: "قاعة الهدى الخاصة بالسيدات",
      capacity: "180 فرد",
      image: "/golden-mosque-courtyard.png",
      features: ["خصوصية تامة واستقلال", "مدخل نسائي مجهز", "شاشات نقل صوتي", "غرفة خدمات خاصة"],
      suitability: "مخصصة بالكامل لمناسبات وسيدات العائلة",
    },
  ];

  const optionalServices = [
    {
      id: "reciter",
      title: "قارئ معتمد من الإذاعة والتلفزيون",
      desc: "تلاوة قرآنية مباركة بأعذب الأصوات",
      icon: Volume2,
    },
    {
      id: "hospitality",
      title: "بوفيه ضيافة متكامل (قهوة وشاي وتمور)",
      desc: "طاقم ضيافة متميز وخدمة فندقية راقية",
      icon: Coffee,
    },
    {
      id: "camera",
      title: "توثيق وتصوير فوتوغرافي وفيديو",
      desc: "تسجيل كامل للمناسبة بكاميرات عالية الدقة",
      icon: Camera,
    },
    {
      id: "sound",
      title: "هندسة صوتية وميكروفونات لاسلكية",
      desc: "نقاء صوتي متكامل يشمل كافة أرجاء القاعة",
      icon: Sparkles,
    },
  ];

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    const code = `DAR-${Math.floor(100000 + Math.random() * 900000)}`;
    setReservationCode(code);
    setIsSubmitted(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#C49A6C] selection:text-[#0B1220]">
      <Navbar />

      {/* Main Reservation Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Toggle Occasion Type */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3 mb-8 p-1.5 bg-[#152132] border border-[#22334A] rounded-2xl shadow-sm">
          <button
            onClick={() => setBookingType("katbketab")}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              bookingType === "katbketab"
                ? "bg-[#C49A6C] text-[#0B1220] font-black shadow-[0_0_15px_rgba(196,154,108,0.3)] scale-[1.02]"
                : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#182436]"
            }`}
          >
            <span>💍 حجز كتب كتاب</span>
            <span className="text-[10px] hidden sm:inline">(عقد قران)</span>
          </button>
          <button
            onClick={() => setBookingType("3aza")}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              bookingType === "3aza"
                ? "bg-[#C49A6C] text-[#0B1220] font-black shadow-[0_0_15px_rgba(196,154,108,0.3)] scale-[1.02]"
                : "text-[#8A9BB3] hover:text-[#FAF7F0] hover:bg-[#182436]"
            }`}
          >
            <span>🕊️ حجز عزاء</span>
            <span className="text-[10px] hidden sm:inline">(دار التعازي)</span>
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto bg-[#152132] border border-[#C49A6C]/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-[#182436] border-2 border-[#C49A6C] text-[#C49A6C] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#C49A6C]" />
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-[#182436] text-[#C49A6C] rounded-full border border-[#C49A6C]/40">
              تم تسجيل طلب الحجز بنجاح
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-aref text-[#FAF7F0] mt-4 mb-2">
              {bookingType === "katbketab"
                ? "بارك الله لكما وبارك عليكما وجمع بينكما في خير"
                : "عظم الله أجركم ورحم ميتكم وألهمكم الصبر والسلوان"}
            </h2>

            <p className="text-[#8A9BB3] text-xs sm:text-sm leading-relaxed mb-6">
              تم تثبيت طلبك في جدول حجوزات دار المناسبات بجامع الحق. كود الحجز المرجعي:
              <span className="block text-2xl font-mono font-bold text-[#C49A6C] mt-2">
                {reservationCode}
              </span>
            </p>

            {/* Summary Details */}
            <div className="bg-[#111A29] border border-[#22334A] rounded-2xl p-5 text-right text-xs space-y-3 mb-8">
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">نوع المناسبة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {bookingType === "katbketab" ? "عقد قران (كتب كتاب)" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">التاريخ المحدد:</span>
                <span className="font-bold text-[#FAF7F0]">
                  اليوم {selectedDay} من {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">الفترة والقاعة:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {timeSlots.find((s) => s.id === selectedSlot)?.title} • {selectedHall}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#22334A] pb-2">
                <span className="text-[#8A9BB3]">صاحب الحجز:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {fullName} ({phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9BB3]">الخدمات الإضافية:</span>
                <span className="font-bold text-[#C49A6C]">
                  {selectedServices.length > 0
                    ? `${selectedServices.length} خدمات مضافة`
                    : "بدون خدمات إضافية"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/201000000000?text=${encodeURIComponent(
                  `السلام عليكم ورحمة الله، تم عمل حجز لـ ${
                    bookingType === "katbketab" ? "كتب كتاب" : "عزاء"
                  } بكود الحجز ${reservationCode} باسم ${fullName} لتاريخ ${selectedDay} ${currentMonth.name}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Send className="w-4 h-4" />
                تأكيد عبر واتساب إدارة المسجد
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#FAF7F0] border border-[#22334A] font-bold text-xs transition"
              >
                تعديل أو حجز جديد
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Reservation Steps */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Calendar & Time Slots */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Calendar Widget */}
              <div className="bg-[#152132] border border-[#22334A] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-aref text-[#C49A6C] flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-[#C49A6C]" />
                      <span>1. اختر تاريخ المناسبة من التقويم</span>
                    </h2>
                    <p className="text-xs text-[#C49A6C]/80 mt-0.5">
                      الأيام المتاحة مؤشرة باللون الذهبي والكراميل للحجز الفوري
                    </p>
                  </div>

                  {/* Month controls */}
                  <div className="flex items-center gap-2 bg-[#182436] border border-[#2A3C54] rounded-xl px-2 py-1 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentMonthIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-[#FAF7F0] transition"
                      title="الشهر السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-[#FAF7F0] px-2 font-aref">
                      {currentMonth.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                      }
                      disabled={currentMonthIndex === months.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-[#FAF7F0] transition"
                      title="الشهر التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday names */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#8A9BB3] mb-2 py-1.5 border-b border-[#22334A]">
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
                        className={`h-10 sm:h-12 rounded-2xl text-xs sm:text-sm font-bold transition flex flex-col items-center justify-center relative ${
                          isSelected
                            ? "bg-[#C49A6C] text-[#0B1220] font-black shadow-[0_0_20px_rgba(196,154,108,0.5)] scale-105"
                            : isBooked
                            ? "bg-[#233246] text-[#64748B] cursor-not-allowed line-through opacity-70"
                            : isPartiallyBooked
                            ? "bg-[#7D5E3B]/70 text-white border border-[#C49A6C]/80 hover:bg-[#7D5E3B]"
                            : "bg-[#182436] text-[#FAF7F0] border border-[#263954] hover:border-[#C49A6C]"
                        }`}
                      >
                        <span>{day}</span>
                        {isPartiallyBooked && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C49A6C] absolute bottom-1.5" />
                        )}
                        {!isBooked && !isPartiallyBooked && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[#FAF7F0]/80 absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-3 border-t border-[#22334A] text-[11px] text-[#8A9BB3]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C49A6C]" />
                    المحدد ({selectedDay} {currentMonth.name})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7F0]" />
                    متاح للحجز
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C49A6C]" />
                    متاح جزئياً
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9E2A38]" />
                    محجوز بالكامل
                  </span>
                </div>
              </div>

              {/* Step 2: Time Slots */}
              <div className="bg-[#152132] border border-[#22334A] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <h2 className="text-lg sm:text-xl font-bold font-aref text-[#C49A6C] flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#C49A6C]" />
                  <span>2. اختر الفترة الزمنية المناسبة</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 rounded-2xl border text-right transition ${
                          isSelected
                            ? "bg-[#182436] border-[#C49A6C] text-[#FAF7F0] font-bold shadow-md ring-1 ring-[#C49A6C]"
                            : "bg-[#111A29] border-[#22334A] text-[#8A9BB3] hover:bg-[#182436] hover:text-[#FAF7F0]"
                        }`}
                      >
                        <span className="block text-sm font-bold text-[#FAF7F0] mb-1">
                          {slot.title}
                        </span>
                        <span className="block text-[11px] text-[#C49A6C] font-mono mb-1">
                          {slot.time}
                        </span>
                        <span className="block text-[10px] text-[#8A9BB3]">{slot.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Halls Available */}
              <div className="bg-[#152132] border border-[#22334A] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <h2 className="text-lg sm:text-xl font-bold font-aref text-[#C49A6C] flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-[#C49A6C]" />
                  <span>3. اختيار قاعة المناسبات</span>
                </h2>

                <div className="space-y-3">
                  {halls.map((hall) => {
                    const isSelected = selectedHall === hall.id;
                    return (
                      <div
                        key={hall.id}
                        onClick={() => setSelectedHall(hall.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected
                            ? "bg-[#182436] border-[#C49A6C] shadow-lg ring-1 ring-[#C49A6C]"
                            : "bg-[#111A29] border-[#22334A] hover:border-[#C49A6C]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-[#C49A6C] bg-[#C49A6C]" : "border-[#22334A]"
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#0B1220]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-[#FAF7F0]">
                                {hall.name}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#182436] text-[#C49A6C] border border-[#22334A] font-semibold">
                                {hall.capacity}
                              </span>
                            </div>
                            <p className="text-xs text-[#8A9BB3] mt-1">{hall.suitability}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {hall.features.map((f, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-[#111A29] border border-[#22334A] px-2 py-0.5 rounded-md text-[#8A9BB3]"
                                >
                                  • {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Left Column: Services & Client Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Optional Add-on Services (Matching Image 1) */}
              <div className="bg-[#152132] border border-[#22334A] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <h2 className="text-base sm:text-lg font-bold font-aref text-[#C49A6C] flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#C49A6C]" />
                  <span>الخدمات المجهزة لمناسبتك</span>
                </h2>

                <div className="space-y-3">
                  {optionalServices.map((service) => {
                    const isChecked = selectedServices.includes(service.id);
                    const Icon = service.icon;

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`w-full p-3.5 rounded-2xl border text-right flex items-center justify-between gap-3 transition ${
                          isChecked
                            ? "bg-[#111A29] border-[#C49A6C] shadow-sm ring-1 ring-[#C49A6C]"
                            : "bg-[#111A29] border-[#22334A] hover:border-[#C49A6C]/50"
                        }`}
                      >
                        <div className="flex flex-col text-right">
                          <span className="text-xs sm:text-sm font-bold text-[#FAF7F0]">
                            {service.title}
                          </span>
                          <span className="text-[11px] text-[#8A9BB3] mt-0.5">
                            {service.desc}
                          </span>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? "bg-[#C49A6C] text-[#0B1220] border-[#C49A6C]"
                              : "bg-[#182436] text-[#C49A6C] border-[#2A3C54]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reservation Details Form (Matching Image 1) */}
              <div className="bg-[#152132] border border-[#22334A] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <h2 className="text-base sm:text-lg font-bold font-aref text-[#C49A6C] flex items-center gap-2 mb-4">
                  <HeartHandshake className="w-5 h-5 text-[#C49A6C]" />
                  <span>بيانات صاحب الحجز</span>
                </h2>

                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A9BB3] mb-1">
                      الاسم الثلاثي أو الرباعي *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسم صاحب الحجز"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111A29] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#C49A6C] text-right"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8A9BB3] mb-1">
                        رقم الهاتف / واتساب *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="968XXXXXXXX"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#111A29] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#C49A6C] text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8A9BB3] mb-1">
                        رقم هاتف إضافي (بديل)
                      </label>
                      <input
                        type="tel"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="اختياري"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#111A29] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#C49A6C] text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8A9BB3] mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111A29] border border-[#22334A] text-[#FAF7F0] text-xs placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#C49A6C] text-right"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-[#111A29] border border-[#22334A] text-xs text-[#8A9BB3] space-y-1.5">
                    <div className="flex justify-between">
                      <span>المناسبة:</span>
                      <span className="font-bold text-[#FAF7F0]">
                        {bookingType === "katbketab" ? "كتب كتاب (عقد قران)" : "عزاء"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>الموعد المحدد:</span>
                      <span className="font-bold text-[#FAF7F0]">
                        {selectedDay} {currentMonth.name} - {selectedSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>القاعة:</span>
                      <span className="font-bold text-[#FAF7F0]">{selectedHall}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-black text-xs shadow-[0_0_20px_rgba(196,154,108,0.25)] active:scale-95 transition"
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
      <footer className="border-t border-[#22334A] bg-[#0B1220] py-8 text-center text-xs text-[#8A9BB3]">
        <p>© جامع الحق ودار المناسبات الإسلامية — خدمة المجتمع والسكينة الإيمانية.</p>
      </footer>
    </div>
  );
}
