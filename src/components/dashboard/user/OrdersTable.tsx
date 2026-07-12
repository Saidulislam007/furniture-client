'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Package, Calendar, CreditCard, ShoppingBag } from 'lucide-react';

// --- Sub-types ---
export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Badge Color Controller
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-stone-900 text-stone-50 border-stone-950';
    }
  };

  return (
    <div className="w-full">
      {/* Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto bg-white border border-stone-200/60 rounded-sm shadow-sm no-scrollbar">
        <table className="w-full border-collapse text-left font-sans text-xs sm:text-sm min-w-[600px] sm:min-w-full">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-semibold select-none">
              <th className="p-4 sm:p-5">Order ID</th>
              <th className="p-4 sm:p-5">Date</th>
              <th className="p-4 sm:p-5">Status</th>
              <th className="p-4 sm:p-5 text-right">Total</th>
              <th className="p-4 sm:p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50/40 transition-colors duration-200">
                <td className="p-4 sm:p-5 font-medium text-stone-950 font-mono tracking-wide">{order.id}</td>
                <td className="p-4 sm:p-5 text-stone-500 font-light">{order.date}</td>
                <td className="p-4 sm:p-5">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-right font-medium text-stone-900 tabular-nums">${order.total.toFixed(2)}</td>
                <td className="p-4 sm:p-5 text-center">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-amber-800 rounded-sm transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center mx-auto"
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

      {/* ─── INTERACTIVE DETAIL SLIDE-OVER DRAWER ─── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Soft Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
              onClick={() => setSelectedOrder(null)}
            />
            
            {/* Right Side Slip Sheet Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white border-l border-stone-200 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto font-sans"
            >
              <div className="space-y-6">
                {/* Header Spec */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-light">Order Blueprint</h3>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">{selectedOrder.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="p-1.5 hover:bg-stone-100 rounded-sm text-stone-400 hover:text-stone-900 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
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
                      <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                        <div className="max-w-[70%]">
                          <p className="font-medium text-stone-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5 font-light">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                        <span className="font-medium text-stone-900 font-mono">${(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
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
    </div>
  );
};