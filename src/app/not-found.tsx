import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-stone-50 text-stone-900 font-serif flex items-center justify-center overflow-hidden relative">
      
      {/* 🌌 Background Minimal Lines for Architectural Aesthetic */}
      <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <div className="w-[1px] h-full bg-stone-300" />
        <div className="w-[1px] h-full bg-stone-300 hidden sm:block" />
        <div className="w-[1px] h-full bg-stone-300 hidden lg:block" />
        <div className="w-[1px] h-full bg-stone-300" />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 relative z-10 w-full">
        <div className="max-w-xl mx-auto text-center space-y-8">
          
          {/* 🧩 Giant Minimalist 404 Counter */}
          <div className="space-y-1">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-sans font-extralight tracking-tighter text-stone-300 select-none tabular-nums">
              404
            </h1>
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              Void / Voided Space
            </p>
          </div>

          {/* 📝 Content & Descriptive Text */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-stone-950">
              This page could not be found.
            </h2>
            <p className="text-stone-500 font-sans font-light text-xs sm:text-sm tracking-wide leading-relaxed max-w-sm mx-auto">
              The layout or architectural structural node you are seeking has been relocated, renamed, or currently does not exist within our registry.
            </p>
          </div>

          {/* 🚀 Return Action CTA */}
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 bg-stone-950 text-white text-xs font-serif font-medium uppercase tracking-widest shadow-sm hover:bg-stone-800 transition-colors rounded-sm min-h-[44px] pt-1"
            >
              Return To Sanctuary
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}