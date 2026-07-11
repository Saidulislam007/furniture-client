'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// --- Types & Interfaces ---
interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  subLabel: string;
}

// --- Dynamic Counter Component ---
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    // টোটাল ডিউরেশনকে ফ্রেম রেট দিয়ে ভাগ করে ইনক্রিমেন্ট নির্ধারণ
    const totalMilisecondsStep = Math.max(Math.floor(duration / end), 20);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / totalMilisecondsStep));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, totalMilisecondsStep);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

// --- Sub-component: Individual Stat Card ---
const StatCard: React.FC<{ stat: StatItemProps; index: number }> = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center text-center p-6 bg-white/40 backdrop-blur-[2px] border border-stone-200/50 rounded-sm shadow-sm hover:border-amber-700/40 transition-colors duration-500"
    >
      {/* Animated Big Number */}
      <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-stone-900 tracking-tight mb-3">
        <AnimatedCounter target={stat.value} />
        <span className="text-amber-700 font-sans font-light ml-0.5">{stat.suffix}</span>
      </div>

      {/* Structured Minimal Labels */}
      <h3 className="text-xs sm:text-sm font-sans font-semibold text-stone-800 uppercase tracking-widest mb-1.5">
        {stat.label}
      </h3>
      <p className="text-[11px] sm:text-xs font-serif font-light italic text-stone-500 max-w-[180px] leading-relaxed">
        {stat.subLabel}
      </p>
    </motion.div>
  );
};

// --- Main StatsSection Component ---
export default function StatsSection() {
  const statsData: StatItemProps[] = [
    { value: 10, suffix: "K+", label: "Curated Spaces", subLabel: "Timeless architectures designed worldwide." },
    { value: 98, suffix: "%", label: "Client Retain", subLabel: "Bespoke service with impeccable precision." },
    { value: 45, suffix: "+", label: "Master Artisans", subLabel: "Preserving heritage joinery & modern craft." },
    { value: 16, suffix: "", label: "Global Galleries", subLabel: "Flagship editorial stores across major capitals." }
  ];

  return (
    <section className="w-full bg-stone-50 py-16 sm:py-24 xl:py-28 border-b border-stone-200 overflow-hidden font-serif">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        
        {/* 100% Responsive Grid Config mapping all devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}