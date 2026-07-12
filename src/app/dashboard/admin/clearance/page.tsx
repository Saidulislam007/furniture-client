'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, AlertCircle, Edit3, Trash2, Eye, EyeOff, CheckCircle2, Loader2, X, Save } from 'lucide-react';
import { getAllFurniture } from '@/services/api/getFurniture';
import { deleteFurnitureFromBackend } from '@/services/api/deleteFurniture';
import { updateFurnitureInBackend } from '@/services/api/editFurniture';

interface InventoryItem {
  _id?: string;
  sku?: string;
  title: string;
  image: string;
  price: number; 
  deliveryFee?: number; 
  stock: number;
  status: 'Pending Approval' | 'Published' | 'Unpublished';
}

export default function AssetClearancePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // এডিটিং প্যানেল স্টেট
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchClearanceData();
  }, []);

  // 🚀 🟢 ফিল্টারিং রিমুভড: ডাটাবেজের সব ডাটা সরাসরি টেবিলে লোড হবে
  const fetchClearanceData = async () => {
    try {
      const data = await getAllFurniture();
      if (data) {
        setInventory(data); // সরাসরি সব ডাটা সেভ হচ্ছে
      }
    } catch (error) {
      console.error("❌ Error fetching clearance catalog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); 
  };

  // 🚀 🟢 কুইক পাবলিশ অ্যাকশন (পেজ থেকে রিমুভ হবে না, স্ট্যাটাস লাইভ চেঞ্জ হবে)
  const togglePublishStatus = async (id: string) => {
    const itemToUpdate = inventory.find(item => item._id === id);
    if (!itemToUpdate) return;
    
    // কারেন্ট স্ট্যাটাস অনুযায়ী পরবর্তী স্ট্যাটাস টগল হবে
    const nextStatus = itemToUpdate.status === 'Published' ? 'Unpublished' : 'Published';
    
    const success = await updateFurnitureInBackend(id, { status: nextStatus });
    if (success) {
      // ⚡ প্রোডাক্টের স্ট্যাটাস ডাইনামিক চেঞ্জ করে দেওয়া হলো, ফিল্টার করে রিমুভ করা হবে না
      setInventory(prev => prev.map(item => item._id === id ? { ...item, status: nextStatus } : item));
      triggerToast(`Asset state successfully shifted to ${nextStatus.toUpperCase()}.`);
    } else {
      triggerToast("Error: Authorization pipeline breakdown.");
    }
  };

  // 🚀 🟢 ডিলিট অ্যাকশন (ডিলিট করলে পেজ থেকে পার্মানেন্টলি ভ্যানিশ হয়ে যাবে)
  const handleDeleteProduct = async (id: string) => {
    const confirmPurge = window.confirm("Are you sure you want to permanently purge this asset node?");
    if (!confirmPurge) return;

    const success = await deleteFurnitureFromBackend(id);
    if (success) {
      setInventory(prev => prev.filter(item => item._id !== id));
      triggerToast("Asset ledger record purged permanently."); 
    } else {
      triggerToast("Error: Failed to clear asset node from database.");
    }
  };

  // 🚀 🟢 সাইডবার মডাল সাবমিট লজিক (সব ডাটা আপডেট হবে কিন্তু প্রোডাক্ট পেজেই থাকবে)
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem?._id) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const updatedPayload = {
      title: formData.get('title') as string,
      price: Number(formData.get('price')),
      deliveryFee: Number(formData.get('deliveryFee')),
      stock: Number(formData.get('stock')),
      status: formData.get('status') as InventoryItem['status']
    };

    const success = await updateFurnitureInBackend(editingItem._id, updatedPayload);
    if (success) {
      // ⚡ স্ট্যাটাস যাই হোক না কেন, প্রোডাক্টটি ফিল্টার আউট না করে লাইভ ভ্যালু ম্যাপ করা হলো
      setInventory(prev => prev.map(item => item._id === editingItem._id ? { ...item, ...updatedPayload } : item));
      setEditingItem(null);
      triggerToast("Asset specifications optimized and deployed.");
    } else {
      triggerToast("Error: Pipeline rejected updates.");
    }
    setIsUpdating(false);
  };

  const getStatusStyle = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Published': return 'bg-stone-900 text-stone-50 border-stone-950';
      case 'Unpublished': return 'bg-stone-100 text-stone-600 border-stone-300';
      case 'Pending Approval': return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans relative min-h-screen">
      
      {/* 🔔 আপনার অরিজিনাল টোস্ট নোটিফিকেশন */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 সাইড-ইন এডিট মডাল */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/20 backdrop-blur-xs">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="w-full max-w-md bg-white h-screen shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-stone-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                  <h4 className="font-serif text-lg text-stone-950 font-light">Asset Clearance Decision</h4>
                  <button onClick={() => setEditingItem(null)} className="p-1 text-stone-400 hover:text-stone-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="edit-asset-form" onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Asset Title</label>
                    <input name="title" type="text" defaultValue={editingItem.title} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Price (USD)</label>
                      <input name="price" type="number" defaultValue={editingItem.price} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" required />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Delivery Fee (USD)</label>
                      <input name="deliveryFee" type="number" defaultValue={editingItem.deliveryFee || 0} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Stock Available</label>
                      <input name="stock" type="number" defaultValue={editingItem.stock} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 font-mono" required />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Clearance Status Override</label>
                      <select name="status" defaultValue={editingItem.status} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950">
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Published">Published (Approve)</option>
                        <option value="Unpublished">Unpublished (Reject)</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="border-t border-stone-100 pt-4 flex gap-2 mt-6">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 h-11 border border-stone-200 text-stone-700 text-xs uppercase tracking-wider rounded-sm hover:bg-stone-50 transition-colors">
                  Cancel
                </button>
                <button form="edit-asset-form" type="submit" disabled={isUpdating} className="flex-1 h-11 bg-stone-950 text-white text-xs uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 disabled:bg-stone-400">
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-stone-950 stroke-1" /> Asset Clearance Terminal
          </h3>
          <p className="text-xs text-stone-950 mt-1">Review pending items, manage catalog updates, or issue unpublish workflows.</p>
        </div>

        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-sm">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Synchronizing database clearance nodes...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center border border-stone-200/60 bg-white rounded-sm text-xs font-mono text-stone-400">
            No assets currently found in the system catalog pipeline.
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP & TABLET INTERFACE */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                    <th className="p-4 sm:p-5">Image</th>
                    <th className="p-4 sm:p-5">Asset Title</th>
                    <th className="p-4 sm:p-5 text-right">Valuation (Price)</th>
                    <th className="p-4 sm:p-5 text-right">Delivery Fee</th>
                    <th className="p-4 sm:p-5">Clearance State</th>
                    <th className="p-4 sm:p-5 text-center">Control Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {inventory.map((item) => (
                    <tr key={item._id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-serif text-stone-950 text-sm font-light">
                        <div>{item.title}</div>
                        <div className="text-[10px] font-mono mt-0.5">
                          {item.stock > 0 ? (
                            <span className="text-stone-400">{item.stock} units available {item.sku && `(SKU: ${item.sku})`}</span>
                          ) : (
                            <span className="text-red-500 font-medium flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" /> Out of Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono font-medium text-stone-950">
                        ${(item.price ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono text-stone-600 tracking-wide">
                        ${(item.deliveryFee ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => togglePublishStatus(item._id!)}
                            className="p-1.5 border border-transparent hover:border-stone-200 text-stone-400 hover:text-stone-900 rounded-sm transition-all"
                            title={item.status === 'Published' ? 'Unpublish Spec' : 'Publish Spec'}
                          >
                            {item.status === 'Published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <button onClick={() => setEditingItem(item)} className="p-1.5 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded-sm transition-all" title="Modify Specifications">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button onClick={() => handleDeleteProduct(item._id!)} className="p-1.5 text-stone-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded-sm transition-all" title="Purge Spec Node">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE RESPONSIVE CARDS ENGINE */}
            <div className="block md:hidden space-y-4">
              {inventory.map((item) => (
                <div key={item._id} className="bg-white border border-stone-200/60 p-5 rounded-sm shadow-xs space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-serif text-base text-stone-900 font-light leading-tight">{item.title}</h4>
                        <div className="text-[11px] font-mono mt-1 space-y-0.5">
                          <span className="block font-semibold text-stone-950">Price: ${(item.price ?? 0).toFixed(2)}</span>
                          <span className="block text-stone-500">Delivery: ${(item.deliveryFee ?? 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusStyle(item.status)} shrink-0`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-50 pt-3 gap-2">
                    <div className="text-xs font-mono">
                      {item.stock > 0 ? <span className="text-stone-400">{item.stock} units avail.</span> : <span className="text-red-600 font-medium inline-flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Stockout</span>}
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => togglePublishStatus(item._id!)}
                        className="h-8 w-8 border border-stone-200 rounded-sm flex items-center justify-center text-stone-700 min-h-[32px]"
                      >
                        {item.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditingItem(item)} className="h-8 px-2.5 border border-stone-200 rounded-sm text-xs uppercase tracking-wider font-medium text-stone-700 min-h-[36px]">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(item._id!)} className="h-8 w-8 bg-stone-950 text-white rounded-sm flex items-center justify-center min-h-[32px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}