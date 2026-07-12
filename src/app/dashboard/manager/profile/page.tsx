'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Loader2, Calendar, Mail, Tag } from 'lucide-react';
// 🚀 Better-Auth ক্লায়েন্ট নোড ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// 🚀 ডাটাবেজ থেকে ইউজার লিস্ট নিয়ে আসার এপিআই ইম্পোর্ট
import { getAllUsers } from '@/services/api/getUsers';

// ডাটাবেজ মডেল অনুযায়ী প্ল্যাটফর্ম ইউজার ইন্টারফেস টাইপ
interface DbUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'manager' | 'user';
  createdAt?: string | Date;
}

export default function ManagerProfilePage() {
  // 🚀 লাইভ ইউজার সেশন ডাটা এক্সтраাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // 🚀 ডাটাবেজ থেকে ম্যাচ করা সুনির্দিষ্ট ইউজারের স্টেট
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);

  useEffect(() => {
    // সেশন ডাটা এবং ইউজারের আইডি রেডি হলে ডাটাবেজ সিঙ্ক পাইপলাইন রান করবে
    if (session?.user?.id) {
      const syncUserProfile = async () => {
        try {
          const allUsers = await getAllUsers();
          if (allUsers) {
            // ⚡ সেশন ইউজারের আইডির সাথে ডাটাবেজের অবজেক্ট আইডি (_id) ম্যাচ করা হলো
            const matchedUser = allUsers.find((u: any) => u._id === session.user.id);
            if (matchedUser) {
              setDbUser(matchedUser);
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

  // সেশন লোড বা ডাটাবেজ কুয়েরি পেন্ডিং থাকলে লোডার ঘুরবে
  const isLoading = isAuthPending || isDbLoading;

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl mx-auto md:mx-0">
        
        {/* Header Console */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <User className="w-6 h-6 text-stone-950 stroke-1" /> Profile Center
          </h3>
          <p className="text-xs text-stone-950  mt-1">Manage credentials and secure administrative authorization states.</p>
        </div>

        {/* ⏳ পাইপলাইন লোড হওয়ার সময় কঙ্কাল স্টেট */}
        {isLoading ? (
          <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs flex flex-col items-center justify-center h-52 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Verifying and matching database credentials...</p>
          </div>
        ) : !session || !dbUser ? (
          /* ⚠️ সেশন বা ডাটাবেজ ম্যাচ না মিললে প্রোটেকশন অ্যালার্ট */
          <div className="p-4 text-xs text-amber-800 bg-amber-50 border border-amber-200/60 rounded-sm font-mono">
            ❌ Unauthorized: Active user node match not resolved in system database registry.
          </div>
        ) : (
          /* 🖥️ লাইভ ডাটাবেজ ম্যাচড ইউজার ইন্টারফেস */
          <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs space-y-5">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
              
              {/* ইউজারের প্রোফাইল ইমেজ থাম্বনেইল */}
              <div className="w-14 h-14 bg-stone-950 rounded-sm overflow-hidden flex items-center justify-center text-white font-serif text-xl font-light shrink-0 border border-stone-100">
                {dbUser.image ? (
                  <img src={dbUser.image} alt={dbUser.name} className="w-full h-full object-cover" />
                ) : (
                  dbUser.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              
              <div className="space-y-0.5 min-w-0">
                {/* ডাটাবেজ থেকে লাইভ ম্যাচড নাম ও ইমেইল */}
                <h4 className="text-sm font-semibold text-stone-900 truncate">{dbUser.name}</h4>
                <p className="text-xs text-stone-400 font-mono truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-stone-300" /> {dbUser.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* ১. ইউনিক মেম্বারশিপ নোড আইডি */}
              <div className="flex justify-between py-1.5 border-b border-stone-50 items-center">
                <span className="text-stone-400">Registry ID</span>
                <span className="font-mono text-stone-500 text-[11px] bg-stone-50 px-2 py-0.5 border border-stone-100 rounded-sm">
                  {dbUser._id}
                </span>
              </div>

              {/* ২. ডাটাবেজ রোল পারমিশন ব্যাজ */}
              <div className="flex justify-between py-1.5 border-b border-stone-50 items-center">
                <span className="text-stone-400">Node Permissions</span>
                <span className="font-mono font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1 text-xs capitalize">
                  <Shield className="w-3.5 h-3.5" /> 
                  {dbUser.role || 'user'} Node Access
                </span>
              </div>
              
              {/* ৩. ইউজার রেজিস্ট্রেশন ডেট নোড */}
              <div className="flex justify-between py-1.5 items-center">
                <span className="text-stone-400">Registry Session Node</span>
                <span className="text-stone-700 font-mono text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {dbUser.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </main>
  );
}