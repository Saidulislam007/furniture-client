'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Types & Interfaces ---
interface FeaturedChip {
  label: string;
  slug: string;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  imageUrl?: string;
  chips?: FeaturedChip[];
}

// --- Animation Variants ---
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const chipContainerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6
    }
  }
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

// --- 1. HeroCTA Component (Sub-component) ---
const HeroCTA: React.FC<{
  primaryText: string;
  secondaryText: string;
  chips: FeaturedChip[];
}> = ({ primaryText, secondaryText, chips }) => {
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div 
      variants={containerStagger}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 lg:py-0"
    >
      {/* Brand Positioning Copy */}
      <motion.p 
        variants={fadeInUpVariant}
        className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-amber-700 font-semibold mb-4 sm:mb-6"
      >
        Atelier Custom Spaces
      </motion.p>
      
      {/* Title */}
      <motion.h1 
        variants={fadeInUpVariant}
        className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif font-light tracking-wide text-stone-900 leading-[1.15] mb-5 sm:mb-6"
      >
        Simplicity is the <br className="hidden sm:inline" />
        ultimate sophistication.
      </motion.h1>

      {/* Description */}
      <motion.p 
        variants={fadeInUpVariant}
        className="text-xs sm:text-sm md:text-base font-sans font-light tracking-wide text-stone-500 leading-relaxed max-w-xl mb-8 sm:mb-10"
      >
        Experience craft-centric high-end furniture designed for timeless spaces. Cultivating comfort through refined materiality and restrained modern forms.
      </motion.p>

      {/* Responsive CTA Buttons */}
      <motion.div 
        variants={fadeInUpVariant}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 sm:mb-12"
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex"
        >
          <Link 
            href="/products"
            className="w-full sm:w-auto h-12 sm:h-14 px-8 bg-stone-950 text-white text-xs uppercase tracking-widest font-serif flex items-center justify-center rounded shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
          >
            {primaryText}
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex"
        >
          <a 
            href="#categories"
            onClick={(e) => handleScrollToSection(e, 'categories')}
            className="w-full sm:w-auto h-12 sm:h-14 px-8 border border-stone-200 text-stone-900 text-xs uppercase tracking-widest font-serif flex items-center justify-center rounded hover:bg-stone-50 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
          >
            {secondaryText}
          </a>
        </motion.div>
      </motion.div>

      {/* Optional Featured Collection Chips */}
      {chips.length > 0 && (
        <motion.div 
          variants={chipContainerStagger}
          className="hidden sm:flex flex-wrap items-center gap-2.5 text-xs text-stone-400 font-sans"
        >
          <span className="tracking-wide text-[11px] uppercase mr-1 text-stone-500 font-medium">Trending:</span>
          {chips.map((chip, idx) => (
            <motion.div
              key={idx}
              variants={chipVariant}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/categories/${chip.slug}`}
                className="px-3 py-1.5 border border-stone-200 bg-stone-50/50 rounded-full text-stone-600 hover:border-amber-700 hover:text-amber-800 hover:bg-white transition-all duration-300 cursor-pointer text-[11px] tracking-wide block"
              >
                {chip.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// --- 2. HeroMedia Component (Sub-component) ---
const HeroMedia: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-100">
      {/* Fluid Editorial Image Overlay with Zoom-in Motion */}
      <motion.div 
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      {/* Luxury Radial Shading Mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-50/20 to-transparent pointer-events-none hidden lg:block" />
    </div>
  );
};

// --- 3. Main HeroSection Component (Composer) ---
export default function HeroSection({
  primaryCtaText = "Shop Collection",
  secondaryCtaText = "Explore Categories",
  imageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600",
  chips = [
    { label: "Minimalist Sofa", slug: "sofas" },
    { label: "Oak Credenza", slug: "storage" },
    { label: "Timeless Lounge", slug: "chairs" }
  ]
}: HeroSectionProps) {
  return (
    /* 🚀 আল্ট্রা হাইট বুস্ট লক:
       - lg:h-[90vh] -> ল্যাপটপ (1024px) স্ক্রিনে চমৎকার ইম্প্যাক্ট।
       - xl:h-[93vh] -> আল্ট্রা-ওয়াইড বা লার্জ ডেস্কটপে (1920px) একদম ফুল ভিউপোর্ট টাচ করবে।
    */
    <section className="w-full min-h-[75vh] sm:min-h-[80vh] lg:h-[90vh] xl:h-[93vh] bg-stone-50 border-b border-stone-200 overflow-hidden flex flex-col lg:grid lg:grid-cols-2 pt-20">
      
      {/* Layout Control: Mobile Stacked Architecture with CTA First */}
      <div className="order-2 lg:order-1 w-full h-full flex items-center justify-center">
        <HeroCTA 
          primaryText={primaryCtaText} 
          secondaryText={secondaryCtaText} 
          chips={chips} 
        />
      </div>

      <div className="order-1 lg:order-2 w-full h-[35vh] sm:h-[45vh] lg:h-full">
        <HeroMedia imageUrl={imageUrl} />
      </div>

    </section>
  );
}