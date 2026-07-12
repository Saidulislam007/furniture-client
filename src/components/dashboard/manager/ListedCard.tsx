'use client';

import React from 'react';
import { Archive } from 'lucide-react';

interface ListedCardProps {
  count: number;
}

export function ListedCard({ count }: ListedCardProps) {
  return (
    <div className="bg-white border border-stone-200/60 p-5 sm:p-6 rounded-sm shadow-xs flex items-start justify-between transition-all duration-300 hover:shadow-sm">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Total Furniture Listed</p>
        <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900 tabular-nums">{count} Units</h3>
        <p className="text-xs font-light text-stone-500">Active catalog repository specs</p>
      </div>
      <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm shrink-0">
        <Archive className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </div>
    </div>
  );
}