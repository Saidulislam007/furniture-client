'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  User, 
  HelpCircle, 
  Star, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { authClient } from '../../../lib/auth-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 🚀 Better-Auth রিয়েল-টাইম সেশন ডাটা ডিটেকশন পাইপライン
  const { data: authData } = authClient.useSession();
  
  const currentUser = {
    name: authData?.user?.name || "Client Member",
    role: authData?.user?.role || "Verified User",
    image: authData?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
  };

  // Hydration Error এড়ানোর জন্য মাউন্ট চেক
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-stone-50/60 text-stone-900 font-sans flex pt-20 relative">
        <div className="flex-1 w-full relative">{children}</div>
      </div>
    );
  }

  // 🎯 মোবাইল বটম বারের জন্য স্ক্রিনশট অনুযায়ী ৫টি কী-মেনু আইটেম নোড
  const mobileMenuItems = [
    { name: 'Overview', path: '/dashboard/user', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Delivery', path: '/dashboard/user/orders', icon: <Truck className="w-5 h-5" /> },
    { name: 'Support', path: '/dashboard/user/support', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'My Reviews', path: '/dashboard/user/reviews', icon: <Star className="w-5 h-5" /> },
    { name: 'Cartlist', path: '/dashboard/user/cart', icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#eadecf] text-stone-900 font-sans flex flex-col md:flex-row relative overflow-x-hidden pb-24 md:pb-0">
      
      {/* 🖥️ DESKTOP SIDEBAR CHASSIS */}
      <aside className="hidden md:flex sticky top-20 h-[calc(140vh-80px)] w-64 bg-white border-r border-stone-200/60 z-30 p-6 pt-24 flex-col justify-between shrink-0">
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
          
          {/* ডেক্সটপ নেভিগেশন লিংকসমূহ */}
          <nav className="space-y-1">
            {[
              { name: 'Overview', path: '/dashboard/user', icon: <LayoutDashboard className="w-4 h-4" /> },
              { name: 'Delivery', path: '/dashboard/user/orders', icon: <ShoppingBag className="w-4 h-4" /> },
              { name: 'Cartlist', path: '/dashboard/user/cart', icon: <Heart className="w-4 h-4" /> },
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
      {/* 🚀 🟢 ফিক্স: মোবাইল স্ক্রিনে বটম বারের জন্য প্যাডিং এবং মার্জিন পারফেক্ট করা হয়েছে ভাই */}
      <div className="flex-1 w-full min-w-0 relative pt-24 md:pt-18 px-4 md:px-8">{children}</div>

      {/* 📱 🚀 🟢 PREMIUM MOBILE BOTTOM NAVIGATION BAR (Hwubhu Screen-accordance) */}
      <div className="fixed bottom-4 left-4 right-4 h-16 bg-[#121212] z-50 rounded-2xl md:hidden shadow-2xl border border-stone-800 flex items-center justify-around px-2">
        {mobileMenuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={idx}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
            >
              {/* আইকন বক্স রেন্ডারিং (অ্যাক্টিভ হলে পার্পল/ব্লু গ্লো করবে ভাই স্ক্রিনশটের মতো) */}
              <div className={`transition-colors duration-300 ${isActive ? 'text-indigo-400 scale-105' : 'text-stone-400'}`}>
                {item.icon}
              </div>
              {/* টেক্সট লেবেল */}
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