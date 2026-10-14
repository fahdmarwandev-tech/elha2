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
import AboutMosque from "@/components/AboutMosque";

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
  const [videoEnded, setVideoEnded] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [bookingModalType, setBookingModalType] = useState<"3aza" | "katbketab">("katbketab");
  const [scrollY, setScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoLoadedRef = useRef(false);
  const [desktopHqLoaded, setDesktopHqLoaded] = useState(false);
  const [mobileHqLoaded, setMobileHqLoaded] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const openCalendarFor = (type: "3aza" | "katbketab") => {
    setBookingModalType(type);
    setCalendarModalOpen(true);
  };

  const handleVideoPlaying = () => {
    videoLoadedRef.current = true;
    setVideoLoaded(true);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime > 0.05 && !videoLoadedRef.current) {
      videoLoadedRef.current = true;
      setVideoLoaded(true);
    }
    // The text fades in strictly when the video finishes playing (reaches end)
    if (video.duration && video.currentTime >= video.duration - 0.12) {
      handleVideoEnded();
    }
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
    videoLoadedRef.current = true;
    setVideoLoaded(true);
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

  // Scroll listener: smoothly tracks scrollY for navbar convergence animation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll convergence physics (0.0 to 1.0 over first 240px of scroll)
  const scrollFactor = Math.min(1, Math.max(0, scrollY / 240));
  // Gap shrinks from 180px down to 10px as you scroll
  const dynamicGap = Math.max(10, Math.round((1 - scrollFactor) * 180));
  // Mobile dynamic gap shrinks from 26px down to 6px
  const mobileDynamicGap = Math.max(6, Math.round((1 - scrollFactor) * 26));
  // Nav cluster translates horizontally towards the 3-bar sidebar button at top-right
  const navTranslateX = scrollFactor * 340;
  const mobileNavTranslateX = scrollFactor * 175;
  // Nav stays 100% visible while drawing closer, then smoothly drops into the 3-bar button at the end
  const navOpacity = scrollFactor >= 0.85 ? Math.max(0, (1 - scrollFactor) / 0.15) : 1;
  const navScale = scrollFactor >= 0.75 ? Math.max(0.15, 1 - (scrollFactor - 0.75) * 3.4) : Math.max(0.85, 1 - scrollFactor * 0.15);
  // Sidebar button appears and scales up to receive the falling navbar
  const sidebarButtonOpacity = scrollFactor >= 0.15 ? Math.min(1, (scrollFactor - 0.15) / 0.45) : 0;
  const sidebarButtonScale = scrollFactor >= 0.15 ? Math.min(1, 0.5 + ((scrollFactor - 0.15) / 0.85) * 0.5) : 0;
  // Header extras (logo & left actions) fade out gently as scroll begins
  const headerExtrasOpacity = Math.max(0, 1 - scrollFactor * 2.5);

  // Proactively start playing video on mount and check cached images
  useEffect(() => {
    if (typeof window !== "undefined") {
      const imgMobile = new Image();
      imgMobile.src = "/mobile_first_frame.jpg";
      if (imgMobile.complete) setMobileHqLoaded(true);

      const imgDesktop = new Image();
      imgDesktop.src = "/landing_first_frame.jpg";
      if (imgDesktop.complete) setDesktopHqLoaded(true);
    }

    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch(() => {});
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(() => {});
    }
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
      <div className="block lg:hidden min-h-screen bg-[#0B1220] relative overflow-x-hidden text-right">
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
              poster="/mobile_first_frame.jpg"
              onPlaying={handleVideoPlaying}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover object-center"
            >
              <source src="/1012(1).mp4" type="video/mp4" />
            </video>

            {/* Progressive First Frame Placeholder: Blurry LQ -> Smoothly fades to crisp HQ -> Smoothly dissolves into Video */}
            <div
              className={`absolute inset-0 z-10 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${
                videoLoaded ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Step 1: Blurry low-quality image (loads instantly in ~10ms, 13KB) */}
              <img
                src="/mobile_first_frame_lq.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center filter blur-lg scale-105"
              />

              {/* Step 2: High quality picture fades in over the blurry one once loaded */}
              <img
                src="/mobile_first_frame.jpg"
                alt=""
                onLoad={() => setMobileHqLoaded(true)}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
                  mobileHqLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Gradient strictly on the right side behind text, leaving the left side and minaret clear and bright */}
          <div
            className={`absolute inset-y-0 right-0 w-[72%] z-10 bg-gradient-to-l from-[#040914] via-[#061224]/85 via-[#081830]/40 to-transparent transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick Skip button while video is playing */}
          {!videoEnded && (
            <button
              onClick={handleSkip}
              className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-full bg-[#152132]/85 text-[#FAF7F0] hover:text-white text-xs font-semibold backdrop-blur-md border border-[#22334A] flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3 h-3 text-[#C49A6C]" />
            </button>
          )}

          {/* Mobile Top App Bar: Fixed inside viewport with scroll convergence into 3-bar sidebar button */}
          <header
            className={`fixed top-0 inset-x-0 z-30 flex items-center justify-between px-3 sm:px-4 pt-3.5 sm:pt-4 pb-2 transition-opacity duration-700 ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${
              scrollFactor >= 0.98 ? "pointer-events-none" : ""
            }`}
          >
            {/* Mosque Branding */}
            <Link
              href="/"
              style={{
                opacity: headerExtrasOpacity,
                pointerEvents: headerExtrasOpacity > 0.2 ? "auto" : "none",
              }}
              className="flex items-center gap-1.5 sm:gap-2 group transition-opacity duration-300"
            >
              <MosqueDomeIcon className="w-5 h-5 text-[#C49A6C]" />
              <span className="font-aref text-xl font-bold text-[#FAF7F0] transition-colors group-hover:text-[#C49A6C] drop-shadow-md">
                جامع الحق
              </span>
            </Link>

            {/* The 3 Links: Smooth, luxury typography */}
            <nav
              style={{
                gap: `${mobileDynamicGap}px`,
                transform: `translateX(${mobileNavTranslateX}px) scale(${navScale})`,
                opacity: navOpacity,
                pointerEvents: navOpacity > 0.2 ? "auto" : "none",
                transformOrigin: "center right",
              }}
              className="flex items-center transition-all duration-75 will-change-transform"
            >
              <Link
                href="/booking"
                className="text-[#D4AF85] hover:text-[#FAF7F0] transition-colors whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] text-sm sm:text-base font-bold"
              >
                حجز مناسبة
              </Link>
              <Link
                href="/videos"
                className="text-white/95 hover:text-[#D4AF85] transition-colors whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] text-sm sm:text-base font-bold"
              >
                الفيديوهات
              </Link>
              <a
                href="#about-mobile"
                className="text-white/95 hover:text-[#D4AF85] transition-colors whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] text-sm sm:text-base font-bold"
              >
                عن المسجد
              </a>
            </nav>
          </header>

          {/* Main Hero Content (Strictly Right-Aligned over the sunset marble courtyard) */}
          <div
            className={`relative z-20 flex flex-col justify-center items-start text-right pr-4 pl-2 pt-16 sm:pt-20 pb-4 my-auto w-full transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-[62%] sm:w-[54%] mr-0 ml-auto flex flex-col items-start text-right gap-3">
              {/* Eyebrow with caramel accent line */}
              <div className="flex items-center gap-2 text-[#D4AF85] font-semibold text-xs sm:text-sm self-start drop-shadow-sm">
                <span className="w-8 h-[2px] bg-[#D4AF85]/80" />
                <span>مرحبـاً بكم في</span>
              </div>

              {/* Main Mosque Name: Smooth calligraphic flow */}
              <h1 className="font-aref text-[44px] sm:text-5xl font-bold text-white tracking-tight leading-[1.08] text-right w-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
                جامع الحق
              </h1>

              {/* Subheading: Smooth and clear */}
              <h2 className="text-[19px] sm:text-[21px] font-medium text-[#FAF7F0] leading-[1.4] text-right w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] mt-2.5 mb-2">
                بيتٌ منّ بيوت الله ...
                <br />
                يجمّعنا عليِ الخير
              </h2>

              {/* CTA Button: Dark blue gradient with golden border and golden gradient text */}
              <div className="flex flex-wrap items-center gap-2 mt-1 self-start">
                <button
                  onClick={() => openCalendarFor("katbketab")}
                  className="relative group inline-flex items-center justify-center bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-8 py-3.5 rounded-full text-sm border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.25)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden tracking-wide"
                >
                  <span className="relative z-10 bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    احجز قاعة
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Features Bar (3 columns with dividers) */}
          <div
            className={`relative z-20 w-full grid grid-cols-3 border-t border-[#22334A] pt-3 pb-5 px-1 bg-gradient-to-t from-[#0B1220] to-transparent transition-opacity duration-1000 ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Column 1 (صدقة جارية - renders on right in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#152132] backdrop-blur-md border border-[#22334A] flex items-center justify-center text-[#C49A6C] mb-1.5 shadow-sm">
                <HeartHandshake className="w-5 h-5 text-[#C49A6C]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">صدقة جارية</span>
              <span className="text-[10px] text-[#8A9BB3]">لأجر مستدام</span>
            </div>

            {/* Column 2 (علم ونور - renders in center) with vertical dividers */}
            <div className="flex flex-col items-center text-center px-1 border-r border-l border-[#22334A]">
              <div className="w-11 h-11 rounded-full bg-[#152132] backdrop-blur-md border border-[#22334A] flex items-center justify-center text-[#C49A6C] mb-1.5 shadow-sm">
                <BookOpen className="w-5 h-5 text-[#C49A6C]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">علمٌ ونور</span>
              <span className="text-[10px] text-[#8A9BB3]">لبناء جيل واعٍ</span>
            </div>

            {/* Column 3 (مجتمع متعاون - renders on left in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#152132] backdrop-blur-md border border-[#22334A] flex items-center justify-center text-[#C49A6C] mb-1.5 shadow-sm">
                <Users className="w-5 h-5 text-[#C49A6C]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">مجتمع متعاون</span>
              <span className="text-[10px] text-[#8A9BB3]">معاً نصنع الأثر</span>
            </div>
          </div>
        </section>

        {/* Mobile About Mosque Section (Fade-in on scroll) */}
        <AboutMosque id="about-mobile" />

        {/* Mobile Prayer Times Strip */}
        <section id="prayer-times-mobile" className="border-t border-[#22334A] bg-[#152132] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-[#FAF7F0]">أوقات الصلاة</h3>
                <p className="text-xs text-[#8A9BB3]">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-[#182436] text-[#C49A6C] border border-[#22334A] rounded-full">
                ● محدث الآن
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-[#182436] text-[#FAF7F0] border-[#C49A6C] shadow-lg shadow-[#C49A6C]/10"
                      : "bg-[#0B1220] text-[#FAF7F0] border-[#22334A]"
                  }`}
                >
                  <span className={`text-[11px] font-semibold block mb-0.5 ${prayer.isNext ? "text-[#C49A6C]" : "text-[#8A9BB3]"}`}>
                    {prayer.name}
                  </span>
                  <span className="text-base font-bold font-mono tracking-tight block text-[#FAF7F0]">
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="inline-block mt-1 text-[9px] bg-[#C49A6C] text-[#0B1220] font-bold px-2 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Mobile Footer */}
        <footer className="border-t border-[#22334A] bg-[#080D18] py-6 px-4 text-center text-xs text-[#8A9BB3] flex flex-col gap-2">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#8A9BB3]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C49A6C]" />
              سلطنة عمان — ولاية السيب (الموالح الجنوبية)
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#C49A6C]" />
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
      <main className="hidden lg:flex flex-col w-full min-h-screen bg-[#0B1220] text-[#FAF7F0] overflow-x-hidden">
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
              poster="/landing_first_frame.jpg"
              onPlaying={handleVideoPlaying}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="h-full w-full object-cover object-center"
            >
              <source src="/1014.mp4" type="video/mp4" />
            </video>

            {/* Progressive First Frame Placeholder: Blurry LQ -> Smoothly fades to crisp HQ -> Smoothly dissolves into Video */}
            <div
              className={`absolute inset-0 z-10 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${
                videoLoaded ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Step 1: Blurry low-quality image (loads instantly in ~10ms, 12KB) */}
              <img
                src="/landing_first_frame_lq.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center filter blur-lg scale-105"
              />

              {/* Step 2: High quality picture fades in over the blurry one once loaded */}
              <img
                src="/landing_first_frame.jpg"
                alt=""
                onLoad={() => setDesktopHqLoaded(true)}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
                  desktopHqLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Gradient strictly on the right side behind text, leaving the mosque, minarets, sky, and courtyard completely bright and clear */}
          <div
            className={`absolute inset-y-0 right-0 w-[56%] lg:w-[52%] xl:w-[48%] z-10 bg-gradient-to-l from-[#040914] via-[#061224]/85 via-[#081830]/40 to-transparent transition-opacity duration-1000 pointer-events-none ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Quick Skip button while video is playing */}
          {!videoEnded && (
            <button
              onClick={handleSkip}
              className="absolute top-6 left-6 z-40 px-4 py-2 rounded-full bg-[#152132]/85 hover:bg-[#182436] text-[#FAF7F0] text-xs font-semibold backdrop-blur-md border border-[#22334A] transition-all flex items-center gap-2 shadow-xl active:scale-95"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#C49A6C]" />
            </button>
          )}

          {/* Desktop Navigation Bar: INSIDE the video frame at the absolute top */}
          <header
            className={`fixed top-0 inset-x-0 z-30 w-full flex min-h-[96px] items-center justify-between px-8 lg:px-14 py-4 transition-opacity duration-700 ease-in-out ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${
              scrollFactor >= 0.98 ? "pointer-events-none" : ""
            }`}
          >
            {/* Logo in Aref Ruqaa Bold */}
            <Link
              href="/"
              style={{
                opacity: headerExtrasOpacity,
                pointerEvents: headerExtrasOpacity > 0.2 ? "auto" : "none",
              }}
              className="group flex items-center gap-2.5 transition-opacity duration-300"
            >
              <Landmark className="h-7 w-7 shrink-0 text-[#D4AF85] drop-shadow-md" />
              <span className="font-aref text-3xl font-bold text-white transition-colors group-hover:text-[#D4AF85] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                جامع الحق
              </span>
            </Link>

            {/* Desktop Nav links - 3 requested links with smooth elegant typography */}
            <nav
              style={{
                gap: `${dynamicGap}px`,
                transform: `translateX(${navTranslateX}px) scale(${navScale})`,
                opacity: navOpacity,
                pointerEvents: navOpacity > 0.2 ? "auto" : "none",
                transformOrigin: "center right",
              }}
              className="flex items-center transition-all duration-75 will-change-transform"
            >
              <Link
                href="/booking"
                className="flex items-center gap-2.5 py-2 text-xl lg:text-2xl font-bold text-[#D4AF85] hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] whitespace-nowrap"
              >
                <Calendar className="w-5 h-5 text-[#D4AF85]" />
                <span>حجز مناسبة</span>
              </Link>

              <Link
                href="/videos"
                className="flex items-center gap-2.5 py-2 text-xl lg:text-2xl font-bold text-white/95 hover:text-[#D4AF85] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] whitespace-nowrap"
              >
                <Video className="w-5 h-5 text-[#D4AF85]" />
                <span>الفيديوهات</span>
              </Link>

              <a
                href="#about"
                className="py-2 text-xl lg:text-2xl font-bold text-white/95 hover:text-[#D4AF85] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] whitespace-nowrap"
              >
                عن المسجد
              </a>
            </nav>

            {/* Header Actions */}
            <div
              style={{
                opacity: headerExtrasOpacity,
                pointerEvents: headerExtrasOpacity > 0.2 ? "auto" : "none",
              }}
              className="flex items-center gap-3 transition-opacity duration-300"
            >
              <button
                aria-label="بحث"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-[#D4AF85] transition shadow-md border border-white/20 backdrop-blur-md active:scale-95"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Direct Booking with Calendar Modal button */}
              <button
                onClick={() => openCalendarFor("katbketab")}
                className="items-center gap-2 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_20px_-3px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.35)] border border-[#4A79B8]/50 transition inline-flex active:scale-95 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-[#D4AF85]" />
                <span className="drop-shadow-sm">احجز مناسبتك (التقويم)</span>
              </button>
            </div>
          </header>

          {/* Desktop Hero Content: INSIDE the video frame on the right side */}
          <div
            className={`relative z-20 ml-auto flex flex-1 w-[55%] flex-col justify-center px-10 lg:px-16 py-8 transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-start gap-4 text-right">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 text-base font-semibold text-[#D4AF85] drop-shadow-sm">
                <span className="h-[2px] w-12 bg-[#D4AF85]/80" />
                <span>مرحبًا بكم في</span>
              </div>

              {/* Title: Smooth, natural calligraphic rendering */}
              <h1 className="font-aref text-7xl lg:text-8xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
                جامع الحق
              </h1>

              {/* Subheading: Smooth, elegant, no harsh outlines */}
              <h2 className="text-2xl lg:text-3xl font-medium leading-relaxed text-[#FAF7F0] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] mt-3 lg:mt-4 mb-2">
                بيت من بيوت الله ... يجمعنا على الخير
              </h2>

              {/* CTA Button: Dark blue gradient with golden border and golden gradient text */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => openCalendarFor("katbketab")}
                  className="relative group inline-flex min-h-14 items-center justify-center rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-11 text-lg border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,133,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.95),0_0_28px_rgba(212,175,133,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer tracking-wide"
                >
                  <span className="relative z-10 bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    احجز قاعة
                  </span>
                </button>
              </div>

              {/* 3 Bottom Feature Badges: Frameless on laptop view & moved down with smooth typography */}
              <div className="mt-10 lg:mt-14 grid w-full grid-cols-3 gap-6">
                {[
                  { icon: HeartHandshake, title: "صدقة جارية", detail: "الأجر المستدام" },
                  { icon: BookOpen, title: "علم ونور", detail: "لبناء جيل واعٍ" },
                  { icon: Users, title: "مجتمع متعاون", detail: "معًا نصنع الأثر" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex min-w-0 flex-col items-center gap-3 text-center lg:flex-row lg:text-right"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/35 backdrop-blur-sm text-[#D4AF85] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                      <item.icon className="h-5 w-5 text-[#D4AF85]" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                        {item.title}
                      </span>
                      <span className="text-xs text-[#D4AF85] font-medium drop-shadow-sm">
                        {item.detail}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Desktop About Mosque Section (Fade-in on scroll) */}
        <AboutMosque id="about" />

        {/* Dar Monasbat & Videos Showcase Section (Full Width Desktop) */}
        <section id="monasbat-section" className="w-full border-t border-[#22334A] bg-[#0B1220] px-8 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1560px] mx-auto space-y-12"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-right">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#152132] text-[#C49A6C] border border-[#22334A] mb-2 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#C49A6C]" />
                  <span>دار المناسبات الإسلامية • جامع الحق</span>
                </span>
                <h3 className="text-3xl font-extrabold font-aref text-[#FAF7F0]">
                  حجز قاعات المناسبات (عزاء وكتب كتاب)
                </h3>
                <p className="text-sm text-[#8A9BB3] mt-1 max-w-2xl">
                  قاعات فسيحة ومجهزة بأحدث الأنظمة الصوتية والمرئية، مع إمكانية استعراض التقويم المباشر وحجز موعدك فورياً.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/booking"
                  className="px-6 py-3 rounded-full bg-[#152132] hover:bg-[#182436] text-[#FAF7F0] border border-[#22334A] text-xs font-bold transition flex items-center gap-2"
                >
                  <span>جدول الحجوزات الكامل</span>
                  <ArrowLeft className="w-4 h-4 text-[#C49A6C]" />
                </Link>
                <Link
                  href="/videos"
                  className="px-6 py-3 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#C49A6C] border border-[#22334A] text-xs font-bold transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#C49A6C]" />
                  <span>معرض الفيديوهات</span>
                </Link>
              </div>
            </div>

            {/* 3 Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Katb Ketab */}
              <div className="bg-[#152132] border border-[#22334A] rounded-3xl p-6 flex flex-col justify-between hover:border-[#C49A6C] transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182436] border border-[#22334A] flex items-center justify-center text-[#C49A6C] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    💍
                  </div>
                  <h4 className="text-xl font-bold font-aref text-[#FAF7F0] mb-2 group-hover:text-[#C49A6C] transition-colors">
                    حجز كتب كتاب (عقد القران)
                  </h4>
                  <p className="text-xs text-[#8A9BB3] leading-relaxed mb-4">
                    أجواء مباركة وفخامة تليق بيومكم السعيد، مع قاعات مجهزة بكافة متطلبات الإشهار، ضيافة راقية، وتوثيق مرئي.
                  </p>
                  <ul className="text-[11px] text-[#C49A6C] space-y-1.5 mb-6">
                    <li>• اختيار القاعة المناسبة حسب عدد الضيوف</li>
                    <li>• تقويم مواعيد تفاعلي لاختيار اليوم والفترة</li>
                    <li>• خدمات صوتية وشاشات عرض ونظام ضيافة</li>
                  </ul>
                </div>
                <button
                  onClick={() => openCalendarFor("katbketab")}
                  className="w-full py-3 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-black text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#0B1220]" />
                  <span>احجز موعد كتب الكتاب (التقويم)</span>
                </button>
              </div>

              {/* Card 2: 3aza */}
              <div className="bg-[#152132] border border-[#22334A] rounded-3xl p-6 flex flex-col justify-between hover:border-[#C49A6C] transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182436] border border-[#22334A] flex items-center justify-center text-[#FAF7F0] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    🕊️
                  </div>
                  <h4 className="text-xl font-bold font-aref text-[#FAF7F0] mb-2 group-hover:text-[#C49A6C] transition-colors">
                    حجز عزاء (دار التعازي)
                  </h4>
                  <p className="text-xs text-[#8A9BB3] leading-relaxed mb-4">
                    مجالس تأبين وعزاء تراعي الوقار والسكينة، قاعات مستقلة للرجال وأخرى للسيدات، مع تلاوات خاشعة لكبار القراء.
                  </p>
                  <ul className="text-[11px] text-[#C49A6C] space-y-1.5 mb-6">
                    <li>• قاعات كبرى ووسطى تسع حتى 500 معزٍ</li>
                    <li>• طاقم ضيافة متميز وخدمة فندقية</li>
                    <li>• توفير قراء معتمدين ونظام صوتي عالي النقاء</li>
                  </ul>
                </div>
                <button
                  onClick={() => openCalendarFor("3aza")}
                  className="w-full py-3 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#FAF7F0] border border-[#22334A] font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#C49A6C]" />
                  <span>احجز موعد العزاء (التقويم)</span>
                </button>
              </div>

              {/* Card 3: Videos Showcase */}
              <div className="bg-[#152132] border border-[#22334A] rounded-3xl p-6 flex flex-col justify-between hover:border-[#C49A6C] transition group shadow-lg">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182436] border border-[#22334A] flex items-center justify-center text-[#C49A6C] mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6 text-[#C49A6C]" />
                  </div>
                  <h4 className="text-xl font-bold font-aref text-[#FAF7F0] mb-2 group-hover:text-[#C49A6C] transition-colors">
                    مكتبة الفيديوهات والمرئيات
                  </h4>
                  <p className="text-xs text-[#8A9BB3] leading-relaxed mb-4">
                    شاهد مقاطع الفيديو التوثيقية لجامع الحق، وجولات مصورة في قاعات دار المناسبات، وتلاوات قرآنية مسجلة بجودة عالية.
                  </p>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#22334A]">
                    <img
                      src="/landing_last_frame.jpg"
                      alt="معرض الفيديوهات"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#C49A6C] text-[#0B1220] flex items-center justify-center font-bold">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/videos"
                  className="w-full py-3 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#FAF7F0] border border-[#22334A] font-bold text-xs transition flex items-center justify-center gap-2 text-center"
                >
                  <Video className="w-4 h-4 text-[#C49A6C]" />
                  <span>استعراض جميع الفيديوهات المتاحة</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Desktop Interactive Prayer Times Strip (Full Width) */}
        <section id="prayer-times" className="w-full border-t border-[#22334A] bg-[#152132] px-8 lg:px-16 py-14">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1560px] mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-[#FAF7F0]">أوقات الصلاة</h3>
                <p className="text-sm text-[#8A9BB3]">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-xs font-bold px-3.5 py-1.5 bg-[#182436] text-[#C49A6C] border border-[#22334A] rounded-full">
                ● محدث مباشرة
              </span>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-[#182436] text-[#FAF7F0] border-[#C49A6C] shadow-lg shadow-[#C49A6C]/10 scale-105"
                      : "bg-[#0B1220] text-[#FAF7F0] border-[#22334A] hover:border-[#C49A6C]/40"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block mb-1.5 ${
                      prayer.isNext ? "text-[#C49A6C]" : "text-[#8A9BB3]"
                    }`}
                  >
                    {prayer.name}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight block text-[#FAF7F0]">
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="inline-block mt-2.5 text-[10px] bg-[#C49A6C] text-[#0B1220] font-bold px-2.5 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Desktop Footer (Full Width) */}
        <footer className="w-full border-t border-[#22334A] bg-[#080D18] px-8 lg:px-16 py-8">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3 text-right text-xs text-[#8A9BB3]">
            <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49A6C]" />
                <span>سلطنة عمان — ولاية السيب (الموالح الجنوبية)</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A6C]" />
                <span>للتواصل والاستفسار</span>
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating 3-bar Sidebar Trigger Button that appears smoothly when scrolled */}
      <div
        style={{
          opacity: sidebarButtonOpacity,
          transform: `scale(${sidebarButtonScale})`,
          pointerEvents: sidebarButtonOpacity > 0.2 ? "auto" : "none",
        }}
        className="fixed top-3.5 right-3.5 sm:top-6 sm:right-6 lg:right-10 z-50 transition-all duration-150 will-change-transform"
      >
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="فتح القائمة الجانبية"
          className="group flex items-center gap-2 sm:gap-3 bg-[#08111F]/90 hover:bg-[#0E1B31] text-white backdrop-blur-xl px-3.5 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-full border border-white/20 hover:border-[#4A79B8] shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(30,68,123,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* 3 Horizontal lines with subtle dynamic widths */}
          <div className="flex flex-col gap-1.5 w-5 items-end justify-center">
            <span className="h-[2.5px] w-5 bg-white rounded-full transition-all group-hover:bg-[#60A5FA]" />
            <span className="h-[2.5px] w-3.5 bg-[#D4AF85] rounded-full transition-all group-hover:w-5 group-hover:bg-white" />
            <span className="h-[2.5px] w-5 bg-white rounded-full transition-all group-hover:bg-[#60A5FA]" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide drop-shadow-sm">القائمة</span>
        </button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Soft, minimal backdrop overlay that lets the architecture stay visible */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-500 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Transparent Frosted Glass Sidebar panel matching reference layout */}
        <div
          className={`absolute top-0 right-0 h-full w-[310px] sm:w-[380px] lg:w-[420px] bg-black/25 backdrop-blur-3xl border-l border-white/15 px-7 sm:px-9 py-8 shadow-[-16px_0_48px_rgba(0,0,0,0.5)] flex flex-col justify-between transition-transform duration-500 ease-out text-center ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Top Brand (like ALFA / COSTA MATE) */}
          <div className="relative flex flex-col items-center pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="إغلاق القائمة"
              className="absolute top-0 left-0 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex flex-col items-center gap-1 group"
            >
              <Landmark className="h-7 w-7 text-[#D4AF85] drop-shadow-sm mb-1" />
              <span className="font-aref text-3xl font-bold text-white tracking-wide group-hover:text-[#D4AF85] transition-colors drop-shadow-md">
                جامع الحق
              </span>
              <span className="text-[11px] font-semibold text-[#D4AF85] tracking-[0.2em] uppercase drop-shadow-sm">
                صرح الإيمان والسكينة
              </span>
            </Link>
          </div>

          {/* Middle Content */}
          <div className="flex flex-col items-center my-auto py-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md tracking-tight mb-4">
              بيتٌ من بيوت الله
            </h3>

            {/* Delicate thin divider */}
            <div className="w-16 h-[1px] bg-white/25 mb-6" />

            {/* Navigation links centered with elegant spacing */}
            <nav className="flex flex-col items-center gap-4 w-full">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-white transition tracking-wide drop-shadow-sm"
              >
                الرئيسية
              </Link>

              <Link
                href="/videos"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-white transition tracking-wide drop-shadow-sm"
              >
                الفيديوهات
              </Link>

              {/* Featured Active Item with outlined pill border (like 'WIDE EXTERIOR') */}
              <Link
                href="/booking"
                onClick={() => setSidebarOpen(false)}
                className="border border-white/60 hover:border-[#D4AF85] hover:bg-white/10 rounded-full px-8 py-2 text-base sm:text-lg font-bold text-[#D4AF85] hover:text-white transition-all shadow-sm tracking-wide drop-shadow-sm my-1"
              >
                حجز مناسبة
              </Link>

              <a
                href="#about"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-white transition tracking-wide drop-shadow-sm"
              >
                عن المسجد
              </a>

              <a
                href="#prayer-times"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-white transition tracking-wide drop-shadow-sm"
              >
                أوقات الصلاة
              </a>
            </nav>

            {/* Delicate thin divider */}
            <div className="w-16 h-[1px] bg-white/25 mt-6" />
          </div>

          {/* Bottom Action & Mosque Info (like 'View Project' pill button) */}
          <div className="flex flex-col items-center gap-4 pb-2">
            <button
              onClick={() => {
                setSidebarOpen(false);
                openCalendarFor("katbketab");
              }}
              className="border border-white/50 hover:border-[#D4AF85] hover:bg-white/10 text-white hover:text-[#D4AF85] font-bold text-xs uppercase tracking-widest px-8 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm drop-shadow-sm"
            >
              احجز قاعة (التقويم)
            </button>

            <div className="text-[11px] text-[#8A9BB3]/90 text-center space-y-0.5">
              <p>ولاية السيب — الموالح الجنوبية</p>
              <p className="text-[#D4AF85]/90">سلطنة عمان</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal with Calendar */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={bookingModalType}
      />
    </>
  );
}
