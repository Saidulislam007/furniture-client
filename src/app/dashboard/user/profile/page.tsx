'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle, Loader2, Globe } from 'lucide-react';
// 🚀 🟢 ফিক্স: নেক্সট-জেএস পাথ অ্যালিয়াস ব্যবহার করে ইম্পোর্ট এরর ১০০% দূর করা হলো
import { authClient } from '@/lib/auth-client'; 
// প্রোফাইল আপডেট সার্ভিস ফাংশন ইম্পোর্ট
import { updateProfileInBackend } from '@/services/api/updateProfile';

export default function ProfilePage() {
  // Better-Auth সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '' // 🚀 🟢 ইমেজ লিংক হ্যান্ডেল করার জন্য পিওর স্ট্রিং ফিল্ড
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ⚡ সেশন লোড হওয়ার পর ইউজারের বর্তমান ডাটা ফর্মে সেট করার ইফেক্ট
  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || ''
      });
    }
  }, [session]);

  // 🚀 লাইভ ডাটাবেজ আপডেট সাবমিট হ্যান্ডলার
 const handleProfileSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!session?.user?.id) return;

  setIsSaving(true);
  
  // ১. ব্যাকএন্ড এপিআই সার্ভিসে পেলোড পাঠানো হচ্ছে ভাই
  const success = await updateProfileInBackend(session.user.id, profile);

  if (success) {
    // 🎯 🟢 আলটিমেট ফিক্স: Better-Auth সেশন ক্লায়েন্টকে ফোর্স রিফ্রেশ/সিঙ্ক করা
    // এটি করা মাত্রই ব্রাউজার তার পুরানো ক্যাশ ফেলে দিয়ে ডাটাবেজ থেকে নতুন নাম/ইমেজ টেনে আনবে!
    await authClient.sync(); 

    setShowSuccess(true);
    
    // ৩ সেকেন্ড পর সাকসেস নোটিফিকেশন চলে যাবে
    setTimeout(() => setShowSuccess(false), 3000);
  } else {
    console.error("❌ Security Configuration Mutation Rejected by Database.");
  }
  
  setIsSaving(false);
};

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
        <p className="font-mono text-xs text-stone-400 ml-2">Resolving user identity logs...</p>
      </div>
    );
  }

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-xl bg-white border border-stone-200/60 p-6 sm:p-10 rounded-sm shadow-sm space-y-6 text-left"
      >
        <div>
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Profile Identity</h3>
          <p className="text-xs text-stone-400 mt-1">Manage architectural shipping protocols and account metrics.</p>
        </div>

        {/* সাকসেস নোটিফিকেশন ব্যানার */}
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

        {!session ? (
          <div className="w-full py-8 text-center border border-dashed border-amber-300 bg-amber-50/50 rounded-sm text-xs font-mono text-amber-800 p-4">
            ❌ Security Access Warning: Authentication context missing. Please log in to modify configuration files.
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-5 text-xs sm:text-sm">
            
            {/* 🚀 🟢 ভিজ্যুয়াল প্রোফাইল প্রিভিউ উইজেট */}
            <div className="flex items-center gap-4 border-b border-stone-100 pb-5 mb-2">
              <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                {profile.image ? (
                  <img src={profile.image} alt="Avatar Matrix Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300 font-mono text-[10px]">NO AVATAR</div>
                )}
              </div>
              <div>
                <h4 className="font-serif text-base text-stone-900 font-light">{profile.name || 'Current User'}</h4>
                <p className="text-stone-400 text-[11px] font-mono mt-0.5">{profile.email}</p>
              </div>
            </div>

            {/* Legal Name Input Node */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Legal Name</label>
              <input 
                type="text" required value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all"
              />
            </div>

            {/* Contact Email Input Node */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Secure Contact Email</label>
              <input 
                type="email" required value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all"
              />
            </div>

            {/* Profile Image URL Field */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Profile Image URL</label>
              <div className="relative flex items-center">
                <input 
                  type="url" value={profile.image} 
                  onChange={(e) => setProfile({...profile, image: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full h-11 pl-4 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all font-mono"
                />
                <Globe className="w-4 h-4 text-stone-300 absolute right-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Primary Submit Button */}
            <button 
              type="submit" disabled={isSaving}
              className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest shadow-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm min-h-[44px] disabled:bg-stone-400"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-200" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> 
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}