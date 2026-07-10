import { create } from 'zustand';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = create<CartState>(() => ({
  items: [], // আপাতত একটি খালি কার্ট অ্যারে দিয়ে এরর দূর করা হলো
}));
