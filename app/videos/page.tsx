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
    src: "/laptopview.mp4",
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
      src: "/laptopview.mp4",
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
      src: "/mobileview.mp4",
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
      src: "/laptopview.mp4",
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
      src: "/mobileview.mp4",
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
      src: "/laptopview.mp4",
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
      src: "/mobileview.mp4",
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
    <div className="min-h-screen bg-[#070c09] text-white flex flex-col font-sans text-right selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-10 lg:py-14 bg-gradient-to-b from-[#0d1612] via-[#090f0c] to-[#070c09] border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
            <Film className="w-4 h-4 text-amber-400" />
            <span>مكتبة المرئيات والتوثيق المرئي لجامع الحق</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-aref text-white tracking-tight mb-3 drop-shadow-md">
            الفيديوهات والمرئيات المتاحة
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            استعرض المقاطع المرئية التوثيقية لجامع الحق، وجولات قاعات دار المناسبات المجهزة لعقد القران (كتب الكتاب) ومجالس العزاء، والتلاوات المباركة.
          </p>

          {/* Search & Categories Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الفيديوهات..."
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-black/60 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
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
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
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
        <section className="bg-[#0d1612] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl mb-12">
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
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {activeVideo.categoryName}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {activeVideo.duration}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  {activeVideo.views} مشاهدة
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-aref text-white leading-tight">
                {activeVideo.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>حجز مناسبة (عزاء / كتب كتاب)</span>
              </button>

              <button
                onClick={handleReplay}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة تشغيل المقطع</span>
              </button>
            </div>
          </div>
        </section>

        {/* Video Catalog Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-aref text-white flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-amber-400" />
              <span>قائمة الفيديوهات المعروضة ({filteredVideos.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
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
                  className={`group cursor-pointer bg-[#0d1612] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? "border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]"
                      : "border-white/10 hover:border-amber-400/50 hover:bg-white/5"
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
                      <div className="w-12 h-12 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                      {video.duration}
                    </span>

                    {/* Category pill */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-semibold border border-amber-400/30">
                      {video.categoryName}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {video.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{video.date}</span>
                      <span className="text-amber-400 font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
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
        <section className="mt-16 bg-gradient-to-r from-amber-600/20 via-[#0e1713] to-amber-600/10 border border-amber-400/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 inline-block">
              دار المناسبات الإسلامية
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-aref text-white">
              هل ترغب في حجز قاعة العزاء أو عقد القران (كتب الكتاب)؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              يمكنك الاطلاع على مواعيد التقويم المتاحة واختيار القاعة والخدمات المرافقة فورياً من خلال نظام الحجز الإلكتروني.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/booking"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs text-center shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              الانتقال لصفحة الحجز والتقويم
            </Link>
            <button
              onClick={() => {
                setBookingType("katbketab");
                setCalendarModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center transition"
            >
              حجز سريع الآن
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060a08] py-8 text-center text-xs text-slate-400">
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
