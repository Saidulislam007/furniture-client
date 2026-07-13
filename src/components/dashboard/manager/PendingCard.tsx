'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
// 🚀 🟢 আপনার তৈরি করা ফার্নিচার গেট সার্ভিস এপিআই ইম্পোর্ট
import { getAllFurniture } from '@/services/api/getFurniture'; 

export function PendingCard() {
  // লাইভ পেন্ডিং কাউন্টিং ও ইন্টারনাল লোডিং স্টেটস
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ⚡ ডাটাবেজ থেকে ক্যাটালগ ডাটা এনে শুধুমাত্র "Pending" আইটেমের লেন্থ কাউন্ট করার পাইপলাইন
  useEffect(() => {
    const fetchPendingCatalogCount = async () => {
      try {
        const furnitureData = await getAllFurniture();
        
        if (furnitureData && Array.isArray(furnitureData)) {
          // 🎯 ফিল্টারিং মেকানিজম: শুধুমাত্র status === 'Pending' ডাটা আলাদা করা হচ্ছে
          const pendingItems = furnitureData.filter(
            (item: any) => item.status?.trim().toLowerCase() === 'pending'
          );

          setPendingCount(pendingItems.length);
        }
      } catch (error) {
        console.error("❌ Failed to resolve pending furniture catalog registry:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCatalogCount();
  }, []);

  return (
    <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm sm:col-span-2 lg:col-span-1 min-h-[140px]">
      
      {isLoading ? (
        /* ⏳ ডাটাবেজ ফিল্টারিং প্রসেস কমপ্লিট হওয়ার আগ পর্যন্ত ক্লিন স্পিনার */
        <div className="w-full h-full flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          <span className="text-xs text-stone-400 font-mono ml-2">Filtering pending operations...</span>
        </div>
      ) : (
        /* 🖥️ লাইভ ফিল্টারড পেন্ডিং কাউন্ট ইন্টারফেস */
        <>
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Active Pending Requests</p>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">
              {pendingCount} Nodes
            </h3>
            <p className="text-xs font-light text-stone-500">Awaiting clearance from governance nodes</p>
          </div>
          <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </>
      )}

    </div>
  );
}