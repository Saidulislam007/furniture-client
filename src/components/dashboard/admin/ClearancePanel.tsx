'use client';

import React, { useState } from 'react';
import { Check, X, Eye, Trash2, Edit, AlertCircle, ShieldAlert } from 'lucide-react';

export interface PendingProduct {
  id: string;
  name: string;
  manager: string;
  price: number;
  image: string;
  timestamp: string;
}

interface ClearancePanelProps {
  products: PendingProduct[];
  onAction: (id: string, action: 'approve' | 'reject' | 'edit' | 'delete', reason?: string) => void;
}

export function ClearancePanel({ products, onAction }: ClearancePanelProps) {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleRejectSubmit = (id: string) => {
    if (!reason.trim()) return;
    onAction(id, 'reject', reason);
    setRejectId(null);
    setReason('');
  };

  return (
    <div className="bg-white border border-stone-200/60 rounded-sm shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
      

      {products.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-400 font-mono border border-dashed border-stone-200 rounded-sm">
          No pending operational asset nodes found in pipeline queue.
        </div>
      ) : (
        <div className="space-y-4">
          {/* 🖥️ TABLE FOR TABLET & DESKTOP (>= 768px) */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                  <th className="p-4">Asset specs</th>
                  <th className="p-4">Submitted By</th>
                  <th className="p-4 text-right">Valuation</th>
                  <th className="p-4 text-center">Pipeline Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className="w-10 h-10 object-cover border border-stone-100 rounded-sm" alt="" />
                        <div>
                          <p className="font-serif text-stone-900 text-sm font-light">{product.name}</p>
                          <span className="text-[10px] font-mono text-stone-400">{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-stone-800">
                      {product.manager}
                      <span className="block text-[10px] text-stone-400 font-mono font-normal">{product.timestamp}</span>
                    </td>
                    <td className="p-4 text-right font-mono font-semibold text-stone-950">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => onAction(product.id, 'approve')} className="p-1.5 bg-stone-950 text-white rounded-sm hover:bg-stone-900" title="Publish Base Node"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setRejectId(product.id)} className="p-1.5 border border-stone-200 text-stone-500 rounded-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100" title="Unpublish / Decline"><X className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onAction(product.id, 'edit')} className="p-1.5 border border-transparent text-stone-400 hover:border-stone-200 hover:text-stone-900 rounded-sm"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onAction(product.id, 'delete')} className="p-1.5 text-stone-400 hover:text-red-700 rounded-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      
                      {/* Decline Context Modal Pop-row */}
                      {rejectId === product.id && (
                        <div className="mt-2 p-2 bg-stone-50 border border-stone-200 rounded-sm flex gap-2 items-center">
                          <input type="text" placeholder="Reason for decline..." className="flex-1 bg-white border border-stone-200 px-2 py-1 text-[11px] rounded-sm focus:outline-none focus:border-stone-950" value={reason} onChange={e => setReason(e.target.value)} />
                          <button onClick={() => handleRejectSubmit(product.id)} className="px-2 py-1 bg-red-600 text-white text-[10px] font-medium uppercase tracking-wider rounded-sm">Log Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 CARDS FOR MOBILE DEVICES (< 768px) */}
          <div className="block md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.id} className="border border-stone-100 p-4 rounded-sm bg-stone-50/40 space-y-3">
                <div className="flex gap-3">
                  <img src={product.image} className="w-12 h-12 object-cover border border-stone-200 rounded-sm shrink-0" alt="" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">{product.id}</span>
                    <h5 className="font-serif text-sm font-light text-stone-950 truncate">{product.name}</h5>
                    <p className="text-xs text-stone-600 mt-0.5">By: {product.manager}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-stone-100/80 pt-2.5">
                  <span className="font-mono font-bold text-stone-950 text-xs">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onAction(product.id, 'approve')} className="h-7 px-2.5 bg-stone-950 text-white text-[10px] uppercase font-medium tracking-wide rounded-sm">Publish</button>
                    <button onClick={() => setRejectId(product.id === rejectId ? null : product.id)} className="h-7 px-2 border border-stone-200 text-stone-600 text-[10px] uppercase rounded-sm">Decline</button>
                    <button onClick={() => onAction(product.id, 'delete')} className="p-1.5 text-stone-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {rejectId === product.id && (
                  <div className="p-2 bg-white border border-stone-200 rounded-sm space-y-2">
                    <input type="text" placeholder="Reason for rejection..." className="w-full border border-stone-100 px-2 py-1.5 text-xs rounded-sm focus:outline-none" value={reason} onChange={e => setReason(e.target.value)} />
                    <button onClick={() => handleRejectSubmit(product.id)} className="w-full py-1 bg-red-600 text-white text-[10px] uppercase font-semibold tracking-wider rounded-sm">Confirm Rejection</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}