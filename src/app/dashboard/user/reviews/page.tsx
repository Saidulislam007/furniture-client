'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Star, Send, ChevronLeft, ChevronRight, MessageSquare, Package } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { getDeliveriesFromBackend } from '@/services/api/getDelivery';
import { sendToReviewsBackend } from '@/services/api/postReview';
import { getProductReviewsFromBackend } from '@/services/api/reviewService';

interface VerifiedProduct {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
}

interface UserReview {
  _id: string;
  comment: string;
  rating: number;
  productId: string;
}

const ITEMS_PER_PAGE = 6;

export default function ProductReviewsPage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [orderedProducts, setOrderedProducts] = useState<VerifiedProduct[]>([]);
  const [allReviews, setAllReviews] = useState<UserReview[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeReviewForm, setActiveReviewForm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (session?.user?.id) {
      const syncData = async () => {
        try {
          setIsDataLoading(true);
          const rawDeliveries = await getDeliveriesFromBackend(session.user.id);
          const reviewsData = await getProductReviewsFromBackend(session.user.id); 

          if (Array.isArray(rawDeliveries)) {
            setOrderedProducts(rawDeliveries
              .filter((item: any) => item.status?.toLowerCase() === "delivered")
              .map((item: any): VerifiedProduct => ({
                id: item._id,
                productId: item.productId,
                name: item.title,
                price: `$${Number(item.price).toLocaleString()}`,
                image: item.image
              })));
          }
          if (Array.isArray(reviewsData)) setAllReviews(reviewsData);
        } finally {
          setIsDataLoading(false);
        }
      };
      syncData();
    } else if (!isAuthPending) setIsDataLoading(false);
  }, [session, isAuthPending]);

  const totalPages = Math.ceil(orderedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => 
    orderedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [orderedProducts, currentPage]
  );

  const handleSubmit = async (e: React.FormEvent, product: VerifiedProduct) => {
    e.preventDefault();
    setIsSubmitting(product.id);
    const success = await sendToReviewsBackend({
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      productId: product.productId,
      productName: product.name,
      rating: ratings[product.id] || 5,
      comment: comments[product.id] || ''
    });
    if (success) {
      setActiveReviewForm(null);
      // এখানে ডাটা রিফ্রেশ করার জন্য আবার syncData কল করতে পারেন
    }
    setIsSubmitting(null);
  };

  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-stone-900 mb-10">Client Testimonials</h2>

        {isDataLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
        ) : orderedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white p-6 rounded-full mb-4 shadow-sm border border-stone-100">
              <Package className="w-8 h-8 text-amber-800" />
            </div>
            <h3 className="text-xl font-serif text-stone-900 mb-2">No Deliveries Yet</h3>
            <p className="text-stone-500 font-mono text-sm max-w-xs">
              It seems you haven't received any artifacts yet. Once your collection arrives, you can share your thoughts here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedProducts.map((product) => {
              const productReview = allReviews.find(r => r.productId === product.productId);
              return (
                <div key={product.id} className="bg-white/50 border border-stone-200 p-6 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-serif text-lg">{product.name}</h4>
                        <p className="text-xs text-stone-500 font-mono">{product.price}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveReviewForm(activeReviewForm === product.id ? null : product.id)} className="text-xs uppercase tracking-widest bg-stone-900 text-white px-5 py-2.5 rounded-full">
                      {productReview ? "Edit Review" : "Add Review"}
                    </button>
                  </div>

                  {productReview && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-stone-100">
                      <div className="flex gap-1 mb-2">
                        {[...Array(productReview.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                      </div>
                      <p className="text-sm text-stone-700 italic">"{productReview.comment}"</p>
                    </div>
                  )}

                  {activeReviewForm === product.id && (
                    <form onSubmit={(e) => handleSubmit(e, product)} className="mt-6 pt-6 border-t border-stone-200">
                      <textarea className="w-full bg-transparent border border-stone-300 rounded-xl p-4 text-sm" rows={3} placeholder="Share your experience..." onChange={(e) => setComments({...comments, [product.id]: e.target.value})} />
                      <button type="submit" className="mt-4 bg-amber-800 text-white px-6 py-2 rounded-full text-xs uppercase flex items-center gap-2">
                        {isSubmitting === product.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />} Dispatch
                      </button>
                    </form>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full border border-stone-300 disabled:opacity-50"><ChevronLeft /></button>
                <span className="font-mono text-sm">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full border border-stone-300 disabled:opacity-50"><ChevronRight /></button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}