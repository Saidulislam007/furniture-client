'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: 'Saidul Islam', email: 'saidul@islam.com', phone: '+44 7911 123456' });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl bg-white border border-stone-200/60 p-6 sm:p-10 rounded-sm shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950">Profile Identity</h3>
          <p className="text-xs text-stone-400 mt-1">Manage architectural shipping protocols and account metrics.</p>
        </div>

        {showSuccess && (
          <div className="p-3.5 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 flex items-center gap-2 rounded-sm">
            <CheckCircle className="w-4 h-4 text-amber-500" /> Identity configuration transmitted successfully.
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-5 text-xs sm:text-sm">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Legal Name</label>
            <input 
              type="text" required value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">Secure Contact Email</label>
            <input 
              type="email" required value={profile.email} 
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full h-11 px-4 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all"
            />
          </div>

          <button 
            type="submit" disabled={isSaving}
            className="w-full h-12 bg-stone-950 text-white text-xs font-serif uppercase tracking-widest shadow-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm min-h-[44px]"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Transmitting...' : 'Save Configuration'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}