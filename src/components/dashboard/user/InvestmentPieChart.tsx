'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, PieChart as ChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { authClient } from '@/lib/auth-client';
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';

// 🎨 আপনার লাক্সারি থিমের সাথে মিল রেখে ৫টি সম্পূর্ণ আলাদা এবং প্রফেশনাল কালার কোড ভাই
const COLORS = ['#1c1917', '#44403c', '#78716c', '#a8a29e', '#d6d3d1'];

interface ChartDataNode {
  name: string;
  value: number;
}

export const InvestmentPieChart: React.FC = () => {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [chartData, setChartData] = useState<ChartDataNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const computeCategoryDistribution = async () => {
      if (!session?.user?.id || !session?.user?.email || !session?.user?.name) {
        return;
      }

      try {
        setIsLoading(true);
        const rawDeliveries = await getAllDeliveriesFromBackend();

        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          const currentUserId = String(session.user.id).trim();
          const currentUserEmail = String(session.user.email).trim().toLowerCase();
          const currentUserName = String(session.user.name).trim().toLowerCase();

          const productMap: { [key: string]: number } = {};

          rawDeliveries.forEach((item: any) => {
            const isDelivered = item.status?.trim().toLowerCase() === 'delivered';
            const isIdMatched = item.userId && String(item.userId).trim() === currentUserId;
            const isEmailMatched = item.userEmail && String(item.userEmail).trim().toLowerCase() === currentUserEmail;
            const isNameMatched = item.userName && String(item.userName).trim().toLowerCase() === currentUserName;

            if (isDelivered && isIdMatched && isEmailMatched && isNameMatched) {
              // 🎯 ফিক্স: ডাটাবেজের যেকোনো একটি নাম ফিল্ড (productName, title, category) খুঁজে বের করবে
              const rawName = item.productName || item.title || item.category || "Curated Asset";

              // নামটিকে সুন্দরভাবে ট্রিম করে নিচ্ছি ভাই
              const formattedName = rawName.trim();
              const price = Number(item.price || 0);

              // প্রোডাক্ট বা ক্যাটাগরি অনুযায়ী প্রাইস যোগ করা হচ্ছে ভাই
              productMap[formattedName] = (productMap[formattedName] || 0) + price;
            }
          });

          // Recharts এর জন্য ডাটা অ্যারে ফরম্যাটে রূপান্তর
          const formattedChartData: ChartDataNode[] = Object.keys(productMap).map((key) => ({
            name: key,
            value: productMap[key],
          }));

          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error("❌ Failed to resolve client investment pie chart node:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthPending) {
      computeCategoryDistribution();
    }
  }, [session, isAuthPending]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md min-h-[400px] w-full"
    >
      <div className="flex items-start justify-between border-b border-stone-100 pb-4 mb-4">
        <div className="space-y-1 text-left">
          <h4 className="text-base font-serif font-light text-stone-900">
            Investment Distribution
          </h4>
          <p className="text-[10px] font-sans font-light tracking-widest text-stone-400 uppercase mt-0.5">
            Asset Breakdown
          </p>
        </div>
        <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center shrink-0">
          <ChartIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center min-h-[240px]">
        {isAuthPending || isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <span className="text-xs font-mono text-stone-400">Analyzing distribution...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-stone-400 text-xs font-sans font-light py-10">
            No active delivered assets found to map.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `$${Number(value ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`,
                  "Investment",
                ]}
              />
              <Legend
                iconSize={8}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '10px', fontFamily: 'sans-serif', paddingTop: '15px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="border-t border-stone-100 pt-3 mt-4 text-left">
        <p className="text-xs font-sans font-light text-stone-500">
          Visual analysis based on verified logistics metrics.
        </p>
      </div>
    </motion.div>
  );
};