'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Save } from 'lucide-react';

export default function AddProductNodePage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
        
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-stone-950 stroke-1" /> Register New Asset
          </h3>
          <p className="text-xs text-stone-950 mt-1">Initialize a new luxury furniture draft specification into the studio catalog nodes.</p>
        </div>

        <form className="space-y-5 text-xs sm:text-sm bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Asset Title</label>
            <input type="text" placeholder="e.g., Calacatta Marble Credenza" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Universal SKU Code</label>
              <input type="text" placeholder="ATL-CL-991" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Valuation (Price USD)</label>
              <input type="number" placeholder="0.00" className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Studio Render Assets</label>
            <div className="border border-dashed border-stone-300 rounded-sm p-6 bg-stone-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-stone-50 transition-colors">
              <Upload className="w-5 h-5 text-stone-400 mb-2" />
              <span className="text-[11px] font-medium text-stone-700">Upload high-res blueprint/render</span>
              <span className="text-[10px] text-stone-400 mt-0.5">PNG, JPG up to 10MB</span>
            </div>
          </div>

          <button type="submit" className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm pt-0.5 shadow-xs">
            <Save className="w-4 h-4" /> Save As Draft Spec
          </button>
        </form>

      </motion.div>
    </main>
  );
}