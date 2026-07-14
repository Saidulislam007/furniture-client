'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  ShieldAlert
} from 'lucide-react';
// 🚀 🟢 Better-Auth সেশন ক্লায়েন্ট হুক ইম্পোর্ট করা হলো ভাই ডাইনামিক প্রোফাইলের জন্য
import { authClient } from '@/lib/auth-client';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 🚀 🟢 Better-Auth রিয়েল-টাইম সেশন ডাটা ডিটেকশন পাইপলাইন
  const { data: authData } = authClient.useSession();
  
  // 🎯 🚀 ফলব্যাক ডাটা প্রটেকশন (ডেমো ডাটা সরিয়ে সেশনের লাইভ ডাটা বাইন্ডিং ভাই)
  const currentAdmin = {
    name: authData?.user?.name || "Root Administrator",
    role: "Root Administrator",
    image: authData?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-stone-50/60 pt-20">{children}</div>;
  }

  // 🎯 অ্যাডমিন ড্যাশবোর্ডের ৪টি মূল ফিচার যা মোবাইল বটম বারে থাকবে ভাই
  const adminMenuItems = [
    { name: 'Overview', path: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Governance', path: '/dashboard/admin/roles', icon: <Users className="w-5 h-5" /> },
    { name: 'Clearance', path: '/dashboard/admin/clearance', border: 'border-red-200', icon: <ShieldAlert className="w-5 h-5" /> },
    { name: 'Settings', path: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex flex-col md:flex-row relative overflow-x-hidden pb-24 md:pb-0">
      
      {/* 🖥️ DESKTOP SIDEBAR CHASSIS */}
      <aside className="hidden md:flex sticky top-20 h-[calc(140vh-80px)] w-64 bg-white border-r border-stone-200/60 z-30 p-6 pt-24 flex-col justify-between shrink-0">
        <div className="space-y-8 mt-4">
          
          {/* 🎯 🚀 ডেক্সটপ প্রোফাইল কার্ড - এখন ১০০% লাইভ সেশন ডাইনামিক ভাই */}
          <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
            <img 
              src={currentAdmin.image} 
              alt={currentAdmin.name} 
              className="w-11 h-11 object-cover border border-stone-200 rounded-sm shrink-0 shadow-xs"
            />
            <div className="min-w-0 text-left">
              <h4 className="font-serif text-sm font-light text-stone-950 truncate tracking-wide leading-tight">{currentAdmin.name}</h4>
              <span className="text-[9px] font-mono tracking-widest text-red-700 font-bold uppercase block mt-1">{currentAdmin.role}</span>
            </div>
          </div>
          
          {/* ডেক্সটপ নেভিগেশন লিংকসমূহ */}
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
      <div className="flex-1 w-full min-w-0 relative pt-24 md:pt-18 px-4 md:px-8">{children}</div>

      {/* 📱 PREMIUM MOBILE BOTTOM NAVIGATION BAR FOR ADMIN */}
      <div className="fixed bottom-4 left-4 right-4 h-16 bg-[#121212] z-50 rounded-2xl md:hidden shadow-2xl border border-stone-800 flex items-center justify-around px-2">
        {adminMenuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={idx}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-indigo-400 scale-105' : 'text-stone-400'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] mt-1 font-sans font-medium tracking-wide transition-colors duration-300 ${
                isActive ? 'text-white font-bold' : 'text-stone-400'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}