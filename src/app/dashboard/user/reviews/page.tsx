'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, Send, ArrowRight, Package } from 'lucide-react';

// ডামি অর্ডার লিস্ট (ইউজার যা যা কিনেছে)
const orderedProducts = [
  { id: "p1", name: "Minimalist Lounge Chair", price: "$1,250.00", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=150" },
  { id: "p2", name: "Contemporary Ceramic Vase", price: "$170.00", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=150" }
];

export default function ProductReviewsPage() {
  // কোন প্রোডাক্টের রিভিউ বক্স ওপেন আছে তা ট্র্যাক করার স্টেট
  const [activeReviewForm, setActiveReviewForm] = useState<string | null>(null);
  const [successProductId, setSuccessProductId] = useState<string | null>(null);

  // প্রতিটি আলাদা প্রোডাক্টের জন্য ডাইনামিক ইনপুট স্টেট
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  // স্টার ক্লিক হ্যান্ডলার
  const handleRatingChange = (productId: string, value: number) => {
    setRatings(prev => ({ ...prev, [productId]: value }));
  };

  // কমেন্ট টেক্সট হ্যান্ডলার
  const handleCommentChange = (productId: string, value: string) => {
    setComments(prev => ({ ...prev, [productId]: value }));
  };

  // রিভিউ সাবমিট লজিক
  const handleSubmit = (e: React.FormEvent, productId: string, productName: string) => {
    e.preventDefault();
    const productComment = comments[productId] || '';
    const productRating = ratings[productId] || 5;

    if (!productComment.trim()) return;

    // 🚀 এখানে আপনার ব্যাকএন্ড এপিআই কল (axios/fetch) ইন্টিগ্রেট করবেন
    console.log("Submitting Review:", { productId, productName, productRating, productComment });

    // সফল সাবমিট নোটিফিকেশন ট্র্রিগার
    setSuccessProductId(productId);
    setActiveReviewForm(null);

    // স্টেট রিসেট
    setTimeout(() => {
      setSuccessProductId(null);
      setComments(prev => ({ ...prev, [productId]: '' }));
      setRatings(prev => ({ ...prev, [productId]: 5 }));
    }, 3500);
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
        
        {/* Header Metadata */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Product Testimonials</h3>
          <p className="text-xs text-stone-950 mt-1">Share your spatial experiences and design feedback for purchased manifests.</p>
        </div>

        {/* Ordered Products Loop Wrapper */}
        <div className="space-y-4">
          {orderedProducts.map((product) => {
            const isOpen = activeReviewForm === product.id;
            const currentRating = ratings[product.id] || 5;
            const currentComment = comments[product.id] || '';
            const isSubmitted = successProductId === product.id;

            return (
              <div key={product.id} className="bg-white border border-stone-200/60 rounded-sm shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">
                
                {/* Product Layout Grid Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                        <Package className="w-3 h-3" /> Verified Purchase
                      </span>
                      <h4 className="font-serif text-base text-stone-900 font-light mt-0.5">{product.name}</h4>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">{product.price}</p>
                    </div>
                  </div>

                  {/* Trigger Actions Button */}
                  {!isSubmitted ? (
                    <button
                      onClick={() => setActiveReviewForm(isOpen ? null : product.id)}
                      className={`h-9 px-4 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 border transition-all rounded-sm min-h-[36px] ${
                        isOpen 
                          ? 'bg-stone-50 text-stone-900 border-stone-300' 
                          : 'bg-stone-950 text-white border-transparent hover:bg-stone-800'
                      }`}
                    >
                      Write A Review <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                  ) : (
                    <div className="h-9 px-3 bg-stone-900 text-white text-[11px] tracking-wide flex items-center gap-1.5 rounded-sm select-none animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Review Transmitted
                    </div>
                  )}
                </div>

                {/* ─── DYNAMIC ACCORDION FORM SYSTEM (Rendered directly below the product) ─── */}
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
                            className="w-full p-4 text-xs bg-white border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 resize-none leading-relaxed shadow-inner"
                          />
                        </div>

                        {/* Action Transmission Button */}
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="h-10 px-5 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm min-h-[40px] shadow-xs"
                          >
                            <Send className="w-3 h-3" /> Dispatch Testimonial
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
      </motion.div>
    </main>
  );
}