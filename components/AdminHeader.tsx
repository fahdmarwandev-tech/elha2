"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Film,
  ExternalLink,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { logout } from "@/lib/api";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const navLinks = [
    { href: "/admin", label: "لوحة الإدارة", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "إدارة الحجوزات", icon: CalendarCheck },
    { href: "/admin/videos", label: "إدارة المرئيات", icon: Film },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060D1A]/95 backdrop-blur-md border-b border-[#1E3A63]/80 px-4 sm:px-6 lg:px-8 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Right side: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin" className="group flex items-center gap-2.5">
            <img
              src="/logo-gold.png"
              alt="جامع الحق"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,133,0.5)] group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center: Admin Section Switcher Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#0A1628]/90 border border-[#1E3A63] p-1 rounded-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  isActive
                    ? "bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] text-[#0A1628] shadow-sm font-black"
                    : "text-[#8EA3BF] hover:text-[#FFE8B8] hover:bg-[#122849]/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0A1628]" : "text-[#D4AF85]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Left side: Quick actions (View public site + Logout) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/"
            className="text-[11px] sm:text-xs text-[#8EA3BF] hover:text-white px-3 py-1.5 rounded-full border border-[#1E3A63] hover:border-[#D4AF85]/60 bg-[#0A1628] transition flex items-center gap-1.5"
          >
            <span>زيارة الموقع</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="text-[11px] sm:text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Mobile nav pills row */}
      <div className="flex md:hidden items-center justify-center gap-1.5 pt-2 mt-2 border-t border-[#1E3A63]/60">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                isActive
                  ? "bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] text-[#0A1628] shadow-sm"
                  : "text-[#8EA3BF] hover:text-[#FFE8B8] bg-[#0A1628] border border-[#1E3A63]"
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? "text-[#0A1628]" : "text-[#D4AF85]"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
