"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
// 🎯 🚀 আপনার প্রজেক্টের মেইন সার্ভিস ফাংশন
import { getAllFurniture } from '@/services/api/getFurniture';
import type { Product } from "@/types/product";

// ==========================================
// 📑 1. Types Definition
// ==========================================


interface ProductSectionProps {
  title: string;
  subtitle: string;
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
    <div className="w-[260px] sm:w-[320px] md:w-[360px] lg:w-[400px] shrink-0 flex flex-col h-full animate-pulse mr-6">
      <div className="w-full aspect-[4/3.2] bg-stone-200 rounded-[1.5rem] mb-4"></div>
      <div className="h-4 bg-stone-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-stone-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-stone-200 rounded w-4/5 mb-3"></div>
      <div className="w-8 h-8 bg-stone-200 rounded-full"></div>
    </div>
  );
};

// ==========================================
// 📦 3. Sub-Component: Compact Product Card
// ==========================================
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    // 🚀 ১০০% রেসপন্সিভ উইডথ চ্যাসিস ম্যাট্রিক্স (320px থেকে 1920px পর্যন্ত লক)
    <div className="w-[260px] small-mobile:w-[280px] mobile:w-[310px] tablet:w-[340px] laptop:w-[380px] desktop:w-[420px] shrink-0 px-3 sm:px-4">
      <Link
        href="/products"
        className="group flex flex-col h-full cursor-pointer transition-all duration-700 ease-out"
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
        <div className="flex flex-col flex-grow items-start px-1 text-left">
          <h3 className="text-base sm:text-lg font-serif font-medium text-gray-900 tracking-wide mb-1 transition-colors duration-500 group-hover:text-amber-800 line-clamp-1">
            {product.title}
          </h3>

          {product.price && (
            <p className="text-sm font-bold text-gray-950 mb-1">${product.price}</p>
          )}

          {product.description && (
            <p className="text-xs text-gray-600 font-light leading-relaxed mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Action Button */}
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
    </div>
  );
};

// ==========================================
// 🌐 4. Main Component: Product Section (Exported)
// ==========================================
export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  

  onAddToCart,
  onViewDetails,
}) => {

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setFurniture] = useState<Product[]>([]);

  useEffect(() => {
    const loadPublishedFurniture = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllFurniture();

        if (data && Array.isArray(data)) {
          const publishedData = data.filter(
            (product) => product.status === "Published"
          );

          setFurniture(publishedData);
        }
      } catch (err: any) {
        console.error("❌ Failed to resolve home content grid nodes:", err);
        setError("Failed to synchronize architectural specs.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPublishedFurniture();
  }, []);

  // 🎯 🚀 সিএসএস ইনফিনিট লুপ তৈরি করার জন্য আমরা অ্যারেটিকে ডাবল করে নেব ভাই
  const duplicatedProducts = useMemo(() => {
    return [...products, ...products, ...products];
  }, [products]);

  return (
    <section className="w-full py-16 md:py-24 bg-[#f4f0eb] overflow-hidden select-none">

      {/* 🔮 আলটিমেট সিএসএস আর্কিটেকচারাল ইঞ্জিন (Pure CSS Marquee Infrastructure) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        /* 🎯 মাউস হোভার করলে রানিং অফ করার মূল জাদু এখানে ভাই */
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        
        /* 📱 ১০০% রেসপন্সিভ স্ক্রিন কাস্টম মিডিয়া কোয়েরি গাইড */
        @media (max-width: 320px) { .marquee-track { animation-duration: 20s; } }
        @media (max-width: 480px) { .marquee-track { animation-duration: 25s; } }
        @media (max-width: 1024px) { .marquee-track { animation-duration: 30s; } }
      `}} />

      <div className="max-w-[1920px] mx-auto">

        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12 md:mb-16 px-6 sm:px-8 md:px-12 xl:px-16">
          <div className="max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-gray-900 tracking-tight leading-tight">
              {title.split(' ')[0]} <span className="font-normal text-amber-800/90">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>
          {subtitle && (
            <div className="max-w-xs md:mt-2 text-left md:text-right">
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* ─── SCROLLING CONSOLE CONTROLLER ─── */}
        <div className="marquee-container w-full overflow-hidden relative cursor-grab active:cursor-grabbing">
          {/* গ্লসি ফেড ওভারলে মাস্ক (দুই পাশে প্রিমিয়াম গ্রেডিয়েন্ট শ্যাডো ভাই) */}
          <div className="absolute top-0 left-0 h-full w-12 sm:w-24 bg-gradient-to-r from-[#f4f0eb] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-12 sm:w-24 bg-gradient-to-l from-[#f4f0eb] to-transparent z-10 pointer-events-none" />

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="flex px-6 sm:px-8 md:px-12 xl:px-16">
              {[...Array(4)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="w-full py-12 text-center text-red-700 font-mono text-xs uppercase tracking-wider bg-white/40 border border-stone-200">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-6 sm:mx-16 py-16 text-center bg-transparent border border-dashed border-gray-300 rounded-[1.5rem]">
              <h3 className="text-lg font-serif text-gray-800">No architectural pieces listed.</h3>
            </div>
          ) : (
            /* 🚀 রানিং ট্র্যাক ম্যাট্রিক্স নোড */
            <div className="marquee-track py-2">
              {duplicatedProducts.map((product, index) => (
                <ProductCard
                  key={`${product._id}-${index}`}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};