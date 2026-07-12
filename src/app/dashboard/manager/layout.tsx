'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Truck, 
  User, 
  Boxes, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// 🚀 🟢 ম্যানেজার মেনু আইটেমস অ্যারে
const managerMenuItems = [
  { name: 'Overview', path: '/dashboard/manager', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Add Product Node', path: '/dashboard/manager/add-product', icon: <PlusCircle className="w-4 h-4" /> },
  { name: 'Deliveries Tracker', path: '/dashboard/manager/deliveries', icon: <Truck className="w-4 h-4" /> }, 
  { name: 'Profile Center', path: '/dashboard/manager/profile', icon: <User className="w-4 h-4" /> },
  { name: 'Inventory Ledger', path: '/dashboard/manager/inventory', icon: <Boxes className="w-4 h-4" /> },
];

export default function ManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🚀 🟢 মোবাইল স্লাইডার স্টেট

  // Hydration Error এড়ানোর জন্য মাউন্ট স্টেট চেক
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // রুট চেঞ্জ হলে মোবাইল ড্রয়ার অটোমেটিক বন্ধ হবে
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return <div className="min-h-screen bg-stone-50/60 pt-20">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex pt-32 md:pt-20 relative">
      
      {/* 📱 🚀 🟢 MOBILE TOP NAVIGATION PANEL */}
      <div className="w-full h-12 bg-white border-b border-stone-200/80 fixed top-20 left-0 z-40 flex items-center px-4 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-1 text-stone-600 hover:text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold focus:outline-none min-h-[40px]"
        >
          <Menu className="w-4 h-4" /> Account Menu
        </button>
      </div>

      {/* 📱 🚀 🟢 MOBILE DRAWER SLIDE-OVER PANEL WITH FRAMER-MOTION */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* ব্লার ব্যাকড্রপ লেয়ার */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.4 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden backdrop-blur-xs"
            />
            
            {/* ড্রয়ার কন্টেইনার */}
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-20 left-0 h-[calc(100vh-80px)] w-72 bg-white z-50 p-6 flex flex-col justify-between border-r border-stone-200 shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-base tracking-wide text-stone-950 font-light">Studio Catalog</h2>
                    <span className="text-[9px] font-mono tracking-widest text-amber-600 font-semibold uppercase">Manager Panel</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-400 hover:text-stone-900 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {managerMenuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`w-full h-10 px-3 text-xs uppercase tracking-wider font-medium rounded-sm flex items-center gap-3 transition-all duration-200 ${
                          isActive
                            ? 'bg-stone-950 text-white shadow-xs'
                            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono flex items-center gap-1.5 select-none">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400" /> SECURE CONTROL NODE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 🖥️ SIDEBAR CHASSIS (Desktop and Laptop Screen Node) */}
      <aside className="hidden md:flex sticky top-20 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200/60 z-40 p-6 flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-lg tracking-wide text-stone-950 font-light">Studio Catalog</h2>
            <span className="text-[9px] font-mono tracking-widest text-amber-600 font-semibold uppercase">Manager Panel</span>
          </div>
          
          {/* 🔗 ডাইনামিক রাউট ম্যাপ সেকশন */}
          <nav className="space-y-1">
            {managerMenuItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`w-full h-10 px-3 text-xs uppercase tracking-wider font-medium rounded-sm flex items-center gap-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer Meta info */}
        <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono flex items-center gap-1.5 select-none">
          <ShieldAlert className="w-3.5 h-3.5 text-stone-400" /> SECURE CONTROL NODE
        </div>
      </aside>
      
      {/* 🖥️ MAIN CONTENT RENDER NODE */}
      <div className="flex-1 w-full relative px-0 sm:p-0">{children}</div>
    </div>
  );
}