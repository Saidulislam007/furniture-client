'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const dummyWishlist = [
  { id: "p3", title: "Travertine Coffee Table", price: 890.00, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=300" },
  { id: "p4", title: "Sleek Pendant Light", price: 210.00, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300" }
];

export default function WishlistPage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Curated Wishlist</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyWishlist.map((item) => (
            <div key={item.id} className="bg-white border border-stone-200/60 p-4 rounded-sm shadow-sm flex flex-col justify-between group">
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-4 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-serif text-base text-stone-900 font-light">{item.title}</h4>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <button className="w-full h-10 bg-stone-950 text-white text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors min-h-[40px]">
                <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}