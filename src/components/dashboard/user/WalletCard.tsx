'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface WalletCardProps {
  totalOrders: number;
}

export const WalletCard: React.FC<WalletCardProps> = ({ totalOrders }) => {
  return (
    <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-sm flex items-start justify-between transition-all duration-300 hover:shadow-md">
      <div className="space-y-2">
        {/* Subtitle / Label */}
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-stone-400">
          Total Orders
        </p>
        
        {/* 🚀 🟢 ফিক্স: নাম্বার ভ্যালু রেন্ডারিং ব্লক (যা আগে মিসিং ছিল) */}
        <h3 className="text-3xl font-light font-sans tracking-tight text-stone-900 tabular-nums py-0.5">
          {totalOrders}
        </h3>
        
        {/* Context / Caption */}
        <p className="text-xs font-sans font-light text-stone-500">
          Lifetime placement metrics
        </p>
      </div>
      
      {/* Icon Frame */}
      <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center">
        <ShoppingBag className="w-4 h-4" />
      </div>
    </div>
  );
};