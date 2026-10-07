"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] pt-20 px-6 sm:px-12 text-center overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs sm:text-sm font-medium uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Frontend Initialized</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05]"
        >
          Hello, <span className="text-gold italic">World!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mb-10 font-light leading-relaxed"
        >
          Welcome to your new frontend application. Crafted with Next.js App Router, Tailwind CSS, TypeScript, and Framer Motion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-light text-black font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-gold/20 hover:scale-105 active:scale-95 group">
            <span>Explore Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white/90 hover:text-white font-medium text-sm transition-all duration-200 hover:bg-white/5"
          >
            Documentation
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
