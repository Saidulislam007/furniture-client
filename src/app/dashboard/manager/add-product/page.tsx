'use client';

import React, { useState } from 'react';
// 🚀 🟢 AnimatePresence ইম্পোর্ট করা হলো
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Image as ImageIcon, Save, Palette, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { sendFurnitureToBackend } from '@/services/furniture';
import { authClient } from "@/lib/auth-client";

interface ColorOption {
  name: string;
  hex: string;
}

export default function AddProductNodePage() {
  const { data: session } = authClient.useSession();

  const [colors, setColors] = useState<ColorOption[]>([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#374151');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🚀 🟢 টোস্ট নোটিফিকেশন স্টেট ও হ্যান্ডলার নোড
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); // ৩ সেকেন্ড পর হাইড হবে
  };

  const handleAddColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!colorName.trim()) return;
    setColors((prevColors) => [...prevColors, { name: colorName, hex: colorHex }]);
    setColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget; 
    const formData = new FormData(formElement);
    
    const payload = {
      title: formData.get('title'),
      price: Number(formData.get('price')),
      oldPrice: formData.get('oldPrice') ? Number(formData.get('oldPrice')) : undefined,
      deliveryFee: formData.get('deliveryFee') ? Number(formData.get('deliveryFee')) : 0,
      category: formData.get('category'),
      subCategory: formData.get('subCategory'),
      stock: Number(formData.get('stock')),
      material: formData.get('material'),
      warranty: formData.get('warranty'),
      description: formData.get('description'),
      image: formData.get('image'),
      dimensions: {
        width: formData.get('width'),
        height: formData.get('height'),
        depth: formData.get('depth'),
      },
      colors: colors,
      managerId: session?.user?.id || "anonymous_manager_node",
      managerEmail: session?.user?.email || "anonymous@atelier.studio"
    };

    const success = await sendFurnitureToBackend(payload);
    
    if (success) {
      setColors([]); 
      formElement.reset(); 
      // 🚀 🟢 এলার্টের পরিবর্তে এখন আপনার কাঙ্ক্ষিত প্রিমিয়াম টোস্ট নোটিফিকেশন শো করবে
      triggerToast("Asset ledger spec successfully pushed to studio validation pipeline.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans bg-stone-50/40 min-h-screen relative">
      
      {/* 🚀 🟢 ফ্লোটিং লাক্সারি টোস্ট নোটিফিকেশন ইঞ্জিন */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> 
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl mx-auto">
        
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-stone-950 stroke-1" /> Register New Asset
          </h3>
          <p className="text-xs text-stone-950 mt-1">Initialize a new luxury furniture draft specification into the studio catalog nodes.</p>
        </div>

        {!session && (
          <div className="p-3 text-xs text-amber-800 bg-amber-50 border border-amber-200/60 rounded-sm">
            ⚠️ Warning: Active auth session node not verified. Form payload will fallback to anonymous metadata.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs">
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Asset Title</label>
            <input name="title" type="text" placeholder="e.g., Flexform Status Sofa" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Current Price (USD)</label>
              <input name="price" type="number" placeholder="1499" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Original / Old Price (USD)</label>
              <input name="oldPrice" type="number" placeholder="2500" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Delivery Fee (USD)</label>
              <input name="deliveryFee" type="number" placeholder="0.00 (Default 0)" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Category</label>
              <input name="category" type="text" placeholder="e.g., Living Room" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Sub-Category</label>
              <input name="subCategory" type="text" placeholder="e.g., Sofas & Couches" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Stock Count</label>
              <input name="stock" type="number" placeholder="e.g., 14" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Material</label>
              <input name="material" type="text" placeholder="e.g., Italian Leather & Solid Walnut" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Warranty</label>
              <input name="warranty" type="text" placeholder="e.g., 5 Years Framework Warranty" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 block">Dimensions Specification</label>
            <div className="grid grid-cols-3 gap-3">
              <input name="width" type="text" placeholder="Width (e.g., 220 cm)" className="h-11 px-3 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono text-center" required />
              <input name="height" type="text" placeholder="Height (e.g., 85 cm)" className="h-11 px-3 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono text-center" required />
              <input name="depth" type="text" placeholder="Depth (e.g., 95 cm)" className="h-11 px-3 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono text-center" required />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Description</label>
            <textarea name="description" rows={4} placeholder="Describe the upholstered silhouette, luxury fabrics, or modern aesthetics..." className="w-full p-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 resize-none leading-relaxed" required></textarea>
          </div>

          <div className="border border-stone-200/60 p-4 rounded-sm bg-stone-50/30 space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-stone-500" />
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Color Variants Configuration</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="text" placeholder="Color Name (e.g., Charcoal)" className="flex-1 h-9 px-3 text-xs bg-white border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" value={colorName} onChange={e => setColorName(e.target.value)} />
              <input type="color" className="w-9 h-9 border border-stone-200 rounded-sm cursor-pointer p-0 bg-transparent shrink-0" value={colorHex} onChange={e => setColorHex(e.target.value)} />
              <button type="button" onClick={handleAddColor} className="h-9 px-4 bg-stone-950 text-white text-[11px] uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors">Add</button>
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                {colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 border border-stone-200 rounded-sm text-[11px]">
                    <span className="w-3 h-3 rounded-full border border-stone-100" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                    <button type="button" onClick={() => handleRemoveColor(idx)} className="text-stone-400 hover:text-red-600 transition-colors ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-stone-400" /> Studio Render Image URL
            </label>
            <input name="image" type="url" placeholder="https://images.unsplash.com/photo-..." className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono text-stone-700" required />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm pt-0.5 shadow-xs disabled:bg-stone-400 disabled:cursor-not-allowed">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Deploy Spec to Pipeline
          </button>
        </form>

      </motion.div>
    </main>
  );
}