'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
// 🚀 Better-Auth সেশন ক্লায়েন্ট ইম্পোর্ট
import { authClient } from '@/lib/auth-client';
// 🚀 🟢 আপনার তৈরি করা গ্লোবাল ডেলিভারি গেট সার্ভিস এপিআই ইম্পোর্ট
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

export const InvestmentCard: React.FC = () => {
  // Better-Auth সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  // লাইভ ইনভেস্টমেন্ট ক্যালকুলেশন এবং লোডিং স্টেটস
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const computeLiveInvestment = async () => {
      // সেশন ডাটা না আসা পর্যন্ত বা ইউজার ভেরিফাইড না হলে পাইপলাইন স্কিপ করবে
      if (!session?.user?.id || !session?.user?.email || !session?.user?.name) {
        return;
      }

      try {
        setIsLoading(true);
        const rawDeliveries = await getAllDeliveriesFromBackend();

        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          const currentUserId = String(session.user.id).trim();
          const currentUserEmail = String(session.user.email).trim().toLowerCase();
          const currentUserName = String(session.user.name).trim().toLowerCase();

          // 🎯 ৪-লেয়ার স্ট্রিক্ট সেফগার্ড ফিল্টারিং ও সামিং পাইপলাইন
          const calculatedSum = rawDeliveries.reduce((accumulator: number, item: any) => {
            // ১. স্ট্যাটাস ভ্যালিডেশন
            const isDelivered = item.status?.trim().toLowerCase() === 'delivered';
            
            // ২. আইডি ম্যাচ (String বা ObjectId ম্যাচিং সেফগার্ড)
            const isIdMatched = item.userId && String(item.userId).trim() === currentUserId;
            
            // ৩. ইমেল ম্যাচ
            const isEmailMatched = item.userEmail && String(item.userEmail).trim().toLowerCase() === currentUserEmail;
            
            // ৪. নাম ম্যাচ
            const isNameMatched = item.userName && String(item.userName).trim().toLowerCase() === currentUserName;

            // চারটা কন্ডিশনই যদি ট্রু হয়, তবেই কেবল প্রাইস যোগ হবে ভাই!
            if (isDelivered && isIdMatched && isEmailMatched && isNameMatched) {
              return accumulator + Number(item.price || 0);
            }

            return accumulator;
          }, 0);

          setTotalInvestment(calculatedSum);
        }
      } catch (error) {
        console.error("❌ Failed to resolve client investment summation node:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthPending) {
      computeLiveInvestment();
    }
  }, [session, isAuthPending]);

  return (
    <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-sm flex items-start justify-between transition-all duration-300 hover:shadow-md min-h-[120px]">
      <div className="space-y-2 text-left">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-stone-400">
          Total Investment
        </p>
        
        {isAuthPending || isLoading ? (
          /* ⏳ ডাটাবেজ ক্যালকুলেশন রানিং থাকা অবস্থায় মিনিমাল টেক্সট লোডার */
          <div className="flex items-center gap-1.5 py-1">
            <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
            <span className="text-xs font-mono text-stone-400">Summing assets...</span>
          </div>
        ) : (
          /* 🖥️ লাইভ ক্যালকুলেটেড কারেন্সি অ্যামাউন্ট ডিসপ্লে */
          <h3 className="text-3xl font-light font-sans tracking-tight text-stone-900 tabular-nums">
            ${totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        )}

        <p className="text-xs font-sans font-light text-stone-500">
          Cumulative total orders
        </p>
      </div>
      
      <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </div>
    </div>
  );
};