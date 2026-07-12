'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save } from 'lucide-react';

export default function SystemSettingsPage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-stone-950 stroke-1" /> System Global Configurations
          </h3>
          <p className="text-xs text-stone-950 mt-1">Manage global baseline commissions, API throttling limits, and data archival states.</p>
        </div>
        
        <form className="bg-white border border-stone-200/60 p-6 rounded-sm space-y-5 text-xs sm:text-sm">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">Default Platform Commission (%)</label>
            <input type="number" defaultValue={20} className="h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
          </div>
          <button type="button" className="w-full h-11 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-xs">
            <Save className="w-4 h-4" /> Save Configuration Parameters
          </button>
        </form>
      </motion.div>
    </main>
  );
}