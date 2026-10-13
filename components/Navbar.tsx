"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Calendar,
  Video,
  ChevronDown,
  Sparkles,
  Search,
  RotateCcw,
  Landmark,
  HeartHandshake,
  Clock,
  Phone,
} from "lucide-react";
import QuickBookingModal from "./QuickBookingModal";

interface NavbarProps {
  onReplay?: () => void;
  showReplay?: boolean;
}

export default function Navbar({ onReplay, showReplay = false }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDropdownOpen, setBookingDropdownOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<"3aza" | "katbketab">("katbketab");

  const openCalendarFor = (type: "3aza" | "katbketab") => {
    setModalInitialType(type);
    setCalendarModalOpen(true);
    setBookingDropdownOpen(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    {
      name: "حجز مناسبة",
      href: "/booking",
      hasDropdown: true,
      badge: "عزاء وكتب كتاب",
    },
    { name: "الفيديوهات", href: "/videos", icon: Video },
    { name: "مواقيت الصلاة", href: "/#prayer-times-mobile" },
    { name: "عن المسجد والدار", href: "/#about" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#090f0c]/90 backdrop-blur-md border-b border-amber-500/20 text-white transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-sm">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-aref text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  جامع الحق
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-300/80 tracking-wide">
                  دار المناسبات الإسلامية
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setBookingDropdownOpen(true)}
                      onMouseLeave={() => setBookingDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
                          isActive || pathname.startsWith("/booking")
                            ? "text-amber-300 font-bold"
                            : "text-slate-200 hover:text-amber-300"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{item.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-amber-400/80" />
                      </Link>

                      {/* Dropdown Menu */}
                      {bookingDropdownOpen && (
                        <div className="absolute top-full right-0 w-64 pt-2 z-50">
                          <div className="bg-[#0e1713] border border-amber-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                            <button
                              onClick={() => openCalendarFor("katbketab")}
                              className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-2.5 text-right transition group"
                            >
                              <span className="text-lg">💍</span>
                              <div>
                                <span className="block text-xs font-bold text-white group-hover:text-amber-300">
                                  حجز كتب كتاب (عقد قران)
                                </span>
                                <span className="block text-[10px] text-slate-400">
                                  قاعات مجهزة مع تقويم المواعيد
                                </span>
                              </div>
                            </button>

                            <button
                              onClick={() => openCalendarFor("3aza")}
                              className="w-full p-2.5 rounded-xl hover:bg-white/10 flex items-start gap-2.5 text-right transition group"
                            >
                              <span className="text-lg">🕊️</span>
                              <div>
                                <span className="block text-xs font-bold text-white group-hover:text-amber-300">
                                  حجز عزاء (دار التعازي)
                                </span>
                                <span className="block text-[10px] text-slate-400">
                                  قاعات رجالية ونسائية متكاملة
                                </span>
                              </div>
                            </button>

                            <div className="border-t border-white/10 my-1 pt-1">
                              <Link
                                href="/booking"
                                className="w-full p-2 rounded-xl text-center block text-[11px] font-bold text-amber-300 hover:bg-amber-500/10 transition"
                              >
                                عرض جدول التقويم والأسعار كاملة ←
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-amber-300 font-bold"
                        : "text-slate-200 hover:text-amber-300"
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4 text-amber-400" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {showReplay && onReplay && (
                <button
                  onClick={onReplay}
                  aria-label="إعادة المقدمة"
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/40 hover:bg-black/60 px-3.5 py-2 text-xs font-bold text-amber-200 border border-white/15 transition active:scale-95"
                  title="إعادة تشغيل فيديو المقدمة"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>المقدمة</span>
                </button>
              )}

              {/* Direct Booking with Calendar button */}
              <button
                onClick={() => openCalendarFor("katbketab")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 px-5 py-2.5 text-xs font-black text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>احجز مناسبتك (التقويم)</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => openCalendarFor("katbketab")}
                className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>حجز موعد</span>
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-slate-200 hover:text-white transition"
                aria-label="القائمة الرئيسية"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-[#0d1612]/98 border-b border-amber-500/25 px-5 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200 text-right">
            {/* Quick Occasion Reservation Cards for Mobile */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-3">
              <div className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>حجز دار المناسبات (مع التقويم المباشر):</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openCalendarFor("3aza")}
                  className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-right transition"
                >
                  <span className="block text-xs font-bold text-white">🕊️ حجز عزاء</span>
                  <span className="block text-[10px] text-slate-400">تقويم المواعيد والقاعات</span>
                </button>
                <button
                  onClick={() => openCalendarFor("katbketab")}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25 text-right transition"
                >
                  <span className="block text-xs font-bold text-amber-300">💍 كتب كتاب</span>
                  <span className="block text-[10px] text-slate-300">عقد قران واحتفال</span>
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === "/" ? "bg-amber-500/20 text-amber-300" : "text-slate-200 hover:bg-white/5"
                }`}
              >
                الرئيسية
              </Link>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === "/booking"
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                صفحة حجز المناسبات والتقويم الكامل
              </Link>
              <Link
                href="/videos"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  pathname === "/videos"
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>الفيديوهات والمرئيات</span>
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  جديد
                </span>
              </Link>
              <Link
                href="/#prayer-times-mobile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5 transition"
              >
                مواقيت الصلاة لليوم
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5 transition"
              >
                عن المسجد ودار المناسبات
              </Link>
            </div>

            {/* Direct CTA */}
            <div className="pt-2">
              <button
                onClick={() => openCalendarFor("katbketab")}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <Calendar className="w-4 h-4" />
                <span>فتح تقويم الحجوزات الآن</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Quick Calendar & Booking Modal */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={modalInitialType}
      />
    </>
  );
}
