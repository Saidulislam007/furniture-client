'use client';

import React, { useState, useEffect } from 'react';
import { Archive, Loader2 } from 'lucide-react';
// 🚀 🟢 আপনার তৈরি করা ফার্নিচার গেট সার্ভিস এপিআই ইম্পোর্ট (পাথ আপনার প্রজেক্ট অনুযায়ী ফিক্স করে নিবেন ভাই)
import { getAllFurniture } from '@/services/api/getFurniture'; 

export function ListedCard() {
  // লাইভ কাউন্টিং ও ইন্টারনাল লোডিং স্টেটস
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ⚡ ডাটাবেজ থেকে সমস্ত ফার্নিচারের ক্যাটালগ লেন্থ রি-ম্যাপ করার ইফেক্ট পাইপলাইন
  useEffect(() => {
    const fetchCatalogLength = async () => {
      try {
        const furnitureData = await getAllFurniture();
        
        if (furnitureData && Array.isArray(furnitureData)) {
          // 🚀 🟢 ডাটাবেজের সমস্ত উপাদানের মোট লেন্থ (Length) কাউন্ট সেটিং
          setTotalCount(furnitureData.length);
        }
      } catch (error) {
        console.error("❌ Failed to resolve total furniture catalog ledger:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogLength();
  }, []);

  return (
    <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm min-h-[140px]">
      
      {isLoading ? (
        /* ⏳ ডাটাবেজ থেকে ডাটা আসার আগ পর্যন্ত কার্ডের ভেতরের সিম্পল লোডার */
        <div className="w-full h-full flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          <span className="text-xs text-stone-400 font-mono ml-2">Counting catalog specs...</span>
        </div>
      ) : (
        /* 🖥️ লাইভ ডাটাবেজ ম্যাচড কাউন্টিং ইন্টারফেস */
        <>
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Total Furniture Listed</p>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">
              {totalCount} Units
            </h3>
            <p className="text-xs font-light text-stone-500">Active catalog repository specs</p>
          </div>
          <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
            <Archive className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </>
      )}

    </div>
  );
}