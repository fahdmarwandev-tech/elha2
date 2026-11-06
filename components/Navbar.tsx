"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Video,
  User,
  LogOut,
} from "lucide-react";
import QuickBookingModal from "./QuickBookingModal";
import { getStoredUser, logout, UserResponse } from "@/lib/api";

interface NavbarProps {
  onReplay?: () => void;
  showReplay?: boolean;
}

export default function Navbar({ onReplay, showReplay = false }: NavbarProps) {
  const pathname = usePathname();
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<"3aza" | "katbketab">("katbketab");
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    const handleAuthChange = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener("auth:login", handleAuthChange);
    window.addEventListener("auth:logout", handleAuthChange);
    window.addEventListener("auth:token_refreshed", handleAuthChange);

    return () => {
      window.removeEventListener("auth:login", handleAuthChange);
      window.removeEventListener("auth:logout", handleAuthChange);
      window.removeEventListener("auth:token_refreshed", handleAuthChange);
    };
  }, []);

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
      <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#060D1A] via-[#060D1A]/95 to-[#060D1A]/70 backdrop-blur-md text-[#FAF7F0] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-20 sm:min-h-24 py-2 gap-2 sm:gap-4">
            {/* Mosque Logo Only (Refined size) */}
            <Link
              href="/"
              className="flex items-center group shrink-0 py-1"
              aria-label="الرئيسية - جامع الحق"
            >
              <img
                src="/logo-gold.png"
                alt="جامع الحق"
                className="h-18 sm:h-22 md:h-26 w-auto max-h-[84px] sm:max-h-[96px] object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-[0_4px_18px_rgba(212,175,133,0.5)]"
              />
            </Link>

            {/* Desktop Navigation Links - Refined Luxury Typography */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2.5 py-2 text-xl lg:text-2xl font-sans font-black transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap group"
                  >
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-[#FFE8B8]" />
                    )}
                    <span
                      className={
                        isActive
                          ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                          : "text-white/95 group-hover:text-[#FFF2D2] transition-colors"
                      }
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#FFF2D2] bg-[#122849]/80 px-4 py-2 rounded-full border border-[#D4AF85]/60 flex items-center gap-2 shadow-[0_0_12px_rgba(212,175,133,0.25)]">
                    <User className="w-4 h-4 text-[#D4AF85]" />
                    <span>{currentUser.fullName.split(" ")[0]}</span>
                  </span>
                  <button
                    onClick={() => logout()}
                    title="تسجيل الخروج"
                    className="p-2 rounded-full bg-[#122849]/50 hover:bg-rose-950/60 border border-[#1E3A63] hover:border-rose-500/50 text-[#8EA3BF] hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] px-7 py-3 text-sm sm:text-base font-bold text-[#FFF2D2] border border-[#D4AF85]/80 hover:border-[#FFF0C8] shadow-[0_6px_20px_-3px_rgba(0,0,0,0.7),0_0_15px_rgba(212,175,133,0.25)] transition active:scale-95"
                >
                  <User className="w-4 h-4 text-[#D4AF85]" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>

            {/* Mobile Navigation - Refined text links matching home page */}
            <nav className="md:hidden flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm shrink-0">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="py-1 transition-all whitespace-nowrap"
                  >
                    <span
                      className={`font-sans font-black text-sm sm:text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] ${
                        isActive
                          ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent hover:brightness-125"
                          : "text-white/95 hover:text-[#FFF2D2]"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
              {currentUser ? (
                <button
                  onClick={() => logout()}
                  className="transition-all whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[#FFF2D2] border-[#FFE8B8]/60 bg-[#122849]/80 font-sans font-bold text-xs sm:text-sm"
                >
                  <span>{currentUser.fullName.split(" ")[0]}</span>
                  <LogOut className="w-3.5 h-3.5 text-[#FFE8B8]" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`transition-all whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full border ${
                    pathname === "/login" || pathname === "/signup"
                      ? "text-[#FFF2D2] border-[#FFE8B8] bg-[#122849] font-sans font-black shadow-[0_0_12px_rgba(212,175,133,0.4)] text-xs sm:text-sm"
                      : "text-[#FAF7F0] hover:text-white border-[#4A79B8]/60 hover:border-[#D4AF85] bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] font-sans font-bold shadow-sm text-xs sm:text-sm"
                  }`}
                >
                  <User className="w-4 h-4 text-[#D4AF85]" />
                  <span>دخول</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Soft feather gradient: seamless velvety fade from dark navbar into background photo */}
        <div className="absolute top-full inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#060D1A]/70 via-[#060D1A]/20 to-transparent pointer-events-none" />
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
