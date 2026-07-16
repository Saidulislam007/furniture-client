'use client';

import React from 'react';
import { motion, Variants } from "framer-motion";

// --- Types & Interfaces ---
interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface ValueItem {
  number: string;
  title: string;
  description: string;
}

// --- Data Configuration ---
const teamData: TeamMember[] = [
  {
    name: "Soren Lassen",
    role: "Founder & Lead Architect",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
  },
  {
    name: "Marcus Vance",
    role: "Master Artisan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
  },
  {
    name: "Elena Rostova",
    role: "Head of Spatial Design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
  }
];

const valuesData: ValueItem[] = [
  {
    number: "01",
    title: "Honest Materiality",
    description: "We work exclusively with sustainably sourced white oak, natural stones, and unlacquered metals that age gracefully over generations."
  },
  {
    number: "02",
    title: "Structural Rigor",
    description: "Every joint, line, and shadow gap is calculated to achieve an optimal balance between mathematical weight and absolute visual lightness."
  },
  {
    number: "03",
    title: "Bespoke Endurance",
    description: "Rejecting mass production, we treat every layout as a private gallery installation tailored precisely to individual residential movements."
  }
];

// --- Animation Variants ---
const fadeInContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeInUp: Variants  = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

export default function AboutPage() {
  return (
    <main className="w-full bg-stone-50 text-stone-900 font-serif overflow-hidden">
      
      {/* ─── 1. HERO / MANIFESTO BANNER ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 xl:pt-48 xl:pb-36 border-b border-stone-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.215, 0.610, 0.355, 1] }}
            className="max-w-4xl space-y-6"
          >
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              Our Manifesto
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light tracking-wide leading-[1.1] text-stone-950">
              Shaping continuous lines, negative spaces, and tactile heritage.
            </h1>
            <p className="text-stone-500 font-sans font-light text-sm sm:text-base md:text-lg tracking-wide leading-relaxed max-w-2xl pt-4">
              Founded with a conviction that furniture is architectural scale, Atelier blends raw European geometry with time-honored joinery techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. THE STORY / IMAGE SPREAD (Asymmetric Grid Layout) ─── */}
      <section className="w-full py-16 sm:py-24 xl:py-32 border-b border-stone-200 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Narrative Block */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-stone-950">
                The Heritage of Pure Craft
              </h2>
              <div className="space-y-4 font-sans font-light text-xs sm:text-sm tracking-wide text-stone-600 leading-relaxed">
                <p>
                  Atelier began inside a small timber workshop in London, driven by the desire to eliminate traditional industrial clutter. We felt residential spaces were becoming crowded with generic, fast-turnaround objects that lacked gravity or historical memory.
                </p>
                <p>
                  By re-introducing calculated shadow-lines and mortise-and-tenon interlocking joins, our collections communicate seamlessly with modern architectural concrete, natural daylight paths, and structural voids.
                </p>
              </div>
            </motion.div>

            {/* Right Asymmetric Cinematic Cover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 aspect-[16/10] bg-stone-100 rounded-sm border border-stone-200 overflow-hidden relative mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200')" }}
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── 3. CORE STRATEGIC VALUES ─── */}
      <section className="w-full py-16 sm:py-24 xl:py-32 border-b border-stone-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          <div className="mb-12 sm:mb-16 md:mb-20 max-w-xl">
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              Our Foundations
            </p>
            <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-stone-950 mt-1">
              Architectural Ideals
            </h2>
          </div>

          <motion.div 
            variants={fadeInContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {valuesData.map((value, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="space-y-4 border-t border-stone-300 pt-6">
                <span className="block font-sans text-xs tracking-widest text-amber-700 font-bold tabular-nums">
                  {value.number}
                </span>
                <h3 className="text-xl font-light tracking-wide text-stone-900">
                  {value.title}
                </h3>
                <p className="font-sans font-light text-xs sm:text-sm tracking-wide text-stone-500 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ─── 4. EDITORIAL TEAM CREATIVE DIRECTORY ─── */}
      <section className="w-full py-16 sm:py-24 xl:py-32 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          
          <div className="mb-12 sm:mb-16 md:mb-20 text-center max-w-xl mx-auto space-y-2">
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              The Directory
            </p>
            <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-stone-950">
              Master Minds & Craftspersons
            </h2>
            <div className="h-[1px] w-12 bg-amber-700/60 mt-4 mx-auto" />
          </div>

          <motion.div 
            variants={fadeInContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {teamData.map((member, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group flex flex-col space-y-4">
                <div className="w-full aspect-[4/5] overflow-hidden bg-stone-100 rounded-sm border border-stone-200/60 relative mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <h3 className="text-lg font-light tracking-wide text-stone-900 group-hover:text-amber-800 transition-colors">
                    {member.name}
                  </h3>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-stone-400 font-light">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

    </main>
  );
}