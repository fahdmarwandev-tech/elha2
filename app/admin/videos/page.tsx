"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  FileVideo,
  Video as VideoIcon,
} from "lucide-react";
import Link from "next/link";

interface VideoData {
  id: number;
  videoSourceType: "YOUTUBE" | "LOCAL";
  youtubeUrl?: string;
  youtubeId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
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
  const [activeTab, setActiveTab] = useState<"YOUTUBE" | "LOCAL">("YOUTUBE");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // YouTube tab form state
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // File Upload tab form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common metadata inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("lessons");
  const [detectedDuration, setDetectedDuration] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Live preview video ID for YouTube
  const detectedYouTubeId = extractYouTubeId(youtubeUrl);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/v1/videos`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
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

  // Handle local file selection, create temporary preview and auto-detect duration
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setLocalPreviewUrl(preview);

      // Auto-detect video duration from file metadata in browser
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.onloadedmetadata = () => {
        const totalSec = Math.floor(tempVideo.duration);
        if (!isNaN(totalSec) && totalSec > 0) {
          const hours = Math.floor(totalSec / 3600);
          const mins = Math.floor((totalSec % 3600) / 60);
          const secs = totalSec % 60;
          const formatted = hours > 0
            ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
            : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
          setDetectedDuration(formatted);
        }
      };
      tempVideo.src = preview;

      // Auto-fill title from filename if title is currently empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.id === category);
    const catName = categoryObj ? categoryObj.name : "دروس ومواعظ";

    if (activeTab === "YOUTUBE") {
      if (!detectedYouTubeId) {
        setStatusMessage({
          type: "error",
          text: "يرجى إدخال رابط يوتيوب صحيح (مثال: https://youtu.be/...)",
        });
        return;
      }

      try {
        setSubmitting(true);
        // Backend automatically detects exact YouTube duration, view count, and title
        const payload = {
          videoSourceType: "YOUTUBE",
          youtubeUrl: youtubeUrl.trim(),
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          category,
          categoryName: catName,
          isFeatured,
        };

        const res = await fetch(`${apiBase}/api/v1/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setStatusMessage({
            type: "success",
            text: "تم إضافة فيديو اليوتيوب بنجاح في قاعدة البيانات!",
          });
          resetForm();
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
    } else {
      // Local File Upload
      if (!selectedFile) {
        setStatusMessage({
          type: "error",
          text: "يرجى اختيار ملف فيديو لرفعه من جهازك.",
        });
        return;
      }

      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (title.trim()) formData.append("title", title.trim());
        if (description.trim()) formData.append("description", description.trim());
        formData.append("category", category);
        formData.append("categoryName", catName);
        if (detectedDuration) formData.append("duration", detectedDuration);
        formData.append("viewsCount", "0");
        formData.append("isFeatured", String(isFeatured));

        const res = await fetch(`${apiBase}/api/v1/videos/upload`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          setStatusMessage({
            type: "success",
            text: "تم رفع وتخزين ملف الفيديو بنجاح في الموقع وقاعدة البيانات!",
          });
          resetForm();
          fetchVideos();
        } else {
          const errData = await res.json().catch(() => ({}));
          setStatusMessage({
            type: "error",
            text: errData.error || "فشل رفع ملف الفيديو إلى السيرفر.",
          });
        }
      } catch (err) {
        setStatusMessage({
          type: "error",
          text: "تعذر الاتصال بالخادم لرفع الفيديو.",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setYoutubeUrl("");
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTitle("");
    setDescription("");
    setDetectedDuration("");
    setIsFeatured(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الفيديو نهائياً؟")) {
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/v1/videos/${id}`, {
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
              إدارة ورفع المرئيات
            </h1>
            <p className="text-xs sm:text-sm text-[#8A9BB3] mt-1">
              اختر بين وضع رابط يوتيوب أو رفع ملف فيديو مباشر من جهازك، وسيتم نشره فورياً في الموقع.
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

        {/* Add Video Container */}
        <section className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Method Selector Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1E3A63]/80 pb-5 mb-6">
            <h2 className="text-lg font-bold font-aref text-[#FAF7F0] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#D4AF85]" />
              إضافة فيديو جديد
            </h2>

            <div className="flex items-center gap-2 bg-[#050A14] p-1.5 rounded-2xl border border-[#1E3A63]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("YOUTUBE");
                  setStatusMessage(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "YOUTUBE"
                    ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-md"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0]"
                }`}
              >
                <Film className="w-4 h-4 text-red-400" />
                <span>رابط يوتيوب (YouTube)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("LOCAL");
                  setStatusMessage(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "LOCAL"
                    ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] text-[#FFF2D2] shadow-md"
                    : "text-[#8A9BB3] hover:text-[#FAF7F0]"
                }`}
              >
                <Upload className="w-4 h-4 text-[#D4AF85]" />
                <span>رفع ملف من الجهاز (MP4 / WebM)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddVideo} className="space-y-6">
            {/* Tab 1: YouTube Link Input */}
            {activeTab === "YOUTUBE" && (
              <div className="space-y-4">
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
                    يدعم أي رابط يوتيوب (عادي، Shorts، أو فيديو غير مدرج Unlisted).
                  </p>
                </div>

                {/* Instant YouTube Live Preview */}
                {detectedYouTubeId && (
                  <div className="p-4 rounded-2xl bg-[#050B14] border border-[#D4AF85]/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#D4AF85]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D4AF85]" />
                        معاينة حية لمشغل اليوتيوب
                      </span>
                      <span className="font-mono text-[11px] text-[#8A9BB3]">
                        YouTube ID: {detectedYouTubeId}
                      </span>
                    </div>
                    <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg border border-[#1E3A63]">
                      <YouTubePlayer
                        url={youtubeUrl}
                        title={title || "معاينة الفيديو"}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Direct File Upload */}
            {activeTab === "LOCAL" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#D4AF85] mb-2">
                    اختر ملف الفيديو من جهازك (MP4 / WebM / MOV) *
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-[#1E3A63] hover:border-[#D4AF85] bg-[#050A14] rounded-2xl p-8 text-center transition group flex flex-col items-center justify-center gap-3"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-14 h-14 rounded-full bg-[#0D1A2D] border border-[#1E3A63] group-hover:border-[#D4AF85] flex items-center justify-center transition">
                      <FileVideo className="w-7 h-7 text-[#D4AF85]" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#FAF7F0] group-hover:text-[#D4AF85] transition">
                        {selectedFile ? selectedFile.name : "انقر هنا لاختيار ملف فيديو من جهازك"}
                      </p>
                      <p className="text-xs text-[#8A9BB3] mt-1">
                        {selectedFile
                          ? `الحجم: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} ميغابايت`
                          : "الصيغ المدعومة: MP4, WebM, MOV, MKV (حتى 500 ميغابايت)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant Local Video Live Preview */}
                {localPreviewUrl && (
                  <div className="p-4 rounded-2xl bg-[#050B14] border border-[#D4AF85]/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#D4AF85]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D4AF85]" />
                        معاينة فورية للفيديو المختار قبل الرفع
                      </span>
                      <span className="text-[11px] text-[#8A9BB3]">
                        جاهز للرفع والتخزين
                      </span>
                    </div>
                    <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg border border-[#1E3A63]">
                      <YouTubePlayer
                        url={localPreviewUrl}
                        sourceType="LOCAL"
                        title={title || selectedFile?.name}
                        duration={detectedDuration || "فيديو مباشر"}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Common Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                  عنوان الفيديو
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: خطبة الجمعة أو اسم الدرس..."
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
            </div>

            {/* Auto Detection Info Pill */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050B14] border border-[#1E3A63] text-xs text-[#8A9BB3]">
              <Sparkles className="w-4 h-4 text-[#D4AF85] shrink-0" />
              <span>
                يتم استخراج <strong>مدة الفيديو</strong> و<strong>عدد المشاهدات</strong> تلقائياً وبدقة فور الإضافة دون الحاجة لإدخالها يدوياً.
                {detectedDuration ? ` (مدة الملف المختار: ${detectedDuration})` : ""}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A9BB3] mb-1.5">
                الوصف (اختياري)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة مختصرة عن محتوى المقطع..."
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
                disabled={submitting || (activeTab === "YOUTUBE" ? !detectedYouTubeId : !selectedFile)}
                className="px-8 py-3 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] border border-[#D4AF85] hover:border-[#FFF0C8] text-[#FFF2D2] text-xs sm:text-sm font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FFF2D2] border-t-transparent rounded-full animate-spin" />
                    {activeTab === "LOCAL" ? "جاري رفع ملف الفيديو إلى السيرفر..." : "جاري الحفظ في قاعدة البيانات..."}
                  </span>
                ) : (
                  <span>{activeTab === "LOCAL" ? "رفع ونشر ملف الفيديو" : "حفظ ونشر رابط اليوتيوب"}</span>
                )}
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
              لا توجد فيديوهات مخزنة حالياً في قاعدة البيانات. استخدم النموذج أعلاه لإضافة فيديو!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => {
                const isLocal = v.videoSourceType === "LOCAL" || Boolean(v.fileUrl);
                const thumb = isLocal
                  ? (v.customPoster || "/landing_last_frame.jpg")
                  : getYouTubeThumbnail(v.youtubeId || "", "hq");

                return (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63] flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-[#1E3A63]">
                        <img
                          src={thumb}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                        {v.duration && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-[#FAF7F0]">
                            {v.duration}
                          </span>
                        )}
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#050A14]/90 text-[#FFF2D2] border border-[#1E3A63]">
                          {isLocal ? "ملف MP4" : "يوتيوب"}
                        </span>
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
                          {isLocal ? `ملف: ${v.fileName || v.fileUrl}` : `ID: ${v.youtubeId}`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition shrink-0"
                      title="حذف نهائياً"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
