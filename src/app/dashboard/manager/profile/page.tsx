'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Loader2, Calendar, Mail, Save, CheckCircle, Globe } from 'lucide-react';
// Better-Auth ক্লায়েন্ট নোড ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// ডাটাবেজ থেকে ইউজার লিস্ট নিয়ে আসার এপিআই ইম্পোর্ট
import { getAllUsers } from '@/services/api/getUsers';
// 🚀 🟢 প্রোফাইল আপডেট করার সার্ভিস ফাংশন ইম্পোর্ট করা হলো ভাই
import { updateProfileInBackend } from '@/services/api/updateProfile';

interface DbUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'manager' | 'user';
  createdAt?: string | Date;
}

export default function ManagerProfilePage() {
  // লাইভ ইউজার সেশন ডাটা এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // ডাটাবেজ থেকে ম্যাচ করা সুনির্দিষ্ট ইউজারের স্টেট
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);

  // 🚀 ইনপুট ফর্ম হ্যান্ডেল করার জন্য লোকাল স্টেট
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: ''
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.id) {
      const syncUserProfile = async () => {
        try {
          const allUsers = await getAllUsers();
          if (allUsers) {
            const matchedUser = allUsers.find((u: any) => u._id === session.user.id);
            if (matchedUser) {
              setDbUser(matchedUser);
              // ⚡ ফর্ম ইনপুটে ডাটাবেজের কারেন্ট ভ্যালুগুলো প্রি-ফিল করা হলো
              setFormData({
                name: matchedUser.name || '',
                email: matchedUser.email || '',
                image: matchedUser.image || ''
              });
            }
          }
        } catch (error) {
          console.error("❌ Failed to synchronize profile node with database:", error);
        } finally {
          setIsDbLoading(false);
        }
      };

      syncUserProfile();
    } else if (!isAuthPending && !session) {
      setIsDbLoading(false);
    }
  }, [session, isAuthPending]);

  // 🚀 🟢 ম্যানেজারের প্রোফাইল আপডেট সাবমিট হ্যান্ডলার
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !dbUser) return;

    setIsSaving(true);

    // ব্যাকএন্ড এপিআই সার্ভিসে ডাইনামিক পেলোড পাঠানো হচ্ছে ভাই
    const success = await updateProfileInBackend(session.user.id, formData);

    if (success) {
      // লোকাল স্টেট সিঙ্ক (যাতে ডাটাবেজ আপডেটের সাথে সাথে ইন্টারফেসও চেঞ্জ হয়)
      setDbUser(prev => prev ? { ...prev, ...formData } : null);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // ৩ সেকেন্ড পর সাকসেস নোটিশ অফ হবে
    } else {
      console.error("❌ Profile identity mutation rejected by database core matrix.");
    }

    setIsSaving(false);
  };

  const isLoading = isAuthPending || isDbLoading;

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl mx-auto md:mx-0">
        
        {/* Header Console */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <User className="w-6 h-6 text-stone-950 stroke-1" /> Profile Center
          </h3>
          <p className="text-xs text-stone-400 mt-1">Manage credentials and secure administrative authorization states.</p>
        </div>

        {/* 🍞 সাকসেস নোটিফিকেশন ব্যানার */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 flex items-center gap-2 rounded-sm"
            >
              <CheckCircle className="w-4 h-4 text-amber-500" /> Identity configuration transmitted successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ⏳ পাইপলাইন লোড হওয়ার সময় লোডার */}
        {isLoading ? (
          <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs flex flex-col items-center justify-center h-52 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Verifying and matching database credentials...</p>
          </div>
        ) : !session || !dbUser ? (
          <div className="p-4 text-xs text-amber-800 bg-amber-50 p-4 border border-amber-200/60 rounded-sm font-mono">
            ❌ Unauthorized: Active user node match not resolved in system database registry.
          </div>
        ) : (
          /* 🖥️ লাইভ এডিটেবল ম্যানেজার ইন্টারফেস */
          <div className="bg-white border border-stone-200/60 p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
            
            {/* ভিজ্যুয়াল প্রোফাইল প্রিভিউ নোড */}
            <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
              <div className="w-16 h-16 bg-stone-950 rounded-sm overflow-hidden flex items-center justify-center text-white font-serif text-2xl font-light shrink-0 border border-stone-100 shadow-inner">
                {dbUser.image ? (
                  <img src={dbUser.image} alt={dbUser.name} className="w-full h-full object-cover" />
                ) : (
                  dbUser.name?.charAt(0).toUpperCase() || 'M'
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-base font-serif font-light text-stone-900 truncate">{dbUser.name}</h4>
                <p className="text-xs text-stone-400 font-mono truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-stone-300" /> {dbUser.email}
                </p>
              </div>
            </div>

            {/* আপডেট ফর্ম সিস্টেম */}
            <form onSubmit={handleProfileUpdate} className="space-y-5 text-xs sm:text-sm text-left">
              
              {/* ১. Legal Name Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Legal Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all"
                />
              </div>

              {/* ২. Secure Email Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Secure Contact Email</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all"
                />
              </div>

              {/* ৩. Profile Image URL Field */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Profile Image URL</label>
                <div className="relative flex items-center">
                  <input 
                    type="url" 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full h-11 pl-4 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all font-mono"
                  />
                  <Globe className="w-4 h-4 text-stone-300 absolute right-3.5 pointer-events-none" />
                </div>
              </div>

              {/* ─── READ ONLY ADMINISTRATIVE METRICS ─── */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5 font-mono text-xs text-stone-500">
                <div className="flex justify-between items-center">
                  <span>Registry ID:</span>
                  <span className="text-[11px] bg-stone-50 px-2 py-0.5 border border-stone-100 text-stone-600 rounded-sm">{dbUser._id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Node Permissions:</span>
                  <span className="text-amber-800 uppercase text-[10px] tracking-wider font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 fill-amber-50" /> {dbUser.role || 'manager'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Session Created:</span>
                  <span>
                    {dbUser.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : "N/A"}
                  </span>
                </div>
              </div>

              {/* Save Button Node */}
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest shadow-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm min-h-[44px] disabled:bg-stone-400 pt-0.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-200" />
                    <span>Transmitting Change...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> 
                    <span>Save Configuration</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </main>
  );
}