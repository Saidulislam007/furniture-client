'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authClient } from '../../lib/auth-client';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Array<{ name: string; path: string }>;
  session: any;
  onSignOut: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose, routes, session, onSignOut }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // 🚀 Better-Auth ব্যাকআপ সেশন চেক
  const { data: authData } = authClient.useSession();
  const activeUser = session || authData?.user;

  // Focus Trapping implementation for Accessibility (A11y)
  useEffect(() => {
    if (!isOpen) return;

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
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-[9998] backdrop-blur-xs"
      />

      {/* Drawer Body */}
      <motion.div
        ref={drawerRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        style={{ 
          backgroundColor: '#0c0a09',
          height: '100vh',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '320px', 
          position: 'fixed',
          top: 0,
          right: 0,
          overflowY: 'auto',
          display: 'block', 
          opacity: 1 
        }}
        className="text-stone-100 p-6 z-[9999] border-l border-stone-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-10 mt-2 w-full">
          <span className="font-serif font-light tracking-[0.2em] text-xl text-white select-none">ATELIER</span>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-stone-900/50"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links Grid */}
        <nav className="flex flex-col space-y-2 w-full">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={onClose}
              className="text-sm uppercase tracking-[0.15em] py-3.5 border-b border-stone-900 text-stone-200 hover:text-amber-500 transition-colors focus:outline-none min-h-[44px] flex items-center font-sans font-medium"
            >
              {route.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Profile Status */}
        <div className="pt-6 border-t border-stone-900 mt-12 w-full">
          {activeUser ? (
            <div className="flex flex-col space-y-3 w-full">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                Active Role: <span className="text-amber-500 font-bold uppercase">{activeUser.role}</span>
              </div>
              <button
                onClick={() => { 
                  onClose(); 
                  onSignOut(); 
                }}
                className="w-full text-center text-xs font-sans uppercase tracking-widest bg-stone-900 text-red-400 py-3.5 rounded-xs hover:bg-stone-800 transition-colors min-h-[44px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 font-sans w-full">
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full text-center text-xs uppercase tracking-widest bg-stone-900 text-stone-200 py-3.5 rounded-xs hover:bg-stone-800 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block w-full text-center text-xs uppercase tracking-widest bg-amber-800 text-white py-3.5 rounded-xs hover:bg-amber-900 transition-colors min-h-[44px] flex items-center justify-center font-medium"
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