"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

// 📝 শপ পেজের জন্য লাক্সারি ও প্রিমিয়াম ডেমো প্রোডাক্ট ডেটাবেজ অ্যারে
const shopProducts: Product[] = [
  {
    id: "p1",
    title: "Minimalist Lounge Chair",
    description: "Crafted with premium Nordic oak and organic linen for an understated aesthetic.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600"
  },
  {
    id: "p2",
    title: "Contemporary Ceramic Vase",
    description: "Hand-thrown earthenware finish that introduces a subtle texture to modern settings.",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600"
  },
  {
    id: "p3",
    title: "Travertine Coffee Table",
    description: "Sculptural forms marrying structural stability with raw, unfilled Italian stone.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"
  },
  {
    id: "p4",
    title: "Sleek Pendant Light",
    description: "Brushed brass accents throwing gentle illumination over curated dining profiles.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600"
  },
  {
    id: "p5",
    title: "Monolithic Ash Credenza",
    description: "Hidden seams and soft-close trackways ensuring functional architectural elegance.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600"
  },
  {
    id: "p6",
    title: "Organic Bouclé Sofa",
    description: "Fluid curves designed to create safe zones of comfort within minimal living spaces.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"
  }
];

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
const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  return (
    // 🌟 কার্ড বা অ্যারো আইকনে ক্লিক করলে সরাসরি /products/[id] পেজে রিডাইরেক্ট করবে
    <Link 
      href={`/products/${product.id}`}
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

        {/* Action Button: Circle Arrow Indicator */}
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
// 🌐 4. Main Component: Shop Page
// ==========================================
function ShopPage() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-20 sm:pt-24 overflow-hidden">
      {/* 🌟 কাস্টম ফেড-ইন-আপ সিএসএস অ্যানিমেশন */}
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

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 xl:px-16 py-12">
        
        {/* Header Layout */}
        <div 
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10 md:mb-14"
          style={{ animation: 'fadeInUp 1s cubic-bezier(0.215, 0.610, 0.355, 1) both' }}
        >
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-gray-900 tracking-tight leading-tight">
              Curated <span className="font-normal text-amber-800/90">Architecture</span>
            </h2>
          </div>
          <div className="max-w-xs md:mt-2">
            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed md:text-right">
              Discover our permanent catalog meticulously crafted for modern, conscious living spaces.
            </p>
          </div>
        </div>

        {/* Loading / Grid Render */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {[...Array(3)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : shopProducts.length === 0 ? (
          <div className="w-full py-16 text-center bg-transparent border border-dashed border-gray-300 rounded-[1.5rem]">
            <h3 className="text-lg font-serif text-gray-800">No spaces shaped yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {shopProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// 🌟 Runtime Error ফিক্স করার জন্য ফাইল লেভেলে ডিফল্ট এক্সপোর্ট নিশ্চিত করা হলো
export default ShopPage;