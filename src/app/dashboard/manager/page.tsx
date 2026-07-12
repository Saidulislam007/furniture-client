'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListedCard } from '@/components/dashboard/manager/ListedCard';
import { EarningsCard } from '@/components/dashboard/manager/EarningsCard';
import { PendingCard } from '@/components/dashboard/manager/PendingCard';
import { PerformanceChart } from '@/components/dashboard/manager/PerformanceChart';
import { HighDemandList } from '@/components/dashboard/manager/HighDemandList';

const analyticsData = [
  { name: 'Jan', earnings: 4200 },
  { name: 'Feb', earnings: 3800 },
  { name: 'Mar', earnings: 7100 },
  { name: 'Apr', earnings: 5400 },
  { name: 'May', earnings: 9200 },
  { name: 'Jun', earnings: 12400 },
];

const topRequestedFurniture = [
  { id: "tr-1", name: "Minimalist Lounge Chair", hits: 142, price: "$1,250.00", status: "Active" },
  { id: "tr-2", name: "Travertine Coffee Table", hits: 98, price: "$890.00", status: "Active" },
  { id: "tr-3", name: "Sleek Arc Pendant Light", hits: 64, price: "$410.00", status: "Hold" },
  { id: "tr-4", name: "Calacatta Credenza Set", hits: 41, price: "$2,100.00", status: "Active" }
];

export default function ManagerAnalyticsDashboard() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-10 w-full font-sans bg-stone-50/40 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-10">
        
        {/* ─── HEADER METADATA PANEL ─── */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-stone-950">Performance Overview</h3>
          <p className="text-[11px] sm:text-xs text-stone-950 mt-1">Real-time analytical metrics, revenue charts, and high-demand catalog nodes.</p>
        </div>

        {/* ─── 📊 QUICK METRICS ROW GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ListedCard count={24} />
          <EarningsCard amount={42100.00} />
          <PendingCard count={3} />
        </div>

        {/* ─── 📉 VISUAL ANALYTICS & HIGH-DEMAND MINI-LIST ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <PerformanceChart data={analyticsData} />
          <HighDemandList items={topRequestedFurniture} />
        </div>

      </motion.div>
    </main>
  );
}