"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Trash2,
  X,
  AlertCircle,
  MessageCircle,
  Maximize2,
  Check,
  Building2,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Ribbon,
} from "lucide-react";
import Link from "next/link";

export interface AdminBooking {
  id: string;
  code: string;
  fullName: string;
  nationalId: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  bookingType: "katbketab" | "3aza";
  date: string; // YYYY-MM-DD
  monthIndex: number; // 0: Oct, 1: Nov, 2: Dec
  day: number;
  monthName: string;
  hours: string[];
  timeFormatted: string;
  hoursCountText: string;
  hallName: string;
  notes?: string;
  status: "CONFIRMED" | "COMPLETED" | "PENDING" | "CANCELLED";
  createdAt: string;
}

// Initial realistic seed dataset spanning October, November, and December 2026
const INITIAL_SEED_BOOKINGS: AdminBooking[] = [
  // Past Bookings (October 2026 & early Nov)
  {
    id: "b_1001",
    code: "DAR-819230",
    fullName: "راشد بن سالم الكندي",
    nationalId: "98234120",
    phone: "96891234567",
    email: "rashid.al-kindi@omantel.om",
    bookingType: "katbketab",
    date: "2026-10-12",
    monthIndex: 0,
    day: 12,
    monthName: "أكتوبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00"],
    timeFormatted: "من 06:00 مساءً حتى 10:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران راشد بن سالم الكندي على كريمة الشيخ حمود المعمري",
    status: "COMPLETED",
    createdAt: "2026-10-01T10:15:00.000Z",
  },
  {
    id: "b_1002",
    code: "DAR-542109",
    fullName: "عبدالله بن سعيد العامري",
    nationalId: "91028374",
    phone: "96892345678",
    email: "abdullah.amri@gmail.com",
    bookingType: "katbketab",
    date: "2026-10-19",
    monthIndex: 0,
    day: 19,
    monthName: "أكتوبر 2026",
    hours: ["19:00", "20:00", "21:00", "22:00"],
    timeFormatted: "من 07:00 مساءً حتى 11:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "حفل عقد قران نجلهم أحمد العامري - تجهيز القهوة والبخور العماني",
    status: "COMPLETED",
    createdAt: "2026-10-05T14:30:00.000Z",
  },
  {
    id: "b_1003",
    code: "DAR-334190",
    fullName: "أسرة الشيخ مبارك الحكماني",
    nationalId: "97341209",
    phone: "96893456789",
    email: "alhikmani.family@gmail.com",
    bookingType: "3aza",
    date: "2026-10-26",
    monthIndex: 0,
    day: 26,
    monthName: "أكتوبر 2026",
    hours: ["16:00", "17:00", "18:00", "19:00", "20:00"],
    timeFormatted: "من 04:00 عصراً حتى 09:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عزاء المرحوم بإذن الله الشيخ مبارك بن سيف الحكماني",
    status: "COMPLETED",
    createdAt: "2026-10-24T08:00:00.000Z",
  },
  {
    id: "b_1004",
    code: "DAR-671239",
    fullName: "ناصر بن محمد الشامسي",
    nationalId: "94561230",
    phone: "96894567890",
    email: "shamsi.nasser@outlook.com",
    bookingType: "3aza",
    date: "2026-11-01",
    monthIndex: 1,
    day: 1,
    monthName: "نوفمبر 2026",
    hours: ["15:00", "16:00", "17:00", "18:00", "19:00"],
    timeFormatted: "من 03:00 عصراً حتى 08:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عزاء المغفور لها بإذن الله الوالدة فاطمة بنت ناصر",
    status: "COMPLETED",
    createdAt: "2026-10-30T11:20:00.000Z",
  },
  {
    id: "b_1005",
    code: "DAR-992384",
    fullName: "ماجد بن خلفان الهنائي",
    nationalId: "99102456",
    phone: "96895678901",
    email: "majid.hinai@gmail.com",
    bookingType: "katbketab",
    date: "2026-11-02",
    monthIndex: 1,
    day: 2,
    monthName: "نوفمبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00"],
    timeFormatted: "من 06:00 مساءً حتى 10:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران ماجد بن خلفان الهنائي على كريمة سالم الشريقي",
    status: "COMPLETED",
    createdAt: "2026-10-20T16:45:00.000Z",
  },

  // Today & Upcoming Bookings (November 2026 & December 2026)
  {
    id: "b_1006",
    code: "DAR-720194",
    fullName: "سالم بن خميس الحارثي",
    nationalId: "92348571",
    phone: "96896789012",
    secondaryPhone: "96896789013",
    email: "salim.harthi@gov.om",
    bookingType: "katbketab",
    date: "2026-11-06",
    monthIndex: 1,
    day: 6,
    monthName: "نوفمبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00", "22:00"],
    timeFormatted: "من 06:00 مساءً حتى 11:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران راشد بن سالم الحارثي على كريمة ناصر البوسعيدي - حضور 350 ضيفاً",
    status: "CONFIRMED",
    createdAt: "2026-10-28T09:10:00.000Z",
  },
  {
    id: "b_1007",
    code: "DAR-482910",
    fullName: "أحمد بن خلفان السعدي",
    nationalId: "95123089",
    phone: "96897890123",
    email: "ahmed.saadi@hotmail.com",
    bookingType: "katbketab",
    date: "2026-11-08",
    monthIndex: 1,
    day: 8,
    monthName: "نوفمبر 2026",
    hours: ["19:00", "20:00", "21:00", "22:00"],
    timeFormatted: "من 07:00 مساءً حتى 11:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران مأذون شرعي معتمد - تجهيز شاشات العرض الترحيبية",
    status: "CONFIRMED",
    createdAt: "2026-10-29T12:00:00.000Z",
  },
  {
    id: "b_1008",
    code: "DAR-318492",
    fullName: "عائلة آل سعيد الكرام",
    nationalId: "90123847",
    phone: "96898901234",
    email: "alsaidi.office@gmail.com",
    bookingType: "3aza",
    date: "2026-11-12",
    monthIndex: 1,
    day: 12,
    monthName: "نوفمبر 2026",
    hours: ["16:00", "17:00", "18:00", "19:00", "20:00"],
    timeFormatted: "من 04:00 عصراً حتى 09:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "مجلس عزاء المغفور له بإذن الله الشيخ سعيد بن حمود آل سعيد",
    status: "CONFIRMED",
    createdAt: "2026-11-03T18:30:00.000Z",
  },
  {
    id: "b_1009",
    code: "DAR-602931",
    fullName: "محمد بن ناصر المعولي",
    nationalId: "96781203",
    phone: "96899012345",
    email: "mohd.maawali@gmail.com",
    bookingType: "katbketab",
    date: "2026-11-15",
    monthIndex: 1,
    day: 15,
    monthName: "نوفمبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00"],
    timeFormatted: "من 06:00 مساءً حتى 10:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران محمد المعولي - طلب مأذون شرعي ومكبرات الصوت الإضافية",
    status: "CONFIRMED",
    createdAt: "2026-11-01T15:20:00.000Z",
  },
  {
    id: "b_1010",
    code: "DAR-854120",
    fullName: "خالد بن عبدالله البلوشي",
    nationalId: "98341902",
    phone: "96891122334",
    email: "khalid.balushi@omantel.net",
    bookingType: "katbketab",
    date: "2026-11-20",
    monthIndex: 1,
    day: 20,
    monthName: "نوفمبر 2026",
    hours: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    timeFormatted: "من 05:00 مساءً حتى 10:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "حفل عقد القران وتناول وجبة العشاء في الفناء الخارجي المجهز",
    status: "CONFIRMED",
    createdAt: "2026-10-25T11:45:00.000Z",
  },
  {
    id: "b_1011",
    code: "DAR-192837",
    fullName: "حميد بن راشد الغافري",
    nationalId: "91456782",
    phone: "96892233445",
    email: "humaid.ghafri@gmail.com",
    bookingType: "3aza",
    date: "2026-11-23",
    monthIndex: 1,
    day: 23,
    monthName: "نوفمبر 2026",
    hours: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    timeFormatted: "من 03:00 عصراً حتى 09:00 مساءً",
    hoursCountText: "6 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "مجلس عزاء المغفور له بإذن الله راشد بن حميد الغافري",
    status: "PENDING",
    createdAt: "2026-11-04T07:15:00.000Z",
  },
  {
    id: "b_1012",
    code: "DAR-940128",
    fullName: "يوسف بن إبراهيم الزدجالي",
    nationalId: "97812304",
    phone: "96893344556",
    email: "yousuf.zadjali@gmail.com",
    bookingType: "katbketab",
    date: "2026-11-27",
    monthIndex: 1,
    day: 27,
    monthName: "نوفمبر 2026",
    hours: ["19:00", "20:00", "21:00", "22:00"],
    timeFormatted: "من 07:00 مساءً حتى 11:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران يوسف الزدجالي على كريمة طارق البلوشي",
    status: "CONFIRMED",
    createdAt: "2026-11-02T13:40:00.000Z",
  },
  {
    id: "b_1013",
    code: "DAR-438901",
    fullName: "طارق بن مسعود الشكيلي",
    nationalId: "93451298",
    phone: "96894455667",
    email: "tariq.shukaili@gmail.com",
    bookingType: "katbketab",
    date: "2026-12-02",
    monthIndex: 2,
    day: 2,
    monthName: "ديسمبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00"],
    timeFormatted: "من 06:00 مساءً حتى 10:00 مساءً",
    hoursCountText: "4 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران ومجلس ترحيبي عائلي",
    status: "CONFIRMED",
    createdAt: "2026-11-03T16:00:00.000Z",
  },
  {
    id: "b_1014",
    code: "DAR-765432",
    fullName: "علي بن سعيد المقبالي",
    nationalId: "95678912",
    phone: "96895566778",
    email: "ali.muqbali@gmail.com",
    bookingType: "3aza",
    date: "2026-12-08",
    monthIndex: 2,
    day: 8,
    monthName: "ديسمبر 2026",
    hours: ["16:00", "17:00", "18:00", "19:00", "20:00"],
    timeFormatted: "من 04:00 عصراً حتى 09:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عزاء المرحومة بإذن الله مريم بنت علي المقبالي",
    status: "CONFIRMED",
    createdAt: "2026-11-04T10:00:00.000Z",
  },
  {
    id: "b_1015",
    code: "DAR-892104",
    fullName: "فيصل بن سيف الوهيبي",
    nationalId: "98123456",
    phone: "96896677889",
    email: "faisal.wuhaibi@gmail.com",
    bookingType: "katbketab",
    date: "2026-12-15",
    monthIndex: 2,
    day: 15,
    monthName: "ديسمبر 2026",
    hours: ["18:00", "19:00", "20:00", "21:00", "22:00"],
    timeFormatted: "من 06:00 مساءً حتى 11:00 مساءً",
    hoursCountText: "5 ساعات",
    hallName: "قاعة المجلس العام",
    notes: "عقد قران فيصل بن سيف الوهيبي",
    status: "CONFIRMED",
    createdAt: "2026-11-04T12:00:00.000Z",
  },
];

const MONTHS_DATA = [
  { name: "أكتوبر 2026", year: 2026, monthNum: 10, daysInMonth: 31, startDayOffset: 4 },
  { name: "نوفمبر 2026", year: 2026, monthNum: 11, daysInMonth: 30, startDayOffset: 0 },
  { name: "ديسمبر 2026", year: 2026, monthNum: 12, daysInMonth: 31, startDayOffset: 2 },
];

// Today reference date: November 5, 2026
const TODAY_STR = "2026-11-05";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // Default November 2026
  const [selectedDay, setSelectedDay] = useState<number>(6); // Default Nov 6 (first upcoming booking)
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "katbketab" | "3aza">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "PENDING" | "CANCELLED">("ALL");

  // Modals
  const [selectedBookingModal, setSelectedBookingModal] = useState<AdminBooking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Booking Form State for Admin
  const [newForm, setNewForm] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    bookingType: "katbketab" as "katbketab" | "3aza",
    date: "2026-11-07",
    startHour: "18:00",
    endHour: "22:00",
    hallName: "قاعة المجلس العام",
    notes: "",
  });

  // Load from localStorage or initial seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem("game3_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial seed to ensure rich historical & upcoming data
          const existingCodes = new Set(parsed.map((b: AdminBooking) => b.code));
          const missingSeeds = INITIAL_SEED_BOOKINGS.filter((b) => !existingCodes.has(b.code));
          const merged = [...parsed, ...missingSeeds];
          setBookings(merged);
          return;
        }
      }
      // If no stored data, initialize with initial seeds
      setBookings(INITIAL_SEED_BOOKINGS);
      localStorage.setItem("game3_bookings", JSON.stringify(INITIAL_SEED_BOOKINGS));
    } catch (e) {
      console.error("Failed to load bookings from storage", e);
      setBookings(INITIAL_SEED_BOOKINGS);
    }
  }, []);

  const saveBookings = (newBookings: AdminBooking[]) => {
    setBookings(newBookings);
    try {
      localStorage.setItem("game3_bookings", JSON.stringify(newBookings));
    } catch (e) {
      console.error("Failed to persist bookings", e);
    }
  };

  const currentMonth = MONTHS_DATA[currentMonthIndex];

  // Map of bookings on the current month indexed by day
  const bookingsByDay = useMemo(() => {
    const map = new Map<number, AdminBooking[]>();
    bookings.forEach((b) => {
      // Check if booking matches current month
      if (b.monthIndex === currentMonthIndex || b.date.startsWith(`2026-${String(currentMonth.monthNum).padStart(2, "0")}`)) {
        const day = b.day || parseInt(b.date.split("-")[2], 10);
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day)!.push(b);
      }
    });
    return map;
  }, [bookings, currentMonthIndex, currentMonth.monthNum]);

  // Selected Day's bookings
  const selectedDayBookings = useMemo(() => {
    return bookingsByDay.get(selectedDay) || [];
  }, [bookingsByDay, selectedDay]);

  // Classified Bookings: Upcoming vs Past
  const { upcomingBookings, pastBookings } = useMemo(() => {
    const upcoming: AdminBooking[] = [];
    const past: AdminBooking[] = [];

    bookings.forEach((b) => {
      if (b.date >= TODAY_STR && b.status !== "COMPLETED") {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });

    // Sort upcoming ascending (soonest first)
    upcoming.sort((a, b) => a.date.localeCompare(b.date));
    // Sort past descending (most recent first)
    past.sort((a, b) => b.date.localeCompare(a.date));

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings]);

  // Filtered Table Bookings
  const filteredTableBookings = useMemo(() => {
    let sourceList: AdminBooking[];
    if (activeTab === "UPCOMING") {
      sourceList = upcomingBookings;
    } else if (activeTab === "PAST") {
      sourceList = pastBookings;
    } else {
      sourceList = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
    }

    return sourceList.filter((b) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.fullName.toLowerCase().includes(q);
        const matchesCode = b.code.toLowerCase().includes(q);
        const matchesPhone = b.phone.includes(q);
        const matchesId = b.nationalId.includes(q);
        const matchesNotes = (b.notes || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesPhone && !matchesId && !matchesNotes) {
          return false;
        }
      }

      // Filter type
      if (filterType !== "ALL" && b.bookingType !== filterType) {
        return false;
      }

      // Filter status
      if (filterStatus !== "ALL" && b.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [activeTab, upcomingBookings, pastBookings, bookings, searchQuery, filterType, filterStatus]);

  // Statistics KPIs
  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = upcomingBookings.length;
    const past = pastBookings.length;
    const katbCount = bookings.filter((b) => b.bookingType === "katbketab").length;
    const azaCount = bookings.filter((b) => b.bookingType === "3aza").length;
    const todayCount = bookings.filter((b) => b.date === TODAY_STR).length;

    return { total, upcoming, past, katbCount, azaCount, todayCount };
  }, [bookings, upcomingBookings, pastBookings]);

  // Status Badge Helper
  const getStatusBadge = (status: AdminBooking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مؤكد</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>منتهي ومكتمل</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>قيد المراجعة</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <X className="w-3.5 h-3.5" />
            <span>ملغى</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Change Status
  const handleStatusChange = (bookingId: string, newStatus: AdminBooking["status"]) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b));
    saveBookings(updated);
  };

  // Delete Booking
  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً من النظام؟")) {
      const updated = bookings.filter((b) => b.id !== bookingId);
      saveBookings(updated);
      if (selectedBookingModal?.id === bookingId) {
        setSelectedBookingModal(null);
      }
    }
  };

  // Handle Create New Booking Modal Submit
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.fullName || !newForm.nationalId || !newForm.phone || !newForm.date) {
      alert("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    const dateParts = newForm.date.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    let mIdx = 1;
    let mName = "نوفمبر 2026";
    if (month === 10) {
      mIdx = 0;
      mName = "أكتوبر 2026";
    } else if (month === 12) {
      mIdx = 2;
      mName = "ديسمبر 2026";
    }

    const code = `DAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const created: AdminBooking = {
      id: `b_${Date.now()}`,
      code,
      fullName: newForm.fullName.trim(),
      nationalId: newForm.nationalId.trim(),
      phone: newForm.phone.trim(),
      secondaryPhone: newForm.secondaryPhone.trim() || undefined,
      email: newForm.email.trim() || "admin@game3alhaq.om",
      bookingType: newForm.bookingType,
      date: newForm.date,
      monthIndex: mIdx,
      day: day,
      monthName: mName,
      hours: [newForm.startHour, newForm.endHour],
      timeFormatted: `من ${newForm.startHour} حتى ${newForm.endHour}`,
      hoursCountText: "حسب التحديد",
      hallName: newForm.hallName,
      notes: newForm.notes.trim() || undefined,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    saveBookings([created, ...bookings]);
    setShowAddModal(false);
    setSelectedDay(day);
    setCurrentMonthIndex(mIdx);
    setNewForm({
      fullName: "",
      nationalId: "",
      phone: "",
      secondaryPhone: "",
      email: "",
      bookingType: "katbketab",
      date: "2026-11-07",
      startHour: "18:00",
      endHour: "22:00",
      hallName: "قاعة المجلس العام",
      notes: "",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#040812] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#0B1220] overflow-x-hidden">
      {/* Background radial gradient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#122849]/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[550px] h-[550px] bg-[#C59B63]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-[#0E1F3B]/30 rounded-full blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 w-full flex-1 space-y-8">
        {/* Top Header & Admin Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF85]/20 text-[#FFE8B8] border border-[#D4AF85]/40 flex items-center gap-1.5 shadow-inner">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFE8B8]" />
                <span>لوحة تحكم المسؤول</span>
              </span>
              <span className="text-xs text-[#8EA3BF]">
                اليوم: الخميس، 5 نوفمبر 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              لوحة إدارة حجوزات جامع الحق والمجلس العام
            </h1>
            <p className="text-xs sm:text-sm text-[#DCE6F2] mt-1.5">
              متابعة التقويم التفاعلي للحجوزات، معرفة أصحاب الحجوزات اليومية، وجداول الحجوزات القادمة والسابقة.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF85] via-[#FFE8B8] to-[#C59B63] text-[#0A1628] font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(212,175,133,0.35)] hover:scale-[1.02] active:scale-95 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#0A1628]" />
              <span>إضافة حجز جديد</span>
            </button>

            <Link
              href="/booking"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#FFF2D2] text-xs font-bold transition"
            >
              <ExternalLink className="w-4 h-4 text-[#FFE8B8]" />
              <span>صفحة الحجز العامة</span>
            </Link>

            <Link
              href="/admin/videos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#FFF2D2] text-xs font-bold transition"
            >
              <span>إدارة الفيديوهات</span>
            </Link>
          </div>
        </div>

        {/* 6 KPI Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-[#8EA3BF] block mb-1">إجمالي الحجوزات</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#FFF2D2] font-mono">{stats.total}</span>
              <CalendarCheck className="w-4 h-4 text-[#D4AF85]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/25 backdrop-blur-xl border border-emerald-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-emerald-300/80 block mb-1">حجوزات قادمة</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-300 font-mono">{stats.upcoming}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/25 backdrop-blur-xl border border-amber-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-amber-300/80 block mb-1">حجوزات اليوم</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-300 font-mono">{stats.todayCount}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-[#8EA3BF] block mb-1">حجوزات سابقة ومنتهية</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#DCE6F2] font-mono">{stats.past}</span>
              <Clock className="w-4 h-4 text-[#8EA3BF]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#C59B63]/15 backdrop-blur-xl border border-[#D4AF85]/30 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-[#FFE8B8] block mb-1">عقد قران</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-[#FFE8B8] font-mono">{stats.katbCount}</span>
              <HeartHandshake className="w-4 h-4 text-[#FFE8B8]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-950/25 backdrop-blur-xl border border-sky-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] font-semibold text-sky-300/80 block mb-1">مجالس عزاء</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-300 font-mono">{stats.azaCount}</span>
              <Ribbon className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        </div>

        {/* Calendar and Selected Day Bookings Details (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Widget (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-sans flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#FFE8B8]" />
                  <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent">
                    تقويم الحجوزات الشهري
                  </span>
                </h2>
                <p className="text-xs text-[#DCE6F2] mt-0.5">
                  انقر على أي يوم لاستعراض قائمة وبيانات الحجوزات المسجلة فيه مباشرة
                </p>
              </div>

              {/* Month Switcher */}
              <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-xl px-2 py-1 shadow-inner self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentMonthIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 text-[#FFE8B8] transition cursor-pointer"
                  title="الشهر السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#FFF2D2] px-2 min-w-[95px] text-center">
                  {currentMonth.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonthIndex((prev) => Math.min(MONTHS_DATA.length - 1, prev + 1))
                  }
                  disabled={currentMonthIndex === MONTHS_DATA.length - 1}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 text-[#D4AF85] transition cursor-pointer"
                  title="الشهر التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-3.5 mb-4 text-[11px] text-[#DCE6F2] font-semibold bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#D4AF85] to-[#FFE8B8] shadow-[0_0_6px_rgba(212,175,133,0.8)]" />
                <span>عقد قران</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                <span>عزاء</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>متعدد / مكتمل</span>
              </span>
              <span className="mr-auto text-[10px] text-[#FFE8B8]">
                * الأرقام الملونة داخل الأيام توضح عدد الحجوزات
              </span>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#FFE8B8] mb-2 py-2 bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-xl shadow-inner">
              <span>الأحد</span>
              <span>الإثنين</span>
              <span>الثلاثاء</span>
              <span>الأربعاء</span>
              <span>الخميس</span>
              <span>الجمعة</span>
              <span>السبت</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: currentMonth.startDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-14 sm:h-16" />
              ))}

              {Array.from({ length: currentMonth.daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = bookingsByDay.get(day) || [];
                const hasBookings = dayBookings.length > 0;
                const isSelected = selectedDay === day;
                const dateIso = `2026-${String(currentMonth.monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dateIso === TODAY_STR;

                // Types on this day
                const hasKatb = dayBookings.some((b) => b.bookingType === "katbketab");
                const hasAza = dayBookings.some((b) => b.bookingType === "3aza");

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`relative group rounded-xl p-1 sm:p-1.5 transition-all duration-200 cursor-pointer flex flex-col justify-between items-center text-center h-14 sm:h-16 select-none ${
                      isSelected
                        ? "bg-gradient-to-br from-[#D4AF85]/40 via-white/20 to-[#122849]/80 border-2 border-[#FFF0C8] shadow-[0_0_20px_rgba(212,175,133,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] scale-105 z-10"
                        : hasBookings
                        ? "bg-white/[0.1] hover:bg-white/[0.18] border border-white/25 hover:border-white/50"
                        : "bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/70"
                    }`}
                  >
                    {/* Top Row: Day Number and isToday marker */}
                    <div className="w-full flex items-center justify-between px-1">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono ${
                          isSelected
                            ? "text-[#FFF9E6]"
                            : hasBookings
                            ? "text-[#FFE8B8]"
                            : "text-white/80"
                        }`}
                      >
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-[#0A1628] font-black">
                          اليوم
                        </span>
                      )}
                    </div>

                    {/* Booking indicator pills or dots */}
                    {hasBookings ? (
                      <div className="w-full flex items-center justify-center gap-1 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border shadow-sm ${
                            hasKatb && hasAza
                              ? "bg-purple-500/30 text-purple-200 border-purple-400/50"
                              : hasKatb
                              ? "bg-[#D4AF85]/30 text-[#FFE8B8] border-[#FFE8B8]/40"
                              : "bg-sky-500/30 text-sky-200 border-sky-400/50"
                          }`}
                        >
                          {dayBookings.length} حجز
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/30 font-medium">متاح</span>
                    )}

                    {/* Micro dot indicators */}
                    <div className="flex items-center gap-1 mt-auto">
                      {hasKatb && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFE8B8]" />
                      )}
                      {hasAza && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Bookings Drawer / Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative overflow-hidden flex flex-col min-h-[460px]">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            {/* Selected Day Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
              <div>
                <span className="text-[11px] font-semibold text-[#8EA3BF] block">تفاصيل اليوم المختار</span>
                <h3 className="text-lg sm:text-xl font-black text-[#FFF2D2] flex items-center gap-2">
                  <span>اليوم {selectedDay} من {currentMonth.name}</span>
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/[0.08] border border-white/20 text-[#FFE8B8] shadow-inner">
                {selectedDayBookings.length} {selectedDayBookings.length === 1 ? "حجز" : "حجوزات"}
              </span>
            </div>

            {/* Bookings on this day */}
            {selectedDayBookings.length > 0 ? (
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[480px] pr-1">
                {selectedDayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/15 hover:border-[#D4AF85]/50 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.25)] relative group"
                  >
                    {/* Header Row: Occasion Type & Code */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1.5 ${
                          b.bookingType === "katbketab"
                            ? "bg-[#D4AF85]/20 text-[#FFE8B8] border-[#D4AF85]/40"
                            : "bg-sky-500/20 text-sky-200 border-sky-500/40"
                        }`}
                      >
                        {b.bookingType === "katbketab" ? (
                          <>
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>عقد قران</span>
                          </>
                        ) : (
                          <>
                            <Ribbon className="w-3.5 h-3.5" />
                            <span>عزاء</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs font-mono font-bold text-white/70 bg-black/30 px-2 py-0.5 rounded">
                        {b.code}
                      </span>
                    </div>

                    {/* Applicant Name */}
                    <div className="mb-2">
                      <h4 className="text-base font-black text-[#FFF2D2] group-hover:text-[#FFE8B8] transition">
                        {b.fullName}
                      </h4>
                      {b.notes && (
                        <p className="text-xs text-[#DCE6F2] mt-0.5 line-clamp-2">
                          {b.notes}
                        </p>
                      )}
                    </div>

                    {/* Time & Duration */}
                    <div className="flex items-center gap-2 text-xs text-[#FFE8B8] mb-2.5 bg-black/20 p-2 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF85] shrink-0" />
                      <span>{b.timeFormatted} ({b.hoursCountText})</span>
                    </div>

                    {/* Contact details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#DCE6F2] mb-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#D4AF85]" />
                        <span dir="ltr">{b.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#D4AF85]" />
                        <span dir="ltr">رقم: {b.nationalId}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                      <div>{getStatusBadge(b.status)}</div>

                      <div className="flex items-center gap-2">
                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `السلام عليكم ورحمة الله، بخصوص حجزكم في مجلس جامع الحق رقم: ${b.code}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/40 transition"
                          title="مراسلة عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* View Full Modal */}
                        <button
                          onClick={() => setSelectedBookingModal(b)}
                          className="px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.18] text-xs font-bold text-[#FFF2D2] border border-white/20 transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF85]" />
                          <span>التفاصيل</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-2xl border border-dashed border-white/15">
                <CalendarIcon className="w-12 h-12 text-[#8EA3BF]/40 mb-3" />
                <h4 className="text-base font-bold text-[#DCE6F2] mb-1">
                  لا توجد حجوزات مسجلة في هذا اليوم
                </h4>
                <p className="text-xs text-[#8EA3BF] max-w-xs mb-4">
                  اليوم {selectedDay} من {currentMonth.name} متاح بالكامل لاستقبال أي حجز جديد.
                </p>
                <button
                  onClick={() => {
                    setNewForm((prev) => ({
                      ...prev,
                      date: `2026-${String(currentMonth.monthNum).padStart(2, "0")}-${String(
                        selectedDay
                      ).padStart(2, "0")}`,
                    }));
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-[#FFF2D2] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#FFE8B8]" />
                  <span>إضافة حجز لهذا اليوم</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE BOOKINGS DASHBOARD TABLE (Upcoming & Past Tabs) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/35 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative overflow-hidden space-y-6">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/15">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-sans flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-[#D4AF85]" />
                <span className="bg-[linear-gradient(to_left,#D4AF85_0%,#FFF2D2_50%,#B88E58_100%)] bg-clip-text text-transparent">
                  سجل وكشوفات الحجوزات الكاملة
                </span>
              </h2>
              <p className="text-xs text-[#DCE6F2] mt-0.5">
                جدول مفصل بجميع الحجوزات القادمة والحجوزات التي انقضى موعدها مع إمكانية البحث والفرز الفوري
              </p>
            </div>

            {/* Upcoming vs Past Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/15 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("UPCOMING")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "UPCOMING"
                    ? "bg-gradient-to-r from-[#D4AF85]/35 via-white/20 to-[#122849]/70 text-[#FFF9E6] border border-[#FFF0C8] shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>الحجوزات القادمة</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  {upcomingBookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("PAST")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "PAST"
                    ? "bg-gradient-to-r from-[#D4AF85]/35 via-white/20 to-[#122849]/70 text-[#FFF9E6] border border-[#FFF0C8] shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#8EA3BF]" />
                <span>الحجوزات السابقة والمنتهية</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-white/10 text-white/80 font-mono">
                  {pastBookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "ALL"
                    ? "bg-gradient-to-r from-[#D4AF85]/35 via-white/20 to-[#122849]/70 text-[#FFF9E6] border border-[#FFF0C8] shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span>كافة السجلات</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#D4AF85]/20 text-[#FFE8B8] font-mono">
                  {bookings.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input (5 Cols) */}
            <div className="lg:col-span-6 relative">
              <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، رقم الهاتف، الرقم المدني، أو كود الحجز..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] focus:bg-white/[0.14] border border-white/20 focus:border-[#FFE8B8] text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Type (3 Cols) */}
            <div className="lg:col-span-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#091526] border border-white/20 text-xs sm:text-sm text-[#DCE6F2] focus:border-[#FFE8B8] focus:outline-none cursor-pointer"
              >
                <option value="ALL">جميع أنواع المناسبات</option>
                <option value="katbketab">عقد قران فقط</option>
                <option value="3aza">مجالس عزاء فقط</option>
              </select>
            </div>

            {/* Filter by Status (3 Cols) */}
            <div className="lg:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#091526] border border-white/20 text-xs sm:text-sm text-[#DCE6F2] focus:border-[#FFE8B8] focus:outline-none cursor-pointer"
              >
                <option value="ALL">جميع الحالات</option>
                <option value="CONFIRMED">مؤكد</option>
                <option value="PENDING">قيد المراجعة</option>
                <option value="COMPLETED">منتهي ومكتمل</option>
                <option value="CANCELLED">ملغى</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-slate-950/40">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-white/[0.08] text-[#FFE8B8] border-b border-white/15 font-black">
                  <th className="p-3.5 whitespace-nowrap">رقم الحجز</th>
                  <th className="p-3.5 whitespace-nowrap">اسم صاحب الحجز</th>
                  <th className="p-3.5 whitespace-nowrap">نوع المناسبة</th>
                  <th className="p-3.5 whitespace-nowrap">تاريخ الحجز</th>
                  <th className="p-3.5 whitespace-nowrap">التوقيت والمدة</th>
                  <th className="p-3.5 whitespace-nowrap">رقم الهاتف</th>
                  <th className="p-3.5 whitespace-nowrap">الرقم المدني</th>
                  <th className="p-3.5 whitespace-nowrap">تفاصيل / الملاحظات</th>
                  <th className="p-3.5 whitespace-nowrap text-center">الحالة</th>
                  <th className="p-3.5 whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#FAF7F0]">
                {filteredTableBookings.length > 0 ? (
                  filteredTableBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-white/[0.05] transition-colors group"
                    >
                      {/* Code */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#FFE8B8] bg-black/40 px-2 py-1 rounded border border-white/10">
                          {b.code}
                        </span>
                      </td>

                      {/* Full Name & Email */}
                      <td className="p-3.5">
                        <div className="font-bold text-[#FFF2D2] text-sm">
                          {b.fullName}
                        </div>
                        <div className="text-[11px] text-[#8EA3BF] font-mono mt-0.5">
                          {b.email}
                        </div>
                      </td>

                      {/* Booking Type */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            b.bookingType === "katbketab"
                              ? "bg-[#D4AF85]/20 text-[#FFE8B8] border-[#D4AF85]/40"
                              : "bg-sky-500/20 text-sky-200 border-sky-500/40"
                          }`}
                        >
                          {b.bookingType === "katbketab" ? (
                            <>
                              <HeartHandshake className="w-3.5 h-3.5" />
                              <span>عقد قران</span>
                            </>
                          ) : (
                            <>
                              <Ribbon className="w-3.5 h-3.5" />
                              <span>عزاء</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-bold text-[#FFF2D2] font-mono">
                          {b.date}
                        </div>
                        <div className="text-[11px] text-[#DCE6F2]">
                          اليوم {b.day} ({b.monthName})
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-medium text-xs text-[#DCE6F2]">
                          {b.timeFormatted}
                        </div>
                        <div className="text-[11px] text-[#FFE8B8]">
                          {b.hoursCountText}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span dir="ltr" className="font-mono text-xs text-[#FFF2D2]">
                            {b.phone}
                          </span>
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `السلام عليكم ورحمة الله، بخصوص حجزكم في مجلس جامع الحق رقم: ${b.code}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition"
                            title="واتساب مباشر"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* National ID */}
                      <td className="p-3.5 whitespace-nowrap font-mono text-xs text-[#DCE6F2]">
                        {b.nationalId}
                      </td>

                      {/* Notes / Details */}
                      <td className="p-3.5 max-w-[220px]">
                        <p className="text-xs text-[#DCE6F2] truncate" title={b.notes || "لا توجد ملاحظات"}>
                          {b.notes || <span className="text-white/30">—</span>}
                        </p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5 whitespace-nowrap text-center">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0A1628] border border-white/20 text-[#FFF2D2] focus:outline-none cursor-pointer"
                        >
                          <option value="CONFIRMED">مؤكد</option>
                          <option value="PENDING">قيد المراجعة</option>
                          <option value="COMPLETED">منتهي ومكتمل</option>
                          <option value="CANCELLED">ملغى</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.2] text-[#FFE8B8] transition"
                            title="عرض تفاصيل الحجز كاملة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                            title="حذف الحجز"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-[#8EA3BF]">
                      <AlertCircle className="w-8 h-8 text-[#8EA3BF]/40 mx-auto mb-2" />
                      <p className="font-bold text-sm text-[#DCE6F2]">لا توجد حجوزات مطابقة لمعايير البحث والفرز</p>
                      <p className="text-xs text-[#8EA3BF] mt-1">جرّب تغيير كلمات البحث أو إعادة ضبط الفلاتر أعلاه</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: Full Booking Receipt & Details Modal */}
      {/* ========================================================================= */}
      {selectedBookingModal && (
        <div
          onClick={() => setSelectedBookingModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#081222] border border-white/20 rounded-[28px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE8B8] to-transparent" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF85]/20 border border-[#D4AF85]/40 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#FFE8B8]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#FFF2D2]">
                    تفاصيل وسند حجز القاعة
                  </h3>
                  <span className="text-xs font-mono text-[#8EA3BF]">
                    كود الحجز: {selectedBookingModal.code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Type and Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[#8EA3BF]">نوع المناسبة:</span>
                <span className="font-bold text-[#FFF2D2]">
                  {selectedBookingModal.bookingType === "katbketab" ? "عقد قران مبارك" : "مجلس عزاء"}
                </span>
                <span className="text-[#8EA3BF]">الحالة:</span>
                <div>{getStatusBadge(selectedBookingModal.status)}</div>
              </div>

              {/* Applicant Info */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">صاحب الحجز:</span>
                  <span className="font-bold text-[#FFF2D2]">{selectedBookingModal.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">الرقم المدني / الهوية:</span>
                  <span className="font-mono font-bold text-[#FFE8B8]">{selectedBookingModal.nationalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">رقم الهاتف:</span>
                  <span dir="ltr" className="font-mono font-bold text-[#FFF2D2]">{selectedBookingModal.phone}</span>
                </div>
                {selectedBookingModal.secondaryPhone && (
                  <div className="flex justify-between">
                    <span className="text-[#8EA3BF]">هاتف إضافي:</span>
                    <span dir="ltr" className="font-mono text-[#DCE6F2]">{selectedBookingModal.secondaryPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">البريد الإلكتروني:</span>
                  <span className="font-mono text-[#DCE6F2]">{selectedBookingModal.email}</span>
                </div>
              </div>

              {/* Event Timing & Hall */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">تاريخ المناسبة:</span>
                  <span className="font-bold text-[#FFE8B8]">
                    {selectedBookingModal.date} ({selectedBookingModal.monthName})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">الفترة والساعات:</span>
                  <span className="font-bold text-[#FFF2D2]">
                    {selectedBookingModal.timeFormatted} ({selectedBookingModal.hoursCountText})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8EA3BF]">القاعة المحجوزة:</span>
                  <span className="font-bold text-[#FFF2D2]">{selectedBookingModal.hallName}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedBookingModal.notes && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[#8EA3BF] block mb-1">الملاحظات وتفاصيل المناسبة:</span>
                  <p className="text-[#FFF2D2] leading-relaxed">{selectedBookingModal.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/15">
              <a
                href={`https://wa.me/${selectedBookingModal.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `السلام عليكم ورحمة الله، بخصوص حجزكم في مجلس جامع الحق رقم: ${selectedBookingModal.code}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة واتساب</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-[#FFF2D2] border border-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#D4AF85]" />
                  <span>طباعة السند</span>
                </button>
                <button
                  onClick={() => setSelectedBookingModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF85] to-[#FFE8B8] text-[#0A1628] text-xs font-black transition cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Add New Booking Manually (Admin Action) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#081222] border border-white/20 rounded-[28px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative my-8"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE8B8] to-transparent" />

            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF85]/20 border border-[#D4AF85]/40 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-[#FFE8B8]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#FFF2D2]">
                    تسجيل حجز جديد في النظام
                  </h3>
                  <p className="text-xs text-[#8EA3BF]">
                    إضافة حجز يدوي مباشر لقاعة مجلس جامع الحق
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs sm:text-sm">
              {/* Occasion Type */}
              <div>
                <label className="block text-xs font-semibold text-[#DCE6F2] mb-1.5">
                  نوع المناسبة *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewForm({ ...newForm, bookingType: "katbketab" })}
                    className={`py-2.5 px-4 rounded-xl font-bold border transition ${
                      newForm.bookingType === "katbketab"
                        ? "bg-[#D4AF85]/30 border-[#FFE8B8] text-[#FFF9E6]"
                        : "bg-white/[0.04] border-white/15 text-white/70"
                    }`}
                  >
                    عقد قران
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewForm({ ...newForm, bookingType: "3aza" })}
                    className={`py-2.5 px-4 rounded-xl font-bold border transition ${
                      newForm.bookingType === "3aza"
                        ? "bg-sky-500/30 border-sky-400 text-sky-200"
                        : "bg-white/[0.04] border-white/15 text-white/70"
                    }`}
                  >
                    عزاء
                  </button>
                </div>
              </div>

              {/* Applicant Name & National ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    اسم صاحب الحجز *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.fullName}
                    onChange={(e) => setNewForm({ ...newForm, fullName: e.target.value })}
                    placeholder="الاسم الثلاثي أو الرباعي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    الرقم المدني / الهوية *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.nationalId}
                    onChange={(e) => setNewForm({ ...newForm, nationalId: e.target.value })}
                    placeholder="الرقم المدني"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs text-right focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    رقم الهاتف للتواصل *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="968XXXXXXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs text-right focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs text-right focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Date & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    تاريخ المناسبة *
                  </label>
                  <input
                    type="date"
                    required
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#091526] border border-white/20 text-white text-xs focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    من الساعة
                  </label>
                  <input
                    type="text"
                    value={newForm.startHour}
                    onChange={(e) => setNewForm({ ...newForm, startHour: e.target.value })}
                    placeholder="18:00"
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs text-center focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                    حتى الساعة
                  </label>
                  <input
                    type="text"
                    value={newForm.endHour}
                    onChange={(e) => setNewForm({ ...newForm, endHour: e.target.value })}
                    placeholder="22:00"
                    dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs text-center focus:border-[#FFE8B8] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#DCE6F2] mb-1">
                  الملاحظات وأسماء العروسين أو المتوفى
                </label>
                <textarea
                  rows={3}
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  placeholder="أدخل أي ملاحظات خاصة بالحجز..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-xs focus:border-[#FFE8B8] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-white text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF85] to-[#FFE8B8] text-[#0A1628] text-xs font-black transition cursor-pointer shadow-lg"
                >
                  تأكيد وحفظ الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
