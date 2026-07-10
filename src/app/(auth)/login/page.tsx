'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);
    try {
      console.log('Sending secure payload to NestJS Auth API:', data);
      // API call logic here
    } catch (err: unknown) {
      setServerError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 flex font-sans pt-20">
      {/* Left Side: Luxury Editorial Brand Image (Visible from 1024px to 1920px) */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 hover:scale-105" />
        <div className="relative z-10 max-w-md text-stone-100 font-serif">
          <p className="text-xs uppercase tracking-widest text-amber-500 mb-3">Atelier Collections</p>
          <h2 className="text-4xl xl:text-5xl font-light tracking-wide leading-tight mb-6">Simplicity is the ultimate sophistication.</h2>
          <div className="h-[1px] w-20 bg-amber-600 mb-6" />
          <p className="text-sm font-sans font-light tracking-wide text-stone-400 leading-relaxed">Experience craft-centric high-end furniture designed for timeless spaces.</p>
        </div>
      </div>

      {/* Right Side: Fluid Form Box (320px to 1920px responsive) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-12 xl:px-24 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-10 shadow-sm rounded"
        >
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide text-stone-900">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">Sign in to access your curated dashboard & past orders.</p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs sm:text-sm border-l-2 border-red-600 rounded-r">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full h-11 px-4 text-sm bg-stone-50/50 border rounded focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-200'
                }`}
                placeholder="alex@example.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-stone-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-amber-800 hover:text-amber-900 hover:underline">Forgot?</Link>
              </div>
              <input
                id="password"
                type="password"
                disabled={isLoading}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`w-full h-11 px-4 text-sm bg-stone-50/50 border rounded focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-stone-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-stone-950 text-white font-serif tracking-widest text-xs uppercase rounded hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[44px] flex items-center justify-center disabled:bg-stone-400"
            >
              {isLoading ? 'Verifying...' : 'Sign In Account'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
            <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-stone-400">Or Continue With</span>
          </div>

          <button
            type="button"
            className="w-full h-12 border border-stone-200 text-sm font-medium text-stone-700 rounded flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors min-h-[44px]"
            onClick={() => console.log('Redirecting to NestJS Google OAuth url')}
          >
            Google Identity
          </button>

          <p className="mt-8 text-center text-xs sm:text-sm text-stone-600">
            New to Atelier?{' '}
            <Link href="/register" className="font-semibold text-amber-800 hover:text-amber-900 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}