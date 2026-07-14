'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Loader2, Heart, Mail, User, ChevronLeft, ChevronRight } from 'lucide-react';
// Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// আপনার তৈরি করা কার্ট গেটসার্ভিস এপিআই ইম্পোর্ট
import { getCartFromBackend } from '@/services/api/getCart';

// ডাটাবেজ থেকে আসা কার্ট আইটেমের টাইপ ইন্টারফেস
interface WishlistItem {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  color?: string;
}

// 🎯 🚀 প্রতি পেজে ঠিক ৩টি করে উইশলিস্ট কার্ড লক করা হলো ভাই
const ITEMS_PER_PAGE = 3;

export default function WishlistPage() {
  // Better-Auth থেকে কারেন্ট সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // লাইভ ডাটা ও লোডিং স্টেটস
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // প্যাজিনেশন কারেন্ট স্টেট নোড
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (session?.user?.id) {
      const syncWishlistData = async () => {
        try {
          const cartData = await getCartFromBackend(session.user.id);
          
          if (cartData) {
            const secureMatchedItems = cartData.filter((item: any) =>
              item.userId === session.user.id &&
              item.userName === session.user.name &&
              item.userEmail === session.user.email
            );
            setWishlist(secureMatchedItems);
          }
        } catch (error) {
          console.error("❌ Failed to resolve wishlist secure pipeline:", error);
        } finally {
          setIsDataLoading(false);
        }
      };

      syncWishlistData();
    } else if (!isAuthPending && !session) {
      setIsDataLoading(false);
    }
  }, [session, isAuthPending]);

  // 📊 ৩টি ডেটার সাপেক্ষে প্যাজিনেশন ট্র্যাক ক্যালকুলেশন
  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);

  const paginatedWishlist = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [wishlist, currentPage]);

  const isLoading = isAuthPending || isDataLoading;

  return (
    <main className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 min-h-screen bg-transparent">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Header Metadata section */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Heart className="w-6 h-6 text-amber-800 stroke-1 fill-amber-800/10" /> Curated Cartlist
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Showing page {currentPage} of {totalPages || 1} — {wishlist.length} units listed.
          </p>
          
          {/* 👤 সিকিউরড মেটা ব্যাজ */}
          {session?.user && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-stone-500 mt-3 bg-white border border-stone-200/40 p-2 rounded-sm w-fit shadow-xs">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {session.user.name}</span>
              <span className="text-stone-300 hidden sm:inline">|</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {session.user.email}</span>
            </div>
          )}
        </div>
        
        {/* ⏳ 🟢 ফিক্স: আপনার রিকোয়েস্ট অনুযায়ী লোডিং ও সেফগার্ড প্যানেলের হাইট-উইডথ কমপিউটেড (Compact Scale) */}
        {isLoading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-xl shadow-xs">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Fetching verified ledger nodes...</p>
          </div>
        ) : !session ? (
          /* ⚠️ সেশন প্রোটেকশন অ্যালার্ট কন্টেইনার কমপ্যাক্ট সাইজ ফিক্স */
          <div className="w-full max-w-2xl mx-auto py-6 text-center border border-dashed border-amber-300 bg-amber-50/40 rounded-xl text-xs font-mono text-amber-800 px-4 shadow-xs">
            ❌ Security Access Warning: Authentication context missing. Please log in to visualize logs.
          </div>
        ) : wishlist.length === 0 ? (
          /* 📥 এম্পটি স্টেট কমপ্যাক্ট সাইজ ফিক্স */
          <div className="w-full py-14 flex flex-col items-center justify-center border border-dashed border-stone-300 bg-white rounded-xl shadow-xs">
            <h3 className="text-sm font-serif font-light text-stone-400 tracking-wide">No secure assets verified within this session's ledger queue.</h3>
          </div>
        ) : (
          <>
            {/* 🖥️ লাইভ ডেটা গ্রিড রেন্ডার (সর্বোচ্চ ৩টি কন্টেন্ট) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedWishlist.map((item) => (
                <div key={item._id} className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-sm flex flex-col justify-between group hover:border-stone-300/80 transition-colors">
                  
                  {/* Product Image Frame */}
                  <div className="aspect-[4/3] bg-stone-50 overflow-hidden mb-4 relative border border-stone-100 rounded-lg">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                    {item.color && (
                      <span className="absolute top-2 right-2 text-[9px] font-mono uppercase bg-stone-950 text-white px-2 py-0.5 tracking-wider rounded-xs shadow-xs select-none">
                        {item.color}
                      </span>
                    )}
                  </div>

                  {/* Specs Box */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-0.5 text-left">
                      <h4 className="font-serif text-base text-stone-900 font-light group-hover:text-amber-800 transition-colors line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                        <span className="text-stone-950 font-semibold">${item.price.toFixed(2)}</span>
                        <span>•</span>
                        <span className="truncate max-w-[100px]">ID: {item.productId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <button className="w-full h-10 bg-stone-950 text-white text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-all min-h-[40px] rounded-lg shadow-xs active:scale-99">
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* ================= 📊 🚀 LUXURY PAGINATION LAYER ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-12 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
                {/* Previous Page Arrow */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Buttons mapping */}
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

                {/* Next Page Arrow */}
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