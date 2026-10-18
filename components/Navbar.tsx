"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Video,
  Landmark,
  RotateCcw,
  User,
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
    { name: "المجلس", href: "/booking", icon: Calendar },
    { name: "الخطب والدروس", href: "/videos", icon: Video },
    { name: "عن المسجد", href: "/#about" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#060D1A]/95 backdrop-blur-md border-b border-[#1E3A63]/60 text-[#FAF7F0] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Logo only in Navbar */}
            <Link
              href="/"
              className="flex items-center group shrink-0"
              aria-label="الرئيسية - جامع الحق"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-[#0F1E36] to-[#0A1526] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] group-hover:border-[#D4AF85] group-hover:scale-105 transition-all shadow-sm">
                <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF85]" />
              </div>
            </Link>

            {/* Desktop Navigation Links - The 3 requested links only */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-2 text-sm transition-all duration-200 relative ${
                      isActive
                        ? "text-[#FFF2D2] font-black drop-shadow-[0_0_12px_rgba(212,175,133,0.55)] border-b-2 border-[#D4AF85]"
                        : "text-[#D4AF85]/80 hover:text-[#FFF2D2] font-bold"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-6 py-2.5 text-xs font-bold text-[#FFF2D2] border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_6px_20px_-3px_rgba(0,0,0,0.7),0_0_15px_rgba(212,175,133,0.25)] transition active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF85]" />
                <span>تسجيل الدخول</span>
              </Link>
            </div>

            {/* Mobile Navigation - The links on top directly */}
            <nav className="md:hidden flex items-center gap-2 sm:gap-3 text-xs font-semibold shrink-0">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-all whitespace-nowrap py-1 px-2.5 rounded-lg ${
                      isActive
                        ? "text-[#FFF2D2] font-black bg-[#122849]/60 border border-[#D4AF85]/70 shadow-[0_0_12px_rgba(212,175,133,0.3)]"
                        : "text-[#D4AF85]/80 hover:text-[#FFF2D2] font-bold"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/login"
                className={`transition-all whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                  pathname === "/login" || pathname === "/signup"
                    ? "text-[#FFF2D2] border-[#D4AF85] bg-[#122849] font-black shadow-[0_0_12px_rgba(212,175,133,0.4)]"
                    : "text-[#FFF2D2] border-[#D4AF85]/60 bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] font-bold shadow-sm"
                }`}
              >
                <User className="w-3 h-3 text-[#D4AF85]" />
                <span>دخول</span>
              </Link>
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
