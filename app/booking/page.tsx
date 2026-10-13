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
    <div className="min-h-screen bg-[#070c09] text-white flex flex-col font-sans text-right selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-b from-[#0d1612] via-[#090f0c] to-[#070c09] border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-4">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <span>نظام الحجز الإلكتروني لدار المناسبات بجامع الحق</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-aref text-white tracking-tight mb-4 drop-shadow-md">
            حجز قاعات المناسبات (عزاء وكتب كتاب)
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            نسعد باستقبال مناسباتكم المباركة ومجالسكم في قاعات دار المناسبات المجهزة بأحدث الوسائل
            والأنظمة الصوتية، مع إمكانية استعراض التقويم وحجز موعدك فورياً.
          </p>

          {/* Toggle Occasion Type */}
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 mt-8 p-1.5 bg-black/60 border border-white/15 rounded-2xl shadow-xl">
            <button
              onClick={() => setBookingType("katbketab")}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                bookingType === "katbketab"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>💍 حجز كتب كتاب</span>
              <span className="text-[10px] hidden sm:inline">(عقد قران)</span>
            </button>
            <button
              onClick={() => setBookingType("3aza")}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                bookingType === "3aza"
                  ? "bg-[#8f6b28] text-white font-black shadow-lg shadow-amber-900/30 border border-amber-400/30 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🕊️ حجز عزاء</span>
              <span className="text-[10px] hidden sm:inline">(دار التعازي)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Reservation Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {isSubmitted ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto bg-[#0d1612] border border-amber-400/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-400/30">
              تم تسجيل طلب الحجز بنجاح
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-aref text-white mt-4 mb-2">
              {bookingType === "katbketab"
                ? "بارك الله لكما وبارك عليكما وجمع بينكما في خير"
                : "عظم الله أجركم ورحم ميتكم وألهمكم الصبر والسلوان"}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              تم تثبيت طلبك في جدول حجوزات دار المناسبات بجامع الحق. كود الحجز المرجعي:
              <span className="block text-2xl font-mono font-bold text-amber-300 mt-2">
                {reservationCode}
              </span>
            </p>

            {/* Summary Details */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-5 text-right text-xs space-y-3 mb-8">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">نوع المناسبة:</span>
                <span className="font-bold text-amber-300">
                  {bookingType === "katbketab" ? "عقد قران (كتب كتاب)" : "مجلس عزاء وتأبين"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">التاريخ المحدد:</span>
                <span className="font-bold text-white">
                  اليوم {selectedDay} من {currentMonth.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">الفترة والقاعة:</span>
                <span className="font-bold text-white">
                  {timeSlots.find((s) => s.id === selectedSlot)?.title} • {selectedHall}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">صاحب الحجز:</span>
                <span className="font-bold text-white">
                  {fullName} ({phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الخدمات الإضافية:</span>
                <span className="font-bold text-amber-300">
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
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Send className="w-4 h-4" />
                تأكيد عبر واتساب إدارة المسجد
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition"
              >
                تعديل أو حجز جديد
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Reservation Steps */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Calendar & Time Slots */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Calendar Widget */}
              <div className="bg-[#0d1612] border border-amber-500/25 rounded-3xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-aref text-white flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-amber-400" />
                      <span>1. اختر تاريخ المناسبة من التقويم</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      الأيام الخضراء متاحة للحجز الفوري
                    </p>
                  </div>

                  {/* Month controls */}
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentMonthIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 transition"
                      title="الشهر السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-amber-300 px-2 font-aref">
                      {currentMonth.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))
                      }
                      disabled={currentMonthIndex === months.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-300 transition"
                      title="الشهر التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday names */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2 py-1.5 border-b border-white/5">
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
                            ? "bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30 scale-105"
                            : isBooked
                            ? "bg-white/5 text-slate-600 cursor-not-allowed line-through opacity-60"
                            : isPartiallyBooked
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                            : "bg-black/40 text-slate-200 border border-white/10 hover:border-amber-400/50 hover:bg-white/10"
                        }`}
                      >
                        <span>{day}</span>
                        {isPartiallyBooked && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1.5" />
                        )}
                        {!isBooked && !isPartiallyBooked && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-emerald-400/70 absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    المحدد ({selectedDay} {currentMonth.name})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    متاح للحجز
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    متاح جزئياً
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                    محجوز بالكامل
                  </span>
                </div>
              </div>

              {/* Step 2: Time Slots */}
              <div className="bg-[#0d1612] border border-amber-500/25 rounded-3xl p-5 sm:p-6 shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold font-aref text-white flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-amber-400" />
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
                            ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                            : "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold text-white mb-1">
                          {slot.title}
                        </span>
                        <span className="block text-[11px] text-amber-300 font-mono mb-1">
                          {slot.time}
                        </span>
                        <span className="block text-[10px] text-slate-400">{slot.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Halls Available */}
              <div className="bg-[#0d1612] border border-amber-500/25 rounded-3xl p-5 sm:p-6 shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold font-aref text-white flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-amber-400" />
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
                            ? "bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10"
                            : "bg-black/40 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-amber-400 bg-amber-400" : "border-slate-500"
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-white">
                                {hall.name}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-semibold">
                                {hall.capacity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">{hall.suitability}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {hall.features.map((f, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md text-slate-400"
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

            {/* Right Column: Services & Client Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Optional Add-on Services */}
              <div className="bg-[#0d1612] border border-amber-500/25 rounded-3xl p-5 sm:p-6 shadow-xl">
                <h2 className="text-base sm:text-lg font-bold font-aref text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>الخدمات المجهزة لمناسبتك</span>
                </h2>

                <div className="space-y-2.5">
                  {optionalServices.map((service) => {
                    const isChecked = selectedServices.includes(service.id);
                    const Icon = service.icon;

                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`w-full p-3 rounded-2xl border text-right flex items-start gap-3 transition ${
                          isChecked
                            ? "bg-amber-500/15 border-amber-400/80 text-white"
                            : "bg-black/35 border-white/10 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-amber-400 text-slate-950 font-bold"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-white">
                            {service.title}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {service.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reservation Details Form */}
              <div className="bg-[#0d1612] border border-amber-500/25 rounded-3xl p-5 sm:p-6 shadow-xl">
                <h2 className="text-base sm:text-lg font-bold font-aref text-white flex items-center gap-2 mb-4">
                  <HeartHandshake className="w-5 h-5 text-amber-400" />
                  <span>بيانات صاحب الحجز</span>
                </h2>

                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      الاسم الثلاثي أو الرباعي *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسم صاحب الحجز"
                      className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-right"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        رقم الهاتف / الواتساب *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        رقم هاتف إضافي (بديل)
                      </label>
                      <input
                        type="tel"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="اختياري"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {bookingType === "katbketab" ? "اسما العروسين" : "اسم المتوفى رحمه الله"}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        bookingType === "katbketab"
                          ? "مثال: أحمد & سارة"
                          : "مثال: المرحوم بإذن الله فلان الفلاني"
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-right"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-slate-300 space-y-1.5">
                    <div className="flex justify-between">
                      <span>المناسبة:</span>
                      <span className="font-bold text-amber-300">
                        {bookingType === "katbketab" ? "كتب كتاب (عقد قران)" : "عزاء"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>الموعد المحدد:</span>
                      <span className="font-bold text-white">
                        {selectedDay} {currentMonth.name} - {selectedSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>القاعة:</span>
                      <span className="font-bold text-white">{selectedHall}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition"
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
      <footer className="border-t border-white/10 bg-[#060a08] py-8 text-center text-xs text-slate-400">
        <p>© جامع الحق ودار المناسبات الإسلامية — خدمة المجتمع والسكينة الإيمانية.</p>
      </footer>
    </div>
  );
}
