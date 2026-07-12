"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// 📑 আপগ্রেডেড Product Details ইন্টারফেস
interface ProductDetails {
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

// 📝 ১০০% টাইপ-সেফ রেসপন্সিভ প্রোডাক্টস ডাটাবেজ
const productsDatabase: Record<string, ProductDetails> = {
  "1": {
    id: "1",
    title: "Flexform Status Sofa",
    price: 1499,
    oldPrice: 2500,
    rating: 4.7,
    reviewsCount: "2.6k Reviews",
    image: "https://images.unsplash.com/photo-1581782361327-0402ca001ba9?q=80&w=800",
    description: "The Status Sofa's sleek silhouette is complemented by its impeccable upholstery, available in a range of luxurious fabrics and fine leathers. Its deep, generously padded cushions provide exceptional comfort, while the slim, subtly angled armrests add to its modern aesthetic.",
    category: "Living Room",
    subCategory: "Sofas & Couches",
    stock: 14,
    featured: true,
    material: "Italian Leather & Solid Walnut Framework",
    warranty: "5 Years Framework Warranty",
    dimensions: {
      width: "220 cm",
      height: "85 cm",
      depth: "95 cm"
    },
    colors: [
      { name: "Charcoal", hex: "#374151" },
      { name: "Amber", hex: "#ea580c" },
      { name: "Purple", hex: "#7c3aed" },
      { name: "Matt Black", hex: "#6b7280" },
    ]
  },
  
  "p1": {
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
    dimensions: {
      width: "82 cm",
      height: "76 cm",
      depth: "80 cm"
    },
    colors: [
      { name: "Oak Grey", hex: "#bcaf9e" }
    ]
  }
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = productsDatabase[productId] || productsDatabase["1"];
      setProduct(foundProduct);
      if (foundProduct?.colors?.length) {
        setSelectedColor(foundProduct.colors[foundProduct.colors.length - 1].name);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex items-center justify-center animate-pulse">
        <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">ATELIER</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-24 pb-16 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Catalog
        </button>

        {/* 2-Column Responsive Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Left: Product Image */}
          <div className="w-full aspect-[4/3.5] md:aspect-[4/4] bg-[#eadecf] rounded-[2rem] overflow-hidden shadow-sm">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
            />
          </div>

          {/* Right: Product Details Info Area */}
          <div className="flex flex-col h-full text-left">
            
            {/* Category Breadcrumb & Stock Status Tag */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-100">
                {product.category} / {product.subCategory}
              </span>
              <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded-sm border ${
                product.stock > 0 ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-rose-50 text-rose-800 border-rose-100"
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-gray-900 fill-gray-900" : "text-gray-300"}`} 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 mt-0.5">{product.rating}</span>
              <span className="text-gray-400 mx-1">•</span>
              <button className="text-sm text-gray-600 underline font-light hover:text-gray-900">
                {product.reviewsCount}
              </button>
            </div>

            {/* Pricing System */}
            <div className="flex items-baseline gap-4 mb-6">
              {product.oldPrice && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through font-light">
                  ${product.oldPrice}
                </span>
              )}
              <span className="text-3xl sm:text-4xl font-bold text-gray-950">
                ${product.price}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* ─── 🚀 🟢 NEW Spec Sheet Details Badge Section ─── */}
            <div className="mb-6 p-4 bg-white/60 border border-gray-200/60 rounded-xl space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Material Composition</span>
                <span className="text-gray-900 font-light">{product.material}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Dimensions (W × H × D)</span>
                <span className="text-gray-900 font-mono">{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Warranty Structure</span>
                <span className="text-gray-900 font-light">{product.warranty}</span>
              </div>
            </div>

            {/* Color Swatch Picker */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{product.colors.length} {product.colors.length > 1 ? "Colors" : "Color"} Available</h3>
                {selectedColor && <span className="text-xs text-gray-500 font-light">({selectedColor})</span>}
              </div>
              
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 relative flex items-center justify-center ${
                      selectedColor === color.name ? "border-gray-900 scale-110 shadow-sm" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <span className="w-2 h-2 rounded-full bg-white block mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => console.log("Direct Checkout for: ", product.id, " with color: ", selectedColor)}
                disabled={product.stock === 0}
                className="w-full bg-[#111827] hover:bg-black text-white text-sm font-medium py-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              
              <button 
                onClick={() => console.log("Added to Cart State")}
                disabled={product.stock === 0}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all active:scale-98 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}