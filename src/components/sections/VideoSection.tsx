'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSectionProps {
  title?: string;
  subtitle?: string;
  thumbnailUrl?: string;
}

export default function VideoSection({
  title = "The Architecture of Sound & Space",
  subtitle = "Inside the Atelier Workshop",
  thumbnailUrl = "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1600" // লাক্সারি কভার ইমেজ
}: VideoSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 🚀 আপনার দেওয়া ইউটিউব ভিডিওর অফিশিয়াল এম্বেড ইউআরএল
  const youtubeEmbedUrl = "https://www.youtube.com/embed/eaIopb53EvE?autoplay=1&modestbranding=1&rel=0";

  return (
    <section className="w-full bg-stone-50 py-16 sm:py-24 xl:py-32 border-b border-stone-200 overflow-hidden font-serif">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        
        {/* 1. Header Typography */}
        <div className="mb-10 sm:mb-14 text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-900 leading-tight">
            {title}
          </h2>
          <div className="h-[1px] w-16 bg-amber-700/60 mt-4 mx-auto" />
        </div>

        {/* 2. Cinematic Video Thumbnail Trigger */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full aspect-[16/9] max-w-6xl mx-auto bg-stone-900 overflow-hidden rounded-sm border border-stone-200 shadow-md group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {/* Cover Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-[1.02] transition-all duration-[750ms] ease-out"
            style={{ backgroundImage: `url('${thumbnailUrl}')` }}
          />
          
          {/* Editorial Soft Overlay */}
          <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-colors duration-500" />

          {/* Luxury Ripple Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-stone-950 flex items-center justify-center shadow-2xl z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-75" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 translate-x-0.5 text-stone-900">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-6 z-10 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to Launch Film
          </div>
        </motion.div>

      </div>

      {/* ─── 3. CINEMATIC OVERLAY LIGHTBOX MODAL (YouTube Integrated) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-stone-400 hover:text-white transition-colors focus:outline-none"
              onClick={() => setIsOpen(false)}
              aria-label="Close Player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 🚀 ফিক্স: নেটিভ ভিডিওর পরিবর্তে ইউটিউব আইফ্রেম এম্বেড প্লেয়ার */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-5xl aspect-[16/9] bg-black shadow-2xl relative rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={youtubeEmbedUrl}
                title="Atelier Cinema Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}