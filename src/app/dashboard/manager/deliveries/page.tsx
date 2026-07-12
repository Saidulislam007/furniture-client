'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, User, ChevronDown } from 'lucide-react';

// ডেলিভারি ইন্টারফেস টাইপ (ইমেজ এবং প্রাইস যুক্ত করা হলো)
interface Delivery {
  id: string;
  orderId: string;
  clientName: string;
  item: string;
  image: string;
  price: number;
  date: string;
  destination: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
}

// আপডেট হওয়া ডামি ডেলিভারি ডাটাবেজ
const initialDeliveries: Delivery[] = [
  { 
    id: "DLV-091", 
    orderId: "ATL-9842", 
    clientName: "Alexandre Dupont",
    item: "Minimalist Lounge Chair", 
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=150",
    price: 1250.00,
    date: "July 08, 2026",
    destination: "Manhattan, NY", 
    status: "Pending" 
  },
  { 
    id: "DLV-092", 
    orderId: "ATL-7621", 
    clientName: "Sophia Loren",
    item: "Contemporary Ceramic Vase", 
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=150",
    price: 170.00,
    date: "June 24, 2026",
    destination: "Los Angeles, CA", 
    status: "Dispatched" 
  }
];

export default function DeliveriesTrackerPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);

  const handleStatusChange = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Dispatched': return 'bg-stone-100 text-stone-600 border-stone-300';
      case 'Delivered': return 'bg-stone-900 text-stone-50 border-stone-950';
    }
  };

  return (
    <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-10 w-full font-sans">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Header Metadata */}
        <div className="border-b border-stone-200/60 pb-5">
          <h3 className="font-serif text-2xl font-light tracking-wide text-stone-950 flex items-center gap-2">
            <Truck className="w-6 h-6 text-stone-400 stroke-1" /> Deliveries Control Center
          </h3>
          <p className="text-xs text-stone-400 mt-1">Monitor active logistics paths and update transmission operational states.</p>
        </div>

        {/* 🖥️ DESKTOP & TABLET INTERFACE (Data Table) */}
        <div className="hidden md:block w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-xs">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                {/* 🚀 🟢 হেডার মডিফিকেশন: ইমেজ এবং কাস্টমার এক্সেস ফিল্ড */}
                <th className="p-4 sm:p-5">Image</th>
                <th className="p-4 sm:p-5">Client & Destination</th>
                <th className="p-4 sm:p-5">Asset Title</th>
                <th className="p-4 sm:p-5">Manifest Date</th>
                {/* 🚀 🟢 পরিবর্তন ১: নতুন প্রাইস কলাম যুক্ত করা হলো */}
                <th className="p-4 sm:p-5 text-right">Price</th>
                <th className="p-4 sm:p-5">Logistics Status</th>
                <th className="p-4 sm:p-5 text-center">Set Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-stone-50/40 transition-colors">
                  
                  {/* 🚀 🟢 ডাইনামিক প্রোডাক্ট ইমেজ থাম্বনেইল নোড */}
                  <td className="p-4 sm:p-5">
                    <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                      <img src={delivery.image} alt={delivery.item} className="w-full h-full object-cover" />
                    </div>
                  </td>

                  {/* Client Metadata Column */}
                  <td className="p-4 sm:p-5">
                    <div className="space-y-0.5">
                      <div className="font-medium text-stone-950 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" /> {delivery.clientName}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {delivery.destination}
                      </div>
                    </div>
                  </td>
                  
                  {/* Asset Item Title */}
                  <td className="p-4 sm:p-5 font-serif text-stone-900 font-light text-sm">
                    {delivery.item}
                    <span className="block text-[10px] font-mono text-stone-400 mt-0.5">{delivery.id}</span>
                  </td>

                  {/* Date Grid */}
                  <td className="p-4 sm:p-5 font-mono text-stone-500 tracking-wide">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-300" /> {delivery.date}
                    </div>
                  </td>

                  {/* 🚀 🟢 ডাইনামিক কারেন্সি প্রাইস রেন্ডার কলাম */}
                  <td className="p-4 sm:p-5 text-right font-mono font-medium text-stone-950">
                    ${(delivery.price ?? 0).toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 sm:p-5">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>

                  {/* Live Interactive Action Selector */}
                  <td className="p-4 sm:p-5 text-center">
                    <div className="relative inline-block text-left">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 MOBILE INTERFACE (Adaptive 100% Responsive Blueprint Cards) */}
        <div className="block md:hidden space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-stone-200/60 p-5 rounded-sm shadow-xs space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3">
                  {/* মোবাইল ইমেজ রেন্ডার */}
                  <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden shrink-0">
                    <img src={delivery.image} alt={delivery.item} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">{delivery.id}</span>
                    <h4 className="font-serif text-base text-stone-900 font-light leading-tight">{delivery.item}</h4>
                    <span className="block font-mono text-xs font-semibold text-stone-950 mt-1">${(delivery.price ?? 0).toFixed(2)}</span>
                    
                    <p className="text-xs text-stone-500 mt-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" /> {delivery.clientName}
                    </p>
                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-300" /> {delivery.destination}
                    </p>
                    <p className="text-[11px] text-stone-400 font-mono mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-300" /> {delivery.date}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Interaction System Row */}
              <div className="flex items-center justify-between border-t border-stone-50 pt-3 gap-2">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
                
                <div className="relative inline-block text-left">
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
                </div>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </main>
  );
}