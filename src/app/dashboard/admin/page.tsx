'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

// 🚀 🟢 সাব-কম্পোনেন্টসমূহ ইম্পোর্ট (Absolute Path)
import { AdminSummaryCards } from '@/components/dashboard/admin/AdminSummaryCards';
import { PlatformRevenueChart } from '@/components/dashboard/admin/PlatformRevenueChart';
import { PendingProduct } from '@/components/dashboard/admin/ClearancePanel';
import { PlatformUser } from '@/components/dashboard/admin/RoleManagement';

const mockPendingProducts: PendingProduct[] = [
  { id: "NODE-883", name: "Calacatta Credenza Set", manager: "Imran Ahmed", price: 2100.00, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=150", timestamp: "2 hours ago" },
  { id: "NODE-912", name: "Sleek Arc Pendant Light", manager: "Zayan Khan", price: 410.00, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=150", timestamp: "5 hours ago" },
];

const mockPlatformUsers: PlatformUser[] = [
  { id: "USR-01", name: "Imran Ahmed", email: "imran.hero@digitools.com", role: "Manager", hasWriteAccess: true },
  { id: "USR-02", name: "Zayan Khan", email: "zayan.design@digitools.com", role: "Manager", hasWriteAccess: false },
  { id: "USR-03", name: "Tasnim Rahman", email: "tasnim.dev@gmail.com", role: "User", hasWriteAccess: false },
  { id: "USR-04", name: "Alexandre Dupont", email: "dupont.alex@yahoo.com", role: "User", hasWriteAccess: true },
];

export default function AdminCoreDashboard() {
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>(mockPendingProducts);
  const [users, setUsers] = useState<PlatformUser[]>(mockPlatformUsers);

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-10 w-full font-sans bg-stone-50/40 min-h-screen box-border overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8 w-full">
        
        {/* GLOBAL PLATFORM HEADER METADATA (100% Responsive Layout) */}
        <div className="border-b border-stone-200/60 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div className="min-w-0">
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
              <Terminal className="w-5 h-5 sm:w-6 h-6 text-stone-950 stroke-1 shrink-0" /> Admin Root Console
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-950 mt-0.5 leading-normal">Global platform oversight, real-time fiscal matrix charts, and role execution nodes.</p>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white bg-red-700/90 border border-red-800 px-3 py-1 rounded-xs font-semibold self-start sm:self-auto shrink-0 select-none">
            Root Authority Active
          </span>
        </div>

        {/* 📊 QUICK METRICS STATS GRID */}
        <div className="w-full overflow-hidden">
          <AdminSummaryCards 
            totalManagers={users.filter(u => u.role === 'Manager').length}
            totalApproved={48}
            liveQueue={pendingProducts.length}
          />
        </div>

        {/* ─── 📉 VISUAL ANALYTICS ROW GRID (Fully Adaptive) ─── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 w-full">
          <div className="xl:col-span-2 w-full overflow-hidden">
            <PlatformRevenueChart />
          </div>
        </div>

      </motion.div>
    </main>
  );
}