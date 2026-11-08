"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Video } from "lucide-react";
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
    { name: "المجلس", href: "/booking", icon: Calendar },
    { name: "الخطب والدروس", href: "/videos", icon: Video },
    { name: "عن المسجد", href: "/#about" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#060D1A] via-[#060D1A]/95 to-[#060D1A]/70 backdrop-blur-md text-[#FAF7F0] transition-all duration-300">
        <div className="w-full px-3 sm:px-4 lg:px-14 pt-2.5 sm:pt-4 pb-2 lg:py-3.5">
          <div className="flex items-center justify-between min-h-[75px] sm:min-h-[95px] lg:min-h-[120px] gap-2 sm:gap-4">
            {/* Mosque Logo Only - Responsive: balanced majestic size on mobile */}
            <Link
              href="/"
              className="group flex items-center transition-all active:scale-95 shrink-0"
              aria-label="الرئيسية - جامع الحق"
            >
              <img
                src="/logo-gold.png"
                alt="جامع الحق"
                className="h-24 sm:h-32 md:h-36 lg:h-52 xl:h-56 w-auto max-h-[96px] sm:max-h-[135px] md:max-h-[160px] lg:max-h-[210px] object-contain drop-shadow-[0_4px_28px_rgba(212,175,133,0.6)] group-hover:scale-105 transition-all duration-300"
              />
            </Link>

            {/* Desktop Navigation Links - Refined Luxury Typography matching Home page */}
            <nav className="hidden md:flex items-center gap-12 lg:gap-24 xl:gap-36 2xl:gap-44">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 py-2 text-xl lg:text-2xl font-sans font-black transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap group"
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`w-6 h-6 ${
                          isActive
                            ? "text-[#FFE8B8]"
                            : "text-white/90 group-hover:text-[#FFE8B8]"
                        } transition-colors`}
                      />
                    )}
                    <span
                      className={
                        isActive
                          ? "bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                          : "text-white/95 group-hover:bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200"
                      }
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation - Exact same size and typography as home page */}
            <nav className="md:hidden flex items-center gap-2 sm:gap-4 shrink-0">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href === "/booking" && pathname.startsWith("/booking"));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] text-[13px] sm:text-sm font-heading font-black py-1.5 px-0.5 inline-block scale-x-[0.94] scale-y-[1.45] origin-center transition-colors ${
                      isActive
                        ? "text-[#D4AF85] hover:text-[#FFF2D2]"
                        : "text-white hover:text-[#FFF2D2]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
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
