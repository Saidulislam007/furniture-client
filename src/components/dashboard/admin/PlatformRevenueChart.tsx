'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// 🚀 আপনার প্রজেক্টের অফিশিয়াল গ্লোবাল ডেলিভারি গেট সার্ভিস ইম্পোর্ট করা হলো ভাই
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

interface DeliveryItem {
  _id: string;
  price: number;
  status: string;
  createdAt: string;
}

interface MonthlyChartNode {
  month: string;
  revenue: number;
  platformCut: number;
}

export function PlatformRevenueChart() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 📡 ডাটাবেজ থেকে লাইভ ডেলিভারি ডাটা পুলিং
  useEffect(() => {
    const loadLiveLogisticsRevenue = async () => {
      try {
        const rawData = await getAllDeliveriesFromBackend();
        if (rawData && Array.isArray(rawData)) {
          setDeliveries(rawData);
        }
      } catch (error) {
        console.error("❌ Failed to synchronize master fiscal pipeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLiveLogisticsRevenue();
  }, []);

  // 🎯 🚀 আলটিমেট ম্যাথমেটিক্যাল ক্যালকুলেশন পাইপলাইন (Delivered কন্ডিশন গার্ড সহ)
  const revenueMetrics = useMemo(() => {
    // ১. শুধুমাত্র "Delivered" প্রোডাক্টগুলো ফিল্টার আউট
    const deliveredItems = deliveries.filter(
      item => item.status?.trim().toLowerCase() === 'delivered'
    );

    // ২. মোট গ্রস ভলিউম সামেশন (Gross Marketplace Volume)
    const grossVolume = deliveredItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
    
    // ৩. এডমিন বা প্ল্যাটফর্মের জন্য ২০% নেট কাট
    const platformCommission = grossVolume * 0.20;

    // ৪. ক্রোনোলজিক্যাল মান্থলি চার্ট নোড স্ট্রাকচার মেকার
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // প্রতি মাসের ডাটা অবজেক্ট তৈরি
    const monthlyMap: { [key: string]: number } = {};
    monthNames.forEach(m => { monthlyMap[m] = 0; });

    deliveredItems.forEach(item => {
      if (item.createdAt) {
        const dateNode = new Date(item.createdAt);
        const monthLabel = monthNames[dateNode.getMonth()];
        if (monthLabel) {
          monthlyMap[monthLabel] += Number(item.price || 0);
        }
      }
    });

    // Recharts ফ্রেমওয়ার্ক ফরম্যাটে অ্যারে ম্যাপিং ভাই
    const chartData: MonthlyChartNode[] = monthNames.map(month => ({
      month,
      revenue: monthlyMap[month],
      platformCut: monthlyMap[month] * 0.20 // প্রতি মাসের ২০% নেট
    }));

    return {
      grossVolume,
      platformCommission,
      chartData
    };
  }, [deliveries]);

  if (isLoading) {
    return (
      <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs h-96 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        <p className="font-mono text-[11px] text-stone-400">Aggregating Global Fiscal Matrix...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div className="space-y-0.5">
          <h4 className="font-serif text-base sm:text-lg text-stone-900 font-light">Global Revenue Pipeline</h4>
          <p className="text-[11px] text-stone-400">Aggregated marketplace gross value transaction metrics.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono tracking-wider text-stone-600 uppercase flex items-center gap-1 bg-stone-50 px-2.5 py-1 border border-stone-100 rounded-sm">
            <TrendingUp className="w-3.5 h-3.5 text-stone-950" /> Live Synchronized
          </span>
        </div>
      </div>

      {/* 📊 লাইভ ডাইনামিক রেভিনিউ কুইক স্ট্যাটাস নোডস */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-50 text-left">
        <div>
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest">Gross Marketplace Volume</p>
          <h5 className="text-xl sm:text-2xl font-light text-stone-950 mt-0.5">
            ${revenueMetrics.grossVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
        </div>
        <div>
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest">Platform Commission (20%)</p>
          <h5 className="text-xl sm:text-2xl font-light text-amber-700 mt-0.5">
            ${revenueMetrics.platformCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
        </div>
      </div>
      
      {/* রেসপন্সিভ চার্ট কন্টেইনার */}
      <div className="w-full h-60 sm:h-72 lg:h-80 text-[10px] font-mono pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueMetrics.chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
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
            <Area type="monotone" dataKey="platformCut" name="Platform Net (20%)" stroke="#b45309" strokeWidth={1.5} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}