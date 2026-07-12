'use client';

import React from 'react';
import { motion } from 'framer-motion';
// 🚀 🟢 ১০০% ফিক্স: ৪ লেভেল ওপরে গিয়ে user ফোল্ডার থেকে প্রপারলি ইম্পোর্ট করা হলো
import { OrdersTable, Order } from '../../../../components/dashboard/user/OrdersTable';

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

export default function OrderHistoryPage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Order Registry History</h3>
        <OrdersTable orders={dummyOrders} />
      </motion.div>
    </main>
  );
}