'use client';

import React from 'react';

export default function Loading() {
  return (
    /* 🎯 🟢 সাইডবার লক রেখে ডানদিকের মেইন {children} বক্সের ভেতরে শপ পেজের আইডেন্টিকাল লাক্সারি UI */
    <div className="w-full min-h-[75vh] bg-[#f4f0eb] flex items-center justify-center animate-pulse rounded-sm border border-stone-200/10">
      <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">
        ATELIER
      </p>
    </div>
  );
}