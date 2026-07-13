"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
// 🚀 শপ পেজের এক্সপোর্টেড ডেটাবেজ ইম্পোর্ট করা হলো
import { shopProducts, Product } from "../page"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { data: session, isPending: isAuthPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🚀 🟢 ফিক্স: শপ পেজের মেইন অ্যারে থেকে আইডি অনুযায়ী প্রোডাক্ট ফিল্টার করা হচ্ছে
      const foundProduct = shopProducts.find((p) => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[foundProduct.colors.length - 1].name);
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [productId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!session) {
      triggerToast("Authentication Required: Please log in to commit items to cart.");
      return;
    }
    if (!product) return;

    setIsAddingToCart(true);

    const cartPayload = {
      userId: session.user.id,
      userName: session.user.name || "Anonymous User",
      userEmail: session.user.email,
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      image: product.image,
      color: selectedColor || "Default",
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartPayload),
      });

      const data = await response.json();

      if (response.status === 201 && data.success) {
        triggerToast("Asset ledger record committed to cart node successfully.");
      } else if (response.status === 400 || !data.success) {
        triggerToast(data.error || "This product is already in your cart matrix.");
      }
    } catch (error) {
      console.error("❌ Cart Pipeline Fetch Error:", error);
      triggerToast("Error: Cart transaction synchronization pipeline failed.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading || isAuthPending) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex items-center justify-center animate-pulse">
        <p className="font-serif text-2xl tracking-[0.25em] text-amber-700 select-none">ATELIER</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f4f0eb] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-lg text-stone-600 font-light">Product Specification Matrix Not Found.</p>
        <button onClick={() => router.push('/products')} className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-stone-900 bg-white border border-stone-200 px-4 py-2 rounded-sm shadow-xs hover:bg-stone-50">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-24 pb-16 font-sans relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="w-full aspect-[4/3.5] md:aspect-[4/4] bg-[#eadecf] rounded-[2rem] overflow-hidden shadow-sm">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700" />
          </div>

          <div className="flex flex-col h-full text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-100">
                {product.category} / {product.subCategory}
              </span>
              <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded-sm border ${product.stock > 0 ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-rose-50 text-rose-800 border-rose-100"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">{product.title}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-gray-900 fill-gray-900" : "text-gray-300"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 mt-0.5">{product.rating}</span>
              <span className="text-gray-400 mx-1">•</span>
              <button className="text-sm text-gray-600 underline font-light hover:text-gray-900">{product.reviewsCount}</button>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-gray-950">${product.price}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6 p-4 bg-white/60 border border-gray-200/60 rounded-xl space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Material Composition</span>
                <span className="text-gray-900 font-light">{product.material}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Dimensions (W × H × D)</span>
                <span className="text-gray-900 font-mono">{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400 uppercase tracking-wider">Warranty Structure</span>
                <span className="text-gray-900 font-light">{product.warranty}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{product.colors.length} {product.colors.length > 1 ? "Colors" : "Color"} Available</h3>
                {selectedColor && <span className="text-xs text-gray-500 font-light">({selectedColor})</span>}
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 relative flex items-center justify-center ${selectedColor === color.name ? "border-gray-900 scale-110 shadow-sm" : "border-transparent hover:scale-105"}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && <span className="w-2 h-2 rounded-full bg-white block mix-blend-difference" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => console.log("Direct Checkout executed")} disabled={product.stock === 0} className="w-full bg-[#111827] hover:bg-black text-white text-sm font-medium py-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all active:scale-98 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin text-stone-500" /> : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}