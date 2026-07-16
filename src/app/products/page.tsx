"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Sliders, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
// 🎯 🚀 আপনার প্রজেক্টের মেইন সার্ভিস ফাংশন
import { getAllFurniture } from '@/services/api/getFurniture';
import type { Product } from "@/types/product";

// ==========================================
// 📑 1. Types Definition
// ==========================================


// 🎯 🚀 প্রতি পেজে ঠিক ৬টি প্রোডাক্ট লক করা হলো ভাই (এর বেশি এক পেজে দেখাবে না)
const ITEMS_PER_PAGE = 6;

// ==========================================
// 📦 2. Sub-Component: Compact Product Card
// ==========================================
const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col h-full cursor-pointer transition-all duration-700 ease-out"
      style={{
        animation: `fadeInUp 0.8s cubic-bezier(0.215, 0.610, 0.355, 1) ${index * 0.05}s both`
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
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="absolute top-4 left-4 bg-amber-800 text-white font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm z-10">
            Sale
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.01] transition-colors duration-700" />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow items-start px-1">
        <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1">
          {product.category} / {product.subCategory}
        </div>
        <h3 className="text-base font-serif font-medium text-gray-900 tracking-wide mb-1.5 transition-colors duration-500 group-hover:text-amber-800">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-bold text-gray-950">${product.price}</p>
          {product.oldPrice && (
            <p className="text-xs text-gray-400 line-through">${product.oldPrice}</p>
          )}
        </div>

        {product.description && (
          <p className="text-xs text-gray-600 font-light leading-relaxed mb-4 line-clamp-2">
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // 📝 Filters States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(3000); // 👈 এটাকে ৩০০০ এ লক করেছি, যদি আপনার প্রোডাক্টের দাম এর বেশি হয় তবে রেঞ্জ বাড়িয়ে দিবেন ভাই
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedColor, setSelectedColor] = useState<string>('All');

  // 🚀 প্যাজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadFurnitureData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllFurniture();

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid architecture token or specs pool empty.');
      }

      // শুধুমাত্র Published প্রোডাক্টগুলো আসবে
      const publishedProducts = data.filter((product) => product.status === 'Published');
      setProducts(publishedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to synchronize architectural specs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFurnitureData();
  }, []);

  // ফিল্টার বদলালে ইউজার স্বয়ংক্রিয়ভাবে আবার ১ নম্বর পেজে ফেরত আসবে
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedColor, priceRange, sortBy]);

  // ডাইনামিক ফিল্টার ডেটা জেনারেশন
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const subCategories = useMemo(() => {
    if (selectedCategory === 'All') return ['All'];
    return ['All', ...Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subCategory)))];
  }, [products, selectedCategory]);

  const colors = useMemo(() => {
    const allColors = products.flatMap(p => p.colors?.map(c => c.name) || []);
    return ['All', ...Array.from(new Set(allColors))];
  }, [products]);

  // 🎯 ফিল্টারিং প্রসেস
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.material?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (selectedSubCategory !== 'All') result = result.filter(p => p.subCategory === selectedSubCategory);
    if (selectedColor !== 'All') result = result.filter(p => p.colors?.some(c => c.name === selectedColor));

    result = result.filter(p => p.price <= priceRange);

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubCategory, selectedColor, priceRange, sortBy]);

  // 🚀 🟢 ক্যালকুলেশন: ফিল্টার হওয়া মোট প্রোডাক্টকে প্রতি পেজের সাইজ (৬) দিয়ে ভাগ
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // 🚀 🟢 কারেন্ট পেজ অনুযায়ী ঠিক ৬টি প্রোডাক্ট কেটে বের করা (Slice)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setPriceRange(3000);
    setSortBy('default');
    setSelectedColor('All');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex items-center justify-center animate-pulse">
        <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">ATELIER</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex flex-col items-center justify-center p-4">
        <p className="font-serif text-lg text-red-800 mb-4">{error}</p>
        <button onClick={loadFurnitureData} className="px-5 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest rounded hover:bg-stone-800 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-20 sm:pt-24 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 py-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-gray-900 tracking-tight">
              Curated <span className="font-normal text-amber-800/90">Architecture</span>
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-1 uppercase tracking-wider">
              Page {currentPage} of {totalPages || 1} — Showing {paginatedProducts.length} of {filteredProducts.length} models
            </p>
          </div>
        </div>

        {/* Search & Sorting Panel */}
        <div className="w-full bg-white/60 border border-stone-200/80 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, specs or material..."
              className="w-full h-11 pl-11 pr-4 bg-white border border-stone-200 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-800 transition-all text-stone-900 font-sans"
            />
          </div>

          <div className="w-full md:w-auto flex items-center justify-end gap-3 shrink-0">
            <div className="relative w-1/2 md:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-stone-200 text-xs rounded-xl focus:outline-none appearance-none font-mono uppercase tracking-wide text-stone-700 cursor-pointer"
              >
                <option value="default">Default Node</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-1/2 md:w-auto h-11 px-5 bg-stone-950 text-white hover:bg-stone-800 text-xs uppercase tracking-widest font-medium rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filters Drawer */}
        {showMobileFilters && (
          <div className="w-full bg-white border border-stone-200 rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-[fadeInUp_0.4s_ease-out]">
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-stone-400 uppercase tracking-widest block">Main Matrix</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat ?? "All");
                      setSelectedSubCategory("All");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${selectedCategory === cat ? 'bg-stone-950 text-white border-stone-950 font-medium' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory !== 'All' && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-stone-400 uppercase tracking-widest block">Sub Nodes</label>
                <div className="flex flex-wrap gap-1.5">
                  {subCategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub ?? "All")}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${selectedSubCategory === sub ? 'bg-amber-800 text-white border-amber-800 font-medium' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-[11px] font-mono text-stone-400 uppercase tracking-widest block">Max Budget</label>
                <span className="text-xs font-bold font-mono text-stone-900">${priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="55"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-800 bg-stone-200 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-stone-400 uppercase tracking-widest block">Color Spec</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-9 px-3 bg-stone-50 border border-stone-200 text-xs rounded-lg font-sans text-stone-700"
              >
                {colors.map(col => <option key={col} value={col}>{col}</option>)}
              </select>

              <button onClick={resetFilters} className="mt-3 w-full h-9 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> Reset Grid Matrix
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="w-full py-24 text-center bg-white/40 border border-dashed border-stone-300 rounded-[1.5rem] flex flex-col items-center justify-center">
            <Sliders className="w-8 h-8 text-stone-300 mb-3" />
            <h3 className="text-base font-serif text-stone-600 tracking-wide">No architectural specs match your filter parameters.</h3>
            <button onClick={resetFilters} className="mt-3 text-xs font-mono text-amber-800 hover:underline uppercase tracking-widest">Clear All Queries</button>
          </div>
        ) : (
          <>
            {/* 🎯 🚀 এই গ্রিডে এখন সর্বোচ্চ ঠিক ৬টি কন্টেন্টই রেন্ডার হবে ভাই */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>

            {/* ================= 📊 🚀 প্রফেশনাল পেজ নাম্বার বাটন কন্ট্রোলার ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-16 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
                {/* Previous Page Arrow */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* 🔢 ইউজার যে পেজ নাম্বারে ক্লিক করবে, সেই পেজের ৬টি প্রোডাক্ট সামনে আসবে */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-center flex items-center justify-center transition-all border ${currentPage === pageNum
                          ? 'bg-stone-950 text-white border-stone-950 font-bold shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page Arrow */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ShopPage;