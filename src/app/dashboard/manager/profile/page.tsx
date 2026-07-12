'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';

export default function ManagerProfilePage() {
  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
        
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <User className="w-6 h-6 text-stone-950 stroke-1" /> Profile Center
          </h3>
          <p className="text-xs text-stone-950 mt-1">Manage credentials and secure administrative authorization states.</p>
        </div>

        <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-xs space-y-5">
          <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
            <div className="w-12 h-12 bg-stone-950 rounded-sm flex items-center justify-center text-white font-serif text-lg font-light">
              M
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Studio Catalog Admin</h4>
              <p className="text-xs text-stone-400 font-mono">manager@studio-atellier.com</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-400">Node Permissions</span>
              <span className="font-mono font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1 text-xs">
                <Shield className="w-3.5 h-3.5" /> Full Write Access
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-400">Registry Date</span>
              <span className="text-stone-700 font-mono">July 12, 2026</span>
            </div>
          </div>
        </div>

      </motion.div>
    </main>
  );
}