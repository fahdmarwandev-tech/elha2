"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import YouTubePlayer, { extractYouTubeId, getYouTubeThumbnail } from "@/components/YouTubePlayer";
import {
  Link as LinkIcon,
  Play,
  Trash2,
  PlusCircle,
  Eye,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Film,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface VideoData {
  id: number;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  description?: string;
  category: string;
  categoryName: string;
  duration?: string;
  viewsCount?: string;
  customPoster?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

const CATEGORY_OPTIONS = [
  { id: "lessons", name: "دروس ومواعظ" },
  { id: "khutbah", name: "خطب الجمعة" },
  { id: "recitations", name: "تلاوات خاشعة" },
  { id: "tours", name: "جولات ومناسبات" },
  { id: "interviews", name: "حوارات وبرامج" },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form inputs
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("lessons");
  const [duration, setDuration] = useState("");
  const [viewsCount, setViewsCount] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Live preview video ID
  const detectedId = extractYouTubeId(youtubeUrl);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      } else {
        console.error("Failed to load videos from backend");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!detectedId) {
      setStatusMessage({
        type: "error",
        text: "يرجى إدخال رابط يوتيوب صحيح (مثال: https://youtu.be/...)",
      });
      return;
    }

    try {
      setSubmitting(true);
      const categoryObj = CATEGORY_OPTIONS.find((c) => c.id === category);

      const payload = {
        youtubeUrl: youtubeUrl.trim(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        category,
        categoryName: categoryObj ? categoryObj.name : "دروس ومواعظ",
        duration: duration.trim() || undefined,
        viewsCount: viewsCount.trim() || undefined,
        isFeatured,
      };

      const res = await fetch("http://localhost:8080/api/v1/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: "تم إضافة الفيديو بنجاح وتخزينه في قاعدة البيانات!",
        });
        // Reset form
        setYoutubeUrl("");
        setTitle("");
        setDescription("");
        setDuration("");
        setViewsCount("");
        setIsFeatured(false);
        // Refresh list
        fetchVideos();
      } else {
        const errData = await res.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          text: errData.error || "فشل حفظ الفيديو في قاعدة البيانات.",
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "تعذر الاتصال بالخادم. تأكد من تشغيل الـ Backend.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الفيديو من قاعدة البيانات؟")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/videos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        setStatusMessage({
          type: "success",
          text: "تم حذف الفيديو بنجاح.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "فشل حذف الفيديو من قاعدة البيانات.",
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "تعذر الاتصال بالخادم لحذف الفيديو.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-[#FAF7F0] flex flex-col font-cairo dir-rtl" dir="rtl">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E3A63]/80 pb-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63] inline-block mb-2">
              لوحة تحكم الإدارة (Admin Dashboard)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent">
              إدارة مرئيات وفيديوهات اليوتيوب
            </h1>
            <p className="text-xs sm:text-sm text-[#8A9BB3] mt-1">
              أضف رابط فيديو اليوتيوب ليتم تخزينه في قاعدة البيانات وعرضه فورياً لزوار الموقع.
            </p>
          </div>

          <Link
            href="/videos"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1A2D] hover:bg-[#122849] border border-[#D4AF85]/50 text-[#FFF2D2] text-xs font-bold transition shadow-md"
          >
            <ExternalLink className="w-4 h-4 text-[#D4AF85]" />
            معاينة صفحة الزوار العامة
          </Link>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold transition ${
              statusMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/40 border-red-500/50 text-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Add Video Form & Live Preview */}
        <section className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-bold font-aref text-[#FAF7F0] flex items-center gap-2 mb-6">
            <PlusCircle className="w-5 h-5 text-[#D4AF85]" />
            إضافة فيديو جديد عبر الرابط
          </h2>

          <form onSubmit={handleAddVideo} className="space-y-6">
            {/* Main YouTube URL Input */}
            <div>
              <label className="block text-xs font-bold text-[#D4AF85] mb-2">
                رابط فيديو اليوتيوب (مطلوب) *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-[#D4AF85] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/dkeu6gi3mAc أو https://www.youtube.com/watch?v=..."
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#050A14] border border-[#1E3A63] text-sm text-[#FAF7F0] placeholder:text-[#8A9BB3]/50 focus:outline-none focus:border-[#D4AF85] transition"
                />
              </div>
              <p className="text-[11px] text-[#8A9BB3] mt-1.5">
                يمكنك نسخ الرابط مباشرة من تطبيق يوتيوب أو المتصفح ولصقه هنا.
              </p>
            </div>

            {/* Instant Live Preview Container */}
            {detectedId ? (
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#D4AF85]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#D4AF85]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF85]" />
                    معاينة حية للمشغل في الموقع
                  </span>
                  <span className="font-mono text-[11px] text-[#8A9BB3]">
                    YouTube ID: {detectedId}
                  </span>
                </div>
                <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg border border-[#1E3A63]">
                  <YouTubePlayer
                    url={youtubeUrl}
                    title={title || "معاينة الفيديو"}
                    duration={duration}
                  />
                </div>
              </div>
            ) : null}

            {/* Optional Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                  عنوان الفيديو (اختياري - يجلب تلقائياً إن تُرِك فارغاً)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خطبة الجمعة أو اسم البرنامج"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#D4AF85] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                  التصنيف
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] focus:outline-none focus:border-[#D4AF85] transition"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#050A14]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                  مدة الفيديو (اختياري)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="مثال: 45:02 أو 15:30"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#D4AF85] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                  عدد المشاهدات (اختياري)
                </label>
                <input
                  type="text"
                  value={viewsCount}
                  onChange={(e) => setViewsCount(e.target.value)}
                  placeholder="مثال: 2,027,645"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#D4AF85] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                الوصف (اختياري)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة مختصرة عن محتوى الفيديو..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#050A14] border border-[#1E3A63] text-xs text-[#FAF7F0] placeholder:text-[#8A9BB3]/40 focus:outline-none focus:border-[#D4AF85] transition resize-none"
              />
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4AF85] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-[#FFF2D2]">
                تعيين كفيديو مميز رئيسي في أعلى صفحة المرئيات
              </span>
            </label>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !detectedId}
                className="px-8 py-3 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] hover:border-[#FFF0C8] text-[#FFF2D2] text-xs sm:text-sm font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? "جاري الحفظ في قاعدة البيانات..." : "حفظ ونشر الفيديو في الموقع"}
              </button>
            </div>
          </form>
        </section>

        {/* Existing Database Videos List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-aref text-[#FAF7F0] flex items-center gap-2">
              <Film className="w-5 h-5 text-[#D4AF85]" />
              الفيديوهات المخزنة حالياً في قاعدة البيانات ({videos.length})
            </h3>
            <button
              onClick={fetchVideos}
              className="text-xs text-[#D4AF85] hover:underline"
            >
              إعادة تحميل القائمة ↻
            </button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-xs text-[#8A9BB3]">
              جاري تحميل الفيديوهات من قاعدة البيانات...
            </div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A9BB3] bg-[#0A1628] rounded-2xl border border-[#1E3A63]">
              لا توجد فيديوهات مخزنة حالياً في قاعدة البيانات. استخدم النموذج أعلاه لإضافة أول فيديو!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-[#1E3A63]">
                      <img
                        src={getYouTubeThumbnail(v.youtubeId, "hq")}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                      {v.duration && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#FAF7F0]">
                          {v.duration}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#0A1628] text-[#D4AF85] border border-[#1E3A63] font-bold">
                          {v.categoryName || v.category}
                        </span>
                        {v.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                            مميز
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#FAF7F0] truncate" title={v.title}>
                        {v.title}
                      </h4>
                      <p className="text-[10px] text-[#8A9BB3] font-mono truncate">
                        ID: {v.youtubeId}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition shrink-0"
                    title="حذف من قاعدة البيانات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
