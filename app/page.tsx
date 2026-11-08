"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  HeartHandshake,
  Landmark,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import QuickBookingModal from "@/components/QuickBookingModal";
import AboutMosque from "@/components/AboutMosque";
import { getPrayerTimes } from "@/lib/api";

function formatPrayerTime(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const isPM = hours >= 12;
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const period = isPM ? "م" : "ص";
  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}

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

  const handleMobileTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime > 0.05 && !videoLoadedRef.current) {
      videoLoadedRef.current = true;
      setVideoLoaded(true);
    }
    // Mobile video reaches end (duration ~3.48s)
    if (video.duration && video.currentTime >= video.duration - 0.08) {
      video.pause();
      try {
        video.currentTime = video.duration;
      } catch {}
      setVideoEnded(true);
    }
  };

  const handleMobileEnded = () => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.pause();
      try {
        if (mobileVideoRef.current.duration) {
          mobileVideoRef.current.currentTime = mobileVideoRef.current.duration;
        }
      } catch {}
    }
    setVideoEnded(true);
  };

  const handleDesktopTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime > 0.05 && !videoLoadedRef.current) {
      videoLoadedRef.current = true;
      setVideoLoaded(true);
    }
    // Desktop video reaches end (duration ~3.13s)
    if (video.duration && video.currentTime >= video.duration - 0.08) {
      video.pause();
      try {
        video.currentTime = video.duration;
      } catch {}
      setVideoEnded(true);
    }
  };

  const handleDesktopEnded = () => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
      try {
        if (desktopVideoRef.current.duration) {
          desktopVideoRef.current.currentTime = desktopVideoRef.current.duration;
        }
      } catch {}
    }
    setVideoEnded(true);
  };

  const handleSkip = () => {
    videoLoadedRef.current = true;
    setVideoLoaded(true);
    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
      try {
        desktopVideoRef.current.currentTime = desktopVideoRef.current.duration || 3.13;
      } catch {}
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.pause();
      try {
        mobileVideoRef.current.currentTime = mobileVideoRef.current.duration || 3.48;
      } catch {}
    }
    setVideoEnded(true);
  };

  const handleReplay = () => {
    setVideoEnded(false);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isMobile) {
      if (mobileVideoRef.current) {
        mobileVideoRef.current.currentTime = 0;
        mobileVideoRef.current.play().catch(() => {});
      }
    } else {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.currentTime = 0;
        desktopVideoRef.current.play().catch(() => {});
      }
    }
  };

  const scrollToAbout = (e: React.MouseEvent, isMobile = false) => {
    e.preventDefault();
    const targetId = isMobile ? "about-mobile" : "about";
    const el = document.getElementById(targetId) || document.getElementById("about") || document.getElementById("about-mobile");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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

  // Smooth scroll convergence physics (0.0 to 1.0 over first 180px of scroll)
  const scrollFactor = Math.min(1, Math.max(0, scrollY / 180));
  // Gap shrinks as you scroll
  const dynamicGap = Math.max(12, Math.round((1 - scrollFactor) * 44 + 28));
  const mobileDynamicGap = Math.max(6, Math.round((1 - scrollFactor) * 16));

  // Nav cluster translates horizontally towards the 3-bar sidebar button at top-right
  const navTranslateX = scrollFactor * 340;
  const mobileNavTranslateX = scrollFactor * 90;

  // Desktop Nav fade and scale
  const navOpacity = scrollFactor >= 0.7 ? Math.max(0, 1 - (scrollFactor - 0.7) / 0.3) : 1;
  const navScale = scrollFactor >= 0.6 ? Math.max(0.2, 1 - (scrollFactor - 0.6) * 2) : Math.max(0.85, 1 - scrollFactor * 0.15);

  // Mobile Nav: Smoothly shrinks & dissolves as it approaches the button spot
  const mobileNavOpacity = scrollFactor <= 0.2 ? 1 : Math.max(0, 1 - (scrollFactor - 0.2) / 0.45);
  const mobileNavScale = scrollFactor <= 0.15 ? 1 : Math.max(0.1, 1 - Math.pow(scrollFactor, 1.3) * 0.9);

  // Sidebar button appears and expands smoothly to receive the dissolving navbar (0.25 to 0.7)
  const sidebarButtonOpacity = scrollFactor <= 0.25 ? 0 : Math.min(1, (scrollFactor - 0.25) / 0.4);
  const sidebarButtonScale = scrollFactor <= 0.25 ? 0.3 : Math.min(1, 0.3 + ((scrollFactor - 0.25) / 0.4) * 0.7);

  // Header extras (logo & left actions) fade out gently as scroll begins
  const headerExtrasOpacity = Math.max(0, 1 - scrollFactor * 2.2);

  // Proactively start playing video on mount and check cached images
  useEffect(() => {
    if (typeof window !== "undefined") {
      const imgMobile = new Image();
      imgMobile.src = "/mobile_first_frame.jpg";
      if (imgMobile.complete) setMobileHqLoaded(true);

      const imgDesktop = new Image();
      imgDesktop.src = "/landing_first_frame.jpg";
      if (imgDesktop.complete) setDesktopHqLoaded(true);

      // Preload the guaranteed last frames
      const imgMobileLast = new Image();
      imgMobileLast.src = "/mobile_last_frame.jpg";
      const imgDesktopLast = new Image();
      imgDesktopLast.src = "/landing_last_frame.jpg";

      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        if (mobileVideoRef.current) {
          mobileVideoRef.current.play().catch(() => {
            setVideoLoaded(true);
            setVideoEnded(true);
          });
        }
      } else {
        if (desktopVideoRef.current) {
          desktopVideoRef.current.play().catch(() => {
            setVideoLoaded(true);
            setVideoEnded(true);
          });
        }
      }

      // Safety watchdog: ensure UI and last frame always show within 4.5s
      const timer = setTimeout(() => {
        setVideoLoaded(true);
        setVideoEnded(true);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, []);

  const [prayerTimes, setPrayerTimes] = useState([
    { key: "FAJR", name: "الفجر", time: "04:45 ص", isNext: true },
    { key: "SUNRISE", name: "الشروق", time: "06:05 ص", isNext: false },
    { key: "DHUHR", name: "الظهر", time: "12:15 م", isNext: false },
    { key: "ASR", name: "العصر", time: "03:30 م", isNext: false },
    { key: "MAGHRIB", name: "المغرب", time: "06:10 م", isNext: false },
    { key: "ISHA", name: "العشاء", time: "07:40 م", isNext: false },
  ]);

  useEffect(() => {
    getPrayerTimes()
      .then((data) => {
        if (!data) return;
        const next = (data.nextPrayer || "FAJR").toUpperCase();
        setPrayerTimes([
          { key: "FAJR", name: "الفجر", time: formatPrayerTime(data.fajr), isNext: next === "FAJR" },
          { key: "SUNRISE", name: "الشروق", time: formatPrayerTime(data.sunrise), isNext: next === "SUNRISE" },
          { key: "DHUHR", name: "الظهر", time: formatPrayerTime(data.dhuhr), isNext: next === "DHUHR" },
          { key: "ASR", name: "العصر", time: formatPrayerTime(data.asr), isNext: next === "ASR" },
          { key: "MAGHRIB", name: "المغرب", time: formatPrayerTime(data.maghrib), isNext: next === "MAGHRIB" },
          { key: "ISHA", name: "العشاء", time: formatPrayerTime(data.isha), isNext: next === "ISHA" },
        ]);
      })
      .catch((err) => {
        console.warn("Could not fetch prayer times, using default times", err);
      });
  }, []);

  return (
    <>
      {/* =========================================================================
          MOBILE VIEW (< 1024px / block lg:hidden)
          Full-screen edge-to-edge. Video plays in background and halts on last frame.
          Navbar is an overlay directly in the video frame at the top.
          ========================================================================= */}
      <div className="block lg:hidden min-h-screen bg-[#050A14] relative overflow-x-hidden text-right">
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
              onTimeUpdate={handleMobileTimeUpdate}
              onEnded={handleMobileEnded}
              onError={() => {
                setVideoLoaded(true);
                setVideoEnded(true);
              }}
              className="h-full w-full object-cover object-center"
            >
              <source src={process.env.NEXT_PUBLIC_MOBILE_HERO_VIDEO || "/1012(1).mp4"} type="video/mp4" />
            </video>

            {/* Guaranteed Last Frame Poster (fades in once video reaches the end, ensuring it is always on the last frame) */}
            <img
              src="/mobile_last_frame.jpg"
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out pointer-events-none ${
                videoEnded ? "opacity-100" : "opacity-0"
              }`}
            />

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
              className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-full bg-[#0A1628]/85 text-[#FAF7F0] hover:text-[#FFF2D2] text-xs font-semibold backdrop-blur-md border border-[#1E3A63] flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3 h-3 text-[#D4AF85]" />
            </button>
          )}

          {/* Mobile Top App Bar: 3-column split across the whole width */}
          <header
            className={`fixed top-0 inset-x-0 z-30 w-full px-4 sm:px-6 pt-4 sm:pt-5 pb-2 transition-opacity duration-700 ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${
              scrollFactor >= 0.98 ? "pointer-events-none" : ""
            }`}
          >
            <div className="w-full grid grid-cols-3 items-center">
              {/* Right: Mosque Logo */}
              <div className="flex items-center justify-start">
                <Link
                  href="/"
                  style={{
                    opacity: headerExtrasOpacity,
                    pointerEvents: headerExtrasOpacity > 0.2 ? "auto" : "none",
                  }}
                  className="group flex items-center transition-all active:scale-95 shrink-0"
                  aria-label="جامع الحق"
                >
                  <img
                    src="/logo-gold.png"
                    alt="جامع الحق"
                    className="h-24 sm:h-28 w-auto max-h-[90px] sm:max-h-[110px] object-contain drop-shadow-[0_4px_28px_rgba(212,175,133,0.6)] group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>

              {/* Center: المجلس */}
              <div
                style={{
                  opacity: mobileNavOpacity,
                  pointerEvents: mobileNavOpacity > 0.2 ? "auto" : "none",
                }}
                className="flex items-center justify-center text-center"
              >
                <Link
                  href="/booking"
                  className="py-1 px-2 text-sm sm:text-base font-sans font-black whitespace-nowrap text-white/95 hover:text-[#FFF2D2] transition-all drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] group"
                >
                  <span className="transition-all duration-200 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    المجلس
                  </span>
                </Link>
              </div>

              {/* Left: الخطب والدروس */}
              <div
                style={{
                  opacity: mobileNavOpacity,
                  pointerEvents: mobileNavOpacity > 0.2 ? "auto" : "none",
                }}
                className="flex items-center justify-end text-left"
              >
                <Link
                  href="/videos"
                  className="py-1 px-2 text-sm sm:text-base font-sans font-black whitespace-nowrap text-white/95 hover:text-[#FFF2D2] transition-all drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] group"
                >
                  <span className="transition-all duration-200 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    الخطب والدروس
                  </span>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Hero Content (Strictly Right-Aligned over the sunset marble courtyard) */}
          <div
            className={`relative z-20 flex flex-col justify-center items-start text-right pr-2.5 pl-2 pt-12 sm:pt-16 pb-10 my-auto w-full transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-fit mr-1 sm:mr-3 ml-auto flex flex-col items-center text-center gap-2.5 -mt-6 sm:-mt-4">
              {/* Main Mosque Name: Ornate golden calligraphy matching reference */}
              <img
                src="/hero-calligraphy-gold.png"
                alt="جامع الحق"
                className="w-[195px] sm:w-[240px] h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]"
              />

              {/* Location Tag */}
              <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#C59B63_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                <MapPin className="w-4 h-4 text-[#D4AF85] shrink-0" />
                <span>الموالح الجنوبية - السيب</span>
              </div>

              {/* CTA Button: Dark blue gradient with golden border and golden gradient text */}
              <div className="self-start mr-1 flex flex-wrap items-center justify-center gap-2 mt-1.5">
                <a
                  href="#about-mobile"
                  onClick={(e) => scrollToAbout(e, true)}
                  className="relative group inline-flex items-center justify-center gap-2 bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-5 py-2 rounded-full text-base sm:text-lg border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.25)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden tracking-wide"
                >
                  <Landmark className="w-5 h-5 text-[#FFE8B8] relative z-10" />
                  <span className="relative z-10 bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    عن المسجد
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Features Bar (3 columns with dividers) */}
          <div
            className={`relative z-20 w-full grid grid-cols-3 border-t border-[#1E3A63]/60 pt-3 pb-5 px-1 bg-gradient-to-t from-[#050A14] to-transparent transition-opacity duration-1000 ${
              videoEnded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Column 1 (صدقة جارية - renders on right in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#0D1A2D] backdrop-blur-md border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-1.5 shadow-sm">
                <HeartHandshake className="w-5 h-5 text-[#D4AF85]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">صدقة جارية</span>
              <span className="text-[10px] text-[#8EA3BF]">لأجر مستدام</span>
            </div>

            {/* Column 2 (علم ونور - renders in center) with vertical dividers */}
            <div className="flex flex-col items-center text-center px-1 border-r border-l border-[#1E3A63]/60">
              <div className="w-11 h-11 rounded-full bg-[#0D1A2D] backdrop-blur-md border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-1.5 shadow-sm">
                <BookOpen className="w-5 h-5 text-[#D4AF85]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">علمٌ ونور</span>
              <span className="text-[10px] text-[#8EA3BF]">لبناء جيل واعٍ</span>
            </div>

            {/* Column 3 (مجتمع متعاون - renders on left in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#0D1A2D] backdrop-blur-md border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-1.5 shadow-sm">
                <Users className="w-5 h-5 text-[#D4AF85]" />
              </div>
              <span className="text-xs font-bold text-[#FAF7F0]">مجتمع متعاون</span>
              <span className="text-[10px] text-[#8EA3BF]">معاً نصنع الأثر</span>
            </div>
          </div>
        </section>

        {/* Mobile About Mosque Section (Fade-in on scroll) */}
        <AboutMosque id="about-mobile" />

        {/* Mobile Prayer Times Strip */}
        <section id="prayer-times-mobile" className="border-t border-[#1E3A63]/60 bg-[#050A14] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-[opacity,transform]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-extrabold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-2 pt-0.5 pb-2 leading-[1.45]">أوقات الصلاة</h3>
                <p className="text-xs text-[#8EA3BF]">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63] rounded-full">
                ● محدث الآن
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border-2 border-[#D4AF85] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)]"
                      : "bg-[#0A1628] text-[#FAF7F0] border border-[#1E3A63]"
                  }`}
                >
                  <span className={`text-[11px] font-semibold block mb-0.5 ${prayer.isNext ? "text-[#D4AF85]" : "text-[#8EA3BF]"}`}>
                    {prayer.name}
                  </span>
                  <span className="text-base font-bold font-mono tracking-tight block text-[#FAF7F0]">
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="inline-block mt-1 text-[9px] bg-[#D4AF85] text-[#050B14] font-bold px-2 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Mobile Footer */}
        <footer className="border-t border-[#1E3A63]/60 bg-[#03060C] py-6 px-4 text-center text-xs text-[#8EA3BF] flex flex-col gap-2">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#8EA3BF]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4AF85]" />
              سلطنة عمان — ولاية السيب (الموالح الجنوبية)
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#D4AF85]" />
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
      <main className="hidden lg:flex flex-col w-full min-h-screen bg-[#050A14] text-[#FAF7F0] overflow-x-hidden">
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
              onTimeUpdate={handleDesktopTimeUpdate}
              onEnded={handleDesktopEnded}
              onError={() => {
                setVideoLoaded(true);
                setVideoEnded(true);
              }}
              className="h-full w-full object-cover object-center"
            >
              <source src={process.env.NEXT_PUBLIC_DESKTOP_HERO_VIDEO || "/1014.mp4"} type="video/mp4" />
            </video>

            {/* Guaranteed Last Frame Poster (fades in once video reaches the end, ensuring it is always on the last frame) */}
            <img
              src="/landing_last_frame.jpg"
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out pointer-events-none ${
                videoEnded ? "opacity-100" : "opacity-0"
              }`}
            />

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
              className="absolute top-6 left-6 z-40 px-4 py-2 rounded-full bg-[#0A1628]/85 hover:bg-[#122849] text-[#FAF7F0] hover:text-[#FFF2D2] text-xs font-semibold backdrop-blur-md border border-[#1E3A63] transition-all flex items-center gap-2 shadow-xl active:scale-95"
            >
              <span>تخطي</span>
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF85]" />
            </button>
          )}

          {/* Desktop Navigation Bar: 3-column split across the whole width */}
          <header
            className={`fixed top-0 inset-x-0 z-30 w-full px-6 sm:px-10 lg:px-14 py-4 transition-opacity duration-700 ease-in-out ${
              videoEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${
              scrollFactor >= 0.98 ? "pointer-events-none" : ""
            }`}
          >
            <div className="w-full grid grid-cols-3 items-center min-h-[96px]">
              {/* 1. Right: Mosque Logo */}
              <div className="flex items-center justify-start">
                <Link
                  href="/"
                  style={{
                    opacity: headerExtrasOpacity,
                    pointerEvents: headerExtrasOpacity > 0.2 ? "auto" : "none",
                  }}
                  className="group flex items-center transition-all active:scale-95 shrink-0"
                  aria-label="جامع الحق"
                >
                  <img
                    src="/logo-gold.png"
                    alt="جامع الحق"
                    className="h-32 sm:h-40 lg:h-52 w-auto max-h-[180px] object-contain drop-shadow-[0_4px_30px_rgba(212,175,133,0.6)] group-hover:scale-105 transition-all duration-300"
                  />
                </Link>
              </div>

              {/* 2. Center: المجلس */}
              <div
                style={{
                  opacity: navOpacity,
                  pointerEvents: navOpacity > 0.2 ? "auto" : "none",
                }}
                className="flex items-center justify-center text-center"
              >
                <Link
                  href="/booking"
                  className="py-2 px-4 text-xl lg:text-2xl font-sans font-black text-white/95 transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap group"
                >
                  <span className="transition-all duration-200 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    المجلس
                  </span>
                </Link>
              </div>

              {/* 3. Left: الخطب والدروس */}
              <div
                style={{
                  opacity: navOpacity,
                  pointerEvents: navOpacity > 0.2 ? "auto" : "none",
                }}
                className="flex items-center justify-end text-left"
              >
                <Link
                  href="/videos"
                  className="py-2 px-4 text-xl lg:text-2xl font-sans font-black text-white/95 hover:text-[#FFF2D2] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] whitespace-nowrap group"
                >
                  <span className="transition-all duration-200 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent">
                    الخطب والدروس
                  </span>
                </Link>
              </div>
            </div>
          </header>

          {/* Desktop Hero Content: INSIDE the video frame on the right side */}
          <div
            className={`relative z-20 ml-auto flex flex-1 w-[55%] min-h-screen flex-col justify-between pr-6 lg:pr-10 pl-10 pt-32 lg:pt-40 xl:pt-44 pb-8 lg:pb-12 transition-all duration-1000 ease-out ${
              videoEnded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {/* Main Hero Elements: جامع الحق + الموقع + الأزرار (moved down for laptop view to fill screen proportionally) */}
            <div className="flex flex-col items-start gap-3 text-right mt-auto mb-auto lg:translate-y-4 xl:translate-y-6">
              <div className="flex flex-col items-center gap-4">
                {/* Title: Ornate golden calligraphy matching reference */}
                <img
                  src="/hero-calligraphy-gold.png"
                  alt="جامع الحق"
                  className="w-[290px] lg:w-[350px] xl:w-[380px] h-auto object-contain drop-shadow-[0_6px_22px_rgba(0,0,0,0.6)]"
                />

                {/* Location Tag */}
                <div className="flex items-center justify-center gap-2 text-base lg:text-xl font-bold bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#C59B63_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  <MapPin className="w-5 h-5 text-[#D4AF85] shrink-0" />
                  <span>الموالح الجنوبية - السيب</span>
                </div>

                {/* CTA Button: Dark blue gradient with golden border and golden gradient text */}
                <div className="self-start mr-3 lg:mr-5 flex items-center gap-4 mt-2">
                  <a
                    href="#about"
                    onClick={(e) => scrollToAbout(e, false)}
                    className="relative group inline-flex min-h-12 py-2.5 items-center justify-center gap-3 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-9 text-2xl border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,133,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] hover:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.95),0_0_28px_rgba(212,175,133,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer tracking-wide"
                  >
                    <Landmark className="w-6 h-6 text-[#FFE8B8] relative z-10" />
                    <span className="relative z-10 bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      عن المسجد
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3 Bottom Feature Badges: Frameless on laptop view & anchored at the bottom */}
            <div className="w-full pt-4">
              <div className="grid w-full grid-cols-3 gap-6">
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
        <section id="monasbat-section" className="w-full border-t border-[#1E3A63]/60 bg-[#050A14] px-8 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1560px] mx-auto space-y-12 will-change-[opacity,transform]"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-right">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#0D1A2D] text-[#D4AF85] border border-[#1E3A63] mb-2 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF85]" />
                  <span>المجلس العام • جامع الحق</span>
                </span>
                <div>
                  <h3 className="text-3xl font-extrabold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-3 pt-1 pb-3 leading-[1.45]">
                    حجز قاعات المناسبات (عقد قران وعزاء)
                  </h3>
                </div>
                <p className="text-sm text-[#8EA3BF] mt-1 max-w-2xl">
                  قاعات فسيحة ومجهزة بأحدث الأنظمة الصوتية والمرئية، مع إمكانية استعراض التقويم المباشر وحجز موعدك فورياً.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/booking"
                  className="px-6 py-3 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85]/80 hover:border-[#D4AF85] text-[#FFF2D2] text-xs font-bold transition flex items-center gap-2 shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)]"
                >
                  <span>جدول الحجوزات الكامل</span>
                  <ArrowLeft className="w-4 h-4 text-[#D4AF85]" />
                </Link>
                <Link
                  href="/videos"
                  className="px-6 py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#D4AF85] border border-[#1E3A63] hover:border-[#D4AF85]/60 text-xs font-bold transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#D4AF85]" />
                  <span>المرئيات والدروس الدينية</span>
                </Link>
              </div>
            </div>

            {/* 3 Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: 3a2d Keran */}
              <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 flex flex-col justify-between hover:border-[#D4AF85] shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_30px_rgba(18,40,73,0.5)] transition group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1628] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-4 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="w-6 h-6 text-[#D4AF85]" />
                  </div>
                  <h4 className="text-xl font-bold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#FAF7F0] group-hover:to-[#D4AF85] bg-clip-text text-transparent transition-colors mb-2 inline-block px-2 pt-1 pb-2.5 leading-[1.55]">
                    حجز عقد قران
                  </h4>
                  <p className="text-xs text-[#8EA3BF] leading-relaxed mb-4">
                    أجواء مباركة وفخامة تليق بيومكم السعيد، مع قاعات مجهزة بكافة متطلبات الإشهار، ضيافة راقية، وتوثيق مرئي.
                  </p>
                  <ul className="text-[11px] text-[#D4AF85] space-y-1.5 mb-6">
                    <li>• اختيار القاعة المناسبة حسب عدد الضيوف</li>
                    <li>• تقويم مواعيد تفاعلي لاختيار اليوم والفترة</li>
                    <li>• خدمات صوتية وشاشات عرض ونظام ضيافة</li>
                  </ul>
                </div>
                <Link
                  href="/booking?type=katbketab"
                  className="w-full py-3 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85]/80 hover:border-[#D4AF85] text-[#FFF2D2] font-black text-xs transition shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] flex items-center justify-center gap-2 active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF85]" />
                  <span>احجز موعد عقد القران (التقويم)</span>
                </Link>
              </div>

              {/* Card 2: 3aza */}
              <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 flex flex-col justify-between hover:border-[#D4AF85] shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_30px_rgba(18,40,73,0.5)] transition group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1628] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-[#D4AF85]" />
                  </div>
                  <h4 className="text-xl font-bold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#FAF7F0] group-hover:to-[#D4AF85] bg-clip-text text-transparent transition-colors mb-2 inline-block px-2 pt-1 pb-2.5 leading-[1.55]">
                    حجز عزاء (دار التعازي)
                  </h4>
                  <p className="text-xs text-[#8EA3BF] leading-relaxed mb-4">
                    مجالس تأبين وعزاء تراعي الوقار والسكينة، قاعات مستقلة للرجال وأخرى للسيدات، مع تلاوات خاشعة لكبار القراء.
                  </p>
                  <ul className="text-[11px] text-[#D4AF85] space-y-1.5 mb-6">
                    <li>• قاعات كبرى ووسطى تسع حتى 500 معزٍ</li>
                    <li>• طاقم ضيافة متميز وخدمة فندقية</li>
                    <li>• توفير قراء معتمدين ونظام صوتي عالي النقاء</li>
                  </ul>
                </div>
                <Link
                  href="/booking?type=3aza"
                  className="w-full py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/60 font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF85]" />
                  <span>احجز موعد العزاء (التقويم)</span>
                </Link>
              </div>

              {/* Card 3: Islamic Videos Showcase */}
              <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 flex flex-col justify-between hover:border-[#D4AF85] shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_30px_rgba(18,40,73,0.5)] transition group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1628] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6 text-[#D4AF85]" />
                  </div>
                  <h4 className="text-xl font-bold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#FAF7F0] group-hover:to-[#D4AF85] bg-clip-text text-transparent transition-colors mb-2 inline-block px-2 pt-1 pb-2.5 leading-[1.55]">
                    المرئيات والدروس والخطب
                  </h4>
                  <p className="text-xs text-[#8EA3BF] leading-relaxed mb-4">
                    شاهد واستمع إلى خطب الجمعة المباركة، والدروس والمحاضرات الدينية، والتلاوات القرآنية الخاشعة من محراب ومنبر جامع الحق.
                  </p>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#1E3A63]">
                    <img
                      src="/landing_last_frame.jpg"
                      alt="المرئيات والدروس الدينية"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(212,175,133,0.4)]">
                        ▶
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/videos"
                  className="w-full py-3 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/60 font-bold text-xs transition flex items-center justify-center gap-2 text-center"
                >
                  <Video className="w-4 h-4 text-[#D4AF85]" />
                  <span>استعراض المرئيات والدروس الدينية</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Desktop Interactive Prayer Times Strip (Full Width) */}
        <section id="prayer-times" className="w-full border-t border-[#1E3A63]/60 bg-[#070F1E] px-8 lg:px-16 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1560px] mx-auto will-change-[opacity,transform]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-3 pt-1 pb-3 leading-[1.45]">
                  أوقات الصلاة
                </h3>
                <p className="text-sm text-[#8EA3BF]">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-xs font-bold px-3.5 py-1.5 bg-[#0D1A2D] text-[#D4AF85] border border-[#1E3A63] rounded-full shadow-sm">
                ● محدث مباشرة
              </span>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border-2 border-[#D4AF85] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] scale-105"
                      : "bg-[#050C18] text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/50"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block mb-1.5 ${
                      prayer.isNext ? "text-[#D4AF85]" : "text-[#8EA3BF]"
                    }`}
                  >
                    {prayer.name}
                  </span>
                  <span className="text-xl font-bold font-mono tracking-tight block text-[#FAF7F0]">
                    {prayer.time}
                  </span>
                  {prayer.isNext && (
                    <span className="inline-block mt-2.5 text-[10px] bg-[#D4AF85] text-[#050B14] font-bold px-2.5 py-0.5 rounded-full">
                      القادمة
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Desktop Footer (Full Width) */}
        <footer className="w-full border-t border-[#1E3A63]/60 bg-[#03060C] px-8 lg:px-16 py-8">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3 text-right text-xs text-[#8EA3BF]">
            <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF85]" />
                <span>سلطنة عمان — ولاية السيب (الموالح الجنوبية)</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF85]" />
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
          className="group flex items-center gap-2.5 bg-[#060D1A]/95 hover:bg-[#0A1628] text-white backdrop-blur-xl px-4 py-2 sm:py-2.5 rounded-full border border-[#1E3A63] hover:border-[#D4AF85]/80 shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Menu className="w-5 h-5 text-[#D4AF85] group-hover:text-[#FFF2D2] transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
          <span className="text-sm font-bold text-white group-hover:text-[#FFF2D2] transition-colors tracking-wide drop-shadow-sm">القائمة</span>
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
              <img
                src="/logo-gold.png"
                alt="جامع الحق"
                className="h-24 sm:h-28 md:h-32 w-auto max-h-[120px] object-contain drop-shadow-[0_4px_18px_rgba(212,175,133,0.45)] group-hover:scale-105 transition-all duration-300 mb-2"
              />
              <span className="font-naskh text-3xl font-bold text-white tracking-normal group-hover:text-[#D4AF85] transition-colors drop-shadow-md">
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
              صرح الإيمان والسكينة
            </h3>

            {/* Delicate thin divider */}
            <div className="w-16 h-[1px] bg-white/25 mb-6" />

            {/* Navigation links centered with elegant spacing */}
            <nav className="flex flex-col items-center gap-5 w-full">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-[#D4AF85] transition tracking-wide drop-shadow-sm"
              >
                الرئيسية
              </Link>

              <Link
                href="/videos"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-[#D4AF85] transition tracking-wide drop-shadow-sm"
              >
                الخطب والدروس
              </Link>

              <Link
                href="/booking"
                onClick={() => setSidebarOpen(false)}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-[#D4AF85] transition tracking-wide drop-shadow-sm"
              >
                المجلس
              </Link>

              <a
                href="#about"
                onClick={(e) => {
                  setSidebarOpen(false);
                  scrollToAbout(e, typeof window !== "undefined" && window.innerWidth < 1024);
                }}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-[#D4AF85] transition tracking-wide drop-shadow-sm"
              >
                عن المسجد
              </a>

              <a
                href="#prayer-times"
                onClick={(e) => {
                  e.preventDefault();
                  setSidebarOpen(false);
                  const targetId = typeof window !== "undefined" && window.innerWidth < 1024 ? "prayer-times-mobile" : "prayer-times";
                  const el = document.getElementById(targetId) || document.getElementById("prayer-times") || document.getElementById("prayer-times-mobile");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="text-base sm:text-lg font-bold text-white/90 hover:text-[#D4AF85] transition tracking-wide drop-shadow-sm"
              >
                أوقات الصلاة
              </a>
            </nav>

            {/* Delicate thin divider */}
            <div className="w-16 h-[1px] bg-white/25 mt-6" />
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
