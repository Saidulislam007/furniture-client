'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { ClearancePanel, PendingProduct } from '@/components/dashboard/admin/ClearancePanel';

// ইনিশিয়াল ডামি ডেটা প্রটেকশন সহ
const mockPendingProducts: PendingProduct[] = [
  { id: "NODE-883", name: "Calacatta Credenza Set", manager: "Imran Ahmed", price: 2100.00, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=150", timestamp: "2 hours ago" },
  { id: "NODE-912", name: "Sleek Arc Pendant Light", manager: "Zayan Khan", price: 410.00, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=150", timestamp: "5 hours ago" },
];

export default function AssetClearancePage() {
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>(mockPendingProducts);

  const handleClearanceOperation = (id: string, action: 'approve' | 'reject' | 'edit' | 'delete', reason?: string) => {
    if (action === 'approve') {
      alert(`Asset Node ${id} authorized & successfully published globally.`);
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } else if (action === 'reject') {
      alert(`Asset Node ${id} rejected. Reason logged: "${reason}"`);
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } else if (action === 'delete') {
      if(confirm("Permanently purge this spec request node?")) {
        setPendingProducts(prev => prev.filter(p => p.id !== id));
      }
    } else {
      alert(`Triggering specification modifier terminal for node ${id}`);
    }
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Isolated Section Header */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-stone-950 stroke-1" />Asset Clearance Pipeline
          </h3>
          <p className="text-xs text-stone-950 mt-1">Review pending items, manage catalog updates, or issue unpublish workflows.</p>
        </div>

        {/* 🚀 🟢 আপনার দেওয়া ClearancePanel কম্পোনেন্ট এখানে রেন্ডার হবে */}
        <div className="w-full bg-white border border-stone-200/60 rounded-sm shadow-xs">
          <ClearancePanel 
            products={pendingProducts} 
            onAction={handleClearanceOperation} 
          />
        </div>

      </motion.div>
    </main>
  );
}