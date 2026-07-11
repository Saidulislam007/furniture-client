'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function NewsletterSection({
  title = "Join the Atelier Registry",
  subtitle = "Bespoke Architecture & Design Updates",
  description = "Subscribe to receive private gallery previews, limited-run collection drops, and editorial space-styling notes directly to your inbox."
}: NewsletterSectionProps) {
  // ─── STATE MANAGEMENT ───
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ─── NATIVE REGEX VALIDATION ───
  const validateEmail = (emailStr: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(emailStr);
  };

  // ─── SUBMISSION HANDLER ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // ১. এম্পটি ফিল্ড চেক
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    // ২. ফরম্যাট ভ্যালিডেশন
    if (!validateEmail(email)) {
      setError('Please enter a valid architectural email address.');
      return;
    }

    setIsLoading(true);

    try {
      // ⏳ কৃত্রিম নেটওয়ার্ক ডিলে (লকিং স্টেট টেস্ট করার জন্য)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Native Registered Email:", email);
      
      // সাকসেস স্টেট মেসেজ
      setSuccess('Welcome to Atelier. Check your inbox for confirmation.');
      setEmail(''); // ফিল্ড ক্লিন
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-stone-100 py-20 sm:py-24 xl:py-32 border-b border-stone-200 overflow-hidden text-stone-900 font-serif">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          {/* Header Copy */}
          <div className="space-y-3">
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              {subtitle}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-stone-900 leading-tight">
              {title}
            </h2>
            <div className="h-[1px] w-12 bg-amber-700/60 mt-4 mx-auto" />
          </div>

          <p className="text-xs sm:text-sm md:text-base font-sans font-light tracking-wide text-stone-500 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          {/* ─── NATIVE FEEDBACK MESSAGES ─── */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-xl mx-auto p-3.5 bg-red-50 text-red-700 text-xs font-sans border-l-2 border-red-600 rounded-r text-left"
              >
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-xl mx-auto p-3.5 bg-green-50 text-green-700 text-xs font-sans border-l-2 border-green-600 rounded-r text-left"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── FORM IMPLEMENTATION ─── */}
          <div className="max-w-xl mx-auto w-full">
            <form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 w-full animate-none"
              noValidate // ব্রাউজারের ডিফল্ট পপআপ অফ করে আমাদের লাক্সারি মেসেজ দেখানোর জন্য
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if(error) setError(null); // ইউজার টাইপ করা শুরু করলে এরর হাইড হবে
                  }}
                  placeholder="Enter your email address..."
                  disabled={isLoading}
                  className={`w-full h-12 sm:h-14 px-5 text-sm bg-white border font-sans font-light tracking-wide rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-stone-300'
                  } disabled:bg-stone-50 disabled:text-stone-400`}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={isLoading ? {} : { y: -2 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                className="h-12 sm:h-14 px-8 bg-stone-950 text-white text-xs uppercase tracking-widest font-serif font-medium rounded-sm shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all min-h-[44px] sm:min-w-[150px] flex items-center justify-center disabled:bg-stone-400 disabled:cursor-not-allowed pt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </form>

            {/* Privacy Microcopy */}
            <p className="text-[10px] sm:text-xs font-sans font-light tracking-wide text-stone-400 text-center mt-4">
              We respect your structural privacy. Unsubscribe securely in one click at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}