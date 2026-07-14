'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

// 🚀 🟢 সাব-কম্পোনেন্টসমূহ ইম্পোর্ট (Absolute Path)
import { AdminSummaryCards } from '@/components/dashboard/admin/AdminSummaryCards';
import { PlatformRevenueChart } from '@/components/dashboard/admin/PlatformRevenueChart';

// 🚀 🟢 অফিসিয়াল এপিআই সার্ভিসসমূহ ইম্পোর্ট
import { getAllUsers } from '@/services/api/getUsers';
import { getAllFurniture } from '@/services/api/getFurniture';
// 🚀 🟢 নতুন ডেলিভারি ব্যাকএন্ড গেট সার্ভিস ইম্পোর্ট করা হলো ভাই
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

// টাইপ ডেফিনিশন (মঙ্গোডিবি অবজেক্ট স্কিমা এলাইনমেন্ট)
interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user'; 
}

export default function AdminCoreDashboard() {
  // 🎯 🚀 লাইভ স্টেটস (কোনো রকম ডামী কন্টেন্ট ছাড়া একদম ফ্রেশ ভাই)
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [publishedCount, setPublishedCount] = useState<number>(0);
  
  // 🚀 🟢 লাইভ রেভিনিউ নোড স্টেট
  const [liveRevenue, setLiveRevenue] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoreConsoleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 📡 ১. এপিআই থেকে সব ইউজার ডাটা লোড
        const rawUsers = await getAllUsers();
        if (rawUsers && Array.isArray(rawUsers)) {
          setUsers(rawUsers);
        }

        // 📡 ২. এপিআই থেকে ফার্নিচার ডাটা নিয়ে এসে লাইভ পাবলিশড কাউন্ট ফিল্টার
        const rawFurniture = await getAllFurniture();
        if (rawFurniture && Array.isArray(rawFurniture)) {
          const publishedItems = rawFurniture.filter(item => item.status === 'Published');
          setPublishedCount(publishedItems.length);
        }

        // 📡 ৩. 🟢 ডাইনামিক ডেলিভারি ডাটা ফেচ করে শুধুমাত্র DELIVERED গুলোর প্রাইস সামেশন লক করা হলো ভাই
        const rawDeliveries = await getAllDeliveriesFromBackend();
        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          const totalDeliveredRevenue = rawDeliveries
            .filter((item: any) => item.status?.trim().toLowerCase() === 'delivered')
            .reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);
          
          setLiveRevenue(totalDeliveredRevenue);
        }

      } catch (err: any) {
        console.error("❌ Failed to resolve admin core metrics pipeline:", err);
        setError("Failed to synchronize central system nodes.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCoreConsoleData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex items-center justify-center animate-pulse">
        <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">ATELIER</p>
      </div>
    );
  }

  return (
    <main className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 min-h-screen bg-transparent">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8 w-full">
        
        {/* GLOBAL PLATFORM HEADER METADATA */}
        <div className="border-b border-stone-300/60 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div className="min-w-0 text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
              <Terminal className="w-5 h-5 sm:w-6 h-6 text-stone-950 stroke-1 shrink-0" /> Admin Root Console
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-normal">Global platform oversight, real-time fiscal matrix charts, and role execution nodes.</p>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white bg-red-700 border border-red-800 px-3 py-1 rounded-sm font-semibold self-start sm:self-auto shrink-0 select-none">
            Root Authority Active
          </span>
        </div>

        {error ? (
          <div className="w-full py-8 text-center text-red-800 font-mono text-xs uppercase tracking-wider">
            {error}
          </div>
        ) : (
          <>
            {/* 📊 QUICK METRICS STATS GRID */}
            {/* 🚀 🟢 ফিক্স: ৩ নম্বর প্রপে liveQueue এর জায়গায় সরাসরি লাইভ রেভিনিউ ভ্যালুটি পাস করা হলো ভাই */}
            <div className="w-full overflow-hidden">
              <AdminSummaryCards 
                totalManagers={users.filter(u => u.role === 'manager').length}
                totalApproved={publishedCount}
                totalRevenue={liveRevenue}
              />
            </div>

            {/* ─── 📉 VISUAL ANALYTICS ROW GRID ─── */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8 w-full">
              <div className="w-full overflow-hidden">
                <PlatformRevenueChart />
              </div>
            </div>
          </>
        )}

      </motion.div>
    </main>
  );
}