"use client";

import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";

/**
 * Extracts YouTube 11-character video ID from any YouTube URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - VIDEO_ID directly
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Resolves high quality YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: "max" | "hq" = "max"): string {
  if (quality === "max") {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

interface YouTubePlayerProps {
  url: string;
  title?: string;
  customPoster?: string;
  duration?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
  autoPlay?: boolean;
}

export default function YouTubePlayer({
  url,
  title = "فيديو جامع الحق",
  customPoster,
  duration,
  className = "",
  aspectRatio = "video",
  autoPlay = false,
}: YouTubePlayerProps) {
  const videoId = extractYouTubeId(url);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [thumbnailSrc, setThumbnailSrc] = useState<string>("");

  useEffect(() => {
    setIsPlaying(autoPlay);
    if (customPoster) {
      setThumbnailSrc(customPoster);
    } else if (videoId) {
      // Default to maxres with automatic fallback to hq
      setThumbnailSrc(getYouTubeThumbnail(videoId, "max"));
    }
  }, [url, customPoster, autoPlay, videoId]);

  const handleThumbnailError = () => {
    // If maxresdefault fails (404 on some videos), fallback to standard hqdefault
    if (videoId && thumbnailSrc.includes("maxresdefault")) {
      setThumbnailSrc(getYouTubeThumbnail(videoId, "hq"));
    }
  };

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[21/9]";

  if (!videoId) {
    return (
      <div
        className={`w-full ${aspectClass} bg-[#0A1628] rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-red-500/30 ${className}`}
      >
        <p className="text-sm font-semibold text-red-300">رابط الفيديو غير صالح أو غير مدعوم</p>
        <span className="text-xs text-[#8EA3BF] mt-1 font-mono">{url}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#1E3A63]/60 group ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0 z-10"
        />
      ) : (
        <div
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 z-10 cursor-pointer overflow-hidden select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsPlaying(true);
            }
          }}
          aria-label={`تشغيل فيديو: ${title}`}
        >
          {/* Video Poster Frame */}
          {thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={title}
              onError={handleThumbnailError}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />
          )}

          {/* Dark / Gold Atmospheric Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/90 via-[#040812]/30 to-[#040812]/20 transition-opacity duration-300 group-hover:opacity-75 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(4,8,18,0.7)_100%)] pointer-events-none" />

          {/* Golden Mosque Play Button - perfectly centered in middle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(true);
              }}
              className="pointer-events-auto relative z-20 flex flex-col items-center gap-3 cursor-pointer group/btn focus:outline-none"
              aria-label="تشغيل الفيديو"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[linear-gradient(135deg,#0E203A_0%,#183561_60%,#265394_100%)] border-2 border-[#D4AF85] p-0.5 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,133,0.4)] group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_35px_rgba(255,240,200,0.7)] group-hover:scale-110 group-hover:border-[#FFF0C8] transition-all duration-300">
                <div className="w-full h-full rounded-full flex items-center justify-center bg-[#070F1E]/80 backdrop-blur-sm">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[#FFF2D2] fill-[#D4AF85] translate-x-0.5 group-hover:fill-[#FFF2D2] transition-colors" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#FFF2D2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-90 group-hover:opacity-100 transition-opacity">
                انقر للتشغيل
              </span>
            </button>
          </div>

          {/* Duration Badge if available */}
          {duration && (
            <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-md bg-[#050B14]/85 border border-[#1E3A63]/80 backdrop-blur-sm text-[11px] font-bold text-[#FFF2D2] shadow-md">
              {duration}
            </div>
          )}

          {/* Top Title preview banner */}
          {title && (
            <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-[#040812]/80 to-transparent pointer-events-none">
              <h3 className="text-xs sm:text-sm font-bold text-[#FAF7F0] line-clamp-1 drop-shadow-md">
                {title}
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
