"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import QuickBookingModal from "./QuickBookingModal";

interface NavbarProps {
  onReplay?: () => void;
  showReplay?: boolean;
}

export default function Navbar({ onReplay, showReplay = false }: NavbarProps) {
  const pathname = usePathname();
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState<"3aza" | "katbketab">("katbketab");

  const navLinks = [
    { name: "المجلس", href: "/booking" },
    { name: "الخطب والدروس", href: "/videos" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#060D1A] via-[#060D1A]/95 to-[#060D1A]/70 backdrop-blur-md text-[#FAF7F0] transition-all duration-300">
        <div className="w-full px-4 sm:px-8 lg:px-14 pt-4 sm:pt-5 pb-2 lg:py-4">
          <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center">
            {/* 1. Right: المجلس */}
            <div className="flex items-center justify-start text-right">
              <Link
                href="/booking"
                className="py-1 sm:py-2 px-1.5 sm:px-4 text-sm sm:text-xl lg:text-2xl font-sans font-black transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap group"
              >
                <span
                  className={
                    pathname === "/booking" || pathname.startsWith("/booking")
                      ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                      : "text-white/95 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200"
                  }
                >
                  المجلس
                </span>
              </Link>
            </div>

            {/* 2. Middle / Center: Mosque Logo & Location */}
            <div className="flex flex-col items-center justify-center text-center px-1">
              <Link
                href="/"
                className="group flex flex-col items-center justify-center transition-all active:scale-95 shrink-0"
                aria-label="جامع الحق"
              >
                <img
                  src="/logo-gold.png"
                  alt="جامع الحق"
                  className="h-28 sm:h-32 lg:h-36 xl:h-40 w-auto max-h-[110px] lg:max-h-[135px] xl:max-h-[145px] object-contain drop-shadow-[0_4px_30px_rgba(212,175,133,0.65)] group-hover:scale-105 transition-all duration-300"
                />
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 text-[11px] sm:text-sm lg:text-base font-bold whitespace-nowrap bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#C59B63_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5 text-[#D4AF85] shrink-0" />
                  <span className="whitespace-nowrap">الموالح الجنوبية - السيب</span>
                </div>
              </Link>
            </div>

            {/* 3. Left: الخطب والدروس */}
            <div className="flex items-center justify-end text-left">
              <Link
                href="/videos"
                className="py-1 sm:py-2 px-1.5 sm:px-4 text-sm sm:text-xl lg:text-2xl font-sans font-black transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] group flex flex-col md:inline-block items-center leading-tight text-center md:text-left"
              >
                <span
                  className={
                    pathname === "/videos"
                      ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] whitespace-nowrap block md:inline"
                      : "text-white/95 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200 whitespace-nowrap block md:inline"
                  }
                >
                  الخطب
                </span>
                <span className="hidden md:inline">&nbsp;</span>
                <span
                  className={
                    pathname === "/videos"
                      ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] whitespace-nowrap block md:inline"
                      : "text-white/95 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200 whitespace-nowrap block md:inline"
                  }
                >
                  والدروس
                </span>
              </Link>
            </div>
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
