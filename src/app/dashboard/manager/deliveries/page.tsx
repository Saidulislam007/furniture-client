'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Calendar, ChevronDown, Loader2 } from 'lucide-react';
// Better-Auth ক্লায়েন্ট সেশন হুক ইম্পোর্ট
import { authClient } from "@/lib/auth-client";
// 🚀 🟢 ওল্ড এপিআই রিমুভ করে নতুন গ্লোবাল গেট সার্ভিস ইম্পোর্ট করা হলো
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

export default function DeliveriesTrackerPage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // লাইভ ডাটা ও ইন্টারনাল চেকিং স্টেটস
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ⚡ 🟢 নতুন ফিক্স: কোনো ডামি আইডি ছাড়া সরাসরি গ্লোবাল সার্ভিস ফেচ রান হচ্ছে
  useEffect(() => {
    const loadAllGlobalDeliveries = async () => {
      try {
        // 🚀 আপনার তৈরি করা গ্লোবাল গেট সার্ভিস কল
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
  }, []); // ⚡ সেশন ডিপেন্ডেন্সি তুলে নেওয়া হলো যেহেতু এটি গ্লোবাল পাবলিক ট্র্যাকার

  // ম্যানেজারের জন্য লাইভ সেট পাইপলাইন হ্যান্ডলার ফাংশন
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
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Header Metadata */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Truck className="w-6 h-6 text-stone-950 stroke-1" /> Deliveries Control Center
          </h3>
          <p className="text-xs text-stone-400 mt-1">Monitor active logistics paths and update transmission operational states.</p>
        </div>

        {deliveries.length === 0 ? (
          <div className="w-full py-20 text-center border border-dashed border-stone-300 bg-white rounded-sm">
            <h3 className="text-sm font-serif font-light text-stone-400 tracking-wide">No universal logistics operations currently dispatched.</h3>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP & TABLET INTERFACE (Data Table) */}
            <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-xs no-scrollbar">
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
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-stone-50/40 transition-colors">
                      
                      {/* প্রোডাক্ট ইমেজ থাম্বনেইল */}
                      <td className="p-4 sm:p-5">
                        <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                          <img src={delivery.image} alt={delivery.item} className="w-full h-full object-cover" />
                        </div>
                      </td>

                      {/* ক্লায়েন্ট নোড ইন্টেল */}
                      <td className="p-4 sm:p-5">
                        <p className="font-medium text-stone-950 text-xs sm:text-sm">{delivery.clientName}</p>
                        <p className="text-[10px] font-mono text-stone-400 truncate max-w-[140px]">{delivery.userEmail}</p>
                      </td>

                      {/* Asset Item Title */}
                      <td className="p-4 sm:p-5 font-serif text-stone-900 font-light text-sm">
                        {delivery.item}
                        <span className="block text-[10px] font-mono text-stone-400 mt-0.5 truncate max-w-[120px]">ID: {delivery.id}</span>
                      </td>

                      {/* Date Grid */}
                      <td className="p-4 sm:p-5 font-mono text-stone-500 tracking-wide">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-300" /> {delivery.date}
                        </div>
                      </td>

                      {/* কারেন্সি প্রাইস কলাম */}
                      <td className="p-4 sm:p-5 text-right font-mono font-medium text-stone-950">
                        ${delivery.price.toFixed(2)}
                      </td>

                      {/* ডেলিভারি ফি কলাম */}
                      <td className="p-4 sm:p-5 text-right font-mono text-stone-500 tabular-nums">
                        ${delivery.deliveryFee.toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 sm:p-5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>

                      {/* অ্যাকশন সিলেক্টর পাইপলাইন */}
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
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white border border-stone-200/60 p-5 rounded-sm shadow-xs space-y-4 text-left">
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
                            className="appearance-none bg-stone-950 text-white text-[11px] uppercase tracking-wider font-medium px-3 pr-8 h-8 rounded-sm focus:outline-none transition-all cursor-pointer"
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
          </>
        )}

      </motion.div>
    </main>
  );
}