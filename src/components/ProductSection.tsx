"use client";

import React from 'react';
import Link from 'next/link'; // 🌟 ১. Next.js Link ইম্পোর্ট করা হলো

// ==========================================
// 📑 1. Types Definition
// ==========================================
export interface Product {
  id: string;
  title: string;
  price?: number;
  rating?: number;
  image: string;
  description?: string;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  onViewDetails: (id: string) => void;
}

// ==========================================
// ⏳ 2. Sub-Component: Compact Skeleton Card
// ==========================================
const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="w-full aspect-[4/3.2] bg-gray-200 rounded-[1.5rem] mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5 mb-3"></div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  );
};

// ==========================================
// 📦 3. Sub-Component: Compact Product Card
// ==========================================
const ProductCard: React.FC<{
  product: Product;
  index: number;
}> = ({ product, index }) => {
  
  return (
    // 🌟 ২. পুরো কার্ডটিকে Link দিয়ে মুড়িয়ে দেওয়া হলো যা সরাসরি /products এ নিয়ে যাবে
    <Link 
      href="/products"
      className="group flex flex-col h-full cursor-pointer transition-all duration-700 ease-out"
      style={{
        animation: `fadeInUp 0.8s cubic-bezier(0.215, 0.610, 0.355, 1) ${index * 0.15}s both`
      }}
    >
      {/* Image Container */}
      <div className="w-full aspect-[4/3.2] bg-[#eadecf] rounded-[1.5rem] overflow-hidden relative mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-700">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.01] transition-colors duration-700" />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow items-start px-1">
        <h3 className="text-lg font-serif font-medium text-gray-900 tracking-wide mb-1 transition-colors duration-500 group-hover:text-amber-800">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-xs text-gray-600 font-light leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Action Button: HTML div হিসেবে রাখা হয়েছে কারণ Link এর ভেতর button রাখা রিঅ্যাক্ট স্ট্যান্ডার্ড বিরোধী */}
        <div
          className="mt-auto w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 transition-all duration-500 group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="w-3.5 h-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

// ==========================================
// 🌐 4. Main Component: Product Section (Exported)
// ==========================================
export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  isLoading,
}) => {
  return (
    <section className="w-full py-12 md:py-16 bg-[#f4f0eb] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 xl:px-16">
        
        {/* Header Layout */}
        <div 
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10 md:mb-14"
          style={{ animation: 'fadeInUp 1s cubic-bezier(0.215, 0.610, 0.355, 1) both' }}
        >
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-gray-900 tracking-tight leading-tight">
              {title.split(' ')[0]} <span className="font-normal text-amber-800/90">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>
          {subtitle && (
            <div className="max-w-xs md:mt-2">
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed md:text-right">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Loading Skeleton Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {[...Array(3)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full py-16 text-center bg-transparent border border-dashed border-gray-300 rounded-[1.5rem]">
            <h3 className="text-lg font-serif text-gray-800">No spaces shaped yet</h3>
            <p className="mt-2 text-xs text-xs text-gray-500 font-light">Please check back soon for our latest collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};