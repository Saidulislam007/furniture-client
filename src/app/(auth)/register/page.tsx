'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authClient } from '../../../lib/auth-client'; 

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>();

  const password = watch('password'); 

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      // ১. MongoDB-তে ইউজার ক্রিয়েট করা হচ্ছে
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (response?.error) {
        setServerError(response.error.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      } else {
        // 🚀 ফোর্সড সাইন-আউট: কোনো অবস্থাতেই যেন অটো-লগইন সেশন তৈরি না থাকে
        await authClient.signOut({
          redirect: false // নেক্সট-জেএস রিডাইরেকশন আমরা ম্যানুয়ালি হ্যান্ডেল করব
        });

        setServerSuccess('Account created successfully! Redirecting to login page...');
        
        // ⏳ ৩ সেকেন্ড পর লগইন পেজে রিডাইরেক্ট হবে
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: unknown) {
      setServerError('An unexpected network error occurred. Please check your database connection.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err: unknown) {
      setServerError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 flex font-sans pt-20">
      {/* Left Side: Luxury Editorial Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200')] bg-cover bg-center opacity-30 mix-blend-luminosity transition-transform duration-700 hover:scale-105" />
        <div className="relative z-10 max-w-md text-stone-100 font-serif">
          <p className="text-xs uppercase tracking-widest text-amber-500 mb-3">Atelier Custom Spaces</p>
          <h2 className="text-4xl xl:text-5xl font-light tracking-wide leading-tight mb-6">Details make the design, design makes the space.</h2>
          <div className="h-[1px] w-20 bg-amber-600 mb-6" />
          <p className="text-sm font-sans font-light tracking-wide text-stone-400 leading-relaxed">Join our premier membership program for early drop access, architecture consultation, and tiered loyalty rewards.</p>
        </div>
      </div>

      {/* Right Side: Fluid Form Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-12 xl:px-24 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-10 shadow-sm rounded"
        >
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide text-stone-900">Create Account</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">Register to enjoy secure express checkout and synchronized tracking.</p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs sm:text-sm border-l-2 border-red-600 rounded-r">
              {serverError}
            </div>
          )}

          {serverSuccess && (
            <div className="mb-5 p-3.5 bg-green-50 text-green-700 text-xs sm:text-sm border-l-2 border-green-600 rounded-r">
              {serverSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                disabled={isLoading}
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`w-full h-11 px-4 text-sm bg-stone-50/50 border rounded focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-stone-200'
                }`}
                placeholder="Said Halder"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

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
                placeholder="saidul@islam.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">Password</label>
              <input
                id="password"
                type="password"
                disabled={isLoading}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                className={`w-full h-11 px-4 text-sm bg-stone-50/50 border rounded focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-stone-200'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                disabled={isLoading}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || "Passwords don't match"
                })}
                className={`w-full h-11 px-4 text-sm bg-stone-50/50 border rounded focus:outline-none focus:ring-2 focus:ring-amber-700 transition-all ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-stone-200'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-stone-950 text-white font-serif tracking-widest text-xs uppercase rounded hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[44px] flex items-center justify-center disabled:bg-stone-400 pt-1"
            >
              {isLoading ? 'Creating Account...' : 'Open Account'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
            <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-stone-400">Or Continue With</span>
          </div>

          <button
            type="button"
            className="w-full h-12 border border-stone-200 text-sm font-medium text-stone-700 rounded flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors min-h-[44px]"
            onClick={handleGoogleSignIn}
          >
            Google Identity
          </button>

          <p className="mt-6 text-center text-xs sm:text-sm text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-amber-800 hover:text-amber-900 hover:underline">
              Sign In here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}