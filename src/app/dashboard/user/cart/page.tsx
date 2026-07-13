'use client';



import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { ShoppingCart, Loader2, Heart, Mail, User } from 'lucide-react';

// 🚀 Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট

import { authClient } from "@/lib/auth-client";

// 🚀 আপনার তৈরি করা কার্ট গেট সার্ভিস এপিআই ইম্পোর্ট

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



export default function WishlistPage() {

  // Better-Auth থেকে কারেন্ট সেশন এক্সট্রাকশন

  const { data: session, isPending: isAuthPending } = authClient.useSession();

 

  // লাইভ ডাটা ও লোডিং স্টেটস

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);



  useEffect(() => {

    // যখন সেশন রেডি হবে এবং ইউজার আইডি পাওয়া যাবে, তখন ডাটা ফেচ হবে

    if (session?.user?.id) {

      const syncWishlistData = async () => {

        try {

          const cartData = await getCartFromBackend(session.user.id);

         

          if (cartData) {

            // ⚡ লজিক লক: কার্ট ডেটার userId, userName এবং userEmail সেশনের সাথে ম্যাচ করে ফিল্টার করা হলো

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



  const isLoading = isAuthPending || isDataLoading;



  return (

    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full min-h-screen bg-[#f4f0eb]/20">

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

       

        {/* Header Metadata section */}

        <div className="border-b border-stone-200/60 pb-5">

          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">

            <Heart className="w-6 h-6 text-amber-800 stroke-1 fill-amber-800/10" /> Curated Cartlist

          </h3>

          <p className="text-xs text-stone-400 mt-1">Review ledger logs and manage highly synchronized personal asset architectures.</p>

         

          {/* 👤 একটি ছোট্ট সিকিউরড মেটা ব্যাজ যা কাস্টমার নোড কনফার্ম করে */}

          {session?.user && (

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-stone-500 mt-3 bg-white border border-stone-200/40 p-2 rounded-sm w-fit shadow-xs">

              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {session.user.name}</span>

              <span className="text-stone-300 hidden sm:inline">|</span>

              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {session.user.email}</span>

            </div>

          )}

        </div>

       

        {/* ⏳ পাইপলাইন সিঙ্ক বা লোডিং স্টেট */}

        {isLoading ? (

          <div className="w-full h-64 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-sm">

            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />

            <p className="text-xs font-mono text-stone-400">Verifying customer credentials & fetching secure nodes...</p>

          </div>

        ) : !session ? (

          /* ⚠️ সেশন ভেরিফাইড না থাকলে প্রোটেকশন অ্যালার্ট */

          <div className="w-full py-12 text-center border border-dashed border-amber-300 bg-amber-50/50 rounded-sm text-xs font-mono text-amber-800 p-4">

            ❌ Security Access Warning: Authentication context missing. Please log in to visualize verified ledger entries.

          </div>

        ) : wishlist.length === 0 ? (

          /* 📥 উইশলিস্ট বা কার্ট খালি থাকলে ক্লাসিক এম্পটি স্টেট */

          <div className="w-full py-20 text-center border border-dashed border-stone-300 bg-white rounded-sm">

            <h3 className="text-sm font-serif font-light text-stone-400 tracking-wide">No secure assets verified within this session's ledger queue.</h3>

          </div>

        ) : (

          /* 🖥️ লাইভ ডেটা গ্রিড রেন্ডার */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {wishlist.map((item) => (

              <div key={item._id} className="bg-white border border-stone-200/60 p-4 rounded-sm shadow-sm flex flex-col justify-between group hover:border-stone-300/80 transition-colors">

               

                {/* Product Image Frame */}

                <div className="aspect-[4/3] bg-stone-50 overflow-hidden mb-4 relative border border-stone-100 rounded-sm">

                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />

                  {item.color && (

                    <span className="absolute top-2 right-2 text-[9px] font-mono uppercase bg-stone-950 text-white px-2 py-0.5 tracking-wider rounded-xs shadow-xs select-none">

                      {item.color}

                    </span>

                  )}

                </div>



                {/* Specs Box */}

                <div className="flex justify-between items-start mb-4">

                  <div className="space-y-0.5">

                    <h4 className="font-serif text-base text-stone-900 font-light group-hover:text-amber-800 transition-colors">{item.title}</h4>

                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">

                      <span className="text-stone-950 font-semibold">${item.price.toFixed(2)}</span>

                      <span>•</span>

                      <span>ID: {item.productId}</span>

                    </div>

                  </div>

                </div>



                {/* Primary Action Button */}

                <button className="w-full h-10 bg-stone-950 text-white text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-900 transition-all min-h-[40px] rounded-xs shadow-xs active:scale-99">

                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart

                </button>

              </div>

            ))}

          </div>

        )}

      </motion.div>

    </main>

  );

}