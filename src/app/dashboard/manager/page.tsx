'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Archive, DollarSign, Clock, TrendingUp, Armchair, ChevronRight } from 'lucide-react';

// 📈 Recharts Components Import
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// চার্টের জন্য ৬ মাসের মিনিমালিস্ট আর্নিং ডেটা Manifest
const analyticsData = [
  { name: 'Jan', earnings: 4200 },
  { name: 'Feb', earnings: 3800 },
  { name: 'Mar', earnings: 7100 },
  { name: 'Apr', earnings: 5400 },
  { name: 'May', earnings: 9200 },
  { name: 'Jun', earnings: 12400 },
];

// মোস্ট রিকোয়েস্টেড ফার্নিচার আর্কিটেকচারাল নোড ডেটা
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
          <p className="text-[11px] sm:text-xs text-stone-400 mt-1">Real-time analytical metrics, revenue charts, and high-demand catalog nodes.</p>
        </div>

        {/* ─── 📊 QUICK METRICS ROW GRID (100% RESPONSIVE) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* কার্ড ১: Total Furniture Listed */}
          <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Total Furniture Listed</p>
              <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">24 Units</h3>
              <p className="text-xs font-light text-stone-500">Active catalog repository specs</p>
            </div>
            <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
              <Archive className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* কার্ড ২: Total Earnings */}
          <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Total Earnings</p>
              <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">$42,100.00</h3>
              <p className="text-xs font-light text-stone-500">Marketplace aggregate revenue index</p>
            </div>
            <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
              <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* কার্ড ৩: Active Pending Requests */}
          <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Active Pending Requests</p>
              <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">3 Nodes</h3>
              <p className="text-xs font-light text-stone-500">Awaiting clearance from governance nodes</p>
            </div>
            <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
              <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

        </div>

        {/* ─── 📉 VISUAL ANALYTICS & HIGH-DEMAND MINI-LIST GRID ROW ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ১. Recharts Area Chart Box (Col-span 2 on Desktops) */}
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
            
            {/* Chart Area Container Node */}
            <div className="w-full h-64 sm:h-72 text-[10px] font-mono pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
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

          {/* ২. Mini-List: Most Requested Furniture Manifests */}
          <div className="bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs flex flex-col justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-serif text-base text-stone-900 font-light">High-Demand Assets</h4>
              <p className="text-[11px] text-stone-400">Top architecture units accumulating client requests.</p>
            </div>

            {/* Iteration Node List */}
            <div className="divide-y divide-stone-100 flex-1 flex flex-col justify-center">
              {topRequestedFurniture.map((furniture) => (
                <div key={furniture.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-stone-50 border border-stone-100 rounded-sm text-stone-400 group-hover:text-stone-950 group-hover:bg-stone-100 transition-colors">
                      <Armchair className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-stone-900 tracking-wide transition-colors group-hover:text-stone-950">{furniture.name}</h5>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">{furniture.price}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-medium text-stone-950 bg-stone-50 px-2 py-0.5 border border-stone-100 rounded-sm">
                      {furniture.hits} hits
                    </span>
                    <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-stone-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>
    </main>
  );
}