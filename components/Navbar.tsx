"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-gold transition-colors font-heading">
              DAR <span className="text-gold">MONASBAT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center">
            <button className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold hover:bg-gold-light text-black transition-all duration-200 shadow-lg shadow-gold/20 hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-white/10 px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-gold transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-gold transition-colors"
          >
            About
          </Link>
          <Link
            href="#services"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-gold transition-colors"
          >
            Services
          </Link>
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-white/80 hover:text-gold transition-colors"
          >
            Contact
          </Link>
          <div className="pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold text-black transition-all shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
