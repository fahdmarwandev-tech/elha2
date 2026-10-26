"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import YouTubePlayer, { extractYouTubeId, getYouTubeThumbnail } from "@/components/YouTubePlayer";
import {
  Video as VideoIcon,
  Film,
  Calendar,
  Search,
  Sparkles,
  Clock,
  Eye,
  Play,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import QuickBookingModal from "@/components/QuickBookingModal";

export interface VideoItem {
  id: string;
  title: string;
  desc: string;
  category: "khutbah" | "lessons" | "recitations" | "tours";
  categoryName: string;
  youtubeUrl: string; // The YouTube video link (from admin or hardcoded)
  poster?: string;    // Optional custom image; if omitted, automatically uses YouTube's HQ frame
  duration: string;
  date: string;
  views: string;
  isFeatured?: boolean;
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"3aza" | "katbketab">("katbketab");

  // Custom link preview input state (so user can test ANY YouTube link right away)
  const [customLinkInput, setCustomLinkInput] = useState("");
  const [customLinkError, setCustomLinkError] = useState<string | null>(null);

  // Hardcoded initial list of YouTube videos (will later come from backend/admin dashboard)
  const [videoList, setVideoList] = useState<VideoItem[]>([
    {
      id: "dkeu6gi3mAc",
      title: "السبت الممتاز | نجم الجيل | مع ويجز | THE GOATS",
      desc: "لقاء ممتع وحصري من برنامج السبت الممتاز مع النجم تامر حسني وويجز، متاح للمشاهدة مباشرة عبر المشغل المدمج في الموقع بجودة عالية.",
      category: "lessons",
      categoryName: "حوارات وبرامج",
      youtubeUrl: "https://youtu.be/dkeu6gi3mAc?si=yUSf8JfNVktQWeYD",
      duration: "45:02",
      date: "أكتوبر 2026",
      views: "2,027,645",
      isFeatured: true,
    },
  ]);

  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoList[0]);
  const [autoPlayActive, setAutoPlayActive] = useState(false);

  const categories = [
    { id: "all", label: "جميع المرئيات" },
    { id: "khutbah", label: "خطب الجمعة" },
    { id: "lessons", label: "دروس دينية ومحاضرات" },
    { id: "recitations", label: "تلاوات خاشعة" },
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
    setAutoPlayActive(true);
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  // Allows pasting ANY YouTube link to instantly preview it in the player
  const handleLoadCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomLinkError(null);

    const videoId = extractYouTubeId(customLinkInput);
    if (!videoId) {
      setCustomLinkError("يرجى إدخال رابط يوتيوب صحيح (مثال: https://www.youtube.com/watch?v=...)");
      return;
    }

    const newVideo: VideoItem = {
      id: `custom-${Date.now()}`,
      title: "فيديو مخصص تجريبي من الرابط المدخل",
      desc: "تم تحميل هذا الفيديو مباشرة من الرابط الذي أدخلته، دون تنزيل ملفات، باستخدام مشغل يوتيوب الرسمي المدمج.",
      category: "lessons",
      categoryName: "فيديو مضاف",
      youtubeUrl: customLinkInput.trim(),
      duration: "--:--",
      date: "الآن",
      views: "جديد",
    };

    setVideoList((prev) => [newVideo, ...prev]);
    setActiveVideo(newVideo);
    setAutoPlayActive(true);
    setCustomLinkInput("");
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-[#FAF7F0] flex flex-col font-sans text-right selection:bg-[#D4AF85] selection:text-[#050B14]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-10 lg:py-14 bg-gradient-to-b from-[#0A1628] via-[#070F1E] to-[#050A14] border-b border-[#1E3A63]/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1A2D] border border-[#1E3A63] text-[#D4AF85] text-xs font-bold mb-3 shadow-[0_0_15px_rgba(212,175,133,0.15)]">
            <Film className="w-4 h-4 text-[#D4AF85]" />
            <span>المكتبة المرئية الإسلامية • جامع الحق</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent tracking-tight mb-3 drop-shadow-md">
            المرئيات والدروس الدينية وخطب الجمعة
          </h1>

          <p className="text-[#8A9BB3] text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            استمع وشاهد خطب الجمعة المباركة والدروس الدينية مباشرة عبر مشغل يوتيوب المدمج داخل الموقع.
          </p>

          {/* Quick YouTube Link Tester Bar (Interactive demo of how admin dashboard will work) */}
          <form
            onSubmit={handleLoadCustomLink}
            className="mt-6 max-w-3xl mx-auto bg-[#070F1E]/90 border border-[#D4AF85]/40 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            <div className="relative flex-1 w-full">
              <LinkIcon className="w-4 h-4 text-[#D4AF85] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customLinkInput}
                onChange={(e) => {
                  setCustomLinkInput(e.target.value);
                  setCustomLinkError(null);
                }}
                placeholder="جرّب وضع أي رابط يوتيوب هنا لعرضه في الموقع فوراً..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/60 focus:outline-none focus:border-[#D4AF85] transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] hover:border-[#FFF0C8] text-[#FFF2D2] text-xs font-bold transition shadow-md whitespace-nowrap active:scale-95"
            >
              عرض الفيديو في الموقع
            </button>
          </form>
          {customLinkError && (
            <p className="text-xs text-red-400 mt-2 font-semibold">{customLinkError}</p>
          )}

          {/* Search & Categories Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#D4AF85] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في خطب الجمعة أو الدروس..."
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-[#050C18] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85]/40 transition"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    selectedCategory === cat.id
                      ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-[0_0_15px_rgba(212,175,133,0.3)]"
                      : "bg-[#0D1A2D] text-[#8A9BB3] hover:text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/50 hover:bg-[#122849]/50"
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
        {/* Featured Video Player Box using YouTubePlayer */}
        <section className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-12">
          {/* YouTube Player Frame */}
          <div className="w-full bg-black">
            <YouTubePlayer
              key={activeVideo.id}
              url={activeVideo.youtubeUrl}
              title={activeVideo.title}
              customPoster={activeVideo.poster}
              duration={activeVideo.duration}
              autoPlay={autoPlayActive}
            />
          </div>

          {/* Video Metadata */}
          <div className="p-5 sm:p-7">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63]">
                  {activeVideo.categoryName}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#8A9BB3]">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF85]" />
                  {activeVideo.duration}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#8A9BB3]">
                  <Eye className="w-3.5 h-3.5 text-[#D4AF85]" />
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
          </div>
        </section>

        {/* Video Catalog Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-aref flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-[#D4AF85]" />
              <span className="bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent">
                قائمة المرئيات والدروس المعروضة ({filteredVideos.length})
              </span>
            </h3>
            <span className="text-xs text-[#8A9BB3]">
              اضغط على أي فيديو لتشغيله في المشغل الرئيسي أعلاه
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isCurrent = activeVideo.id === video.id;
              const videoId = extractYouTubeId(video.youtubeUrl);
              const thumbUrl =
                video.poster ||
                (videoId ? getYouTubeThumbnail(videoId, "hq") : "/landing_last_frame.jpg");

              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group cursor-pointer bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? "border-[#D4AF85] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] scale-[1.02]"
                      : "border-[#1E3A63]/80 hover:border-[#D4AF85]/70 hover:shadow-[0_10px_25px_rgba(18,40,73,0.4)]"
                  }`}
                >
                  {/* Thumbnail Frame */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={thumbUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,133,0.4)] group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-[#FFF2D2] text-[#FFF2D2] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#FAF7F0] text-[10px] font-mono font-bold border border-[#1E3A63]/60">
                      {video.duration}
                    </span>

                    {/* Category pill */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#050A14]/85 backdrop-blur-md text-[#D4AF85] text-[10px] font-semibold border border-[#1E3A63]">
                      {video.categoryName}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-sm text-[#FAF7F0] group-hover:text-[#D4AF85] transition-colors line-clamp-2 leading-snug mb-1.5">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#8A9BB3] line-clamp-2 leading-relaxed mb-3">
                        {video.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1E3A63]/60 flex items-center justify-between text-[11px] text-[#8A9BB3]">
                      <span>{video.date}</span>
                      <span className="text-[#D4AF85] font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
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
        <section className="mt-16 bg-gradient-to-r from-[#070F1E] via-[#0D1A2D] to-[#0A1628] border border-[#1E3A63] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
          <div className="space-y-2 text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63] inline-block">
              المجلس العام
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent">
              هل ترغب في حجز قاعة العزاء أو عقد القران؟
            </h3>
            <p className="text-xs sm:text-sm text-[#8A9BB3] max-w-xl leading-relaxed">
              يمكنك الاطلاع على مواعيد التقويم المتاحة واختيار القاعة والخدمات المرافقة فورياً من خلال نظام الحجز الإلكتروني للمجلس.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/booking"
              className="px-6 py-3.5 rounded-full bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85]/80 hover:border-[#D4AF85] text-[#FFF2D2] font-black text-xs text-center shadow-[0_10px_25px_-4px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,133,0.3)] transition active:scale-95"
            >
              الانتقال لصفحة المجلس والتقويم
            </Link>
            <button
              onClick={() => {
                setBookingType("katbketab");
                setCalendarModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-full bg-[#0A1628] hover:bg-[#122849] text-[#FAF7F0] border border-[#1E3A63] hover:border-[#D4AF85]/60 font-bold text-xs text-center transition"
            >
              حجز موعد مباشر
            </button>
          </div>
        </section>
      </main>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialType={bookingType}
      />
    </div>
  );
}
