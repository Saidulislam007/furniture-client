'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const adminMenuItems = [
  { name: 'Overview', path: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Role Governance', path: '/dashboard/admin/roles', icon: <Users className="w-4 h-4" /> },
  { name: 'Asset Clearance', path: '/dashboard/admin/clearance', icon: <ShieldAlert className="w-4 h-4" /> },
  { name: 'System Settings', path: '/dashboard/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

const currentAdmin = {
  name: "Al-Amin Hossain",
  role: "Root Administrator",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return <div className="min-h-screen bg-stone-50/60 pt-20">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* 📱 MOBILE TOP NAVIGATION BAR */}
      {/* 🚀 🟢 ফিক্স: top-[73px] বা আপনার গ্লোবাল নেভবারের হাইটের নিচে দেওয়া হলো যাতে ওভ্যারল্যাপ না করে ভাই */}
      <div className="w-full h-12 bg-white border-b border-stone-200 fixed top-[86px] left-0 z-40 flex items-center justify-between px-4 md:hidden shadow-xs">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-1 text-stone-700 hover:text-stone-950 flex items-center gap-2 text-xs uppercase tracking-wider font-sans font-bold focus:outline-none min-h-[40px]"
        >
          <Menu className="w-4 h-4 text-stone-950" /> Admin Console Menu
        </button>
        <span className="text-[10px] font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded-xs uppercase font-bold tracking-wider">
          Admin Mode
        </span>
      </div>

      {/* 📱 MOBILE SIDE DRAWER PANEL */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.4 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-screen w-72 bg-white z-50 p-6 flex flex-col justify-between border-r border-stone-200 shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <img 
                    src={currentAdmin.image} 
                    alt={currentAdmin.name} 
                    className="w-10 h-10 object-cover border border-stone-200 rounded-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-light text-stone-950 truncate tracking-wide leading-tight">{currentAdmin.name}</h4>
                    <span className="text-[9px] font-mono tracking-widest text-red-700 font-bold uppercase block mt-0.5">{currentAdmin.role}</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="ml-auto p-1.5 hover:bg-stone-100 rounded-sm text-stone-400 hover:text-stone-900 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {adminMenuItems.map((item) => {
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
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> ROOT AUTHORITY SECURE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 🖥️ DESKTOP SIDEBAR CHASSIS */}
      <aside className="hidden md:flex sticky top-0 h-[calc(100vh-80px)] w-64 bg-white border-r border-stone-200/60 z-30 p-6 pt-24 flex-col justify-between shrink-0">
        <div className="space-y-8 mt-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
            <img 
              src={currentAdmin.image} 
              alt={currentAdmin.name} 
              className="w-11 h-11 object-cover border border-stone-200 rounded-sm shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <h4 className="font-serif text-sm font-light text-stone-950 truncate tracking-wide leading-tight">{currentAdmin.name}</h4>
              <span className="text-[9px] font-mono tracking-widest text-red-700 font-bold uppercase block mt-1">{currentAdmin.role}</span>
            </div>
          </div>
          
          <nav className="space-y-1">
            {adminMenuItems.map((item) => {
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
        
        <div className="border-t border-stone-100 pt-4 text-[10px] text-stone-400 font-light tracking-wide font-mono flex items-center gap-1.5 select-none">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> ROOT AUTHORITY SECURE
        </div>
      </aside>
      
      {/* 🖥️ MAIN WORKSPACE RENDER NODE */}
      {/* 🚀 🟢 ফিক্স: মোবাইল স্ক্রিনে ড্যাশবোর্ড বারটির নিচে স্পেস দেওয়ার জন্য pt-32 করা হলো ভাই */}
      <div className="flex-1 w-full min-w-0 relative pt-32 md:pt-18">{children}</div>
    </div>
  );
}