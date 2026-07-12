'use client';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface ManifestCardProps {
  count: number;
}

export const ManifestCard: React.FC<ManifestCardProps> = ({ count }) => {
  return (
    <div className="bg-white border border-stone-200/60 p-6 rounded-sm shadow-sm flex items-start justify-between transition-all duration-300 hover:shadow-md">
      <div className="space-y-2">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-stone-400">
          Active Manifests
        </p>
        <h3 className="text-3xl font-light font-sans tracking-tight text-stone-900 tabular-nums">
          {count}
        </h3>
        <p className="text-xs font-sans font-light text-stone-500">
          In transmission status
        </p>
      </div>
      <div className="text-stone-400 p-2 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center">
        <LayoutDashboard className="w-4 h-4" />
      </div>
    </div>
  );
};