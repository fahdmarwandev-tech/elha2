"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, HeartHandshake, Landmark, MapPin, Menu, Phone, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <main className="min-h-screen bg-[#f4f0e8] relative flex flex-col justify-center items-center py-4 sm:py-8 px-2 sm:px-6 lg:px-10 overflow-x-hidden">
      
      {/* Soft warm tones around the page */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#eadfcf]/45 rounded-full blur-[130px] pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f1e6d7]/60 rounded-full blur-[140px] pointer-events-none -ml-40 -mb-20" />
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#eee2d2]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main site shell */}
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[1560px] bg-[#fbf8f1] rounded-[28px] sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(20,40,28,0.12),0_10px_25px_-5px_rgba(20,40,28,0.06)] border border-[#e9e2d6] overflow-hidden flex flex-col relative z-10"
      >
        
        {/* Webpage Content */}
        <div className="bg-[#fbf8f1] flex flex-col gap-0">
          
          {/* Navigation Bar */}
          <nav className="flex min-h-[84px] items-center justify-between gap-3 border-b border-[#eee7db] px-4 sm:px-8 lg:min-h-[100px] lg:px-12">
            {/* Logo in Aref Ruqaa Bold */}
            <Link href="/" className="group flex items-center gap-2">
              <Landmark className="h-7 w-7 shrink-0 text-[#b77a24]" />
              <span className="font-aref text-3xl font-bold text-[#4a3218] transition-colors group-hover:text-amber-700">
                جامع الحق
              </span>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {["الرئيسية", "عن المسجد", "مواقيت الصلاة", "الأنشطة والفعاليات", "التبرع", "اتصل بنا"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`relative py-2 text-sm font-semibold transition-colors ${activeTab === item ? "font-bold text-[#99651f] after:absolute after:inset-x-0 after:-bottom-[30px] after:h-0.5 after:bg-[#b77a24]" : "text-slate-600 hover:text-[#99651f]"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button aria-label="بحث" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f4eee3] text-[#8e5c1b] transition hover:bg-[#eee2cf]">
                <Search className="h-5 w-5" />
              </button>
              <a href="#prayer-times" className="hidden items-center gap-2 rounded-full bg-[#17241f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#263b32] lg:inline-flex">
                تبرع الآن
                <ArrowLeft className="h-4 w-4" />
              </a>
              <button
                aria-label="القائمة"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#80601f] text-white transition hover:bg-[#6e5019] lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>

          {mobileMenuOpen && (
            <div className="grid grid-cols-2 gap-2 border-b border-[#eee7db] bg-[#fbf8f1] p-4">
              {["الرئيسية", "عن المسجد", "مواقيت الصلاة", "الأنشطة والفعاليات", "التبرع", "اتصل بنا"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold ${activeTab === item ? "bg-[#f1e6d3] text-[#8e5c1b]" : "text-slate-700 hover:bg-[#f4eee3]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Hero inspired by the attached mosque design */}
          <section className="relative isolate min-h-[900px] overflow-hidden bg-[#fbf8f1] lg:min-h-[800px]">
            <picture className="absolute inset-0 -z-20">
              <source media="(max-width: 1023px)" srcSet="/Illuminated%20Mosque%20at%20Dusk.png" />
              <img
                src="/golden-hour-mosque-cream-fade.png?v=2"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-center"
              />
            </picture>
            <div className="relative z-10 ml-auto flex min-h-[900px] w-[64%] flex-col justify-center px-2 py-16 lg:min-h-[800px] lg:w-[51%] lg:px-10 lg:py-20">
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

                <h1 className="font-aref text-4xl font-bold leading-[1.2] tracking-tight text-[#14251f] lg:text-7xl">
                  جامع الحق
                </h1>
                <h2 className="text-xl font-bold leading-relaxed text-[#9b6828] lg:text-3xl">
                  بيت من بيوت الله ... يجمعنا على الخير
                </h2>
                <p className="text-base leading-8 text-slate-600">
                  مكان للعبادة، والعلم، والمجتمع، حيث تلتقي القلوب على الإيمان، وتُبنى العلاقات على الخير، وتزدهر حياتنا بقيم الإسلام.
                </p>

                <a
                  href="#programs"
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
                    <div key={item.title} className="flex min-w-0 flex-col items-center gap-2 border-l border-[#d9c9aa]/70 px-1 text-center last:border-l-0 lg:flex-row lg:text-right">
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
          {/* Interactive Prayer Times Strip */}
          <div id="prayer-times" className="mt-0 border-t border-[#eee7db] px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">مواقيت الصلاة لليوم</h3>
                <p className="text-xs text-slate-500">حسب التوقيت المحلي لجامع الحق</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full">
                ● محدث مباشرة
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {prayerTimes.map((prayer, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    prayer.isNext
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/15 scale-105"
                      : "bg-slate-50/80 text-slate-800 border-slate-200/60 hover:bg-slate-100"
                  }`}
                >
                  <span className={`text-xs font-semibold block mb-1 ${prayer.isNext ? "text-amber-300" : "text-slate-500"}`}>
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

      {/* Footer Info */}
      <footer className="w-full max-w-[1560px] mt-5 flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-500 px-3 lg:flex-row lg:text-right">
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
  );
}
