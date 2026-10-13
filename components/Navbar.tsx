"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Video,
  Landmark,
  RotateCcw,
} from "lucide-react";
import QuickBookingModal from "./QuickBookingModal";

interface NavbarProps {
  onReplay?: () => void;
  showReplay?: boolean;
}

export default function Navbar({ onReplay, showReplay = false }: NavbarProps) {
  const pathname = usePathname();
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<"3aza" | "katbketab">("katbketab");

  const openCalendarFor = (type: "3aza" | "katbketab") => {
    setModalInitialType(type);
    setCalendarModalOpen(true);
  };

  const navLinks = [
    { name: "حجز مناسبة", href: "/booking", icon: Calendar },
    { name: "الفيديوهات", href: "/videos", icon: Video },
    { name: "عن المسجد", href: "/#about" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#090f0c]/90 backdrop-blur-md border-b border-amber-500/20 text-white transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-sm">
                <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-aref text-lg sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  جامع الحق
                </span>
                <span className="hidden sm:inline text-[10px] font-semibold text-amber-300/80 tracking-wide">
                  دار المناسبات الإسلامية
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - The 3 requested links only */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors ${
                      isActive || (item.href === "/booking" && pathname.startsWith("/booking"))
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
            <div className="hidden md:flex items-center gap-3">
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

              <button
                onClick={() => openCalendarFor("katbketab")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 px-5 py-2 text-xs font-black text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>احجز مناسبتك (التقويم)</span>
              </button>
            </div>

            {/* Mobile Navigation - The 3 links on top directly, NO 3-bars sidebar */}
            <nav className="md:hidden flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-2xl border border-white/10 text-xs font-bold">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-xl transition whitespace-nowrap ${
                      isActive
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                        : "text-slate-200 hover:text-amber-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={modalInitialType}
      />
    </>
  );
}
