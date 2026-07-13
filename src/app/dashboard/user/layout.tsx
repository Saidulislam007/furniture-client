'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Heart, User, HelpCircle, Menu, X, Star, ShieldCheck } from 'lucide-react';
// 🚀 Better-Auth সেশন ক্লায়েন্ট হুক ইম্পোর্ট করা হলো ভাই ডাইনামিক প্রোফাইলের জন্য
import { authClient } from '../../../lib/auth-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 🚀 Better-Auth রিয়েল-টাইম সেশন ডাটা ডিটেকশন পাইপলাইন
  const { data: authData } = authClient.useSession();
  
  // ফলব্যাক ডাটা প্রটেকশন (যদি সেশন ক্যাশ লোড হতে সামান্য দেরিও হয় ভাই)
  const currentUser = {
    name: authData?.user?.name || "Client Member",
    role: authData?.user?.role || "Verified User",
    image: authData?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
  };

  // Hydration Error এড়ানোর জন্য মাউন্ট চেক
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // রুট চেঞ্জ হলে মোবাইল ড্রয়ার অটোমেটিক বন্ধ হবে
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-stone-50/60 text-stone-900 font-sans flex pt-20 relative">
        <div className="flex-1 w-full relative">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* 📱 MOBILE TOP NAVIGATION PANEL */}
      {/* 🚀 🟢 ফিক্স: top-[73px] দিয়ে গ্লোবাল নেভবারের ওভ্যারল্যাপ চিরতরে লক করা হলো ভাই */}
      <div className="w-full h-12 bg-white border-b border-stone-200 fixed top-[87px] left-0 z-40 flex items-center justify-between px-4 md:hidden shadow-xs">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-1 text-stone-700 hover:text-stone-950 flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold focus:outline-none min-h-[40px]"
        >
          <Menu className="w-4 h-4 text-amber-700" /> Account Menu
        </button>
        <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-xs uppercase font-bold tracking-wider">
          Client Mode
        </span>
      </div>

      {/* 📱 MOBILE SIDE DRAWER PANEL WITH PRE-BUILT IMAGE ACCORDANCE */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Mask */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.4 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden backdrop-blur-xs"
            />
            
            {/* 🚀 🟢 ড্রয়ার কন্টেইনার ফিক্স: এডমিন ও ম্যানেজারের মতো হুবহু ইমেজ ও ক্লোজ বাটন লেআউট */}
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-screen w-72 bg-white z-50 p-6 flex flex-col justify-between border-r border-stone-200 shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                
                {/* 🎯 🎯 ফিক্স: প্রফেশনাল ইউজার প্রোফাইল কার্ড ডিজাইন */}
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <img 
                    src={currentUser.image} 
                    alt={currentUser.name} 
                    className="w-10 h-10 object-cover border border-stone-200 rounded-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-light text-stone-950 truncate tracking-wide leading-tight">{currentUser.name}</h4>
                    <span className="text-[9px] font-mono tracking-widest text-amber-700 font-bold uppercase block mt-0.5">{currentUser.role}</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="ml-auto p-1.5 hover:bg-stone-100 rounded-sm text-stone-400 hover:text-stone-900 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation Links (Mobile) */}
                <nav className="space-y-1">
                  {[
                    { name: 'Overview', path: '/dashboard/user', icon: <LayoutDashboard className="w-4 h-4" /> },
                    { name: 'Order History', path: '/dashboard/user/orders', icon: <ShoppingBag className="w-4 h-4" /> },
                    { name: 'My Cart', path: '/dashboard/user/cart', icon: <Heart className="w-4 h-4" /> },
                    { name: 'Product Reviews', path: '/dashboard/user/reviews', icon: <Star className="w-4 h-4" /> },
                    { name: 'Profile Center', path: '/dashboard/user/profile', icon: <User className="w-4 h-4" /> },
                    { name: 'Concierge Support', path: '/dashboard/user/support', icon: <HelpCircle className="w-4 h-4" /> },
                  ].map((item, idx) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={idx}
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
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> SECURE ACCESS NODE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 🖥️ DESKTOP SIDEBAR CHASSIS */}
      <aside className="hidden md:flex sticky top-0 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200/60 z-30 p-6 pt-24 flex-col justify-between shrink-0">
        <div className="space-y-8 mt-4">
          
          {/* ডেক্সটপ প্রোফাইল কার্ড */}
          <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
            <img 
              src={currentUser.image} 
              alt={currentUser.name} 
              className="w-11 h-11 object-cover border border-stone-200 rounded-sm shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <h4 className="font-serif text-sm font-light text-stone-950 truncate tracking-wide leading-tight">{currentUser.name}</h4>
              <span className="text-[9px] font-mono tracking-widest text-amber-700 font-bold uppercase block mt-1">{currentUser.role}</span>
            </div>
          </div>
          
          <nav className="space-y-1">
            {[
              { name: 'Overview', path: '/dashboard/user', icon: <LayoutDashboard className="w-4 h-4" /> },
              { name: 'Order History', path: '/dashboard/user/orders', icon: <ShoppingBag className="w-4 h-4" /> },
              { name: 'My Cart', path: '/dashboard/user/cart', icon: <Heart className="w-4 h-4" /> },
              { name: 'Product Reviews', path: '/dashboard/user/reviews', icon: <Star className="w-4 h-4" /> },
              { name: 'Profile Center', path: '/dashboard/user/profile', icon: <User className="w-4 h-4" /> },
              { name: 'Concierge Support', path: '/dashboard/user/support', icon: <HelpCircle className="w-4 h-4" /> },
            ].map((item, idx) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={idx}
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
        
        <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono flex items-center gap-1.5 select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> SECURE ACCESS NODE
        </div>
      </aside>
      
      {/* 🖥️ MAIN WORKSPACE RENDER NODE */}
      <div className="flex-1 w-full min-w-0 relative pt-32 md:pt-18">{children}</div>
    </div>
  );
}