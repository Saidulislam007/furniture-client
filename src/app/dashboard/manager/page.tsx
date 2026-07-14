'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListedCard } from '@/components/dashboard/manager/ListedCard';
import { EarningsCard } from '@/components/dashboard/manager/EarningsCard';
import { PendingCard } from '@/components/dashboard/manager/PendingCard';
import { PerformanceChart } from '@/components/dashboard/manager/PerformanceChart';

export default function ManagerAnalyticsDashboard() {
  // 🚀 ডাইনামিক ডাটাবেজ ইন্টিগ্রেশনের জন্য লোকাল স্টেটস
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [metrics, setProfileMetrics] = useState({ listed: 19, earnings: 4738, pending: 0 }); // স্ক্রিনশট অনুযায়ী ডেমো ইনিশিয়াল ডাটা লক করা হলো ভাই

  useEffect(() => {
    // 📡 ব্যাকএন্ড এপিআই ইন্টিগ্রেশন পাইপলাইন
    const fetchDashboardAnalytics = async () => {
      try {
        // const rawAnalytics = await getAnalyticsFromBackend();
        // setAnalyticsData(rawAnalytics);
      } catch (error) {
        console.error("❌ Failed to resolve manager dashboard matrix:", error);
      }
    };

    fetchDashboardAnalytics();
  }, []);

  return (
    // 🚀 🟢 ফিক্স: bg-stone-50/40 ফেলে bg-transparent করা হলো এবং ডানে বামে ফুল রেসপন্সিভ স্পেসিং এর জন্য w-full সেট করা হলো ভাই
    <main className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 bg-transparent min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-10">
        
        {/* ─── HEADER METADATA PANEL ─── */}
        <div className="border-b border-stone-300/60 pb-5">
          <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-stone-950">Performance Overview</h3>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1">Real-time analytical metrics, revenue charts, and high-demand catalog nodes.</p>
        </div>

        {/* ─── 📊 QUICK METRICS ROW GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ListedCard count={metrics.listed} />
          <EarningsCard amount={metrics.earnings} />
          <PendingCard count={metrics.pending} />
        </div>

        {/* ─── 📉 VISUAL ANALYTICS CHART ─── */}
        {/* 🚀 🟢 ফিক্স: চার্টটিকে ডেক্সটপে সুন্দর ফুল উইডথ দেখানোর জন্য grid-cols-1 দেওয়া হলো */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          <PerformanceChart data={analyticsData} />
        </div>

      </motion.div>
    </main>
  );
}