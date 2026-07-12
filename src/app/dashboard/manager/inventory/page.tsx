'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, AlertCircle, Edit3, Trash2, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

// ইনভেন্টরি আইটেম ইন্টারফেস টাইপ
interface InventoryItem {
  sku: string;
  name: string;
  location: string;
  stock: number;
  status: 'Pending Approval' | 'Published' | 'Unpublished';
}

// আপগ্রেডেড ডামি ইনভেন্টরি ডাটাবেজ
const initialInventory: InventoryItem[] = [
  { sku: "ATL-TRV-01", name: "Travertine Coffee Table", stock: 12, location: "Warehouse Alpha", status: "Published" },
  { sku: "ATL-LNG-44", name: "Minimalist Lounge Chair", stock: 2, location: "Warehouse Beta", status: "Pending Approval" },
  { sku: "ATL-ARC-09", name: "Sleek Arc Pendant Light", stock: 0, location: "Warehouse Alpha", status: "Unpublished" }
];

export default function InventoryLedgerPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // পাবলিশিং টগল হ্যান্ডলার (পাবলিশিং পাওয়ার রেস্ট্রিকশন সহ)
  const togglePublishStatus = (sku: string) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.sku === sku) {
          if (item.status === 'Pending Approval') {
            triggerToast("Unauthorized: Cannot publish a pending asset node.");
            return item;
          }
          const nextStatus = item.status === 'Published' ? 'Unpublished' : 'Published';
          triggerToast(`Asset state successfully shifted to ${nextStatus.toUpperCase()}.`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // ডিলিট হ্যান্ডলার
  const handleDeleteProduct = (sku: string) => {
    setInventory(prev => prev.filter(item => item.sku !== sku));
    triggerToast("Asset ledger record purged permanently.");
  };

  // স্ট্যাটাস ভিত্তিক ব্যাজ কালার কনফিগারেশন
  const getStatusStyle = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Published': return 'bg-stone-900 text-stone-50 border-stone-950';
      case 'Unpublished': return 'bg-stone-100 text-stone-600 border-stone-300';
      case 'Pending Approval': return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
    }
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans">
      
      {/* 🔔 FLOATING NOTIFICATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Header Console */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-stone-400 stroke-1" /> Inventory Ledger Terminal
          </h3>
          <p className="text-xs text-stone-400 mt-1">Real-time stock architecture matrices and adaptive state visibility controllers.</p>
        </div>

        {/* 🖥️ DESKTOP & TABLET LOGISTICS INTERFACE */}
        <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                <th className="p-4 sm:p-5">Blueprint Specs (SKU)</th>
                <th className="p-4 sm:p-5">Asset Title</th>
                <th className="p-4 sm:p-5">Localization Node</th>
                <th className="p-4 sm:p-5">Clearance State</th>
                <th className="p-4 sm:p-5 text-right">Available Volume</th>
                <th className="p-4 sm:p-5 text-center">Control Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {inventory.map((item) => (
                <tr key={item.sku} className="hover:bg-stone-50/30 transition-colors">
                  <td className="p-4 sm:p-5 font-mono text-stone-500 tracking-wide">{item.sku}</td>
                  <td className="p-4 sm:p-5 font-serif text-stone-950 text-sm font-light">{item.name}</td>
                  <td className="p-4 sm:p-5 text-stone-500 font-light">{item.location}</td>
                  <td className="p-4 sm:p-5">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-right font-mono">
                    {item.stock > 0 ? (
                      <span className="text-stone-950 font-medium">{item.stock} units</span>
                    ) : (
                      <span className="text-red-600 font-medium inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                      </span>
                    )}
                  </td>
                  
                  {/* Action Columns Block */}
                  <td className="p-4 sm:p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Toggle Visibility (Publishing Power) */}
                      <button
                        disabled={item.status === 'Pending Approval'}
                        onClick={() => togglePublishStatus(item.sku)}
                        className={`p-1.5 border rounded-sm transition-all ${
                          item.status === 'Published'
                            ? 'text-stone-900 border-stone-300 bg-stone-50 hover:bg-stone-100'
                            : 'text-stone-400 border-transparent hover:border-stone-200 hover:text-stone-900'
                        } disabled:opacity-20 disabled:cursor-not-allowed`}
                        title={item.status === 'Published' ? 'Depublish Manifest' : 'Publish Manifest'}
                      >
                        {item.status === 'Published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit Spec */}
                      <button
                        className="p-1.5 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded-sm transition-all"
                        title="Modify Specifications"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Spec */}
                      <button
                        onClick={() => handleDeleteProduct(item.sku)}
                        className="p-1.5 text-stone-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded-sm transition-all"
                        title="Purge Spec Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE CARDS ENGINE (100% Responsive adaptive nodes) */}
        <div className="block md:hidden space-y-4">
          {inventory.map((item) => (
            <div key={item.sku} className="bg-white border border-stone-200/60 p-5 rounded-sm shadow-xs space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">{item.sku}</span>
                  <h4 className="font-serif text-base text-stone-900 font-light">{item.name}</h4>
                  <p className="text-xs text-stone-500 font-light">{item.location}</p>
                </div>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-stone-50 pt-3 gap-2">
                <div className="text-xs font-mono">
                  {item.stock > 0 ? (
                    <span className="text-stone-950 font-medium">{item.stock} units</span>
                  ) : (
                    <span className="text-red-600 font-medium inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Stockout
                    </span>
                  )}
                </div>

                {/* Mobile System Controls */}
                <div className="flex gap-1.5">
                  <button
                    disabled={item.status === 'Pending Approval'}
                    onClick={() => togglePublishStatus(item.sku)}
                    className="h-8 w-8 border border-stone-200 rounded-sm flex items-center justify-center text-stone-700 disabled:opacity-20 min-h-[32px]"
                  >
                    {item.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="h-8 px-2.5 border border-stone-200 rounded-sm text-xs uppercase tracking-wider font-medium text-stone-700 min-h-[36px]">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item.sku)}
                    className="h-8 w-8 bg-stone-950 text-white rounded-sm flex items-center justify-center min-h-[32px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </main>
  );
}