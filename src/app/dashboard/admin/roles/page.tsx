'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, CheckCircle2, UserCheck, Loader2 } from 'lucide-react';
// 🚀 🟢 আপনার নতুন এপিআই পাথ থেকে ফেচ ফাংশন ইম্পোর্ট
import { getAllUsers } from '@/services/api/getUsers';

// প্ল্যাটফর্ম ইউজার ইন্টারফেস টাইপ (ডাটাবেজ অবজেক্ট মডেল অনুযায়ী)
interface PlatformUser {
  _id: string; // মঙ্গোডিবির ইউনিক অবজেক্ট আইডি
  name: string;
  email: string;
  image?: string; // Better-Auth এ অপশনাল হতে পারে তাই সেফগার্ড সহ
  role: 'admin' | 'manager' | 'user'; // ডাটাবেজে ছোট হাতের অক্ষরে সেভ থাকে
}

export default function RoleGovernancePage() {
  // 🚀 ডামি ডাটা টোটাল ক্লিন করে লাইভ স্টেট খালি রাখা হলো
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 🚀 🟢 আপনার অরিজিনাল টোস্ট স্টেট এবং ট্রিগার
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); // ৩ সেকেন্ড পর হাওয়া করে দেয়
  };

  // 🚀 🟢 এপিআই ডাটা পাইপলাইন লোড মেকানিজম
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const data = await getAllUsers();
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error("❌ Failed to resolve user governance pipeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  // 🚀 ইউজার রোল চেঞ্জ হ্যান্ডলার
  const handleRoleChange = (id: string, newRole: PlatformUser['role']) => {
    setUsers(prev => prev.map(u => {
      if (u._id === id) {
        triggerToast(`Role for ${u.name} updated to ${newRole.toUpperCase()}.`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans relative min-h-screen">
      
      {/* 🔔 🟢 আপনার অরিজিনাল FLOATING NOTIFICATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Users className="w-6 h-6 text-stone-950 stroke-1" /> Dedicated Role Management
          </h3>
          <p className="text-xs text-stone-950 mt-1">Isolate and fine-tune permissions for administrative and general node access.</p>
        </div>

        {/* ⏳ ডাটা লোডিং কঙ্কাল/স্পিনার স্টেট */}
        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-sm">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Synchronizing user governance nodes...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center border border-stone-200/60 bg-white rounded-sm text-xs font-mono text-stone-400">
            No users found in the system registry nodes.
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP & TABLET LOGISTICS INTERFACE */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                    <th className="p-4 sm:p-5 w-20">Avatar</th>
                    <th className="p-4 sm:p-5">Identity Specs (User)</th>
                    <th className="p-4 sm:p-5">Governance Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-stone-50/30 transition-colors">
                      
                      {/* ১. ইউজার ইমেজ নোড */}
                      <td className="p-4 sm:p-5">
                        <div className="w-10 h-10 bg-stone-100 border border-stone-200 rounded-full overflow-hidden shrink-0">
                          <img 
                            src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"} 
                            alt={user.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>
                      
                      {/* ২. নাম এবং ইমেইল আইডেন্টিটি */}
                      <td className="p-4 sm:p-5 font-serif text-stone-950 text-sm font-light">
                        <div className="font-medium text-stone-950">{user.name}</div>
                        <div className="text-[11px] font-mono text-stone-400 mt-0.5">{user.email}</div>
                      </td>

                      {/* ৩. ডাইনামিক ড্রপডাউন রোল সিলেক্টর */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <Shield className="w-3.5 h-3.5 text-stone-900" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                          )}
                          <select 
                            value={user.role} 
                            onChange={(e) => handleRoleChange(user._id, e.target.value as PlatformUser['role'])}
                            className="h-9 px-2 bg-stone-50 border border-stone-200 rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 cursor-pointer capitalize"
                          >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE RESPONSIVE CARDS ENGINE */}
            <div className="block md:hidden space-y-4">
              {users.map((user) => (
                <div key={user._id} className="bg-white border border-stone-200/60 p-5 rounded-sm shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    
                    {/* মোবাইল ইমেজ নোড */}
                    <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-full overflow-hidden shrink-0">
                      <img 
                        src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"} 
                        alt={user.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="font-serif text-base text-stone-900 font-light leading-tight">{user.name}</h4>
                      <span className="block font-mono text-[11px] text-stone-500 truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* mobile selection border */}
                  <div className="border-t border-stone-50 pt-2.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">Assign Role:</span>
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user._id, e.target.value as PlatformUser['role'])}
                      className="h-8 px-2 bg-stone-50 border border-stone-200 rounded-sm text-[11px] font-mono focus:outline-none cursor-pointer text-stone-800 capitalize"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </motion.div>
    </main>
  );
}