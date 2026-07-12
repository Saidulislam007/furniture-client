'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  earnings: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="xl:col-span-2 bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h4 className="font-serif text-base text-stone-900 font-light">Revenue Performance Flow</h4>
          <p className="text-[11px] text-stone-400">Visual velocity curve of monthly catalog transactions.</p>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase flex items-center gap-1 bg-stone-50 px-2 py-1 border border-stone-100 rounded-sm self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-stone-950" /> +18.4% Net Margin
        </span>
      </div>
      
      <div className="w-full h-64 sm:h-72 text-[10px] font-mono pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="managerAnalyticsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1c1917" stopOpacity={0.06}/>
                <stop offset="95%" stopColor="#1c1917" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
            <XAxis dataKey="name" stroke="#a8a29e" tickLine={false} axisLine={false} />
            <YAxis stroke="#a8a29e" tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '2px', color: '#fff', fontSize: '11px' }}
              labelStyle={{ fontFamily: 'monospace', color: '#a8a29e' }}
            />
            <Area type="monotone" dataKey="earnings" stroke="#1c1917" strokeWidth={1.5} fillOpacity={1} fill="url(#managerAnalyticsFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}