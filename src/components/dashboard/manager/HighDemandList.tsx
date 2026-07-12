'use client';

import React from 'react';
import { Armchair, ChevronRight } from 'lucide-react';

interface FurnitureNode {
  id: string;
  name: string;
  hits: number;
  price: string;
  status: string;
}

interface HighDemandListProps {
  items: FurnitureNode[];
}

export function HighDemandList({ items }: HighDemandListProps) {
  return (
    <div className="bg-white border border-stone-200/60 p-4 sm:p-6 rounded-sm shadow-xs flex flex-col justify-between gap-6">
      <div className="space-y-1">
        <h4 className="font-serif text-base text-stone-900 font-light">High-Demand Assets</h4>
        <p className="text-[11px] text-stone-400">Top architecture units accumulating client requests.</p>
      </div>

      <div className="divide-y divide-stone-100 flex-1 flex flex-col justify-center">
        {items.map((furniture) => (
          <div key={furniture.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-50 border border-stone-100 rounded-sm text-stone-400 group-hover:text-stone-950 group-hover:bg-stone-100 transition-colors">
                <Armchair className="w-3.5 h-3.5" />
              </div>
              <div>
                <h5 className="text-xs font-medium text-stone-900 tracking-wide transition-colors group-hover:text-stone-950">{furniture.name}</h5>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">{furniture.price}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-medium text-stone-950 bg-stone-50 px-2 py-0.5 border border-stone-100 rounded-sm">
                {furniture.hits} hits
              </span>
              <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-stone-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}