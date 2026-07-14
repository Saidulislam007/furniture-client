'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, CheckCircle2, UserCheck, Loader2, ChevronLeft, ChevronRight, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
// 🚀 🟢 আপনার নতুন এপিআই পাথ থেকে ফেচ ফাংশন ইম্পোর্ট
import { getAllUsers } from '@/services/api/getUsers';

// প্ল্যাটফর্ম ইউজার ইন্টারফেস টাইপ (ডাটাবেজ অবজেক্ট মডেল অনুযায়ী)
interface PlatformUser {
  _id: string; // মঙ্গোডিবির ইউনিক অবজেক্ট আইডি
  name: string;
  email: string;
  image?: string; 
  role: 'admin' | 'manager' | 'user'; 
}

// 🎯 প্রতি পেজে ঠিক ৬টি করে ইউজার রেকর্ড লক করা হলো ভাই
const ITEMS_PER_PAGE = 6;

export default function RoleGovernancePage() {
  // ডাইনামিক ডাটা স্টেট
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 📝 🟢 এডভান্সড সার্চ এবং ফিল্টার স্টেটস
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // 🚀 প্যাজিনেশন কারেন্ট স্টেট নোড
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // 🚀 🟢 আপনার অরিজিনাল টোস্ট স্টেট এবং ট্রিগার
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); // ৩ সেকেন্ড পর হাওয়া করে দেয়
  };

  // 🚀 এপিআই ডাটা পাইপলাইন লোড মেকানিজম
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

  // ⚡ সার্চ বা ফিল্টার বদলালে ইউজার স্বয়ংক্রিয়ভাবে আবার ১ম পেজে ফেরত যাবে ভাই
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  // 🎯 🚀 আলটিমেট সার্চ ও রোল ফিল্টারিং লজিক ম্যাট্রিক্স
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // ১. নাম এবং ইমেইল কুয়েরি সার্চ ট্র্যাকিং
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name?.toLowerCase().includes(query) || 
        u.email?.toLowerCase().includes(query)
      );
    }

    // ২. স্পেসিফিক রোল টাইপ ফিল্টারিং (admin, manager, user)
    if (selectedRole !== 'all') {
      result = result.filter(u => u.role === selectedRole);
    }

    return result;
  }, [users, searchQuery, selectedRole]);

  // 📊 ফিল্টার হওয়া ডেটার সাপেক্ষে প্যাজিনেশন ক্যালকুলেশন
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setCurrentPage(1);
  };

  return (
    <main className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 font-sans relative min-h-screen bg-transparent">
      
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
        <div className="border-b border-stone-200/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
              <Users className="w-6 h-6 text-stone-950 stroke-1" /> Dedicated Role Management
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Showing {paginatedUsers.length} of {filteredUsers.length} active directory nodes ({users.length} total system users)
            </p>
          </div>
          <span className="text-[10px] font-mono bg-red-50 text-red-700 px-2 py-1 rounded-sm uppercase font-bold tracking-wider border border-red-100 self-start sm:self-auto select-none">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* ================= 🔍 🟢 PREMIUM SEARCH & CONTROLS CONTROLLER ================= */}
        <div className="w-full bg-white/60 border border-stone-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* লাইভ নাম ও ইমেইল সার্চ নোড */}
          <div className="w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin, manager, name or email registry..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* রোল ক্যাটেগরি ড্রপডাউন সিলেক্টর এবং রিসেট বাটন */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            <div className="relative w-full sm:w-40">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none appearance-none font-mono uppercase tracking-wide text-stone-700 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin Node</option>
                <option value="manager">Manager Node</option>
                <option value="user">User Node</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {(searchQuery || selectedRole !== 'all') && (
              <button
                onClick={resetFilters}
                className="h-10 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono rounded-lg flex items-center justify-center gap-1 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ⏳ ডাটা লোডিং কঙ্কাল/স্পিনার স্টেট */}
        {isLoading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-xl shadow-xs">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Synchronizing user governance nodes...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="w-full h-48 flex flex-col items-center justify-center gap-2 border border-dashed border-stone-300 bg-white rounded-xl text-xs font-mono text-stone-400">
            <span>No user registries match your filter parameters.</span>
            <button onClick={resetFilters} className="text-amber-800 underline uppercase text-[10px] tracking-wider mt-1">Clear Search Query</button>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP & TABLET LOGISTICS INTERFACE */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-xl shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                    <th className="p-4 sm:p-5 w-20">Avatar</th>
                    <th className="p-4 sm:p-5">Identity Specs (User)</th>
                    <th className="p-4 sm:p-5">Governance Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {paginatedUsers.map((user) => (
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
                      
                      {/* ২. নাম এবং ইমেইল আইдেন্টিটি */}
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
              {paginatedUsers.map((user) => (
                <div key={user._id} className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-start gap-3 text-left">
                    
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

                  {/* mobile assignment line */}
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

            {/* ================= 📊 🚀 LUXURY PAGINATION CONTROLLER LAYER ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-12 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers mapping */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-center flex items-center justify-center transition-all border ${
                        currentPage === pageNum
                          ? 'bg-stone-950 text-white border-stone-950 font-bold shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </motion.div>
    </main>
  );
}