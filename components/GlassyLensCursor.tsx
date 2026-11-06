"use client";

import React, { useEffect, useRef, useState } from "react";

interface GlassyLensCursorProps {
  imageSrc?: string;
  outsideSize?: number;
  buttonSize?: number;
}

type LensMode = "outside" | "glass-box" | "button";

export default function GlassyLensCursor({
  imageSrc = "/majlis-hall.jpg",
  outsideSize = 34,
  buttonSize = 68,
}: GlassyLensCursorProps) {
  const revealOverlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<LensMode>("outside");
  const [isVisible, setIsVisible] = useState(false);
  const modeRef = useRef<LensMode>("outside");

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const target = e.target as HTMLElement | null;
      const isButton = !!target?.closest(
        'button, a, input, textarea, select, [role="button"], .interactive-button'
      );
      const isGlassCard = !!target?.closest('[data-glass-card="true"], .glass-card');

      let newMode: LensMode = "outside";
      if (isButton) {
        newMode = "button";
      } else if (isGlassCard) {
        newMode = "glass-box";
      } else {
        newMode = "outside";
      }

      if (newMode !== modeRef.current) {
        modeRef.current = newMode;
        setMode(newMode);
      }

      // Dynamic radius: small (outside buttons) vs expanded (on buttons)
      const currentRadius = newMode === "button" ? buttonSize / 2 : outsideSize / 2;

      // 1. Move the glow directly with the cursor
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x - currentRadius}px, ${y - currentRadius}px, 0)`;
      }

      // 2. Feathered reveal mask for glass cards (using the smaller outside radius)
      if (revealOverlayRef.current) {
        const maskStr = `radial-gradient(circle ${currentRadius}px at ${x}px ${y}px, black 35%, transparent 100%)`;
        revealOverlayRef.current.style.maskImage = maskStr;
        (revealOverlayRef.current.style as any).webkitMaskImage = maskStr;
      }

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [outsideSize, buttonSize, isVisible]);

  const currentSize = mode === "button" ? buttonSize : outsideSize;

  return (
    <>
      {/* 1:1 FULLSCREEN CUTOUT OVERLAY:
          Feathered reveal of the background photo through glass cards, sized compactly outside buttons */}
      <div
        ref={revealOverlayRef}
        className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-200 ease-out will-change-[mask-image] ${
          isVisible && mode === "glass-box" ? "opacity-100" : "opacity-0"
        }`}
        style={{
          WebkitMaskImage: `radial-gradient(circle ${outsideSize / 2}px at -200px -200px, black 35%, transparent 100%)`,
          maskImage: `radial-gradient(circle ${outsideSize / 2}px at -200px -200px, black 35%, transparent 100%)`,
        }}
      >
        <div
          className="w-full h-full bg-cover bg-center filter brightness-125 contrast-105 saturate-[1.05]"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <div className="absolute top-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-b from-[#060D1A] via-[#060D1A]/85 via-30% via-[#060D1A]/40 via-65% to-transparent pointer-events-none" />
      </div>

      {/* DYNAMIC CURSOR GLOW:
          Smaller outside buttons (34px), smoothly expanding to full button glow (68px) when hovering over buttons */}
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 pointer-events-none z-25 transition-[opacity,width,height] duration-200 ease-out will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: `${currentSize}px`,
          height: `${currentSize}px`,
          transform: "translate3d(-200px, -200px, 0)",
        }}
      >
        <div className="relative w-full h-full rounded-full">
          {/* Subtle optical blur when outside over the raw background */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
              mode === "outside" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backdropFilter: "blur(6px) brightness(1.22) saturate(1.1)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
            }}
          />

          {/* Luminous, radiant white-gold specular light */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.75) 0%, rgba(255,242,215,0.48) 30%, rgba(212,175,133,0.24) 55%, transparent 75%)",
            }}
          />
        </div>
      </div>
    </>
  );
}
