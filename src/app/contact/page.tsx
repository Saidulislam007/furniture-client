'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
// 🚀 আপনার কাস্টম এক্সপ্রেস অ্যাকশন ফাইল থেকে সাবমিশন ফাংশনটি ইম্পোর্ট করা হলো ভাই
import { sendContactMessageToBackend } from '@/services/api/contactMessages';

// --- Types & Interfaces ---
interface ContactInput {
  name: string;
  email: string;
  phone: string; // 🚀 🟢 নতুন ফোন নম্বর ফিল্ড স্টেট টাইপ
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string; // 🚀 🟢 নতুন ফোন নম্বর ভ্যালিডেশন এরর টাইপ
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  // ─── STATE MANAGEMENT ───
  const [formData, setFormData] = useState<ContactInput>({
    name: '',
    email: '',
    phone: '', // 🚀 🟢 ফোন নম্বর ইনিশিয়াল স্টেট খালি রাখা হলো ভাই
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ─── NATIVE VALIDATION LOUPE ───
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // 📞 ইন্টারন্যাশনাল এবং লোকাল ফোন নম্বরের জন্য স্ট্যান্ডার্ড রেগুলার এক্সপ্রেশন গার্ড ভাই
    const phoneRegex = /^[0-9\s+-]{10,15}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid architectural email address.';
    }

    // 📞 🟢 ফোন নম্বর স্ট্রিন্ট ভ্যালিডেশন চেক লজিক ভাই
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid contact number (10-15 digits).';
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message content cannot be empty.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── SUBMISSION HANDLER WITH LIVE EXPRESS BACKEND INTEGRATION ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 📡 🚀 🟢 আপনার নতুন এক্সপ্রেস এপিআই ফাংশনটি এখানে এক্সিকিউট করা হলো ভাই (ফোন নম্বর ডাটা সহ যাবে)
      const success = await sendContactMessageToBackend(formData);
      
      if (success) {
        setSuccessMessage('Message transmitted successfully. Our concierge team will connect shortly.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // সাকসেসফুলি ফর্ম সম্পূর্ণ রিসেট
        setErrors({});
      } else {
        setSuccessMessage('Transmission failed. Express pipeline rejected database ledger record.');
      }
    } catch (err) {
      console.error("❌ Transmission exception:", err);
      setSuccessMessage('Network anomalies detected. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full bg-stone-50 text-stone-900 font-serif overflow-hidden">
      
      {/* ─── 1. ARCHITECTURAL HEADER ─── */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 xl:pt-48 xl:pb-20 border-b border-stone-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl space-y-4"
          >
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-amber-700 font-semibold">
              Connect With Us
            </p>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-light tracking-wide text-stone-950">
              Begin Your Space Narrative.
            </h1>
            <p className="text-stone-500 font-sans font-light text-xs sm:text-sm tracking-wide leading-relaxed">
              Whether requesting an architectural consultation, bespoke framing configuration, or gallery inquiry, our London concierge team responds within 24 business hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. CONTACT SYSTEM / TWO-COLUMN GRID ─── */}
      <section className="w-full py-16 sm:py-20 xl:py-28 bg-white">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
            
            {/* Left Column: Studio Directory Details */}
            <div className="lg:col-span-4 space-y-10 text-left">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-sans tracking-widest text-stone-400 font-semibold">Central Atelier HQ</h3>
                <p className="text-lg text-stone-900 leading-relaxed font-light">
                  84 Editorial St,<br />Belgravia, London,<br />SW1X 8PX, United Kingdom
                </p>
              </div>

              <div className="space-y-4 border-t border-stone-100 pt-8 font-sans text-xs tracking-wide">
                <div className="space-y-1">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">General & Bespoke Inquiries</span>
                  <a href="mailto:concierge@atelier.com" className="text-stone-800 hover:text-amber-800 font-medium transition-colors">concierge@atelier.com</a>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Press & Editorial Journal</span>
                  <a href="mailto:media@atelier.com" className="text-stone-800 hover:text-amber-800 font-medium transition-colors">media@atelier.com</a>
                </div>
                <div className="space-y-1 pt-2">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Direct Concierge Voice</span>
                  <span className="text-stone-800 font-medium tabular-nums">+44 658 3456 345</span>
                </div>
              </div>
            </div>

            {/* Right Column: Native Curated Interactive Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-8 bg-stone-50/50 p-6 sm:p-10 border border-stone-200/60 rounded-xl shadow-xs"
            >
              {/* Success Notification Alert */}
              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 bg-stone-950 text-white text-xs font-sans tracking-wide rounded-sm border-l-2 border-amber-600 flex items-center justify-between"
                  >
                    <span>{successMessage}</span>
                    <button type="button" onClick={() => setSuccessMessage(null)} className="text-stone-400 hover:text-white">✕</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🎯 🚀 ফর্ম সাবমিশনে handleSubmit বাইন্ড করা আছে ভাই */}
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">Full Name</label>
                    <input
                      type="text"
                      disabled={isLoading}
                      value={formData.name}
                      onChange={(e) => { setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: undefined}); }}
                      className={`w-full h-11 px-4 text-xs font-sans bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                      placeholder="e.g. Jonathan Wright"
                    />
                    {errors.name && <p className="text-red-600 font-sans text-[10px] mt-1 font-medium tracking-wide">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">Email Address</label>
                    <input
                      type="email"
                      disabled={isLoading}
                      value={formData.email}
                      onChange={(e) => { setFormData({...formData, email: e.target.value}); if(errors.email) setErrors({...errors, email: undefined}); }}
                      className={`w-full h-11 px-4 text-xs font-sans bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all ${errors.email ? 'border-red-500' : 'border-stone-200'}`}
                      placeholder="name@company.com"
                    />
                    {errors.email && <p className="text-red-600 font-sans text-[10px] mt-1 font-medium tracking-wide">{errors.email}</p>}
                  </div>
                </div>

                {/* 📞 🟢 নতুন ইন্টিগ্রেটেড ফোন নম্বর ইনপুট নোড (১০০% রেসপন্সিভ লেআউট ভাই) */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">Contact Number</label>
                  <input
                    type="tel"
                    disabled={isLoading}
                    value={formData.phone}
                    onChange={(e) => { setFormData({...formData, phone: e.target.value}); if(errors.phone) setErrors({...errors, phone: undefined}); }}
                    className={`w-full h-11 px-4 text-xs font-sans bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all ${errors.phone ? 'border-red-500' : 'border-stone-200'}`}
                    placeholder="e.g. +880 1712 345 678"
                  />
                  {errors.phone && <p className="text-red-600 font-sans text-[10px] mt-1 font-medium tracking-wide">{errors.phone}</p>}
                </div>

                {/* Subject Input */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">Subject / Intent</label>
                  <input
                    type="text"
                    disabled={isLoading}
                    value={formData.subject}
                    onChange={(e) => { setFormData({...formData, subject: e.target.value}); if(errors.subject) setErrors({...errors, subject: undefined}); }}
                    className={`w-full h-11 px-4 text-xs font-sans bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all ${errors.subject ? 'border-red-500' : 'border-stone-200'}`}
                    placeholder="Bespoke consultation request, project timeline, etc."
                  />
                  {errors.subject && <p className="text-red-600 font-sans text-[10px] mt-1 font-medium tracking-wide">{errors.subject}</p>}
                </div>

                {/* Message TextArea */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-500">Your Message</label>
                  <textarea
                    rows={5}
                    disabled={isLoading}
                    value={formData.message}
                    onChange={(e) => { setFormData({...formData, message: e.target.value}); if(errors.message) setErrors({...errors, message: undefined}); }}
                    className={`w-full p-4 text-xs font-sans bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 transition-all resize-none leading-relaxed ${errors.message ? 'border-red-500' : 'border-stone-200'}`}
                    placeholder="Describe your residential configuration goals..."
                  />
                  {errors.message && <p className="text-red-600 font-sans text-[10px] mt-1 font-medium tracking-wide">{errors.message}</p>}
                </div>

                {/* Submit CTA Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={isLoading ? {} : { y: -1 }}
                  whileTap={isLoading ? {} : { scale: 0.99 }}
                  className="w-full h-12 bg-stone-950 text-white text-xs font-serif font-medium uppercase tracking-widest shadow-sm hover:bg-stone-800 transition-colors flex items-center justify-center rounded-lg disabled:bg-stone-400 disabled:cursor-not-allowed pt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 font-sans text-xs tracking-normal normal-case">
                      <Loader2 className="animate-spin h-4 w-4" /> Transmitting...
                    </span>
                  ) : (
                    'Transmit Message'
                  )}
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}