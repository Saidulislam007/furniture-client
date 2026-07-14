'use client';

import React from 'react';
import { Layers, ShieldCheck, DollarSign } from 'lucide-react';

interface AdminSummaryCardsProps {
  totalManagers: number;
  totalApproved: number;
  totalRevenue?: number; // 🚀 🟢 অপশনাল করা হলো যাতে ডাটা দেরিতে আসলেও ক্র্যাশ না করে
}

export function AdminSummaryCards({ totalManagers, totalApproved, totalRevenue = 0 }: AdminSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
      
      {/* ১. ম্যানেজার কাউন্ট কার্ড */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Authorized Managers</p>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-900 font-mono">{totalManagers} Nodes</h3>
        </div>
        <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {/* ২. লাইভ ক্যাটালগ প্রোডাক্ট কাউন্ট কার্ড */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Total Live Catalog Spec</p>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-900 font-mono">{totalApproved} Nodes</h3>
        </div>
        <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* 🚀 🟢 ৩. সেফগার্ড প্রটেক্টেড রেভিনিউ কার্ড (?? 0 ব্যবহার করায় আর কখনো ক্র্যাশ করবে না ভাই) */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-xl flex items-center justify-between transition-all hover:shadow-xs sm:col-span-2 lg:col-span-1">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Total Live Revenue (Gross)</p>
          <h3 className="text-2xl sm:text-3xl font-light text-amber-800 font-mono">
            ${(totalRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="text-amber-700 p-2 bg-amber-50/50 border border-amber-100 rounded-sm">
          <DollarSign className="w-4 h-4" />
        </div>
      </div>

    </div>
  );
}