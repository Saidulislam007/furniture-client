'use client';

import React from 'react';
import { TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const globalRevenueData = [
  { month: 'Jan', revenue: 28000, platformCut: 5600 },
  { month: 'Feb', revenue: 35000, platformCut: 7000 },
  { month: 'Mar', revenue: 58000, platformCut: 11600 },
  { month: 'Apr', revenue: 49000, platformCut: 9800 },
  { month: 'May', revenue: 82000, platformCut: 16400 },
  { month: 'Jun', revenue: 104000, platformCut: 20800 },
];

export function PlatformRevenueChart() {
  return (
    <div className="bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="font-serif text-base sm:text-lg text-stone-900 font-light">Global Revenue Pipeline</h4>
          <p className="text-[11px] text-stone-400">Aggregated marketplace gross value transaction metrics.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono tracking-wider text-stone-600 uppercase flex items-center gap-1 bg-stone-50 px-2.5 py-1 border border-stone-100 rounded-sm">
            <TrendingUp className="w-3.5 h-3.5 text-stone-950" /> +24.3% YoY
          </span>
        </div>
      </div>

      {/* রেভিনিউ কুইক স্ট্যাটস */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-50">
        <div>
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest">Gross Marketplace Volume</p>
          <h5 className="text-xl sm:text-2xl font-light text-stone-950 mt-0.5">$356,000.00</h5>
        </div>
        <div>
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest">Platform Commission (20%)</p>
          <h5 className="text-xl sm:text-2xl font-light text-amber-700 mt-0.5">$71,200.00</h5>
        </div>
      </div>
      
      {/* রেসপন্সিভ চার্ট কন্টেইনার */}
      <div className="w-full h-60 sm:h-72 lg:h-80 text-[10px] font-mono pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={globalRevenueData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#78350f" stopOpacity={0.06}/>
                <stop offset="95%" stopColor="#78350f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
            <XAxis dataKey="month" stroke="#a8a29e" tickLine={false} axisLine={false} />
            <YAxis stroke="#a8a29e" tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '2px', color: '#fff', fontSize: '11px' }}
              labelStyle={{ fontFamily: 'monospace', color: '#a8a29e' }}
            />
            <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#1c1917" strokeWidth={1} fillOpacity={1} fill="url(#adminRevenueFill)" />
            <Area type="monotone" dataKey="platformCut" name="Platform Net" stroke="#b45309" strokeWidth={1.5} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}