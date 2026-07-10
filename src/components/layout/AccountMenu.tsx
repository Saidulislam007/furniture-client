// src/components/layout/AccountMenu.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSession } from '@/lib/auth/roles';

// 1. Component props-এর জন্য TypeScript interface ডিফাইন করা
interface AccountMenuProps {
  session: UserSession | null;
  onSignOut: () => void; // Parent component-এর স্টেট ক্লিয়ার করার জন্য ফাংশন টাইপ
}

export default function AccountMenu({ session, onSignOut }: AccountMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // 🟢 User logged out থাকলে (session === null) এই লাক্সারি বাটন জোড়া দেখাবে
  if (!session) {
    return (
      <div className="flex items-center space-x-3 font-sans">
        <Link 
          href="/login" 
          className="text-xs uppercase tracking-wider text-stone-700 hover:text-stone-950 transition-colors focus:outline-none focus:ring-1 focus:ring-stone-400 px-3 py-2 rounded min-h-[44px] flex items-center"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="text-xs uppercase tracking-wider bg-stone-900 text-white px-5 py-2.5 rounded hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[44px] flex items-center shadow-sm font-medium"
        >
          Register
        </Link>
      </div>
    );
  }

  // 🔴 User logged in থাকলে এই ড্রপডাউন মেনু দেখাবে
  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 p-1 focus:outline-none focus:ring-2 focus:ring-amber-700 rounded min-h-[44px]"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="text-sm font-medium border-b border-dashed border-stone-400 max-w-[100px] truncate">
          Hi, {session.name}
        </span>
        <span className="text-[10px] bg-amber-700/10 text-amber-800 px-1.5 py-0.5 rounded font-sans font-semibold tracking-normal uppercase">
          {session.role}
        </span>
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-52 bg-white text-stone-900 shadow-xl border border-stone-200 rounded py-2 z-50 font-sans"
          >
            <div className="px-4 py-2 border-b border-stone-100 text-xs text-stone-500">
              Logged in as <span className="font-semibold block truncate text-stone-800">{session.email}</span>
            </div>
            
            <Link href={`/dashboard/${session.role.toLowerCase()}`} className="block px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors focus:bg-stone-50 focus:outline-none">
              Control Panel
            </Link>
            <Link href="/dashboard/orders" className="block px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors focus:bg-stone-50 focus:outline-none">
              My Purchase History
            </Link>
            
            <hr className="my-1 border-stone-100" />
            
            {/* 🛠️ Sign Out বাটনে onClick ইভেন্টে প্রপস ফাংশনটি কল করা হয়েছে */}
            <button
              onClick={() => {
                setDropdownOpen(false); // মেনু ক্লোজ করবে
                onSignOut();           // Navbar component-এর session স্টেটকে null করে দিবে
              }}
              className="w-full text-left text-red-600 px-4 py-2.5 text-sm hover:bg-red-50/50 transition-colors focus:bg-red-50 focus:outline-none min-h-[44px]"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}