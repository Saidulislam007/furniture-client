'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Package, Calendar, CreditCard, ShoppingBag, Loader2, ClipboardList, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
// Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// আপনার তৈরি করা ডেলিভারি গেট সার্ভিস এপিআই ইম্পোর্ট
import { getDeliveriesFromBackend } from '@/services/api/getDelivery';

// কন্টেইনারカード ইম্পোর্

// --- ১০০% টাইপ সেফ ইন্টারফেস ডেফিনিশন ---
export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string; 
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  deliveryFee: number; 
  total: number;
  items: OrderItem[];
}

// 🎯 🚀 প্রতি পেজে ঠিক ৭টি করে অর্ডার রেকর্ড লক করা হলো ভাই
const ITEMS_PER_PAGE = 7;

export default function OrderHistoryPage() {
  // Better-Auth সেশন এক্সট্রাকশন
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // লাইভ ডাটা ও পাইপলাইন লোডিং স্টেটস
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // প্যাজিনেশন কারেন্ট স্টেট নোড
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (session?.user?.id) {
      const syncOrderHistory = async () => {
        try {
          const rawDeliveries = await getDeliveriesFromBackend(session.user.id);
          
          if (rawDeliveries) {
            const secureMatchedOrders = rawDeliveries
              .filter((item: any) => {
                const isIdMatch = String(item.userId) === String(session.user.id);
                const isNameMatch = item.userName?.trim().toLowerCase() === session.user.name?.trim().toLowerCase();
                const isEmailMatch = item.userEmail?.trim().toLowerCase() === session.user.email?.trim().toLowerCase();
                return isIdMatch && isNameMatch && isEmailMatch;
              })
              .map((item: any): Order => ({
                id: item._id || "ATL-" + Math.floor(1000 + Math.random() * 9000),
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : "N/A",
                status: (item.status?.toLowerCase() as Order['status']) || 'pending',
                deliveryFee: Number(item.deliveryFee || 0), 
                total: Number(item.price || 0) + Number(item.deliveryFee || 0),
                items: [
                  {
                    id: item.productId || "p1",
                    title: item.title || "Selected Asset",
                    quantity: item.quantity || 1,
                    price: Number(item.price || 0),
                    image: item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=150"
                  }
                ]
              }));
              
            setOrders(secureMatchedOrders);
          }
        } catch (error) {
          console.error("❌ Failed to resolve order registry history pipelines:", error);
        } finally {
          setIsDataLoading(false);
        }
      };

      syncOrderHistory();
    } else if (!isAuthPending && !session) {
      setIsDataLoading(false);
    }
  }, [session, isAuthPending]);

  // 📊 ৭টি ডেটার সাপেক্ষে প্যাজিনেশন ট্র্যাক ক্যালকুলেশন
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [orders, currentPage]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-stone-900 text-stone-50 border-stone-950';
      default: return 'bg-stone-100 text-stone-600 border-stone-300';
    }
  };

  const isLoading = isAuthPending || isDataLoading;

  return (
    <main className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 mt-12 md:mt-0 min-h-screen bg-transparent">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-stone-950 stroke-1" /> Order Registry History
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Showing page {currentPage} of {totalPages || 1} — {ITEMS_PER_PAGE} orders per log view.
          </p>
        </div>

        {/* ⏳ লোডিং ও সেফগার্ড স্টেটস */}
        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-2 border border-stone-200/60 bg-white rounded-sm">
            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            <p className="text-xs font-mono text-stone-400">Verifying customer registry credentials...</p>
          </div>
        ) : !session ? (
          <div className="w-full py-12 text-center border border-dashed border-amber-300 bg-amber-50/50 rounded-sm text-xs font-mono text-amber-800 p-4">
            ❌ Security Access Warning: Authentication context missing. Please log in to visualize verified history logs.
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full py-20 text-center border border-dashed border-stone-300 bg-white rounded-sm">
            <h3 className="text-sm font-serif font-light text-stone-400 tracking-wide">No active order blueprints recorded within your session log.</h3>
          </div>
        ) : (
          <>
            {/* 🖥️ লাইভ রেসপন্সিভ টেবিল মেকানিজম */}
            <div className="w-full overflow-x-auto bg-white border border-stone-200/60 rounded-xl shadow-sm no-scrollbar">
              <table className="w-full border-collapse text-left font-sans text-xs sm:text-sm min-w-[750px] sm:min-w-full">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-semibold select-none">
                    <th className="p-4 sm:p-5 w-24">Image</th>
                    <th className="p-4 sm:p-5">Order ID</th>
                    <th className="p-4 sm:p-5">Date</th>
                    <th className="p-4 sm:p-5">Status</th>
                    <th className="p-4 sm:p-5 text-right">Delivery</th>
                    <th className="p-4 sm:p-5 text-right">Total Fee</th>
                    <th className="p-4 sm:p-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/40 transition-colors duration-200">
                      <td className="p-4 sm:p-5">
                        <div className="w-12 h-12 bg-stone-50 border border-stone-200/60 rounded-sm overflow-hidden shrink-0">
                          <img src={order.items[0]?.image} alt="Asset node" className="w-full h-full object-cover" />
                        </div>
                      </td>

                      <td className="p-4 sm:p-5 font-medium text-stone-950 font-mono tracking-wide truncate max-w-[150px]">{order.id}</td>
                      <td className="p-4 sm:p-5 text-stone-500 font-light">{order.date}</td>
                      <td className="p-4 sm:p-5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right font-mono text-stone-500 tabular-nums">${order.deliveryFee.toFixed(2)}</td>
                      <td className="p-4 sm:p-5 text-right font-medium text-stone-900 tabular-nums">${order.total.toFixed(2)}</td>
                      <td className="p-4 sm:p-5 text-center">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-amber-800 rounded-sm min-w-[32px] min-h-[32px] flex items-center justify-center mx-auto"
                          aria-label="View Order Blueprint"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= 📊 🚀 LUXURY PAGINATION LAYER ================= */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mt-12 pt-6 border-t border-stone-200/60 font-mono text-xs select-none">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-xl border border-stone-300 bg-white text-stone-700 flex items-center justify-center transition-all hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers Mapping */}
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

                {/* Next Button */}
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

        {/* ─── INTERACTIVE DETAIL SLIDE-OVER DRAWER মডাল ─── */}
        <AnimatePresence>
          {selectedOrder && (
            <>
              {/* Soft Backdrop Overlay */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
              
              {/* Right Side Slip Sheet Panel */}
              <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white border-l border-stone-200 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto font-sans"
              >
                <div className="space-y-6">
                  {/* Header Spec */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-stone-900 font-light">Order Blueprint</h3>
                      <p className="text-xs text-stone-400 font-mono mt-0.5 truncate max-w-[250px]">{selectedOrder.id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-400 hover:text-stone-900 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Meta Matrix Banner */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 border border-stone-200/40 p-4 rounded-sm">
                    <div className="space-y-1">
                      <span className="text-stone-400 block text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                      </span>
                      <span className="text-stone-800 font-medium">{selectedOrder.date}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-400 block text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Package className="w-3 h-3" /> Status
                      </span>
                      <span className={`inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider border rounded-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Manifest Itemized Stack */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" /> Manifest Items
                    </h4>
                    <div className="divide-y divide-stone-100 border border-stone-100 rounded-sm px-3 bg-stone-50/20">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="py-3 flex flex-col space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-100 rounded-sm overflow-hidden border border-stone-200/60 shrink-0">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="font-medium text-stone-900 line-clamp-1">{item.title}</p>
                              <p className="text-[11px] text-stone-400 mt-0.5 font-light">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                            <span className="font-medium text-stone-900 font-mono shrink-0">${(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics Breakdown */}
                  <div className="space-y-2.5 bg-stone-50/60 border border-stone-200/40 p-4 rounded-sm text-xs font-mono text-stone-600">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Base Evaluation:</span>
                      <span className="text-stone-950">${selectedOrder.items[0]?.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 flex items-center gap-1"><Truck className="w-3 h-3" /> Logistics Premium:</span>
                      <span className="text-stone-950 font-medium">${selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

                {/* Total Summary Footer */}
                <div className="border-t border-stone-100 pt-5 mt-8 flex items-center justify-between text-stone-900">
                  <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold flex items-center gap-1">
                    <CreditCard className="w-4 h-4" /> Grand Total
                  </span>
                  <span className="text-2xl font-light font-mono tabular-nums">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </motion.div>
    </main>
  );
}