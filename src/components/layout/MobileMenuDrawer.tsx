'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserSession } from '@/lib/auth/roles';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Array<{ name: string; path: string }>;
  session: UserSession | null;
  onSignOut: () => void; // Navbar থেকে সেশন ক্লিয়ার করার হ্যান্ডলার
}

export default function MobileMenuDrawer({ onClose, routes, session, onSignOut }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus Trapping implementation for Accessibility (A11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll('button, a, input');
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
      />

      {/* Drawer Body */}
      <motion.div
        ref={drawerRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-stone-900 text-stone-100 p-6 z-50 flex flex-col justify-between border-l border-stone-800 shadow-2xl shadow-black"
        role="dialog"
        aria-modal="true"
      >
        <div>
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold tracking-widest text-lg uppercase">ATELIER</span>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links Grid */}
          <nav className="flex flex-col space-y-5">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={onClose}
                className="text-base uppercase tracking-wider py-2 border-b border-stone-800 hover:text-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600 rounded min-h-[44px] flex items-center"
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Status */}
        <div className="pt-6 border-t border-stone-800">
          {session ? (
            // 🔴 User Logged In থাকলে এই ভিউ দেখাবে
            <div className="flex flex-col space-y-3">
              <div className="text-sm font-sans text-stone-400">
                Active Role: <span className="text-amber-500 font-bold">{session.role}</span>
              </div>
              <button
                onClick={() => { 
                  onClose(); 
                  onSignOut(); // সেশন নাল করার জন্য প্যারেন্ট ফাংশন কল
                }}
                className="w-full text-center text-sm font-sans tracking-wide bg-stone-800 text-red-400 py-3 rounded hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // 🟢 User Logged Out থাকলে Sign In এবং Register বাটন পাশাপাশি দেখাবে
            <div className="flex flex-col space-y-3 font-sans">
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full text-center text-sm tracking-wide bg-stone-800 text-stone-200 py-3 rounded hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-600 min-h-[44px] flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block w-full text-center text-sm tracking-wide bg-amber-800 text-white py-3 rounded hover:bg-amber-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600 min-h-[44px] flex items-center justify-center font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}