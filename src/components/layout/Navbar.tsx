'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart.store';
import AccountMenu from './AccountMenu';
import MobileMenuDrawer from './MobileMenuDrawer';
import { authClient } from '../../lib/auth-client';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  
  // Better-Auth সেশন হুক
  const { data: authData, isPending } = authClient.useSession();
  
  // 🎯 🟢 সেফগার্ড: রোল যদি আন্ডারডিফাইন্ড থাকে তবে পাথনাম (URL) চেক করে ব্যাকআপ রোল ইনজেক্ট করবে ভাই
  let currentRole = authData?.user?.role || 'user';
  if (!authData?.user?.role && pathname.includes('/dashboard/admin')) {
    currentRole = 'admin';
  } else if (!authData?.user?.role && pathname.includes('/dashboard/manager')) {
    currentRole = 'manager';
  }

  const session: UserSession | null = authData?.user ? {
    id: authData.user.id,
    name: authData.user.name,
    email: authData.user.email,
    role: currentRole.toLowerCase(), 
    emailVerified: authData.user.emailVerified,
    image: authData.user.image,
    createdAt: new Date(authData.user.createdAt),
    updatedAt: new Date(authData.user.updatedAt),
  } : null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsOpen(false);
          window.location.href = '/login'; 
        }
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicRoutes = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  const getLoggedInRoutes = (role?: string) => [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    ...(role === 'admin' || role === 'manager' ? [{  path: '/dashboard/products' }] : []),
    { name: 'Dashboard', path: `/dashboard/${role || 'user'}` },
  ];

  // 🎯 🟢 URL চেক করে ব্যাকআপ রাউট তৈরি লজিক
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const routes = (session || isDashboardRoute) 
    ? getLoggedInRoutes(session?.role || currentRole) 
    : publicRoutes;

  const isCartActive = pathname === '/cart';

  if (isPending) return <div className="h-20 bg-stone-50" />;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-serif border-b ${
        isScrolled 
          ? 'bg-stone-900/95 backdrop-blur-md text-stone-100 border-stone-800 shadow-lg py-3' 
          : 'bg-stone-50 text-stone-900 border-stone-200 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-widest uppercase min-h-[44px] flex items-center">
          ATELIER
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex space-x-8">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm tracking-wide uppercase transition-colors relative py-2 ${
                  isActive ? 'text-amber-600 font-semibold' : 'hover:text-amber-700 text-inherit'
                }`}
              >
                {route.name}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Cart Icon Badge */}
          {(!session || (session.role !== 'admin' && session.role !== 'manager')) && !isDashboardRoute && (
            <Link 
              href="/cart" 
              className={`relative p-2 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-300 ${
                isCartActive ? 'text-amber-600 font-semibold' : 'hover:text-amber-700 text-inherit'
              }`}
              aria-label="Shopping Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-sans font-bold leading-none text-white bg-amber-700 rounded-full transform translate-x-1/3 -translate-y-1/3"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Link>
          )}

          {/* Account Menu (Desktop Only) */}
          <div className="hidden md:block">
            <AccountMenu session={session} onSignOut={handleSignOut} />
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-inherit focus:outline-none focus:ring-2 focus:ring-amber-700 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open Navigation Menu"
            aria-expanded={isOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <MobileMenuDrawer 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
            routes={routes} 
            session={session || { role: currentRole }} // 🎯 🚀 ব্যাকআপ সেশন অবজেক্ট পাস
            onSignOut={handleSignOut}
          />
        )}
      </AnimatePresence>
    </header>
  );
}