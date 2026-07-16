'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, AlertCircle, Edit3, Trash2, CheckCircle2, Loader2, X, Save, ChevronLeft, ChevronRight, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { getAllFurniture } from '@/services/api/getFurniture';
import { deleteFurnitureFromBackend } from '@/services/api/deleteFurniture';
import { updateFurnitureInBackend } from '@/services/api/editFurniture';
import type { Product } from "@/types/product";



// 🎯 প্রতি পেজে ঠিক ৭টি করে ইনভেন্টরি কন্টেন্ট লক করা হলো ভাই!
const ITEMS_PER_PAGE = 7;

export default function InventoryLedgerPage() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 📝 🟢 এডভান্সড সার্চ এবং ফিল্টার স্টেটস
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // প্যাজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchFurnitureData();
  }, []);

  const fetchFurnitureData = async () => {
    try {
      const data = await getAllFurniture();
      if (data) setInventory(data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ সার্চ বা ফিল্টার বদলালে ম্যানেজার স্বয়ংক্রিয়ভাবে আবার ১ম পেজে ফেরত যাবেন ভাই
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // 🎯 🚀 আলটিমেট সার্চ ও ফার্নিচার ইনভেন্টরি ফিল্টারিং লজিক ম্যাট্রিক্স
  const filteredInventory = useMemo(() => {
    let result = [...inventory];

    // ১. টাইটেল, মেটেরিয়াল বা ক্যাটেগরি কুয়েরি সার্চ ট্র্যাকিং
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title?.toLowerCase().includes(query) || 
        item.material?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    // ২. স্ট্যাটাস ফিল্টারিং (Published, Unpublished, Pending Approval)
    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }

    return result;
  }, [inventory, searchQuery, selectedStatus]);

  // 📊 ৭টি ডেটার সাপেক্ষে প্যাজিনেশন ট্র্যাক ক্যালকুলেশন
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); 
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmPurge = window.confirm("Are you sure you want to permanently purge this asset node?");
    if (!confirmPurge) return;

    const success = await deleteFurnitureFromBackend(id);
    if (success) {
      setInventory(prev => {
        const updated = prev.filter(item => item._id !== id);
        const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return updated;
      });
      triggerToast("Asset ledger record purged permanently."); 
    } else {
      triggerToast("Error: Failed to clear asset node from database.");
    }
  };

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
      status: formData.get('status') as Product['status']
    };

    const success = await updateFurnitureInBackend(editingItem._id, updatedPayload);
    if (success) {
      setInventory(prev => prev.map(item => item._id === editingItem._id ? { ...item, ...updatedPayload } : item));
      setEditingItem(null);
      triggerToast("Asset specifications optimized and deployed.");
    } else {
      triggerToast("Error: Pipeline rejected updates.");
    }
    setIsUpdating(false);
  };

  const getStatusStyle = (status: Product['status']) => {
    switch (status) {
      case 'Published': return 'bg-stone-900 text-stone-50 border-stone-950';
      case 'Draft': return 'bg-stone-100 text-stone-600 border-stone-300';
      case 'Pending Approval': return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <main className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 font-sans relative min-h-screen bg-transparent">
      
      {/* 🔔 FLOATING NOTIFICATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 SIDE-IN EDIT PANEL */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/20 backdrop-blur-xs">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="w-full max-w-md bg-white h-screen shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-stone-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                  <h4 className="font-serif text-lg text-stone-950 font-light">Edit Asset Specification</h4>
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
                      <label className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">Clearance State</label>
                      <select name="status" defaultValue={editingItem.status} className="h-10 px-3 bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950">
                        <option value="Published">Published</option>
                        <option value="Unpublished">Unpublished</option>
                        <option value="Pending Approval">Pending Approval</option>
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
        
        {/* Section Header */}
        <div className="border-b border-stone-200/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
              <Boxes className="w-6 h-6 text-stone-950 stroke-1" /> Inventory Ledger Terminal
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Showing {paginatedInventory.length} of {filteredInventory.length} active items ({inventory.length} total catalog furniture)
            </p>
          </div>
          <span className="text-[10px] font-mono bg-stone-900 text-white px-2.5 py-1 rounded-sm uppercase font-bold tracking-wider self-start sm:self-auto select-none">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* ================= 🔍 🟢 PREMIUM SEARCH & CONTROLS CONTROLLER ================= */}
        <div className="w-full bg-white/60 border border-stone-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* লাইভ ফার্নিচার সার্চ নোড */}
          <div className="w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, material specs or category..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* স্ট্যাটাস ক্যাটেগরি ড্রপডাউন সিলেক্টর এবং রিসেট বাটন */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none appearance-none font-mono uppercase tracking-wide text-stone-700 cursor-pointer"
              >
                <option value="all">All Inventory States</option>
                <option value="Published">Published State</option>
                <option value="Unpublished">Unpublished State</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {(searchQuery || selectedStatus !== 'all') && (
              <button
                onClick={resetFilters}
                className="h-10 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono rounded-lg flex items-center justify-center gap-1 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ⏳ ডাটা নোড হ্যান্ডলিং কন্ডিশনাল চেকিং */}
        {paginatedInventory.length === 0 ? (
          <div className="w-full h-48 flex flex-col items-center justify-center gap-2 border border-dashed border-stone-300 bg-white rounded-xl text-xs font-mono text-stone-400">
            <span>No furniture items match your filter parameters.</span>
            <button onClick={resetFilters} className="text-amber-800 underline uppercase text-[10px] tracking-wider mt-1">Clear Search Query</button>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP INTERFACE */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-xl shadow-sm">
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
                  {paginatedInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-serif text-stone-950 text-sm font-light text-left">
                        <div>{item.title}</div>
                        <div className="text-[10px] font-mono mt-0.5">
                          {item.stock > 0 ? (
                            <span className="text-stone-400">{item.stock} units available</span>
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
                          <button onClick={() => setEditingItem(item)} className="p-1.5 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded-sm transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(item._id!)} className="p-1.5 text-stone-400 hover:text-red-700 border border-transparent hover:border-red-100 rounded-sm transition-all">
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
              {paginatedInventory.map((item) => (
                <div key={item._id} className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3 text-left">
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
                      <button onClick={() => setEditingItem(item)} className="h-8 px-2.5 border border-stone-200 rounded-xl text-xs uppercase tracking-wider font-medium text-stone-700 min-h-[36px]">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(item._id!)} className="h-8 w-8 bg-stone-950 text-white rounded-xl flex items-center justify-center min-h-[32px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= 📊 🚀 LUXURY PAGINATION LAYER ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-12 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-center flex items-center justify-center transition-all border ${
                        currentPage === pageNum
                          ? 'bg-stone-950 text-white border-stone-950 font-bold shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
}