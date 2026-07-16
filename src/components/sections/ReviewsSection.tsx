'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

// --- Types & Interfaces ---
interface ReviewItemProps {
  name: string;
  role: string;
  rating: number;
  comment: string;
  projectName: string;
  avatar: string; // 🚀 ফিক্স: ইউজার ইমেজের জন্য নতুন প্রপ টাইপ
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// --- Sub-component: Individual Review Card ---
const ReviewCard: React.FC<{ review: ReviewItemProps; index: number }> = ({ review, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -4,
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
      }}
      className="flex flex-col justify-between p-6 sm:p-8 bg-white border border-stone-200/60 rounded-sm shadow-sm hover:border-amber-700/40 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Luxury Star Rating (Minimalist Solid Fill) & Dynamic Image Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-amber-700">
            {[...Array(review.rating)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>

          <span className="inline-block px-2.5 py-0.5 text-[9px] font-sans uppercase tracking-widest bg-stone-50 text-stone-500 border border-stone-200/40 rounded-sm">
            {review.projectName}
          </span>
        </div>

        {/* Editorial Review Text */}
        <p className="text-sm sm:text-base font-serif font-light italic text-stone-800 leading-[1.8] tracking-wide select-text">
          "{review.comment}"
        </p>
      </div>

      {/* User Info Signature Footer with Profile Pic */}
      <div className="border-t border-stone-100 pt-5 mt-6 flex items-center space-x-4 font-sans text-xs">
        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-stone-200">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-300"
          />
        </div>
        <div className="leading-tight">
          <h4 className="font-semibold text-stone-900">{review.name}</h4>
          <p className="text-[11px] text-stone-400 font-light tracking-wide mt-0.5">{review.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main ReviewsSection Component ---
export default function ReviewsSection() {
  const reviewsData: ReviewItemProps[] = [
    {
      name: "Alexandra Thorne",
      role: "Art Director, London",
      rating: 5,
      comment: "Atelier completely transformed our open-plan duplex. The structural white oak credenza acts as a functional sculpture. The restrained minimalism and balance of material texturing are beyond perfect.",
      projectName: "Belgravia Duplex",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    },
    {
      name: "David Sterling",
      role: "Real Estate Developer",
      rating: 5,
      comment: "Their attention to heritage joinery combined with continuous modern forms brought tremendous value to our premium project. Impeccable execution, transparent deadlines, and pristine architectural lines.",
      projectName: "Highgate Residence",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    },
    {
      name: "Elena Rostova",
      role: "Private Art Collector",
      rating: 5,
      comment: "The low-profile modular seating catches the afternoon shadow patterns beautifully. It changes the entire lighting geometry of the gallery living space. A true masterpiece in tactile comfort.",
      projectName: "Minimalist Loft",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    }
  ];

  return (
    <section className="w-full bg-stone-50 py-16 sm:py-24 xl:py-32 border-b border-stone-200 overflow-hidden font-serif">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">

        {/* Premium Header Layout */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
            Client Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-900">
            Voices of Atelier
          </h2>
          <div className="h-[1px] w-16 bg-amber-700/60 mt-4 mx-auto" />
        </div>

        {/* 100% Responsive Grid Config Mapping with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {reviewsData.map((review, idx) => (
            <ReviewCard key={idx} review={review} index={idx} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}