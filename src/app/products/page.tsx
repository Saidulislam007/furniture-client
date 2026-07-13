"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ==========================================
// 📑 1. Types Definition
// ==========================================
export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: string;
  image: string;
  description: string;
  category: string;
  subCategory: string;
  stock: number;
  featured: boolean;
  material: string;
  warranty: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  colors: { name: string; hex: string }[];
}

// 📝 শপ পেজের জন্য সম্পূর্ণ প্রিমিয়াম প্রোডাক্ট ডেটাবেজ (যা ডিটেইলস পেজের সাথে সিঙ্কড)
export const shopProducts: Product[] = [
  {
    id: "p1",
    title: "Minimalist Lounge Chair",
    price: 899,
    oldPrice: 1200,
    rating: 4.8,
    reviewsCount: "1.2k Reviews",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800",
    description: "Crafted with premium Nordic oak and organic linen for an understated aesthetic. Perfect for reading corners or minimalist office arrangements.",
    category: "Living Room",
    subCategory: "Lounge Chairs",
    stock: 8,
    featured: false,
    material: "Solid Nordic Oak & Organic Flax Linen",
    warranty: "3 Years Comprehensive Warranty",
    dimensions: { width: "82 cm", height: "76 cm", depth: "80 cm" },
    colors: [{ name: "Oak Grey", hex: "#bcaf9e" }]
  },
  {
    id: "p2",
    title: "Contemporary Ceramic Vase",
    price: 240,
    rating: 4.5,
    reviewsCount: "412 Reviews",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800",
    description: "Hand-thrown earthenware finish that introduces a subtle texture to modern architectural settings.",
    category: "Decor",
    subCategory: "Vases",
    stock: 25,
    featured: false,
    material: "Natural Terracotta Clay",
    warranty: "No Warranty Structure Available",
    dimensions: { width: "24 cm", height: "45 cm", depth: "24 cm" },
    colors: [{ name: "Terracotta", hex: "#c37a5e" }]
  },
  {
    id: "p3",
    title: "Travertine Coffee Table",
    price: 1850,
    oldPrice: 2200,
    rating: 4.9,
    reviewsCount: "89 Reviews",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800",
    description: "Sculptural forms marrying structural stability with raw, unfilled imported Italian stone composites.",
    category: "Living Room",
    subCategory: "Tables",
    stock: 3,
    featured: true,
    material: "Italian Travertine Solid Stone",
    warranty: "2 Years Material Warranty",
    dimensions: { width: "120 cm", height: "40 cm", depth: "80 cm" },
    colors: [{ name: "Ivory Cream", hex: "#f0e6d2" }]
  },
  {
    id: "p4",
    title: "Sleek Pendant Light",
    price: 340,
    rating: 4.6,
    reviewsCount: "1.1k Reviews",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800",
    description: "Brushed brass accents throwing gentle illumination over highly curated dining profiles.",
    category: "Lighting",
    subCategory: "Pendant Lights",
    stock: 19,
    featured: false,
    material: "Brushed Brass & Hand-Blown Glass",
    warranty: "1 Year Electrical Node Warranty",
    dimensions: { width: "35 cm", height: "110 cm", depth: "35 cm" },
    colors: [{ name: "Brass Gold", hex: "#d4af37" }]
  },
  {
    id: "p5",
    title: "Monolithic Ash Credenza",
    price: 2100,
    rating: 4.8,
    reviewsCount: "67 Reviews",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800",
    description: "Hidden seams and soft-close trackways ensuring functional architectural elegance and heavy volume storage.",
    category: "Storage",
    subCategory: "Cabinets",
    stock: 5,
    featured: false,
    material: "Solid Ash Wood & Steel Anchors",
    warranty: "5 Years Framework Warranty",
    dimensions: { width: "180 cm", height: "75 cm", depth: "45 cm" },
    colors: [{ name: "Natural Ash", hex: "#e2d2be" }]
  },
  {
    id: "p6",
    title: "Organic Bouclé Sofa",
    price: 1499,
    oldPrice: 2500,
    rating: 4.7,
    reviewsCount: "2.6k Reviews",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
    description: "Fluid curves designed to create safe zones of tactical comfort within ultra-minimalist living spaces.",
    category: "Living Room",
    subCategory: "Sofas & Couches",
    stock: 14,
    featured: true,
    material: "Premium Bouclé Weave & Walnut Base",
    warranty: "5 Years Structural Frame Warranty",
    dimensions: { width: "220 cm", height: "85 cm", depth: "95 cm" },
    colors: [
      { name: "Charcoal", hex: "#374151" },
      { name: "Amber", hex: "#ea580c" },
      { name: "Purple", hex: "#7c3aed" },
      { name: "Matt Black", hex: "#6b7280" },
    ]
  }
];

// ==========================================
// 📦 2. Sub-Component: Compact Product Card
// ==========================================
const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  return (
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
  );
};

// ==========================================
// 🌐 3. Main Component: Shop Page
// ==========================================
function ShopPage() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex items-center justify-center animate-pulse">
        <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">ATELIER</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-20 sm:pt-24 overflow-hidden">
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

        {/* Grid Render */}
        {shopProducts.length === 0 ? (
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

export default ShopPage;