'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, Send, ArrowRight, Loader2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
// Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// আপনার তৈরি করা ডেলিভারি গেট সার্ভিস এপিআই ইম্পোর্ট
import { getDeliveriesFromBackend } from '@/services/api/getDelivery';
// 🚀 নতুন কাস্টমার রিভিউ পোস্ট এপিআই সার্ভিস ইম্পোর্ট করা হলো ভাই
import { sendToReviewsBackend } from '@/services/api/postReview';

// লাইভ অবজেক্ট টাইপ ডেফিনিশন
interface VerifiedProduct {
  id: string;         // মঙ্গোডিবি ট্র্যাকিং ডেলিভারি আইডি
  productId: string;  // অরিজিনাল প্রোডাক্ট আইডি (p1, p2, p3 ইত্যাদি)
  name: string;
  price: string;
  image: string;
}

// 🎯 🚀 চমক: প্রতি পেজে ঠিক ৬টি করে রিভিউ কার্ড লক করা হলো ভাই!
const ITEMS_PER_PAGE = 6;

export default function ProductReviewsPage() {
  // Better-Auth সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  // লাইভ ডাটা ও লোডিং স্টেটস
  const [orderedProducts, setOrderedProducts] = useState<VerifiedProduct[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // প্যাজিনেশন কারেন্ট স্টেট নোড
  const [currentPage, setCurrentPage] = useState<number>(1);

  // কোন প্রোডাক্টের রিভিউ বক্স ওপেন আছে তা ট্র্যাক করার স্টেট
  const [activeReviewForm, setActiveReviewForm] = useState<string | null>(null);
  const [successProductId, setSuccessProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // সাবমিটিং ট্র্যাকিং স্টেট

  // 🍞 কাস্টম সিগনেচার টোস্ট স্টেট এবং ট্রিগার মেকানিজম
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); // ৩ সেকেন্ড পর হাওয়া করে দেয়
  };

  // প্রতিটি আলাদা প্রোডাক্টের জন্য ডাইনামিক ইনপুট স্টেট
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  // ⚡ ডাটাবেজ পাইপলাইন থেকে শুধু DELIVERED প্রোডাক্ট ডাটা সিঙ্ক করার ইফেক্ট
  useEffect(() => {
    if (session?.user?.id) {
      const syncDeliveredProducts = async () => {
        try {
          const rawDeliveries = await getDeliveriesFromBackend(session.user.id);

          if (rawDeliveries) {
            // 🔒 ট্রিপল-লকিং কন্ডিশন + স্ট্রিক্টলি status === "Delivered" ফিল্টার মেকানিজম
            const verifiedDeliveredItems = rawDeliveries
              .filter((item: any) => {
                const isIdMatch = String(item.userId) === String(session.user.id);
                const isNameMatch = item.userName?.trim().toLowerCase() === session.user.name?.trim().toLowerCase();
                const isEmailMatch = item.userEmail?.trim().toLowerCase() === session.user.email?.trim().toLowerCase();
                
                // 🎯 কন্ডিশন: শুধুমাত্র ডেলিভারি সম্পন্ন হওয়া আইটেমগুলো ফিল্টার হবে
                const isDelivered = item.status?.trim().toLowerCase() === "delivered";

                return isIdMatch && isNameMatch && isEmailMatch && isDelivered;
              })
              .map((item: any): VerifiedProduct => ({
                id: item._id, // ডেলিভারি নোড আইডি
                productId: item.productId || "p1",
                name: item.title || "Curated Asset Architecture",
                price: item.price ? `$${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00",
                image: item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=150"
              }));

            setOrderedProducts(verifiedDeliveredItems);
          }
        } catch (error) {
          console.error("❌ Failed to resolve dynamic product testimonials schema:", error);
        } finally {
          setIsDataLoading(false);
        }
      };

      syncDeliveredProducts();
    } else if (!isAuthPending && !session) {
      setIsDataLoading(false);
    }
  }, [session, isAuthPending]);

  // 📊 ৬টি ডেটার সাপেক্ষে প্যাজিনেশন ট্র্যাক ক্যালকুলেশন
  const totalPages = Math.ceil(orderedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return orderedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [orderedProducts, currentPage]);

  // স্টার ক্লিক হ্যান্ডলার
  const handleRatingChange = (productId: string, value: number) => {
    setRatings(prev => ({ ...prev, [productId]: value }));
  };

  // কমেন্ট টেক্সট হ্যান্ডলার
  const handleCommentChange = (productId: string, value: string) => {
    setComments(prev => ({ ...prev, [productId]: value }));
  };

  // 🚀 রিভিউ সাবমিট লজিক
  const handleSubmit = async (e: React.FormEvent, productId: string, productName: string) => {
    e.preventDefault();
    const productComment = comments[productId] || '';
    const productRating = ratings[productId] || 5;

    if (!productComment.trim()) return;

    try {
      setIsSubmitting(productId); // নির্দিষ্ট প্রোডাক্টের জন্য স্পিনার অন করা হলো ভাই

      // 📦 ডাইনামিক রিভিউ পেলোড স্ট্রাকচার
      const reviewPayload = {
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userName: session?.user?.name,
        productId,
        productName,
        rating: productRating,
        comment: productComment,
      };

      // 📡 সার্ভিস এপিআই এর মাধ্যমে ব্যাকএন্ড ম্যাট্রিক্সে ডেটা পাঠানো হলো ভাই
      const success = await sendToReviewsBackend(reviewPayload);

      if (success) {
        setSuccessProductId(productId);
        setActiveReviewForm(null);

        // 🍞 কাস্টম সিগনেচার টোস্ট মেসেজ ফায়ার হলো
        triggerToast("Product testimonial ledger record deployed successfully.");

        // স্টেট রিসেট অপারেশন
        setTimeout(() => {
          setSuccessProductId(null);
          setComments(prev => ({ ...prev, [productId]: '' }));
          setRatings(prev => ({ ...prev, [productId]: 5 }));
        }, 3500);
      } else {
        triggerToast("Failed to transmit server records. Try again.");
      }
    } catch (error) {
      console.error("❌ Error deploying review document schema:", error);
      triggerToast("Network anomalies detected. Action terminated.");
    } finally {
      setIsSubmitting(null); // স্পিনার অফ করা হলো
    }
  };

  const isLoading = isAuthPending || isDataLoading;

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full font-sans min-h-screen bg-transparent relative">
      
      {/* ─── FLOATING TOAST COMPONENT ─── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white px-4 py-3 border border-amber-500/30 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-[11px] font-mono tracking-wide text-stone-200">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl text-left">
        
        {/* Header Metadata */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Product Testimonials</h3>
          <p className="text-xs text-stone-500 mt-1">
            Showing page {currentPage} of {totalPages || 1} — {ITEMS_PER_PAGE} items per view list.
          </p>
        </div>

        {/* ⏳ পাইপলাইন ডাটা লোড লোডার */}
        {isLoading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-xl shadow-xs">
            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            <p className="text-[11px] font-mono text-stone-400">Verifying secure delivery ledgers...</p>
          </div>
        ) : !session ? (
          /* ⚠️ সেশন মিসিং প্রটেকশন */
          <div className="w-full py-6 text-center border border-dashed border-amber-300 bg-amber-50/40 rounded-xl text-xs font-mono text-amber-800 px-4 shadow-xs">
            ❌ Security Access Warning: Authentication context missing. Please log in to view verified purchases.
          </div>
        ) : orderedProducts.length === 0 ? (
          /* 📥 কোনো ডেলিভার্ড প্রোডাক্ট না থাকলে এম্পটি স্টেট */
          <div className="w-full py-14 flex flex-col items-center justify-center border border-dashed border-stone-300 bg-white rounded-xl shadow-xs px-4">
            <MessageSquare className="w-7 h-7 text-stone-300 mb-2 stroke-1" />
            <h3 className="text-sm font-serif font-light text-stone-400 tracking-wide">No verified delivered items found in your purchase history queue.</h3>
          </div>
        ) : (
          <>
            {/* 🖥️ লাইভ ডাইনামিক রিভিউ লিস্ট কার্ডস (সর্বোচ্চ ৬টি কন্টেন্ট) */}
            <div className="space-y-4">
              {paginatedProducts.map((product) => {
                const isOpen = activeReviewForm === product.id;
                const currentRating = ratings[product.id] || 5;
                const currentComment = comments[product.id] || '';
                const isSubmitted = successProductId === product.id;

                return (
                  <div key={product.id} className="bg-white border border-stone-200/60 rounded-xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
                    
                    {/* Product Layout Grid Row */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-50 border border-stone-100 rounded-lg overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-emerald-600 uppercase flex items-center gap-1 font-semibold">
                            <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-50" /> Delivered Purchase
                          </span>
                          <h4 className="font-serif text-base text-stone-900 font-light mt-0.5">{product.name}</h4>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">{product.price}</p>
                        </div>
                      </div>

                      {/* Trigger Actions Button */}
                      {!isSubmitted ? (
                        <button
                          onClick={() => setActiveReviewForm(isOpen ? null : product.id)}
                          className={`h-9 px-4 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 border transition-all rounded-lg min-h-[36px] ${
                            isOpen 
                              ? 'bg-stone-50 text-stone-900 border-stone-300' 
                              : 'bg-stone-950 text-white border-transparent hover:bg-stone-800'
                          }`}
                        >
                          Write A Review <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                      ) : (
                        <div className="h-9 px-3 bg-stone-900 text-white text-[11px] tracking-wide flex items-center gap-1.5 rounded-lg select-none animate-pulse">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Review Transmitted
                        </div>
                      )}
                    </div>

                    {/* ─── DYNAMIC ACCORDION FORM SYSTEM ─── */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-stone-100 bg-stone-50/40"
                        >
                          <form onSubmit={(e) => handleSubmit(e, product.id, product.name)} className="p-5 space-y-4 border-l-2 border-stone-950">
                            
                            {/* Interactive Star Selection Grid */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 block">Architectural Grade (Rating)</label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(product.id, star)}
                                    className="text-amber-500 transition-transform hover:scale-105 focus:outline-none w-8 h-8 flex items-center justify-center"
                                  >
                                    <Star className={`w-5 h-5 ${star <= currentRating ? 'fill-current' : 'text-stone-200'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Textarea Input Node */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 block">Your Experience</label>
                              <textarea
                                rows={3}
                                required
                                value={currentComment}
                                onChange={(e) => handleCommentChange(product.id, e.target.value)}
                                placeholder="Describe material scaling, craftsmanship aesthetics, or transit quality..."
                                className="w-full p-4 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-950 resize-none leading-relaxed shadow-inner"
                              />
                            </div>

                            {/* Action Transmission Button */}
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={isSubmitting === product.id}
                                className="h-10 px-5 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-lg min-h-[40px] shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isSubmitting === product.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                {isSubmitting === product.id ? "Transmitting..." : "Dispatch Testimonial"}
                              </button>
                            </div>

                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
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