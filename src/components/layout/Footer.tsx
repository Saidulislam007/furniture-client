'use client';

import React from 'react';
import Link from 'next/link';
import { motion ,Variants } from 'framer-motion';

// --- Types & Interfaces ---
interface SocialItem {
  label: string;
  href: string;
}

// --- Data Configuration ---
const socialLinks: SocialItem[] = [
  { label: "FB", href: "#" },
  { label: "IG", href: "#" },
  { label: "TW", href: "#" },
  { label: "LN", href: "#" }
];

// --- Animation Variants ---
const footerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    }
  }
};

const fadeInUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#ab7155] text-stone-100 font-serif overflow-hidden">
      {/* ─── MAIN CURATED LAYER ─── */}
      <motion.div 
        variants={footerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center space-y-10 sm:space-y-14"
      >
        
        {/* 1. Big Editorial Headline with Smooth Scale & Fade */}
        <motion.h2 
          variants={fadeInUpVariant}
          className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-light tracking-[0.15em] text-stone-100 uppercase text-center w-full leading-none selection:bg-amber-800"
        >
          FURNITURE <span className="opacity-40 text-stone-200 font-sans font-extralight mx-2 sm:mx-4">/</span> INTERIOR <span className="opacity-40 text-stone-200 font-sans font-extralight mx-2 sm:mx-4">/</span> DESIGN
        </motion.h2>
        
        {/* 2. Brand Info & Directory Links (Clean Horizontal Stack Grid) */}
        <motion.div 
          variants={fadeInUpVariant}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-white/10 pt-10 font-sans text-xs"
        >
          
          {/* Brand Statement & Address */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-base tracking-widest font-serif font-bold text-white">ATELIER</h3>
            <p className="text-stone-200/80 font-light leading-relaxed max-w-xs">
              Crafting architectural furniture and elegant configurations for timeless residential interiors.
            </p>
            <p className="text-stone-300 font-light text-[11px] tracking-wide">
              <span className="text-stone-100 font-medium">Add:</span> 84 Editorial St, London, UK
            </p>
          </div>

          {/* Directory Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-white">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-stone-200/80 font-light">
              <Link href="/about" className="hover:text-stone-950 transition-colors duration-300">Our Story</Link>
              <Link href="/products" className="hover:text-stone-950 transition-colors duration-300">Shop All</Link>
              <Link href="/faq" className="hover:text-stone-950 transition-colors duration-300">Client FAQ</Link>
              <Link href="/care" className="hover:text-stone-950 transition-colors duration-300">Material Care</Link>
            </div>
          </div>

          {/* Clean Embedded Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-white">Bespoke Updates</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-white/30 focus-within:border-white transition-colors duration-300 py-1 max-w-sm">
              <input 
                type="email" 
                placeholder="Subscribe for drop updates..." 
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-white/50 h-8 font-light"
                required
              />
              <button type="submit" className="text-white hover:text-stone-950 transition-colors duration-300 px-2" aria-label="Subscribe">
                →
              </button>
            </form>
          </div>

        </motion.div>

        {/* 3. Meta Line Component matching layout image */}
        <motion.div 
          variants={fadeInUpVariant}
          className="w-full flex flex-col md:flex-row items-center justify-between gap-5 border-t border-white/10 pt-8 font-sans text-[11px] tracking-widest text-white/90"
        >
          
          {/* Domain Address */}
          <a href="https://impeccify.com" target="_blank" rel="noopener noreferrer" className="hover:text-stone-950 transition-colors duration-300 font-medium">
            impeccify.com
          </a>
          
          {/* Official Contact Phone */}
          <span className="tabular-nums font-light">+44 658 3456 345</span>
          
          {/* Curated Social Media Handles with Premium Hover & Tap Effects */}
          <div className="flex items-center space-x-3.5">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-7 h-7 rounded-full border border-white/20 hover:border-white flex items-center justify-center text-[9px] font-bold text-white hover:bg-white hover:text-[#ab7155] transition-colors duration-300"
              >
                {social.label}
              </motion.a>
            ))}
          </div>
          
          {/* Landing Navigation Anchor Shortcuts */}
          <div className="flex items-center space-x-5 font-medium">
            <a href="#categories" className="hover:text-stone-950 transition-colors duration-300">Projects</a>
            <Link href="/about" className="hover:text-stone-950 transition-colors duration-300">About Us</Link>
            <Link href="/blog" className="hover:text-stone-950 transition-colors duration-300">News</Link>
          </div>
        </motion.div>

      </motion.div>

      {/* ─── BOTTOM LEGAL BAR ─── */}
      <div className="w-full bg-stone-950/10 py-5 text-white/60 font-sans text-[11px] tracking-wider border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} Atelier Spaces. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}