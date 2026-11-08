"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {
  CalendarCheck,
  Video,
  LogOut,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Building2,
  Film,
  Sparkles,
  Users,
} from "lucide-react";
import { getStoredUser, isAdminUser, logout, UserResponse } from "@/lib/api";

export default function AdminHubPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdminUser()) {
      router.replace("/login");
    } else {
      setCurrentUser(getStoredUser());
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#040812] flex items-center justify-center text-[#FAF7F0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF85] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#8EA3BF]">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans selection:bg-[#D4AF85] selection:text-[#0B1220] relative overflow-hidden">
      {/* Background luxury illumination */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF85]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#1E447B]/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Admin Navigation Bar */}
      <AdminHeader />

      {/* Main Hub Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center relative z-10 text-right">
        {/* Welcome Section */}
        <div className="mb-10 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#122849]/80 border border-[#D4AF85]/50 text-xs font-bold text-[#FFF2D2] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF85]" />
            <span>بوابة الإدارة المعتمدة</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            أهلاً بك، {currentUser?.fullName || "مدير النظام"}
          </h1>
          <p className="text-xs sm:text-sm text-[#8EA3BF] mt-2 max-w-xl">
            اختر القسم الذي ترغب في إدارته من الخيارات أدناه لتنظيم الحجوزات، تحديث محتوى المرئيات والدروس، أو إدارة عناوين بريد الموظفين.
          </p>
        </div>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Bookings & Halls Management */}
          <Link
            href="/admin/bookings"
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] hover:border-[#D4AF85] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(212,175,133,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF85]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#050C18] border border-[#1E3A63] group-hover:border-[#D4AF85] flex items-center justify-center text-[#D4AF85] mb-5 shadow-inner transition-colors">
                <CalendarCheck className="w-7 h-7 text-[#D4AF85]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#FAF7F0] group-hover:text-[#FFE8B8] transition-colors flex items-center gap-2">
                <span>إدارة الحجوزات والقاعات</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed mt-3">
                متابعة حجوزات عقد القران ومجالس العزاء، اعتماد وتأكيد أو إلغاء الطلبات، إدارة أسعار وساعات عمل القاعات، وتحديد فترات الإغلاق والصيانة.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1E3A63]/70 flex items-center justify-between text-xs sm:text-sm font-bold text-[#D4AF85] group-hover:text-[#FFE8B8]">
              <span>الدخول لإدارة الحجوزات</span>
              <span className="w-8 h-8 rounded-full bg-[#122849] border border-[#D4AF85]/40 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                ←
              </span>
            </div>
          </Link>

          {/* Card 2: Videos & Media Management */}
          <Link
            href="/admin/videos"
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] hover:border-[#D4AF85] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(212,175,133,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E447B]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#050C18] border border-[#1E3A63] group-hover:border-[#D4AF85] flex items-center justify-center text-[#FFE8B8] mb-5 shadow-inner transition-colors">
                <Film className="w-7 h-7 text-[#FFE8B8]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#FAF7F0] group-hover:text-[#FFE8B8] transition-colors flex items-center gap-2">
                <span>إدارة الخطب والمرئيات</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed mt-3">
                إضافة ونشر تسجيلات خطب الجمعة، المحاضرات، والدروس الدينية. دعم إضافة روابط يوتيوب أو رفع ملفات فيديو مع تخصيص المقطع المميز والتصنيفات.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1E3A63]/70 flex items-center justify-between text-xs sm:text-sm font-bold text-[#D4AF85] group-hover:text-[#FFE8B8]">
              <span>الدخول لإدارة المرئيات</span>
              <span className="w-8 h-8 rounded-full bg-[#122849] border border-[#D4AF85]/40 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                ←
              </span>
            </div>
          </Link>

          {/* Card 3: Staff & Team Management */}
          <Link
            href="/admin/staff"
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] hover:border-[#D4AF85] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(212,175,133,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF85]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#050C18] border border-[#1E3A63] group-hover:border-[#D4AF85] flex items-center justify-center text-[#D4AF85] mb-5 shadow-inner transition-colors">
                <Users className="w-7 h-7 text-[#D4AF85]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#FAF7F0] group-hover:text-[#FFE8B8] transition-colors flex items-center gap-2">
                <span>إدارة فريق العمل والموظفين</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed mt-3">
                إدارة عناوين البريد الإلكتروني المعتمدة لموظفي وإداريي جامع الحق، إضافة موظفين جدد، وتحديد الأدوار وحالات التفعيل وسجلات التواصل.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1E3A63]/70 flex items-center justify-between text-xs sm:text-sm font-bold text-[#D4AF85] group-hover:text-[#FFE8B8]">
              <span>الدخول لإدارة الموظفين</span>
              <span className="w-8 h-8 rounded-full bg-[#122849] border border-[#D4AF85]/40 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                ←
              </span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#8EA3BF]/60 border-t border-[#1E3A63]/40">
        جامع الحق — نظام الإدارة المحمي © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
