"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  HeartHandshake,
  Landmark,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // When video reaches its end, it stays on the last frame and text fades in
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
      mobileVideoRef.current.currentTime = mobileVideoRef.current.duration || 3.3;
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

  // Autoplay fallback: if browser blocks autoplay or takes too long, fade in text gracefully
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

  const navLinks = [
    "الرئيسية",
    "عن المسجد",
    "مواقيت الصلاة",
    "الأنشطة والفعاليات",
    "التبرع",
    "اتصل بنا",
  ];

  return (
    <>
      {/* =========================================================================
          MOBILE VIEW (< 1024px / block lg:hidden)
          The video plays in the background, freezes at its last frame,
          and the text of the page fades in directly on top of the last frame.
          ========================================================================= */}
      <div className="block lg:hidden min-h-screen bg-[#0e1713] relative overflow-x-hidden text-right">
        {/* Full-bleed Mobile Hero Container */}
        <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-black">
          {/* Background Video: plays on load, freezes on the last frame */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover object-[32%_center]"
            >
              <source src="/landing_intro.mp4" type="video/mp4" />
              <source src="/download%20(1).mp4" type="video/mp4" />
            </video>
          </div>

          {/* Soft ambient gradient overlay that fades in with the text for readability */}
          <div
            className={`absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35 transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick Skip button while video is playing */}
          {!videoEnded && (
            <button
              onClick={handleSkip}
              className="absolute top-4 left-4 z-30 px-3.5 py-1.5 rounded-full bg-black/50 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3 h-3 text-amber-300" />
            </button>
          )}

          {/* Top App Bar & Main Content: Fades in on the exact last frame */}
          <div
            className={`relative z-10 flex flex-col justify-between min-h-[100dvh] transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {/* Mobile Top App Bar */}
            <header className="relative z-20 flex items-center justify-between px-3.5 pt-3.5 pb-2">
              {/* Quick Actions (Search, Replay & Menu Buttons - renders on right in RTL) */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="بحث"
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-200 shadow-sm active:scale-95 transition hover:bg-black/60"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  aria-label="إعادة المقدمة"
                  onClick={handleReplay}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-200 shadow-sm active:scale-95 transition hover:bg-black/60"
                  title="إعادة تشغيل المقدمة"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  aria-label="القائمة"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-[#8f6b28] text-white flex items-center justify-center shadow-md active:scale-95 transition hover:bg-[#7a591e]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

              {/* Mosque Branding Pill (renders on left in RTL) */}
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-amber-400/30">
                <MosqueDomeIcon className="w-5 h-5 text-amber-300" />
                <span className="font-aref text-lg font-bold text-white pt-0.5">
                  جامع الحق
                </span>
              </div>
            </header>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 left-3 right-3 z-30 bg-[#121c17]/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-amber-500/25"
              >
                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveTab(item);
                        setMobileMenuOpen(false);
                      }}
                      className={`rounded-xl px-3 py-2.5 text-xs font-bold transition text-right ${
                        activeTab === item
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Hero Content (Strictly Right-Aligned over the sunset marble courtyard) */}
            <div className="relative z-10 flex flex-col justify-center items-start text-right pr-4 pl-2 pt-8 pb-6 my-auto w-full">
              <div className="w-[60%] sm:w-[52%] mr-0 ml-auto flex flex-col items-start text-right gap-3">
                {/* Eyebrow with gold accent line */}
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm self-start">
                  <span className="w-8 h-[2px] bg-amber-400" />
                  <span>مرحبـاً بكم في</span>
                </div>

                {/* Main Mosque Name */}
                <h1 className="font-aref text-[42px] sm:text-5xl font-black text-white tracking-tight leading-[1.05] text-right w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
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
            <div className="relative z-10 w-full grid grid-cols-3 border-t border-white/15 pt-3 pb-5 px-1 bg-gradient-to-t from-black/85 to-transparent">
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
          </div>
        </section>

        {/* Mobile Prayer Times Strip */}
        <section id="prayer-times-mobile" className="border-t border-white/10 bg-[#121c17] px-4 py-8">
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
        <footer className="border-t border-white/10 bg-[#0e1713] py-6 px-4 text-center text-xs text-slate-400 flex flex-col gap-2">
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
          The video is the background of the hero. When it reaches its end,
          it freezes on that last frame, and the text of the page fades in.
          ========================================================================= */}
      <main className="hidden lg:flex min-h-screen bg-[#0e1713] relative flex-col justify-center items-center py-8 px-6 lg:px-10 overflow-x-hidden">
        {/* Soft warm tones around the page */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -ml-40 -mb-20" />

        {/* Main site shell */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[1560px] bg-[#14211b] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col relative z-10"
        >
          {/* Webpage Content */}
          <div className="bg-[#14211b] flex flex-col gap-0">
            {/* Desktop Navigation Bar: Fades in with the page content */}
            <nav
              className={`flex min-h-[100px] items-center justify-between gap-3 border-b border-white/10 px-8 lg:px-12 bg-black/25 backdrop-blur-md transition-opacity duration-1000 ${
                videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Logo in Aref Ruqaa Bold */}
              <Link href="/" className="group flex items-center gap-2">
                <Landmark className="h-7 w-7 shrink-0 text-amber-400" />
                <span className="font-aref text-3xl font-bold text-white transition-colors group-hover:text-amber-300">
                  جامع الحق
                </span>
              </Link>

              <div className="flex items-center gap-8">
                {navLinks.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`relative py-2 text-sm font-semibold transition-colors ${
                      activeTab === item
                        ? "font-bold text-amber-300 after:absolute after:inset-x-0 after:-bottom-[30px] after:h-0.5 after:bg-amber-400"
                        : "text-slate-300 hover:text-amber-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReplay}
                  aria-label="إعادة المقدمة"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-amber-200 border border-white/15 transition active:scale-95"
                  title="إعادة تشغيل المقدمة"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>المقدمة</span>
                </button>
                <button
                  aria-label="بحث"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-amber-200 transition hover:bg-white/20 border border-white/15"
                >
                  <Search className="h-5 w-5" />
                </button>
                <a
                  href="#prayer-times"
                  className="items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 inline-flex shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  تبرع الآن
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </nav>

            {/* Desktop Hero Section: Video is the background, freezes on last frame */}
            <section className="relative isolate min-h-[820px] overflow-hidden bg-black">
              {/* Background Video: plays on load, freezes on the last frame */}
              <div className="absolute inset-0 -z-20 overflow-hidden">
                <video
                  ref={desktopVideoRef}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={handleVideoEnded}
                  className="h-full w-full object-cover object-center"
                >
                  <source src="/landing_intro.mp4" type="video/mp4" />
                  <source src="/download%20(1).mp4" type="video/mp4" />
                </video>
              </div>

              {/* Soft atmospheric gradient that fades in with the text to ensure high readability */}
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-l from-black/80 via-black/40 to-transparent transition-opacity duration-1000 pointer-events-none ${
                  videoEnded ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`absolute inset-x-0 bottom-0 h-44 -z-10 bg-gradient-to-t from-[#14211b] via-[#14211b]/70 to-transparent transition-opacity duration-1000 pointer-events-none ${
                  videoEnded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Quick Skip button while video is playing */}
              {!videoEnded && (
                <button
                  onClick={handleSkip}
                  className="absolute top-6 left-6 z-30 px-4 py-2 rounded-full bg-black/50 hover:bg-black/75 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <span>تخطي</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
                </button>
              )}

              {/* Content fades in directly on top of the last frame */}
              <div
                className={`relative z-10 ml-auto flex min-h-[820px] w-[53%] flex-col justify-center px-10 py-20 transition-all duration-1000 ease-out ${
                  videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex flex-col items-start gap-5 text-right">
                  <div className="flex items-center gap-4 text-lg font-semibold text-amber-300">
                    <span className="h-px w-16 bg-amber-400" />
                    <span>مرحبًا بكم في</span>
                  </div>

                  <h1 className="font-aref text-7xl font-bold leading-[1.2] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                    جامع الحق
                  </h1>
                  <h2 className="text-3xl font-bold leading-relaxed text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    بيت من بيوت الله ... يجمعنا على الخير
                  </h2>
                  <p className="text-base leading-8 text-slate-100 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    مكان للعبادة، والعلم، والمجتمع، حيث تلتقي القلوب على الإيمان، وتُبنى العلاقات على الخير، وتزدهر حياتنا بقيم الإسلام.
                  </p>

                  <div className="flex items-center gap-4 mt-1">
                    <a
                      href="#prayer-times"
                      className="inline-flex min-h-14 items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-7 text-base font-bold text-slate-950 shadow-xl shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
                    >
                      <span>اكتشف المزيد</span>
                      <ArrowLeft className="h-5 w-5 text-slate-950" />
                    </a>
                  </div>

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
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-300">
                          <item.icon className="h-6 w-6" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          <span className="text-[10px] text-slate-300">{item.detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Desktop Interactive Prayer Times Strip */}
            <div id="prayer-times" className="mt-0 border-t border-white/10 px-8 py-10 bg-[#121c17]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white">مواقيت الصلاة لليوم</h3>
                  <p className="text-xs text-slate-400">حسب التوقيت المحلي لجامع الحق</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
                  ● محدث مباشرة
                </span>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {prayerTimes.map((prayer, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      prayer.isNext
                        ? "bg-amber-500/20 text-white border-amber-400/50 shadow-lg shadow-amber-500/10 scale-105"
                        : "bg-black/30 text-slate-200 border-white/10 hover:bg-black/45"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold block mb-1 ${
                        prayer.isNext ? "text-amber-300" : "text-slate-400"
                      }`}
                    >
                      {prayer.name}
                    </span>
                    <span className="text-lg font-bold font-mono tracking-tight block text-white">
                      {prayer.time}
                    </span>
                    {prayer.isNext && (
                      <span className="inline-block mt-2 text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                        القادمة
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop Footer Info */}
        <footer className="w-full max-w-[1560px] mt-5 flex items-center justify-between gap-3 text-right text-xs text-slate-400 px-3">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>المملكة العربية السعودية</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>للتواصل والاستفسار</span>
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
