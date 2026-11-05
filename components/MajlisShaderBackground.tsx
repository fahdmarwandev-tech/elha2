"use client";

import React from "react";

interface MajlisShaderBackgroundProps {
  imageSrc?: string;
  className?: string;
}

export default function MajlisShaderBackground({
  imageSrc = "/majlis-hall.jpg",
  className = "",
}: MajlisShaderBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* High-definition, bright, vivid Majlis Hall photo */}
      <div
        className="w-full h-full bg-cover bg-center filter brightness-110 contrast-105 saturate-[1.05]"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />

      {/* Smooth seamless gradient merge with the Navbar (#060D1A) at the top */}
      <div className="absolute top-0 inset-x-0 h-56 sm:h-72 bg-gradient-to-b from-[#060D1A] via-[#060D1A]/85 via-45% via-[#060D1A]/35 via-70% to-transparent pointer-events-none" />

      {/* Very gentle, ultra-soft luxury film: Keeps picture bright and radiant while guaranteeing readable text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/35 pointer-events-none" />

      {/* Warm ambient mosque glow at top and bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,133,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040812]/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
