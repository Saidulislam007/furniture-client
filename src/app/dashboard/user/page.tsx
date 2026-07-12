'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InvestmentCard } from '../../../components/dashboard/user/InvestmentCard';
import { ManifestCard } from '../../../components/dashboard/user/ManifestCard';
import { WalletCard } from '../../../components/dashboard/user/WalletCard';
import { OrdersTable, Order } from '../../../components/dashboard/user/OrdersTable';

// 📡 ডামি ডাটাবেজ (এখানে ২টি অর্ডার আছে, তাই টোটাল অর্ডারে ২ দেখাবে)
const dummyOrders: Order[] = [
  {
    id: "ATL-9842",
    date: "July 08, 2026",
    status: "processing",
    total: 1250.00,
    items: [{ id: "p1", title: "Minimalist Lounge Chair", quantity: 1, price: 1250.00 }]
  },
  {
    id: "ATL-7621",
    date: "June 24, 2026",
    status: "delivered",
    total: 340.00,
    items: [{ id: "p2", title: "Contemporary Ceramic Vase", quantity: 2, price: 170.00 }]
  }
];

export default function OverviewPage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        
        {/* Stat Configuration Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ১. টোটাল ইনভেস্টমেন্ট কার্ড */}
          <InvestmentCard value="$1,590.00" />
          
          {/* ২. একটিভ ম্যানিফেস্ট কার্ড (যা ১টি একটিভ দেখাবে) */}
          <ManifestCard count={dummyOrders.filter(o => o.status !== 'delivered').length} />
          
          {/* 🚀 ৩. টোটাল অর্ডার কার্ড (dummyOrders.length পাস করা হলো, যা ২ দেখাবে) */}
          <WalletCard totalOrders={dummyOrders.length} /> 

        </div>

        {/* Recent Orders Snippet */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-light tracking-wide text-stone-950">Recent Spaces Manifest</h3>
          <OrdersTable orders={dummyOrders.slice(0, 3)} />
        </div>

      </motion.div>
    </main>
  );
}