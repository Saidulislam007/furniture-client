'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function SupportPage() {
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    setSupportSuccess(true);
    setSupportMsg('');
    setTimeout(() => setSupportSuccess(false), 4000);
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl bg-white border border-stone-200/60 p-6 sm:p-10 rounded-sm shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Concierge Support Terminal</h3>
          <p className="text-xs text-stone-400 mt-1">Direct communication bridge with our spatial care experts.</p>
        </div>

        {supportSuccess && (
          <div className="p-3.5 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm">
            Message transmitted successfully. A dedicated concierge will connect via phone/email shortly.
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Describe Your Inquiry</label>
            <textarea rows={5} required value={supportMsg} onChange={(e) => setSupportMsg(e.target.value)} placeholder="State your order issue or modification requirements..." className="w-full p-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-700 resize-none leading-relaxed" />
          </div>
          <button type="submit" className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm min-h-[44px]">
            <Send className="w-3.5 h-3.5" /> Dispatch Message
          </button>
        </form>
      </motion.div>
    </main>
  );
}