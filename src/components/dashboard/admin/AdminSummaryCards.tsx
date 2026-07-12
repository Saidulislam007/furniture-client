'use client';

import React from 'react';
import { Layers, ShieldCheck, Activity } from 'lucide-react';

interface AdminSummaryCardsProps {
  totalManagers: number;
  totalApproved: number;
  liveQueue: number;
}

export function AdminSummaryCards({ totalManagers, totalApproved, liveQueue }: AdminSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      
      <div className="bg-white border border-stone-200/60 p-5 rounded-sm flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Authorized Managers</p>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-900 font-mono">{totalManagers} Nodes</h3>
        </div>
        <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm"><ShieldCheck className="w-4 h-4" /></div>
      </div>

      <div className="bg-white border border-stone-200/60 p-5 rounded-sm flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Total Live Catalog Spec</p>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-900 font-mono">{totalApproved} Nodes</h3>
        </div>
        <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm"><Layers className="w-4 h-4" /></div>
      </div>

      <div className="bg-white border border-stone-200/60 p-5 rounded-sm flex items-center justify-between transition-all hover:shadow-xs sm:col-span-2 lg:col-span-1">
        <div className="space-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">Queue Operations Pressure</p>
          <h3 className="text-2xl sm:text-3xl font-light text-amber-800 font-mono">{liveQueue} Awaiting</h3>
        </div>
        <div className="text-amber-700 p-2 bg-amber-50/50 border border-amber-100 rounded-sm"><Activity className="w-4 h-4 animate-pulse" /></div>
      </div>

    </div>
  );
}