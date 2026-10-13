"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  HeartHandshake,
  Landmark,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  Search,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import QuickBookingModal from "@/components/QuickBookingModal";

function MosqueDomeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v2.5" />
      <circle cx="12" cy="2" r="0.75" fill="currentColor" />
      <path d="M12 4.5C8.5 7 7.5 11 7.5 15V22H16.5V15C16.5 11 15.5 7 12 4.5Z" />
      <path d="M10 22v-4.5a2 2 0 0 1 4 0V22" />
      <path d="M4 17v5H7.5" />
      <path d="M20 17v5H16.5" />
    </svg>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("الرئيسية");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [bookingModalType, setBookingModalType] = useState<"3aza" | "katbketab">("katbketab");

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const openCalendarFor = (type: "3aza" | "katbketab") => {
    setBookingModalType(type);
    setCalendarModalOpen(true);
    setMobileMenuOpen(false);
  };

  // When video reaches its end, it pauses on the last frame and text fades in
  const handleVideoEnded = () => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.pause();
    }
    setVideoEnded(true);
  };

  const handleSkip = () => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.currentTime = desktopVideoRef.current.duration || 3.3;
      desktopVideoRef.current.pause();
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.currentTime = mobileVideoRef.current.duration || 3.1;
      mobileVideoRef.current.pause();
    }
    setVideoEnded(true);
  };

  const handleReplay = () => {
    setVideoEnded(false);
    if (desktopVideoRef.current) {
      desktopVideoRef.current.currentTime = 0;
      desktopVideoRef.current.play().catch(() => {});
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.currentTime = 0;
      mobileVideoRef.current.play().catch(() => {});
    }
  };

  // Autoplay fallback: if browser blocks autoplay or delays, fade in text gracefully
  useEffect(() => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch(() => {});
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(() => {});
    }

    const fallbackTimer = setTimeout(() => {
      setVideoEnded(true);
    }, 4500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const prayerTimes = [
    { name: "الفجر", time: "04:45 ص", isNext: true },
    { name: "الشروق", time: "06:05 ص", isNext: false },
    { name: "الظهر", time: "12:15 م", isNext: false },
    { name: "العصر", time: "03:30 م", isNext: false },
    { name: "المغرب", time: "06:10 م", isNext: false },
    { name: "العشاء", time: "07:40 م", isNext: false },
  ];

  return (
    <>
      {/* =========================================================================
          MOBILE VIEW (< 1024px / block lg:hidden)
          Full-screen edge-to-edge. Video plays in background and halts on last frame.
          Navbar is an overlay directly in the video frame at the top.
          ========================================================================= */}
      <div className="block lg:hidden min-h-screen bg-[#090f0c] relative overflow-x-hidden text-right">
        {/* Fullscreen Mobile Hero Container */}
        <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-black">
          {/* Background Video: Edge to edge, plays on load and halts on last frame */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/mobile_last_frame.jpg"
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover object-center"
            >
              <source src="/mobileview.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Soft ambient gradient overlay that fades in with the text */}
          <div
            className={`absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-black/35 transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick Skip button while video is playing */}
          {!videoEnded && (
            <button
              onClick={handleSkip}
              className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-full bg-black/60 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3 h-3 text-amber-300" />
            </button>
          )}

          {/* Mobile Top App Bar: Directly inside the video frame at top */}
          <header
            className={`relative z-20 flex items-center justify-between px-4 pt-4 pb-2 transition-opacity duration-1000 ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Quick Actions (Booking pill, Replay & Menu Buttons) */}
            <div className="flex items-center gap-2">
              <button
                aria-label="حجز موعد"
                onClick={() => openCalendarFor("katbketab")}
                className="px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex items-center gap-1.5 text-amber-300 text-xs font-bold shadow-sm active:scale-95 transition hover:bg-amber-500/30"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>حجز موعد</span>
              </button>
              <button
                aria-label="إعادة المقدمة"
                onClick={handleReplay}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-200 shadow-sm active:scale-95 transition hover:bg-black/60"
                title="إعادة تشغيل المقدمة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                aria-label="القائمة"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-full bg-[#8f6b28] text-white flex items-center justify-center shadow-md active:scale-95 transition hover:bg-[#7a591e]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mosque Branding Pill (renders on left in RTL) */}
            <Link href="/" className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-amber-400/30">
              <MosqueDomeIcon className="w-5 h-5 text-amber-300" />
              <span className="font-aref text-lg font-bold text-white pt-0.5">
                جامع الحق
              </span>
            </Link>
          </header>

          {/* Mobile Dropdown Menu Drawer */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-16 left-3 right-3 z-30 bg-[#121c17]/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-amber-500/25 space-y-3"
            >
              {/* Quick Occasion Reservation Buttons */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-2.5">
                <span className="block text-[11px] font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>حجز دار المناسبات (مع التقويم المباشر):</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openCalendarFor("3aza")}
                    className="py-2 px-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-right transition"
                  >
                    <span className="block text-xs font-bold text-white">🕊️ حجز عزاء</span>
                    <span className="block text-[10px] text-slate-400">تقويم المواعيد والقاعات</span>
                  </button>
                  <button
                    onClick={() => openCalendarFor("katbketab")}
                    className="py-2 px-2.5 rounded-lg bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25 text-right transition"
                  >
                    <span className="block text-xs font-bold text-amber-300">💍 كتب كتاب</span>
                    <span className="block text-[10px] text-slate-300">عقد قران واحتفال</span>
                  </button>
                </div>
              </div>

              {/* Main Links */}
              <div className="space-y-1">
                <Link
                  href="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>صفحة حجز المناسبات والتقويم</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                    متاح
                  </span>
                </Link>

                <Link
                  href="/videos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>مكتبة الفيديوهات والمرئيات</span>
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    فيديوهات المسجد
                  </span>
                </Link>

                <a
                  href="#prayer-times-mobile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                >
                  مواقيت الصلاة لليوم
                </a>
              </div>
            </motion.div>
          )}

          {/* Main Hero Content (Strictly Right-Aligned over the sunset marble courtyard) */}
          <div
            className={`relative z-20 flex flex-col justify-center items-start text-right pr-4 pl-2 pt-6 pb-4 my-auto w-full transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-[62%] sm:w-[54%] mr-0 ml-auto flex flex-col items-start text-right gap-3">
              {/* Eyebrow with gold accent line */}
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm self-start">
                <span className="w-8 h-[2px] bg-amber-400" />
                <span>مرحبـاً بكم في</span>
              </div>

              {/* Main Mosque Name */}
              <h1 className="font-aref text-[44px] sm:text-5xl font-black text-white tracking-tight leading-[1.05] text-right w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                جامع الحق
              </h1>

              {/* Subheading */}
              <h2 className="text-[20px] sm:text-[22px] font-bold text-amber-200 leading-[1.35] text-right w-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                بيتٌ منّ بيوت الله ...
                <br />
                يجمّعنا عليِ الخير
              </h2>

              {/* Description */}
              <p className="text-[12.5px] sm:text-[13.5px] text-slate-200 leading-[1.7] font-medium text-right w-full drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                مكان للعبادة، والعلم، والمجتمع،
                <br />
                حيث تلتقي القلوب على الإيمان،
                <br />
                وتبني العلاقات على الخير،
                <br />
                ونزدهر حياتنا بقيم الإسلام.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-2 mt-1 self-start">
                <a
                  href="#prayer-times-mobile"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition hover:brightness-110"
                >
                  <span>اكتشف المزيد</span>
                  <ArrowLeft className="w-4 h-4 text-slate-950" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Features Bar (3 columns with dividers) */}
          <div
            className={`relative z-20 w-full grid grid-cols-3 border-t border-white/15 pt-3 pb-5 px-1 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-1000 ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Column 1 (صدقة جارية - renders on right in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 mb-1.5 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">صدقة جارية</span>
              <span className="text-[10px] text-slate-300">لأجر مستدام</span>
            </div>

            {/* Column 2 (علم ونور - renders in center) with vertical dividers */}
            <div className="flex flex-col items-center text-center px-1 border-r border-l border-white/15">
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 mb-1.5 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">علمٌ ونور</span>
              <span className="text-[10px] text-slate-300">لبناء جيل واعٍ</span>
            </div>

            {/* Column 3 (مجتمع متعاون - renders on left in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-amber-300 mb-1.5 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">مجتمع متعاون</span>
              <span className="text-[10px] text-slate-300">معاً نصنع الأثر</span>
            </div>
          </div>
        </section>

        {/* Mobile Prayer Times Strip */}
        <section id="prayer-times-mobile" className="border-t border-white/10 bg-[#0d1612] px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-white">مواقيت الصلاة لليوم</h3>
              <p className="text-xs text-slate-400">حسب التوقيت المحلي لجامع الحق</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
              ● محدث الآن
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {prayerTimes.map((prayer, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  prayer.isNext
                    ? "bg-amber-500/20 text-white border-amber-400/50 shadow-lg shadow-amber-500/10"
                    : "bg-black/30 text-slate-200 border-white/10"
                }`}
              >
                <span className={`text-[11px] font-semibold block mb-0.5 ${prayer.isNext ? "text-amber-300" : "text-slate-400"}`}>
                  {prayer.name}
                </span>
                <span className="text-base font-bold font-mono tracking-tight block text-white">
                  {prayer.time}
                </span>
                {prayer.isNext && (
                  <span className="inline-block mt-1 text-[9px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    القادمة
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Footer */}
        <footer className="border-t border-white/10 bg-[#080d0a] py-6 px-4 text-center text-xs text-slate-400 flex flex-col gap-2">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              المملكة العربية السعودية
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              للتواصل والاستفسار
            </span>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          DESKTOP / LAPTOP VIEW (>= 1024px / hidden lg:flex)
          - NO FRAME: Website is 100% full screen edge-to-edge.
          - Video starts at the absolute top (0px) filling the full viewport.
          - Navbar is directly INSIDE the video frame at the top.
          - When video ends, it pauses on the last frame, and the text fades in.
          ========================================================================= */}
      <main className="hidden lg:flex flex-col w-full min-h-screen bg-[#090f0c] text-white overflow-x-hidden">
        {/* Fullscreen Edge-to-Edge Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-black">
          {/* Background Video: Edge-to-edge starting at the absolute top (0px) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={desktopVideoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover object-center"
            >
              <source src="/laptopview.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Atmospheric gradient overlays that fade in with the text for maximum readability */}
          <div
            className={`absolute inset-0 z-10 bg-gradient-to-l from-black/85 via-black/45 to-transparent transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-0 inset-x-0 h-40 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-0 inset-x-0 h-44 z-10 bg-gradient-to-t from-[#0d1612] via-[#0d1612]/60 to-transparent transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick Skip button while video is playing */}
          {!videoEnded && (
            <button
              onClick={handleSkip}
              className="absolute top-6 left-6 z-40 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-xl active:scale-95"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}

          {/* Desktop Navigation Bar: INSIDE the video frame at the absolute top */}
          <header
            className={`relative z-30 w-full flex min-h-[96px] items-center justify-between px-8 lg:px-14 py-4 transition-opacity duration-1000 ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Logo in Aref Ruqaa Bold */}
            <Link href="/" className="group flex items-center gap-2.5">
              <Landmark className="h-7 w-7 shrink-0 text-amber-400" />
              <span className="font-aref text-3xl font-bold text-white transition-colors group-hover:text-amber-300 drop-shadow-md">
                جامع الحق
              </span>
            </Link>

            {/* Desktop Nav links */}
            <nav className="flex items-center gap-7">
              <Link
                href="/"
                className="py-2 text-sm font-bold text-amber-300 transition-colors"
              >
                الرئيسية
              </Link>

              {/* Booking Nav item with 3aza & Katbketab indicators */}
              <div className="relative group">
                <Link
                  href="/booking"
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-200 hover:text-amber-300 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>حجز مناسبة</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    عزاء وكتب كتاب
                  </span>
                </Link>
              </div>

              {/* Videos Page Link */}
              <Link
                href="/videos"
                className="flex items-center gap-1.5 py-2 text-sm font-semibold text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>الفيديوهات</span>
              </Link>

              <a
                href="#prayer-times"
                className="py-2 text-sm font-semibold text-slate-200 hover:text-amber-300 transition-colors"
              >
                مواقيت الصلاة
              </a>

              <a
                href="#about"
                className="py-2 text-sm font-semibold text-slate-200 hover:text-amber-300 transition-colors"
              >
                عن المسجد والدار
              </a>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReplay}
                aria-label="إعادة المقدمة"
                className="inline-flex items-center gap-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-amber-200 border border-white/15 transition active:scale-95"
                title="إعادة تشغيل المقدمة"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>المقدمة</span>
              </button>

              <button
                aria-label="بحث"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-amber-200 transition hover:bg-black/60 backdrop-blur-md border border-white/15"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Direct Booking with Calendar Modal button */}
              <button
                onClick={() => openCalendarFor("katbketab")}
                className="items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:brightness-110 inline-flex shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Calendar className="h-4 w-4" />
                <span>احجز مناسبتك (التقويم)</span>
              </button>
            </div>
          </header>

          {/* Desktop Hero Content: INSIDE the video frame on the right side */}
          <div
            className={`relative z-20 ml-auto flex flex-1 w-[55%] flex-col justify-center px-10 lg:px-16 py-8 transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-start gap-5 text-right">
              {/* Eyebrow */}
              <div className="flex items-center gap-4 text-lg font-semibold text-amber-300">
                <span className="h-px w-16 bg-amber-400" />
                <span>مرحبًا بكم في</span>
              </div>

              {/* Title */}
              <h1 className="font-aref text-7xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                جامع الحق
              </h1>

              {/* Subheading */}
              <h2 className="text-3xl font-bold leading-relaxed text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                بيت من بيوت الله ... يجمعنا على الخير
              </h2>

              {/* Description */}
              <p className="text-base leading-8 text-slate-100 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                مكان للعبادة، والعلم، والمجتمع، حيث تلتقي القلوب على الإيمان، وتُبنى العلاقات على الخير، وتزدهر حياتنا بقيم الإسلام.
              </p>

              {/* CTA Button */}
              <div className="flex items-center gap-4 mt-2">
                <a
                  href="#prayer-times"
                  className="inline-flex min-h-14 items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 text-base font-bold text-slate-950 shadow-xl shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
                >
                  <span>اكتشف المزيد</span>
                  <ArrowLeft className="h-5 w-5 text-slate-950" />
                </a>
              </div>

              {/* 3 Bottom Feature Badges */}
              <div className="mt-4 grid w-full grid-cols-3 border-t border-white/20 pt-6">
                {[
                  { icon: HeartHandshake, title: "صدقة جارية", detail: "لأجر مستدام" },
                  { icon: BookOpen, title: "علم ونور", detail: "لبناء جيل واعٍ" },
                  { icon: Users, title: "مجتمع متعاون", detail: "معًا نصنع الأثر" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex min-w-0 flex-col items-center gap-2 border-l border-white/15 px-2 text-center last:border-l-0 lg:flex-row lg:text-right"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-300">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className="text-[11px] text-slate-300">{item.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dar Monasbat & Videos Showcase Section (Full Width Desktop) */}
        <section id="monasbat-section" className="w-full border-t border-white/10 bg-[#090f0c] px-8 lg:px-16 py-16">
          <div className="max-w-[1560px] mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-right">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>دار المناسبات الإسلامية • جامع الحق</span>
                </span>
                <h3 className="text-3xl font-extrabold font-aref text-white">
                  حجز قاعات المناسبات (عزاء وكتب كتاب)
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  قاعات فسيحة ومجهزة بأحدث الأنظمة الصوتية والمرئية، مع إمكانية استعراض التقويم المباشر وحجز موعدك فورياً.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/booking"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition flex items-center gap-2"
                >
                  <span>جدول الحجوزات الكامل</span>
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                </Link>
                <Link
                  href="/videos"
                  className="px-6 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>معرض الفيديوهات</span>
                </Link>
              </div>
            </div>

            {/* 3 Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Katb Ketab */}
              <div className="bg-[#0e1713] border border-amber-500/25 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/60 transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4 text-2xl group-hover:scale-110 transition-transform">
                    💍
                  </div>
                  <h4 className="text-xl font-bold font-aref text-white mb-2 group-hover:text-amber-300 transition-colors">
                    حجز كتب كتاب (عقد القران)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    أجواء مباركة وفخامة تليق بيومكم السعيد، مع قاعات مجهزة بكافة متطلبات الإشهار، ضيافة راقية، وتوثيق مرئي.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mb-6">
                    <li>• اختيار القاعة المناسبة حسب عدد الضيوف</li>
                    <li>• تقويم مواعيد تفاعلي لاختيار اليوم والفترة</li>
                    <li>• خدمات صوتية وشاشات عرض ونظام ضيافة</li>
                  </ul>
                </div>
                <button
                  onClick={() => openCalendarFor("katbketab")}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز موعد كتب الكتاب (التقويم)</span>
                </button>
              </div>

              {/* Card 2: 3aza */}
              <div className="bg-[#0e1713] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/60 transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/15 flex items-center justify-center text-white mb-4 text-2xl group-hover:scale-110 transition-transform">
                    🕊️
                  </div>
                  <h4 className="text-xl font-bold font-aref text-white mb-2 group-hover:text-amber-300 transition-colors">
                    حجز عزاء (دار التعازي)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    مجالس تأبين وعزاء تراعي الوقار والسكينة، قاعات مستقلة للرجال وأخرى للسيدات، مع تلاوات خاشعة لكبار القراء.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mb-6">
                    <li>• قاعات كبرى ووسطى تسع حتى 500 معزٍ</li>
                    <li>• طاقم ضيافة متميز وخدمة فندقية</li>
                    <li>• توفير قراء معتمدين ونظام صوتي عالي النقاء</li>
                  </ul>
                </div>
                <button
                  onClick={() => openCalendarFor("3aza")}
                  className="w-full py-3 rounded-full bg-[#8f6b28] hover:bg-[#7a591e] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز موعد العزاء (التقويم)</span>
                </button>
              </div>

              {/* Card 3: Videos Showcase */}
              <div className="bg-gradient-to-b from-[#121c17] to-[#0a110e] border border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400 transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6 text-amber-400" />
                  </div>
                  <h4 className="text-xl font-bold font-aref text-white mb-2 group-hover:text-amber-300 transition-colors">
                    مكتبة الفيديوهات والمرئيات
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    شاهد مقاطع الفيديو التوثيقية لجامع الحق، وجولات مصورة في قاعات دار المناسبات، وتلاوات قرآنية مسجلة بجودة عالية.
                  </p>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                    <img
                      src="/landing_last_frame.jpg"
                      alt="معرض الفيديوهات"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/videos"
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 text-center"
                >
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>استعراض جميع الفيديوهات المتاحة</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Interactive Prayer Times Strip (Full Width) */}
        <section id="prayer-times" className="w-full border-t border-white/10 bg-[#0d1612] px-8 lg:px-16 py-14">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-white">مواقيت الصلاة لليوم</h3>
                <p className="text-sm text-slate-400">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-xs font-bold px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
                ● محدث مباشرة
              </span>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-amber-500/20 text-white border-amber-400/50 shadow-lg shadow-amber-500/10 scale-105"
                      : "bg-black/30 text-slate-200 border-white/10 hover:bg-black/45"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block mb-1.5 ${
                      prayer.isNext ? "text-amber-300" : "text-slate-400"
                    }`}
                  >
                    {prayer.name}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight block text-white">
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="inline-block mt-2.5 text-[10px] bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Footer (Full Width) */}
        <footer className="w-full border-t border-white/10 bg-[#080d0a] px-8 lg:px-16 py-8">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3 text-right text-xs text-slate-400">
            <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>المملكة العربية السعودية</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>للتواصل والاستفسار</span>
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Quick Booking Modal with Calendar */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={bookingModalType}
      />
    </>
  );
}
