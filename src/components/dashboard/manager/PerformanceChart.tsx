'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// 🚀 🟢 আপনার তৈরি করা গ্লোবাল ডেলিভারি গেট সার্ভিস এপিআই ইম্পোর্ট
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

interface GroupedChartData {
  name: string;   // মাসের নাম (e.g., Jan, Feb)
  earnings: number; // ঐ মাসের মোট Delivered রেভিনিউ সাম
}
interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // ডাইনামিক চার্ট ডাটা ও লোডিং স্টেটস
  const [chartData, setChartData] = useState<GroupedChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ⚡ ডাটাবেজ থেকে ডেলিভারি ডাটা এনে শুধুমাত্র "Delivered" আইটেমগুলো মাস ভিত্তিক সাম করার পাইপライン
  useEffect(() => {
    const processAnalyticsFlow = async () => {
      try {
        const rawDeliveries = await getAllDeliveriesFromBackend();

        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          // ১. ১২ মাসের জন্য একটি ইনিশিয়াল ডাইনামিক অবজেক্ট স্ট্রাকচার (মাসের অর্ডার ঠিক রাখার জন্য)
          const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          const monthlyAccumulator: { [key: string]: number } = {
            Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
            Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
          };

          // ২. শুধুমাত্র "Delivered" ডেটা ফিল্টার করে মাসের ম্যাট্রিক্সে সাম করা হচ্ছে ভাই
          rawDeliveries.forEach((item: any) => {
            const isDelivered = item.status?.trim().toLowerCase() === 'delivered';
            
            if (isDelivered && item.createdAt) {
              const orderDate = new Date(item.createdAt);
              const monthName = monthsOrder[orderDate.getMonth()]; //createdAt থেকে মাসের নাম জেনারেট
              
              const itemPrice = Number(item.price || 0);
              monthlyAccumulator[monthName] += itemPrice;
            }
          });

          // ৩. Recharts এর জন্য ডাটা রি-ম্যাপ করা (যে মাসগুলোতে আর্নিং আছে সেগুলোকে ক্রমানুসারে সাজানো)
          const formattedData: GroupedChartData[] = monthsOrder.map(month => ({
            name: month,
            earnings: monthlyAccumulator[month]
          }));

          // গ্রাফের ভিজ্যুয়াল ফ্লো সুন্দর রাখার জন্য কারেন্ট মাস পর্যন্ত ফিল্টার করতে পারেন অথবা পুরো বছরের ম্যাট্রিক্স রাখতে পারেন
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("❌ Failed to resolve dynamic monthly performance chart matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processAnalyticsFlow();
  }, []);

  return (
    <div className="xl:col-span-2 bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs space-y-4 min-h-[380px] flex flex-col justify-between">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-left">
          <h4 className="font-serif text-base text-stone-900 font-light">Revenue Performance Flow</h4>
          <p className="text-[11px] text-stone-400">Visual velocity curve of monthly catalog transactions.</p>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase flex items-center gap-1 bg-stone-50 px-2 py-1 border border-stone-100 rounded-sm self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-stone-950" /> Live Data Dynamic Sync
        </span>
      </div>
      
      {isLoading ? (
        /* ⏳ ডাটাবেজ প্রসেস হওয়ার আগ পর্যন্ত ক্যাটালগ গ্রাফের জন্য লোডার */
        <div className="w-full h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
          <p className="text-[11px] font-mono text-stone-400">Rendering live transaction curves...</p>
        </div>
      ) : (
        /* 🖥️ লাইভ ক্যালকুলেটেড মান্থলি এরিয়া চার্ট */
        <div className="w-full h-64 sm:h-72 text-[10px] font-mono pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
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
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Earnings']}
              />
              <Area type="monotone" dataKey="earnings" stroke="#1c1917" strokeWidth={1.5} fillOpacity={1} fill="url(#managerAnalyticsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
    </div>
  );
}