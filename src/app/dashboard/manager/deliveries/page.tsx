'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, Calendar, ChevronDown, Loader2, ChevronLeft, ChevronRight, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
// Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// 🚀 গ্লোবাল গেট সার্ভিস ইম্পোর্ট
import { getAllDeliveriesFromBackend } from '@/services/api/getAllDeliveries';
// আপডেটেড ডেলিভারি স্ট্যাটাস আপডেট সার্ভিস ইম্পোর্ট
import { updateDeliveryStatusInBackend } from '@/services/api/postDelivery';

interface Delivery {
  id: string; // মঙ্গোডিবি _id 
  userId: string;
  clientName: string;
  userEmail: string;
  productId: string;
  item: string;
  image: string;
  price: number;
  deliveryFee: number;
  date: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
}

// 🎯 প্রতি পেজে ঠিক ৭টি করে ডেলিভারি রেকর্ড লক করা হলো ভাই
const ITEMS_PER_PAGE = 7;

export default function DeliveriesTrackerPage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // লাইভ ডাটা ও ইন্টারনাল চেকিং স্টেটস
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 📝 🟢 এডভান্সড সার্চ এবং ফিল্টার স্টেটস
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // প্যাজিনেশন কারেন্ট স্টেট নোড
  const [currentPage, setCurrentPage] = useState<number>(1);

  // গ্লোবাল সার্ভিস ফেচ রান
  useEffect(() => {
    const loadAllGlobalDeliveries = async () => {
      try {
        const rawDeliveries = await getAllDeliveriesFromBackend();
        
        if (rawDeliveries && Array.isArray(rawDeliveries)) {
          const fullyMappedData = rawDeliveries.map((item: any): Delivery => ({
            id: item._id, 
            userId: item.userId,
            clientName: item.userName || "Anonymous User",
            userEmail: item.userEmail || "N/A",
            productId: item.productId,
            item: item.title || "Curated Furniture Asset",
            image: item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=150",
            price: Number(item.price || 0),
            deliveryFee: Number(item.deliveryFee || 0),
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : "N/A",
            status: item.status === "Dispatched" ? "Dispatched" : item.status === "Delivered" ? "Delivered" : "Pending"
          }));

          setDeliveries(fullyMappedData);
        }
      } catch (error) {
        console.error("❌ Critical failure in loading deliveries matrix:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadAllGlobalDeliveries();
  }, []);

  // ⚡ সার্চ বা ফিল্টার চেঞ্জ হলে ইউজার স্বয়ংক্রিয়ভাবে আবার ১ম পেজে ফেরত যাবে ভাই
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  // 🎯 🚀 আলটিমেট সার্চ ও ডেলিভারি ফিল্টারিং লজিক ম্যাট্রিক্স
  const filteredDeliveries = useMemo(() => {
    let result = [...deliveries];

    // ১. ক্লায়েন্ট নেম, ইমেইল অথবা প্রোডাক্ট টাইটেল কুয়েরি সার্চ ট্র্যাকিং
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.clientName?.toLowerCase().includes(query) || 
        d.userEmail?.toLowerCase().includes(query) ||
        d.item?.toLowerCase().includes(query)
      );
    }

    // ২. ডেলিভারি স্ট্যাটাস ফিল্টারিং (Pending, Dispatched, Delivered)
    if (selectedStatus !== 'all') {
      result = result.filter(d => d.status === selectedStatus);
    }

    return result;
  }, [deliveries, searchQuery, selectedStatus]);

  // 📊 ফিল্টার হওয়া ডেটার সাপেক্ষে প্যাজিনেশন ট্র্যাক ক্যালকুলেশন
  const totalPages = Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeliveries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDeliveries, currentPage]);

  // লাইভ সেট পাইপলাইন হ্যান্ডলার ফাংশন
  const handleStatusChange = async (id: string, newStatus: Delivery['status']) => {
    setUpdatingId(id);

    const success = await updateDeliveryStatusInBackend(id, newStatus);

    if (success) {
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === id ? { ...delivery, status: newStatus } : delivery
        )
      );
    } else {
      console.error("❌ Failed to synchronize pipeline state mutation.");
    }

    setUpdatingId(null);
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Dispatched': return 'bg-stone-100 text-stone-600 border-stone-300';
      case 'Delivered': return 'bg-stone-900 text-stone-50 border-stone-950';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  const isLoading = isAuthPending || isDataLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f0eb]/20 flex items-center justify-center animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        <p className="font-mono text-xs text-stone-400 ml-2">Loading Logistics Matrix Console...</p>
      </div>
    );
  }

  return (
    <main className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 font-sans bg-transparent min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-stone-200/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
              <Truck className="w-6 h-6 text-stone-950 stroke-1" /> Deliveries Control Center
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Showing {paginatedDeliveries.length} of {filteredDeliveries.length} active logs ({deliveries.length} total system operations)
            </p>
          </div>
          <span className="text-[10px] font-mono bg-stone-900 text-white px-2.5 py-1 rounded-sm uppercase font-bold tracking-wider self-start sm:self-auto select-none">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {/* ================= 🔍 🟢 PREMIUM SEARCH & CONTROLS CONTROLLER ================= */}
        <div className="w-full bg-white/60 border mt-[-2] border-stone-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* লাইভ গ্লোবাল লজিস্টিকস সার্চ নোড */}
          <div className="w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email or product manifest..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* লজিস্টিকস স্ট্যাটাস ড্রপডাউন সিলেক্টর এবং রিসেট বাটন */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-stone-200 text-xs rounded-lg focus:outline-none appearance-none font-mono uppercase tracking-wide text-stone-700 cursor-pointer"
              >
                <option value="all">All Logistics Pipelines</option>
                <option value="Pending">Pending State</option>
                <option value="Dispatched">Dispatched State</option>
                <option value="Delivered">Delivered State</option>
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
        {filteredDeliveries.length === 0 ? (
          <div className="w-full py-24 text-center bg-white border border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center">
            <Search className="w-7 h-7 text-stone-300 mb-2 stroke-1" />
            <h3 className="text-sm font-serif font-light text-stone-600 tracking-wide">No active logistics logs match your parameter queries.</h3>
            <button onClick={resetFilters} className="mt-2 text-xs font-mono text-amber-800 hover:underline uppercase tracking-widest">Clear Queries</button>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP & TABLET INTERFACE (Data Table) */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-xl shadow-sm no-scrollbar">
              <table className="w-full border-collapse text-left text-xs sm:text-sm min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-semibold select-none">
                    <th className="p-4 sm:p-5 w-24">Image</th>
                    <th className="p-4 sm:p-5">Client Info</th>
                    <th className="p-4 sm:p-5">Asset Title</th>
                    <th className="p-4 sm:p-5">Manifest Date</th>
                    <th className="p-4 sm:p-5 text-right">Price</th>
                    <th className="p-4 sm:p-5 text-right">Delivery Fee</th>
                    <th className="p-4 sm:p-5">Logistics Status</th>
                    <th className="p-4 sm:p-5 text-center">Set Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {paginatedDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-stone-50/40 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                          <img src={delivery.image} alt={delivery.item} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <p className="font-medium text-stone-950 text-xs sm:text-sm">{delivery.clientName}</p>
                        <p className="text-[10px] font-mono text-stone-400 truncate max-w-[140px]">{delivery.userEmail}</p>
                      </td>
                      <td className="p-4 sm:p-5 font-serif text-stone-900 font-light text-sm">
                        {delivery.item}
                        <span className="block text-[10px] font-mono text-stone-400 mt-0.5 truncate max-w-[120px]">ID: {delivery.id}</span>
                      </td>
                      <td className="p-4 sm:p-5 font-mono text-stone-500 tracking-wide">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-300" /> {delivery.date}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono font-medium text-stone-950">
                        ${delivery.price.toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono text-stone-500 tabular-nums">
                        ${delivery.deliveryFee.toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-center">
                        <div className="relative inline-block text-left">
                          {updatingId === delivery.id ? (
                            <div className="h-8 px-6 flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin text-stone-400" /></div>
                          ) : (
                            <>
                              <select
                                value={delivery.status}
                                onChange={(e) => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                                className="appearance-none bg-stone-50 border border-stone-200 text-stone-800 text-[11px] uppercase tracking-wider font-medium px-3 pr-8 h-8 rounded-sm focus:outline-none focus:ring-1 focus:ring-stone-950 transition-all cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <ChevronDown className="w-3 h-3 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE INTERFACE (Adaptive Layout) */}
            <div className="block md:hidden space-y-4">
              {paginatedDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white border border-stone-200/60 p-5 rounded-xl shadow-sm space-y-4 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                        <img src={delivery.image} alt={delivery.item} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-serif text-base text-stone-900 font-light leading-tight">{delivery.item}</h4>
                        <p className="text-[11px] text-stone-400 font-mono">Client: {delivery.clientName}</p>
                        <div className="text-[11px] font-mono mt-2 space-y-0.5">
                          <span className="block font-semibold text-stone-950">Price: ${delivery.price.toFixed(2)}</span>
                          <span className="block text-stone-500">Delivery Fee: ${delivery.deliveryFee.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 font-mono mt-3 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-300" /> {delivery.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-stone-50 pt-3 gap-2">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                    
                    <div className="relative inline-block text-left">
                      {updatingId === delivery.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-stone-400 mx-4" />
                      ) : (
                        <>
                          <select
                            value={delivery.status}
                            onChange={(e) => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                            className="appearance-none bg-stone-950 text-white text-[11px] uppercase tracking-wider font-medium px-3 pr-8 h-8 rounded-xl focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= 📊 🚀 LUXURY PAGINATION LAYER ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-4 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
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
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center  justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
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