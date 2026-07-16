'use client';

import React from 'react';
import Link from 'next/link';
import { motion ,Variants } from 'framer-motion';


// --- Types & Interfaces ---
export interface CategoryItem {
  title: string;
  slug: string;
  count: number;
  imageUrl: string;
}

interface CategoryGridProps {
  categories: CategoryItem[]; // মিনিমাম ৩টি ক্যাটাগরি প্রোভাইড করতে হবে ইমেজের মতো লেআউটের জন্য
  sectionTitle?: string;
  sectionSubtitle?: string;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

// --- 1. CategoryCard Component (Sub-component) ---
const CategoryCard: React.FC<{ category: CategoryItem; isLarge?: boolean }> = ({ category, isLarge = false }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`group relative w-full overflow-hidden bg-stone-100 border border-stone-200/60 rounded-sm
        ${isLarge 
          ? 'h-[50vh] sm:h-[60vh] lg:h-full min-h-[400px] lg:min-h-[600px]' 
          : 'h-[40vh] sm:h-[45vh] lg:h-[calc(50%-12px)] min-h-[280px]'
        }`}
    >
      <Link href={`/products?category=${category.slug}`} className="block w-full h-full focus:outline-none">
        {/* Editorial Ken-Burns Zoom Image */}
        <motion.div
          className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
          style={{ backgroundImage: `url('${category.imageUrl}')` }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        
        {/* Luxury Linear Shading Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-950/10 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Content Box: Content placed at the bottom as per uploaded image */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between z-10">
          <div className="space-y-1 sm:space-y-2 max-w-[70%]">
            <h3 className="text-xl sm:text-2xl font-serif font-light tracking-wide text-white leading-tight">
              {category.title}
            </h3>
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase text-stone-300">
              {category.count} {category.count === 1 ? 'Product' : 'Products'}
            </p>
          </div>
          
          {/* Circular Luxury Arrow Link Button */}
          <motion.div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 bg-transparent flex items-center justify-center text-white backdrop-blur-[2px] group-hover:bg-white group-hover:text-stone-950 group-hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- 2. Main CategoryGrid Component (Composer) ---
export default function CategoryGrid({ 
  categories, 
  sectionTitle = "Shop by Category", 
  sectionSubtitle = "Carefully Curated Collections" 
}: CategoryGridProps) {
  
  // সেফটি মেকানিজম: অ্যারেতে ডাটা কম থাকলে ব্যাকআপ হ্যান্ডেল
  const leftCard = categories[0];
  const topRightCard = categories[1];
  const bottomRightCard = categories[2];

  if (!leftCard) return null;

  return (
    <section className="w-full bg-stone-50 py-16 sm:py-24 xl:py-32 border-b border-stone-200 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        
        {/* Premium Header Architecture */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
            {sectionSubtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-wide text-stone-900">
            {sectionTitle}
          </h2>
          <div className="h-[1px] w-16 bg-amber-700/60 mt-4 mx-auto" />
        </div>

        {/* Asymmetric 3-Card Grid Layout matching the Image */}
        {leftCard && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:h-[70vh] xl:h-[75vh] lg:min-h-[600px]"
          >
            {/* 1. Left Large Column (Takes 7 Cols on Desktop) */}
            <div className="lg:col-span-7 w-full h-full">
              <CategoryCard category={leftCard} isLarge={true} />
            </div>

            {/* 2. Right Column with Stacked Cards (Takes 5 Cols on Desktop) */}
            <div className="lg:col-span-5 w-full h-full flex flex-col justify-between gap-6">
              {topRightCard && <CategoryCard category={topRightCard} isLarge={false} />}
              {bottomRightCard && <CategoryCard category={bottomRightCard} isLarge={false} />}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}