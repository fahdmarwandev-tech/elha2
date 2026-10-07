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
  Search,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

function IslamicPatternOverlay() {
  return (
    <div className="absolute top-0 right-0 w-[70%] h-full pointer-events-none opacity-[0.06] select-none overflow-hidden">
      <svg
        className="w-full h-full text-[#8e682d]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="islamic-star-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0 L36 18 L54 18 L39 29 L45 47 L30 36 L15 47 L21 29 L6 18 L24 18 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <rect
              x="19.4"
              y="19.4"
              width="21.2"
              height="21.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              transform="rotate(45 30 30)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("الرئيسية");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          Matches exact design from reference image:
          - Uses /masjid_mobile_bg.jpg (vertical portrait reference photo)
          - Badge header on top left with Mosque Arch & جامع الحق in Aref Ruqaa
          - Search & Dark Bronze hamburger buttons on top right
          - Right-aligned text block: مرحباً بكم في —, جامع الحق, بيتٌ من بيوت الله ..., 4-line description
          - Dark pill button: اكتشف المزيد ←
          - Bottom 3-column features: صدقة جارية, علمٌ ونور, مجتمع متعاون
          ========================================================================= */}
      <div className="block lg:hidden min-h-screen bg-[#faf7f2] relative overflow-x-hidden text-right">
        {/* Full-bleed Mobile Hero Container */}
        <section className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden">
          {/* Mosque background with natural fade to cream on the right */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-left"
            style={{ backgroundImage: "url('/masjid_mobile_bg.jpg')" }}
          />

          {/* Islamic Star Pattern Overlay on the light right zone */}
          <IslamicPatternOverlay />

          {/* Mobile Top App Bar */}
          <header className="relative z-20 flex items-center justify-between px-3.5 pt-3.5 pb-2">
            {/* Quick Actions (Search & Menu Buttons - renders on right in RTL) */}
            <div className="flex items-center gap-2">
              <button
                aria-label="بحث"
                className="w-10 h-10 rounded-full bg-[#f6ede1]/90 backdrop-blur-md border border-[#ede3d2]/70 flex items-center justify-center text-[#74521b] shadow-sm active:scale-95 transition"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                aria-label="القائمة"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#6e5019] text-white flex items-center justify-center shadow-md active:scale-95 transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mosque Branding Pill (renders on left in RTL) */}
            <div className="flex items-center gap-2 bg-[#fdfbf7]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-[#ede3d2]/80">
              <MosqueDomeIcon className="w-5 h-5 text-[#9a702e]" />
              <span className="font-aref text-lg font-bold text-[#2e1d08] pt-0.5">
                جامع الحق
              </span>
            </div>
          </header>

          {/* Mobile Dropdown Menu Drawer */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-16 left-3 right-3 z-30 bg-[#fdfbf7]/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-[#ecdac2]"
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
                        ? "bg-[#f1e5d3] text-[#8e5c1b]"
                        : "text-slate-700 hover:bg-[#f4eee3]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Hero Content (Strictly Right-Aligned over the light zone) */}
          <div className="relative z-10 flex flex-col justify-center items-start text-right pr-4 pl-2 pt-8 pb-6 my-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-[56%] sm:w-[50%] mr-0 ml-auto flex flex-col items-start text-right gap-3"
            >
              {/* Eyebrow with gold accent line */}
              <div className="flex items-center gap-2 text-[#8e682d] font-bold text-xs sm:text-sm self-start">
                <span className="w-8 h-[2px] bg-[#a97831]" />
                <span>مرحبـاً بكم في</span>
              </div>

              {/* Main Mosque Name */}
              <h1 className="font-aref text-[40px] sm:text-5xl font-black text-[#14251f] tracking-tight leading-[1.05] text-right w-full">
                جامع الحق
              </h1>

              {/* Subheading */}
              <h2 className="text-[19px] sm:text-[22px] font-bold text-[#986c28] leading-[1.35] text-right w-full">
                بيتٌ منّ بيوت الله ...
                <br />
                يجمّعنا عليِ الخير
              </h2>

              {/* Description */}
              <p className="text-[12px] sm:text-[13.5px] text-[#47534c] leading-[1.7] font-medium text-right w-full">
                مكان للعبادة، والعلم، والمجتمع،
                <br />
                حيث تلتقي القلوب على الإيمان،
                <br />
                وتبني العلاقات على الخير،
                <br />
                ونزدهر حياتنا بقيم الإسلام.
              </p>

              {/* CTA Button */}
              <a
                href="#prayer-times-mobile"
                className="mt-1 self-start inline-flex items-center gap-2.5 bg-[#13221b] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-[#13221b]/20 active:scale-95 transition hover:bg-[#1f372c]"
              >
                <span>اكتشف المزيد</span>
                <ArrowLeft className="w-4 h-4 text-[#e2b866]" />
              </a>
            </motion.div>
          </div>

          {/* Mobile Bottom Features Bar (3 columns with dividers) */}
          <div className="relative z-10 w-full grid grid-cols-3 border-t border-[#d8c5aa]/60 pt-3 pb-5 px-1 bg-gradient-to-t from-[#fdfbf7]/80 to-transparent">
            {/* Column 1 (صدقة جارية - renders on right in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#f5ede0] flex items-center justify-center text-[#9a702e] mb-1.5 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#14251f]">صدقة جارية</span>
              <span className="text-[10px] text-[#71695f]">لأجر مستدام</span>
            </div>

            {/* Column 2 (علم ونور - renders in center) with vertical dividers */}
            <div className="flex flex-col items-center text-center px-1 border-r border-l border-[#d8c5aa]/60">
              <div className="w-11 h-11 rounded-full bg-[#f5ede0] flex items-center justify-center text-[#9a702e] mb-1.5 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#14251f]">علمٌ ونور</span>
              <span className="text-[10px] text-[#71695f]">لبناء جيل واعٍ</span>
            </div>

            {/* Column 3 (مجتمع متعاون - renders on left in RTL) */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-11 h-11 rounded-full bg-[#f5ede0] flex items-center justify-center text-[#9a702e] mb-1.5 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#14251f]">مجتمع متعاون</span>
              <span className="text-[10px] text-[#71695f]">معاً نصنع الأثر</span>
            </div>
          </div>
        </section>

        {/* Mobile Prayer Times Strip */}
        <section id="prayer-times-mobile" className="border-t border-[#ede3d2] bg-[#fbf8f1] px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">مواقيت الصلاة لليوم</h3>
              <p className="text-xs text-slate-500">حسب التوقيت المحلي لجامع الحق</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full">
              ● محدث الآن
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {prayerTimes.map((prayer, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  prayer.isNext
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/15"
                    : "bg-white/80 text-slate-800 border-slate-200/60"
                }`}
              >
                <span className={`text-[11px] font-semibold block mb-0.5 ${prayer.isNext ? "text-amber-300" : "text-slate-500"}`}>
                  {prayer.name}
                </span>
                <span className="text-base font-bold font-mono tracking-tight block">
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
        <footer className="border-t border-[#ede3d2] bg-[#fbf8f1] py-6 px-4 text-center text-xs text-slate-500 flex flex-col gap-2">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              المملكة العربية السعودية
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              للتواصل والاستفسار
            </span>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          DESKTOP / LAPTOP VIEW (>= 1024px / hidden lg:flex)
          Exact laptop layout preserved with floating browser card, daylight image,
          full header navigation, and desktop hero section.
          ========================================================================= */}
      <main className="hidden lg:flex min-h-screen bg-[#f4f0e8] relative flex-col justify-center items-center py-8 px-6 lg:px-10 overflow-x-hidden">
        {/* Soft warm tones around the page */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#eadfcf]/45 rounded-full blur-[130px] pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f1e6d7]/60 rounded-full blur-[140px] pointer-events-none -ml-40 -mb-20" />
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#eee2d2]/40 rounded-full blur-[120px] pointer-events-none" />

        {/* Main site shell */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[1560px] bg-[#fbf8f1] rounded-[32px] shadow-[0_25px_60px_-15px_rgba(20,40,28,0.12),0_10px_25px_-5px_rgba(20,40,28,0.06)] border border-[#e9e2d6] overflow-hidden flex flex-col relative z-10"
        >
          {/* Webpage Content */}
          <div className="bg-[#fbf8f1] flex flex-col gap-0">
            {/* Desktop Navigation Bar */}
            <nav className="flex min-h-[100px] items-center justify-between gap-3 border-b border-[#eee7db] px-8 lg:px-12">
              {/* Logo in Aref Ruqaa Bold */}
              <Link href="/" className="group flex items-center gap-2">
                <Landmark className="h-7 w-7 shrink-0 text-[#b77a24]" />
                <span className="font-aref text-3xl font-bold text-[#4a3218] transition-colors group-hover:text-amber-700">
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
                        ? "font-bold text-[#99651f] after:absolute after:inset-x-0 after:-bottom-[30px] after:h-0.5 after:bg-[#b77a24]"
                        : "text-slate-600 hover:text-[#99651f]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  aria-label="بحث"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4eee3] text-[#8e5c1b] transition hover:bg-[#eee2cf]"
                >
                  <Search className="h-5 w-5" />
                </button>
                <a
                  href="#prayer-times"
                  className="items-center gap-2 rounded-full bg-[#17241f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#263b32] inline-flex"
                >
                  تبرع الآن
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </nav>

            {/* Desktop Hero */}
            <section className="relative isolate min-h-[800px] overflow-hidden bg-[#fbf8f1]">
              <picture className="absolute inset-0 -z-20">
                <img
                  src="/golden-hour-mosque-cream-fade.png?v=2"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
              <div className="relative z-10 ml-auto flex min-h-[800px] w-[51%] flex-col justify-center px-10 py-20">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col items-start gap-5 text-right"
                >
                  <div className="flex items-center gap-4 text-lg font-semibold text-[#a66b20]">
                    <span className="h-px w-16 bg-[#c58b37]" />
                    <span>مرحبًا بكم في</span>
                  </div>

                  <h1 className="font-aref text-7xl font-bold leading-[1.2] tracking-tight text-[#14251f]">
                    جامع الحق
                  </h1>
                  <h2 className="text-3xl font-bold leading-relaxed text-[#9b6828]">
                    بيت من بيوت الله ... يجمعنا على الخير
                  </h2>
                  <p className="text-base leading-8 text-slate-600">
                    مكان للعبادة، والعلم، والمجتمع، حيث تلتقي القلوب على الإيمان، وتُبنى العلاقات على الخير، وتزدهر حياتنا بقيم الإسلام.
                  </p>

                  <a
                    href="#prayer-times"
                    className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#14251f] px-5 text-base font-bold text-white shadow-lg shadow-[#14251f]/15 transition hover:bg-[#203b30]"
                  >
                    <ArrowLeft className="h-5 w-5 text-amber-300" />
                    <span>اكتشف المزيد</span>
                  </a>

                  <div className="mt-3 grid w-full grid-cols-3 border-t border-[#d9c9aa]/70 pt-6">
                    {[
                      { icon: HeartHandshake, title: "صدقة جارية", detail: "لأجر مستدام" },
                      { icon: BookOpen, title: "علم ونور", detail: "لبناء جيل واعٍ" },
                      { icon: Users, title: "مجتمع متعاون", detail: "معًا نصنع الأثر" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex min-w-0 flex-col items-center gap-2 border-l border-[#d9c9aa]/70 px-1 text-center last:border-l-0 lg:flex-row lg:text-right"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3ecdf] text-[#b47a26]">
                          <item.icon className="h-6 w-6" />
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#26352f]">{item.title}</span>
                          <span className="text-[10px] text-slate-500">{item.detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Desktop Interactive Prayer Times Strip */}
            <div id="prayer-times" className="mt-0 border-t border-[#eee7db] px-8 py-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">مواقيت الصلاة لليوم</h3>
                  <p className="text-xs text-slate-500">حسب التوقيت المحلي لجامع الحق</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full">
                  ● محدث مباشرة
                </span>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {prayerTimes.map((prayer, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      prayer.isNext
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/15 scale-105"
                        : "bg-slate-50/80 text-slate-800 border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold block mb-1 ${
                        prayer.isNext ? "text-amber-300" : "text-slate-500"
                      }`}
                    >
                      {prayer.name}
                    </span>
                    <span className="text-lg font-bold font-mono tracking-tight block">
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
        <footer className="w-full max-w-[1560px] mt-5 flex items-center justify-between gap-3 text-right text-xs text-slate-500 px-3">
          <span>© جميع الحقوق محفوظة لجامع الحق — صرح الإيمان والسكينة.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>المملكة العربية السعودية</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>للتواصل والاستفسار</span>
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
