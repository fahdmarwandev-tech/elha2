"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  Play,
  Pause,
  Video as VideoIcon,
  Film,
  RotateCcw,
  Maximize2,
  Calendar,
  Search,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Link from "next/link";
import QuickBookingModal from "@/components/QuickBookingModal";

interface VideoItem {
  id: string;
  title: string;
  desc: string;
  category: "tours" | "monasbat" | "khutbah" | "recitations";
  categoryName: string;
  src: string;
  poster: string;
  duration: string;
  date: string;
  views: string;
  isFeatured?: boolean;
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<VideoItem>({
    id: "intro-main",
    title: "المقطع التعريفي الشامل: صرح جامع الحق ودار المناسبات (عرض الشاشة)",
    desc: "جولة سينمائية متكاملة تستعرض المعمار الإسلامي الأصيل لجامع الحق وتجهيزات دار المناسبات الفاخرة المخصصة لمناسبات كتب الكتاب ومجالس العزاء.",
    category: "tours",
    categoryName: "جولات ومعالم المسجد",
    src: "/1014.mp4",
    poster: "/landing_last_frame.jpg",
    duration: "00:30",
    date: "أكتوبر 2026",
    views: "12,450",
    isFeatured: true,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"3aza" | "katbketab">("katbketab");
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  const videoList: VideoItem[] = [
    {
      id: "intro-main",
      title: "المقطع التعريفي الشامل: صرح جامع الحق ودار المناسبات (عرض الشاشة)",
      desc: "جولة سينمائية متكاملة تستعرض المعمار الإسلامي الأصيل لجامع الحق وتجهيزات دار المناسبات الفاخرة المخصصة لمناسبات كتب الكتاب ومجالس العزاء.",
      category: "tours",
      categoryName: "جولات ومعالم المسجد",
      src: "/1014.mp4",
      poster: "/landing_last_frame.jpg",
      duration: "00:30",
      date: "أكتوبر 2026",
      views: "12,450",
      isFeatured: true,
    },
    {
      id: "mobile-tour",
      title: "أروقة المسجد ومحراب الصلاة (عرض الهاتف الرأسي)",
      desc: "لقطات قريبة تأخذك في رحاب الهدوء والسكينة داخل قاعة الصلاة الرئيسية والمحراب النوراني لجامع الحق.",
      category: "tours",
      categoryName: "جولات ومعالم المسجد",
      src: "/1012(1).mp4",
      poster: "/mobile_last_frame.jpg",
      duration: "00:25",
      date: "أكتوبر 2026",
      views: "8,920",
    },
    {
      id: "katb-ketab-hall",
      title: "قاعات دار المناسبات: تجهيزات عقد القران (كتب الكتاب)",
      desc: "استعراض الإمكانات المخصصة لعقد القران والإشهار، مع جلسات مريحة وتجهيزات إضاءة وصوت فندقية راقية.",
      category: "monasbat",
      categoryName: "دار المناسبات",
      src: "/1014.mp4",
      poster: "/golden-hour-mosque-cream-fade.png",
      duration: "00:30",
      date: "أكتوبر 2026",
      views: "9,600",
    },
    {
      id: "aza-halls",
      title: "قاعات العزاء والتعازي: خدمات متكاملة وسكينة للمُعزّين",
      desc: "نظام استقبال وتجهيز كامل لمجالس العزاء الرجالية والنسائية، بما يضمن الوقار والراحة لأهل المتوفى وضيوفهم.",
      category: "monasbat",
      categoryName: "دار المناسبات",
      src: "/1012(1).mp4",
      poster: "/Illuminated Mosque at Dusk.png",
      duration: "00:25",
      date: "سبتمبر 2026",
      views: "6,840",
    },
    {
      id: "courtyard-dusk",
      title: "مشهد الغروب في الصحن الرخامي لمسجد الحق",
      desc: "انعكاس أضواء الغروب الذهبية على مئذنة وقباب المسجد، مع هدوء يبعث على التأمل وذكر الله.",
      category: "tours",
      categoryName: "جولات ومعالم المسجد",
      src: "/1014.mp4",
      poster: "/golden-mosque-courtyard.png",
      duration: "00:30",
      date: "سبتمبر 2026",
      views: "14,100",
    },
    {
      id: "recitation-night",
      title: "تلاوة خاشعة من صلاة التراويح والقيام بالجامع",
      desc: "أصوات عذبة من نخبة أئمة جامع الحق تأسر القلوب في أجواء إيمانية مباركة.",
      category: "recitations",
      categoryName: "تلاوات خاشعة",
      src: "/1012(1).mp4",
      poster: "/masjid_enhanced.png",
      duration: "00:25",
      date: "رمضان المبارك",
      views: "21,300",
    },
  ];

  const categories = [
    { id: "all", label: "جميع الفيديوهات" },
    { id: "tours", label: "جولات ومعالم المسجد" },
    { id: "monasbat", label: "قاعات دار المناسبات (عزاء وكتب كتاب)" },
    { id: "recitations", label: "تلاوات وخطب" },
  ];

  const filteredVideos = videoList.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleSelectVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setIsPlaying(true);
    if (mainVideoRef.current) {
      mainVideoRef.current.src = video.src;
      mainVideoRef.current.poster = video.poster;
      mainVideoRef.current.play().catch(() => {});
    }
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (isPlaying) {
      mainVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      mainVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleReplay = () => {
    if (!mainVideoRef.current) return;
    mainVideoRef.current.currentTime = 0;
    mainVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#C49A6C] selection:text-[#0B1220]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-10 lg:py-14 bg-gradient-to-b from-[#152132] via-[#0B1220] to-[#0B1220] border-b border-[#22334A] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#182436] border border-[#22334A] text-[#C49A6C] text-xs font-bold mb-3 shadow-sm">
            <Film className="w-4 h-4 text-[#C49A6C]" />
            <span>مكتبة المرئيات والتوثيق المرئي لجامع الحق</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-aref text-[#FAF7F0] tracking-tight mb-3 drop-shadow-md">
            الفيديوهات والمرئيات المتاحة
          </h1>

          <p className="text-[#8A9BB3] text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            استعرض المقاطع المرئية التوثيقية لجامع الحق، وجولات قاعات دار المناسبات المجهزة لعقد القران (كتب الكتاب) ومجالس العزاء، والتلاوات المباركة.
          </p>

          {/* Search & Categories Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#C49A6C] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الفيديوهات..."
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-[#0B1220] border border-[#22334A] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#C49A6C] transition"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    selectedCategory === cat.id
                      ? "bg-[#C49A6C] text-[#0B1220] shadow-md shadow-[#C49A6C]/20"
                      : "bg-[#152132] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#22334A] hover:bg-[#182436]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Video Showcase */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Featured Video Player Box */}
        <section className="bg-[#152132] border border-[#22334A] rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="relative aspect-video w-full bg-black group overflow-hidden">
            <video
              ref={mainVideoRef}
              src={activeVideo.src}
              poster={activeVideo.poster}
              controls
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Video Metadata & Controls */}
          <div className="p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#182436] text-[#C49A6C] border border-[#22334A]">
                  {activeVideo.categoryName}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#8A9BB3]">
                  <Clock className="w-3.5 h-3.5 text-[#C49A6C]" />
                  {activeVideo.duration}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#8A9BB3]">
                  <Eye className="w-3.5 h-3.5 text-[#C49A6C]" />
                  {activeVideo.views} مشاهدة
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-aref text-[#FAF7F0] leading-tight">
                {activeVideo.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#FAF7F0]/90 leading-relaxed">
                {activeVideo.desc}
              </p>
            </div>

            {/* Quick Actions alongside player */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <button
                onClick={() => {
                  setBookingType("katbketab");
                  setCalendarModalOpen(true);
                }}
                className="px-6 py-3 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C49A6C]/20 transition active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#0B1220]" />
                <span>حجز مناسبة (عزاء / كتب كتاب)</span>
              </button>

              <button
                onClick={handleReplay}
                className="px-6 py-2.5 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#FAF7F0] border border-[#22334A] font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C49A6C]" />
                <span>إعادة تشغيل المقطع</span>
              </button>
            </div>
          </div>
        </section>

        {/* Video Catalog Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-aref text-[#FAF7F0] flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-[#C49A6C]" />
              <span>قائمة الفيديوهات المعروضة ({filteredVideos.length})</span>
            </h3>
            <span className="text-xs text-[#8A9BB3]">
              اضغط على أي فيديو لتشغيله في المشغل الرئيسي
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isCurrent = activeVideo.id === video.id;

              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group cursor-pointer bg-[#152132] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? "border-[#C49A6C] shadow-xl shadow-[#C49A6C]/10 scale-[1.02]"
                      : "border-[#22334A] hover:border-[#C49A6C]/60 hover:bg-[#182436]"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#C49A6C] text-[#0B1220] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#0B1220] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#FAF7F0] text-[10px] font-mono font-bold">
                      {video.duration}
                    </span>

                    {/* Category pill */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0B1220]/80 backdrop-blur-md text-[#C49A6C] text-[10px] font-semibold border border-[#22334A]">
                      {video.categoryName}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-sm text-[#FAF7F0] group-hover:text-[#C49A6C] transition-colors line-clamp-2 leading-snug mb-1.5">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#8A9BB3] line-clamp-2 leading-relaxed mb-3">
                        {video.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#22334A] flex items-center justify-between text-[11px] text-[#8A9BB3]">
                      <span>{video.date}</span>
                      <span className="text-[#C49A6C] font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                        تشغيل الآن ←
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hall Reservation CTA Banner */}
        <section className="mt-16 bg-gradient-to-r from-[#152132] via-[#182436] to-[#0B1220] border border-[#22334A] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#182436] text-[#C49A6C] border border-[#22334A] inline-block">
              دار المناسبات الإسلامية
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-aref text-[#FAF7F0]">
              هل ترغب في حجز قاعة العزاء أو عقد القران (كتب الكتاب)؟
            </h3>
            <p className="text-xs sm:text-sm text-[#8A9BB3] max-w-xl leading-relaxed">
              يمكنك الاطلاع على مواعيد التقويم المتاحة واختيار القاعة والخدمات المرافقة فورياً من خلال نظام الحجز الإلكتروني.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/booking"
              className="px-6 py-3.5 rounded-full bg-[#C49A6C] hover:bg-[#D4AF85] text-[#0B1220] font-black text-xs text-center shadow-lg shadow-[#C49A6C]/20 transition active:scale-95"
            >
              الانتقال لصفحة الحجز والتقويم
            </Link>
            <button
              onClick={() => {
                setBookingType("katbketab");
                setCalendarModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-full bg-[#182436] hover:bg-[#22334A] text-[#FAF7F0] border border-[#22334A] font-bold text-xs text-center transition"
            >
              حجز سريع الآن
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#22334A] bg-[#080D18] py-8 text-center text-xs text-[#8A9BB3]">
        <p>© جامع الحق ودار المناسبات — مكتبة المرئيات والتوثيق.</p>
      </footer>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={bookingType}
      />
    </div>
  );
}
