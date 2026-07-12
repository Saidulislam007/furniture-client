'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Heart, User, HelpCircle, Menu, X, Star } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 🚀 🟢 হাইড্রেশন এরর এড়াতে মাউন্ট চেক করা হলো
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 📡 ডাইনামিক রাউট পাথ কনফিগারেশন
  const menuItems = [
  { name: 'Overview', path: '/dashboard/user', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Order History', path: '/dashboard/user/orders', icon: <ShoppingBag className="w-4 h-4" /> },
  { name: 'My Cart', path: '/dashboard/user/cart', icon: <Heart className="w-4 h-4" /> },
  { name: 'Product Reviews', path: '/dashboard/user/reviews', icon: <Star className="w-4 h-4" /> }, // 🚀 🟢 নতুন রিভিউ রাউট অ্যাড করা হলো
  { name: 'Profile Center', path: '/dashboard/user/profile', icon: <User className="w-4 h-4" /> },
  { name: 'Concierge Support', path: '/dashboard/user/support', icon: <HelpCircle className="w-4 h-4" /> },
];

  // প্রথম লোডে সার্ভার ও ক্লায়েন্টকে সেম এইচটিএমএল আউটপুট দিতে কম্পোনেন্ট হোল্ড করা
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-stone-50/60 text-stone-900 font-sans flex pt-20 relative">
        <div className="flex-1 w-full relative">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex pt-20 relative">
      
      {/* 📱 Mobile Top Navigation Panel */}
      <div className="w-full h-12 bg-white border-b border-stone-200 fixed top-20 left-0 z-30 flex items-center px-4 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-1 text-stone-600 hover:text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold focus:outline-none"
        >
          <Menu className="w-5 h-5" /> Account Menu
        </button>
      </div>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex sticky top-20 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200 z-40 p-6 flex-col justify-between">
        <div className="space-y-8">
          <h2 className="font-serif text-lg tracking-wide text-stone-950 font-light">Account Center</h2>
          <nav className="space-y-1">
            {menuItems.map((item, idx) => {
              // 🎯 একটিভ রুট হাইলাইটিং লজিক
              const isActive = pathname === item.path;
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className={`w-full h-10 px-3 text-xs uppercase tracking-wider font-medium rounded-sm flex items-center gap-3 transition-colors duration-200 min-h-[40px] ${
                    isActive 
                      ? 'bg-stone-950 text-white font-semibold' 
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono">
          SECURE ACCESS NODE
        </div>
      </aside>

      {/* ─── MOBILE DRAWER SYSTEM ─── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Mask Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.3 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black z-40 md:hidden" 
              onClick={() => setIsSidebarOpen(false)} 
            />

            {/* Mobile Drawer Slide */}
            <motion.aside 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} 
              className="fixed top-32 left-0 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200 z-40 p-6 flex flex-col justify-between shadow-xl md:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg tracking-wide text-stone-950 font-light">Account Center</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-stone-50 rounded">
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item, idx) => {
                    // 🎯 একটিভ রুট হাইলাইটিং লজিক (মোবাইল)
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={idx}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)} // লিঙ্ক ট্যাপ করলে মেনু ড্রয়ার বন্ধ হবে
                        className={`w-full h-10 px-3 text-xs uppercase tracking-wider font-medium rounded-sm flex items-center gap-3 transition-colors duration-200 min-h-[40px] ${
                          isActive 
                            ? 'bg-stone-950 text-white font-semibold' 
                            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono">
                SECURE ACCESS NODE
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── DYNAMIC SUB-PAGE VIEWPORT ─── */}
      <div className="flex-1 w-full relative">
        {children}
      </div>

    </div>
  );
}