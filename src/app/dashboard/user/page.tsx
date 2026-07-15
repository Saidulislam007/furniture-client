'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
// 🚀 Better-Auth সেশন ক্লায়েন্ট ইম্পোর্ট
import { authClient } from '@/lib/auth-client';
import { InvestmentCard } from '../../../components/dashboard/user/InvestmentCard';
import { ManifestCard } from '../../../components/dashboard/user/ManifestCard';
import { WalletCard } from '../../../components/dashboard/user/WalletCard';
import { InvestmentPieChart } from '@/components/dashboard/user/InvestmentPieChart';
const BACKEND_BASE_URL = process.env.BASE_URL ;
export default function OverviewPage() {
  // Better-Auth সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  // ⚡ লাইভ ডাটাবেজ মেট্রিকেস স্টেটস
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    activeManifests: 0,
    totalOrdersCount: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 📡 ডাটাবেজ থেকে ইউজারের রিয়েল ডাটা ম্যাট্রিক্স লোড করার পাইপলাইন
  useEffect(() => {
    const fetchUserOverviewMetrics = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // 🚀 আপনার এক্সপ্রেস ব্যাকএন্ডের ডিরেক্ট ইউজার ডেলিভারি/অর্ডার এপিআই হিট করা হচ্ছে ভাই
        const response = await fetch(`${BACKEND_BASE_URL}/api/v1/deliveries/${session.user.id}`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const userOrders = result.data;

          // ১. টোটাল ইনভেস্টমেন্ট সাম (ডেলিভারি হওয়া সব অর্ডারের প্রাইস যোগফল)
          const totalSum = userOrders.reduce((acc: number, order: any) => acc + Number(order.price || 0), 0);

          // ২. একটিভ ম্যানিফেস্ট (যেসব অর্ডারের স্ট্যাটাস এখনও Delivered হয় নাই)
          const activeCount = userOrders.filter((order: any) => order.status?.trim().toLowerCase() !== 'delivered').length;

          setMetrics({
            totalInvestment: totalSum,
            activeManifests: activeCount,
            totalOrdersCount: userOrders.length // ৩. টোটাল কতগুলো অর্ডার আছে তার কাউন্ট
          });
        }
      } catch (error) {
        console.error("❌ Failed to resolve dashboard overview metrics pipeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthPending) {
      fetchUserOverviewMetrics();
    }
  }, [session, isAuthPending]);

  // ⏳ সেশন বা ডাটা লোড হওয়ার আগ পর্যন্ত লাক্সারি স্কিন লোডার
  if (isAuthPending || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        <p className="font-mono text-xs text-stone-400">Synchronizing ledger overview...</p>
      </div>
    );
  }

  // ⚠️ সেশন না থাকলে সিকিউরিটি অ্যালার্ট নোড
  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-4 border border-dashed border-amber-300 bg-amber-50/50 rounded-sm text-xs font-mono text-amber-800 text-center">
        ❌ Security Access Warning: Authentication missing. Please log in to view account metrics.
      </div>
    );
  }

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        
        {/* Stat Configuration Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ১. লাইভ টোটাল ইনভেস্টমেন্ট কার্ড */}
          <InvestmentCard value={`$${metrics.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          
          {/* ২. লাইভ একটিভ ম্যানিফেস্ট কার্ড (ডেলিভারি পেন্ডিং অর্ডার সংখ্যা) */}
          <ManifestCard count={metrics.activeManifests} />
          
          {/* ৩. লাইভ টোটাল অর্ডার কার্ড */}
          <WalletCard totalOrders={metrics.totalOrdersCount} /> 

          <InvestmentPieChart/>

        </div>

      </motion.div>
    </main>
  );
}