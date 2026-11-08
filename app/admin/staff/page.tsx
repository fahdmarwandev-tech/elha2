"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/lib/api";
import {
  Users,
  UserPlus,
  Mail,
  Trash2,
  Copy,
  Check,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

const STORAGE_KEY = "dar_monasbat_staff_members";

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "staff-1",
    fullName: "مدير النظام",
    email: "admin@game3alhaq.com",
    createdAt: "2024-01-01",
  },
  {
    id: "staff-2",
    fullName: "مسؤول الحجوزات",
    email: "bookings@game3alhaq.com",
    createdAt: "2024-02-15",
  },
  {
    id: "staff-3",
    fullName: "المنسق الإعلامي",
    email: "media@game3alhaq.com",
    createdAt: "2024-03-10",
  },
];

export default function AdminStaffPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Staff List State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Simple Form Fields (Name + Email only)
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Copy Feedback
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 1. Authorization check
  useEffect(() => {
    if (!isAdminUser()) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // 2. Load stored staff from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep only required simplified fields
          const simplified: StaffMember[] = parsed.map((item: any) => ({
            id: item.id || `staff-${Date.now()}-${Math.random()}`,
            fullName: item.fullName || "موظف",
            email: item.email || "",
            createdAt: item.createdAt || new Date().toISOString().split("T")[0],
          }));
          setStaffList(simplified);
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
      setStaffList(DEFAULT_STAFF);
    } catch {
      setStaffList(DEFAULT_STAFF);
    }
  }, []);

  // Save changes helper
  const saveStaffList = (updated: StaffMember[]) => {
    setStaffList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  // Add staff member (Name + Email only)
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanName) {
      setFormError("يرجى إدخال اسم الموظف");
      return;
    }

    if (!cleanEmail) {
      setFormError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError("صيغة البريد الإلكتروني غير صحيحة، مثال: name@domain.com");
      return;
    }

    const exists = staffList.some((s) => s.email.toLowerCase() === cleanEmail);
    if (exists) {
      setFormError("هذا البريد الإلكتروني مضاف مسبقاً في القائمة");
      return;
    }

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newMember, ...staffList];
    saveStaffList(updated);

    setNameInput("");
    setEmailInput("");
    setFormSuccess(`تمت إضافة الموظف (${cleanName}) بنجاح`);

    setTimeout(() => {
      setFormSuccess("");
    }, 3500);
  };

  // Delete staff member
  const handleDelete = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    saveStaffList(updated);
    setDeleteConfirmId(null);
  };

  // Copy email
  const handleCopyEmail = (email: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans selection:bg-[#D4AF85] selection:text-[#0B1220] relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF85]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#1E447B]/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Shared Admin Header */}
      <AdminHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 text-right">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 pb-6 border-b border-[#1E3A63]/60">
          <div className="flex items-center gap-2 text-xs text-[#8EA3BF] mb-2 font-mono">
            <Link href="/admin" className="hover:text-[#FFE8B8] transition">
              لوحة الإدارة
            </Link>
            <span>/</span>
            <span className="text-[#D4AF85]">إدارة الموظفين</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-2 pt-1 pb-2 leading-[1.5]">
                إدارة موظفي جامع الحق
              </h1>
              <p className="text-xs sm:text-sm text-[#8EA3BF] mt-1">
                إضافة وحفظ أسماء وعناوين البريد الإلكتروني لموظفي الجامع.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1A2D] border border-[#1E3A63] text-xs font-bold text-[#FFE8B8] self-start sm:self-auto">
              <Users className="w-4 h-4 text-[#D4AF85]" />
              <span>إجمالي الموظفين: {staffList.length}</span>
            </div>
          </div>
        </div>

        {/* Simple Add Staff Form (Name + Email only) */}
        <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] rounded-3xl p-5 sm:p-7 mb-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#D4AF85]" />
            <h2 className="text-base sm:text-lg font-bold text-white">إضافة موظف جديد</h2>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Success Banner */}
          {formSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* Staff Name */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-[#FAF7F0] mb-1.5">
                اسم الموظف <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="مثال: أحمد السليماني"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs sm:text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] transition"
              />
            </div>

            {/* Staff Email */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-[#FAF7F0] mb-1.5">
                البريد الإلكتروني <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@game3alhaq.com"
                  dir="ltr"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs sm:text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 focus:outline-none focus:border-[#D4AF85] transition font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] border border-[#D4AF85] text-xs sm:text-sm font-bold text-[#FFF2D2] transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-[#FFE8B8]" />
                <span>إضافة</span>
              </button>
            </div>
          </form>
        </div>

        {/* Staff Table Card */}
        <div className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl overflow-hidden shadow-xl">
          {/* Table Search Bar */}
          <div className="p-4 border-b border-[#1E3A63] flex items-center justify-between gap-3 bg-[#0A1628]/60">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8EA3BF] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#050C18] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8EA3BF]/50 focus:outline-none focus:border-[#D4AF85] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA3BF] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-[#8EA3BF] whitespace-nowrap hidden sm:inline">
              عرض {filteredStaff.length} من {staffList.length} موظف
            </span>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#050C18] border border-[#1E3A63] flex items-center justify-center text-[#8EA3BF] mx-auto mb-3">
                <Users className="w-6 h-6 text-[#D4AF85]/60" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {searchQuery ? "لا توجد نتائج مطابقة" : "لا يوجد موظفون مضافون"}
              </h3>
              <p className="text-xs text-[#8EA3BF]">
                {searchQuery
                  ? "جرب البحث باسم أو بريد إلكتروني آخر"
                  : "أدخل اسم الموظف وبريده أعلاه لإضافته إلى القائمة"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-[#1E3A63] bg-[#0A1628]/90 text-[#8EA3BF] text-xs font-bold">
                    <th className="py-3 px-4 sm:px-6">اسم الموظف</th>
                    <th className="py-3 px-4">البريد الإلكتروني</th>
                    <th className="py-3 px-4 hidden sm:table-cell">تاريخ الإضافة</th>
                    <th className="py-3 px-4 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A63]/40 text-xs sm:text-sm">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-[#122849]/30 transition group">
                      {/* Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[linear-gradient(to_left,#050B14,#122849)] border border-[#D4AF85]/50 flex items-center justify-center font-bold text-xs text-[#FFE8B8] shrink-0">
                            {staff.fullName.slice(0, 1)}
                          </div>
                          <span className="font-bold text-white group-hover:text-[#FFE8B8] transition-colors">
                            {staff.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Email + Copy */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="inline-flex items-center gap-2 bg-[#050C18] border border-[#1E3A63] px-2.5 py-1.5 rounded-lg group-hover:border-[#D4AF85]/40 transition">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF85] shrink-0" />
                          <span className="text-[#FAF7F0] select-all">{staff.email}</span>
                          <button
                            onClick={() => handleCopyEmail(staff.email)}
                            title="نسخ البريد"
                            className="text-[#8EA3BF] hover:text-[#FFE8B8] transition p-0.5 active:scale-90 cursor-pointer"
                          >
                            {copiedEmail === staff.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-[#8EA3BF] font-mono">
                        {staff.createdAt}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDeleteConfirmId(staff.id)}
                          title="حذف الموظف"
                          className="p-1.5 rounded-lg bg-[#050C18] border border-[#1E3A63] text-[#8EA3BF] hover:text-rose-400 hover:border-rose-500/50 transition active:scale-90 cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-rose-500/60 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">تأكيد حذف الموظف</h3>
            <p className="text-xs text-[#8EA3BF] mb-6">
              هل أنت متأكد من حذف هذا الموظف وعنوان بريده من القائمة؟
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full border border-[#1E3A63] text-xs font-bold text-[#8EA3BF] hover:text-white transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#8EA3BF]/60 border-t border-[#1E3A63]/40 mt-12">
        جامع الحق — نظام إدارة الموظفين © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
