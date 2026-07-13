'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
// 🚀 🟢 আপনার তৈরি করা গ্লোবাল ডেলিভারি গেট সার্ভিস এপিআই ইম্পোর্ট
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

export function EarningsCard() {
  // লাইভ আর্নিংস ক্যালকুলেশন ও লোডিং স্টেটস
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ⚡ ডাটাবেজ থেকে ডেলিভারি ডাটা এনে শুধুমাত্র "Delivered" আইটেমের প্রাইস সাম (Sum) করার পাইপলাইন
  useEffect(() => {
    const calculateLiveEarnings = async () => {
      try {
        const rawDeliveries = await getAllDeliveriesFromBackend();

        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          // 🎯 ফিল্টারিং এবং সামেশন লজিক
          const aggregateRevenue = rawDeliveries
            .filter((item: any) => item.status?.trim().toLowerCase() === 'delivered') // শুধু Delivered স্টেট
            .reduce((sum: number, item: any) => {
              // প্রোডাক্ট প্রাইস গ্র্যাব করা হচ্ছে (প্রয়োজন হলে item.deliveryFee ও প্লাস করতে পারেন ভাই)
              const itemPrice = Number(item.price || 0);
              return sum + itemPrice;
            }, 0);

          setTotalEarnings(aggregateRevenue);
        }
      } catch (error) {
        console.error("❌ Failed to resolve dynamic marketplace earnings matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateLiveEarnings();
  }, []);

  return (
    <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm min-h-[140px]">
      
      {isLoading ? (
        /* ⏳ ডাটাবেজ সামেশন প্রসেস হওয়ার আগ পর্যন্ত ক্লিন স্পিনার */
        <div className="w-full h-full flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          <span className="text-xs text-stone-400 font-mono ml-2">Aggregating revenue...</span>
        </div>
      ) : (
        /* 🖥️ লাইভ ক্যালকুলেটেড রেভিনিউ আর্নিংস ইন্টারফেস */
        <>
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Total Earnings</p>
            <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">
              ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs font-light text-stone-500">Marketplace aggregate revenue index</p>
          </div>
          <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
            <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        </>
      )}

    </div>
  );
}