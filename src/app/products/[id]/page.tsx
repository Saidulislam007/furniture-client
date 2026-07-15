"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft, Receipt, CreditCard, X, ShoppingBag, Truck, Edit3, Trash2, EyeOff, Eye, Star, User, AlertTriangle, Save } from "lucide-react";
// Better-Auth ক্লায়েন্ট সেশন হুক
import { authClient } from "@/lib/auth-client";
// এপিআই সার্ভিস মেথডসমূহ ইম্পোর্ট
import { getAllFurniture } from '@/services/api/getFurniture';
// নতুন রিভিউ সার্ভিস ফাংশনটি ইম্পোর্ট করা হলো ভাই
import { getProductReviewsFromBackend } from '@/services/api/reviewService';
// কাস্টম মডুলার ফার্নিচার আপডেট সার্ভিস ফাংশনটি ইম্পোর্ট করা হলো ভাই
import { updateFurnitureInBackend } from '@/services/api/furnitureService';

// 📑 প্রোডাক্ট টাইপ ডেফিনিশন
export interface Product {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  deliveryFee?: number;
  rating: number;
  reviewsCount: string;
  image: string;
  description: string;
  category: string;
  subCategory: string;
  stock: number;
  material: string;
  warranty: string;
  dimensions: { width: string; height: string; depth: string; };
  colors: { name: string; hex: string }[];
  status: "Published" | "Pending Approval";
  managerId: string;
  managerEmail: string;
  createdAt: { $date: string } | string;
}

// 📑 রিভিউ টাইপ ডেফিনিশন
interface ReviewItem {
  _id: { $oid: string } | string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: { $date: string } | string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { data: session, isPending: isAuthPending } = authClient.useSession();
  
  // 🔐 ইউজারের রোল ডিটেকশন ভাই
  const userRole = (session?.user as any)?.role?.toLowerCase() || 'user';
  const isAdminOrManager = userRole === 'admin' || userRole === 'manager';

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isActionProcessing, setIsActionProcessing] = useState<boolean>(false);
  
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); 
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

  // 📝 🚀 🟢 ইন-পেজ লাইভ এডিট ফর্ম ড্রয়ার স্টেটসমূহ ভাই
  const [showEditDrawer, setShowEditDrawer] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDeliveryFee, setEditDeliveryFee] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>("Published");
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ; 
  useEffect(() => {
  console.log("Current Product ID from URL:", productId);
}, [productId]);
  // 📡 ১. প্রোডাক্ট লোড করার মাস্টার পাইপলাইন
  const fetchSingleProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${productId}`, {
        method: 'GET',
        cache: 'no-store'
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        console.warn("⚠️ Target furniture single node returned non-JSON html. Falling back to array filter mapping.");
        const backupData: Product[] = await getAllFurniture();
        if (backupData && Array.isArray(backupData)) {
          const foundBackup = backupData.find((p) => p._id === productId);
          if (foundBackup) initEditForm(foundBackup);
        }
        return;
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        initEditForm(resData.data);
      }
    } catch (error) {
      console.error("❌ Failed to resolve product node from server api:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ ফর্মের ভেতরে লাইভ ডাটা জেনারেট করার ইনিশিয়েলাইজার ভাই
  const initEditForm = (data: Product) => {
    setProduct(data);
    setEditTitle(data.title || "");
    setEditPrice(data.price || 0);
    setEditDeliveryFee(data.deliveryFee || 0);
    setEditStock(data.stock || 0);
    setEditStatus(data.status || "Published");
    if (data.colors && data.colors.length > 0) {
      setSelectedColor(data.colors[data.colors.length - 1].name);
    }
  };

 // 📡 ২. রিভিউ ফেচ লজিক - লুজ ম্যাচিং ফিক্সড
const fetchProductReviews = async () => {
  if (!productId) return;
  try {
    setReviewsLoading(true);
    const data = await getProductReviewsFromBackend(productId);
    
    // data এখন সরাসরি অ্যারে হিসেবে আসবে (যেহেতু উপরে [] রিটার্ন করেছি)
    setReviews(data || []); 
  } catch (err) {
    setReviews([]); 
  } finally {
    setReviewsLoading(false);
  }
};

  useEffect(() => {
    if (productId) {
      fetchSingleProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductReviews();
    }
  }, [productId, product?.title]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 🛒 অ্যাড টু কার্ট
  const handleAddToCart = async () => {
    if (!session) {
      triggerToast("Authentication Required: Please log in to commit items to cart.");
      return;
    }
    if (!product) return;
    setIsAddingToCart(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name || "Anonymous User",
          userEmail: session.user.email,
          productId: product._id,
          title: product.title,
          price: Number(product.price),
          image: product.image,
          color: selectedColor || "Default",
        }),
      });
      const data = await response.json();
      if (response.status === 201 && data.success) {
        triggerToast("Asset committed to cart node successfully.");
      } else {
        triggerToast(data.error || "This product is already in your cart matrix.");
      }
    } catch (error) {
      triggerToast("Error: Cart transaction synchronization failed.");
    } finally {
      setIsAddingToCart(false);
    }
  };

// ফিক্সড পেমেন্ট হ্যান্ডলার
const handleConfirmPurchase = async () => {
    if (!product || !session?.user?.id) return;

    setIsProcessingOrder(true);

    const orderData = {
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        productId: product._id,
        title: product.title,
        price: Number(product.price),
        deliveryFee: Number(product.deliveryFee),
        image: product.image,
        color: selectedColor,
        status: "Pending"
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/deliveries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Order placed successfully!");
            setShowReceipt(false);
        } else {
            throw new Error(result.error || "Failed to place order");
        }
    } catch (error) {
        console.error("Order error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        setIsProcessingOrder(false);
    }
};

  // 🛠️ স্ট্যাটাস পাবলিশ/আনপাবলিশ টগল লজিক ভাই
  const handleToggleStatus = async () => {
    if (!product) return;
    setIsActionProcessing(true);
    
    const cleanProductId = typeof product._id === 'object' && product._id !== null 
      ? (product._id as any).$oid || (product._id as any).toString()
      : product._id;

    const currentStatusClean = product.status ? product.status.toLowerCase().trim() : "";
    const newStatus = currentStatusClean === "published" ? "Pending " : "Published";
    
    try {
      const success = await updateFurnitureInBackend(cleanProductId, { status: newStatus });
      if (success) {
        setProduct({ ...product, status: newStatus as any });
        setEditStatus(newStatus);
        triggerToast(`Product matrix state updated to [${newStatus}] successfully.`);
      } else {
        triggerToast("Express backend pipeline rejected status sync request.");
      }
    } catch (err) {
      console.error("❌ PUT/PATCH synchronization error:", err);
      triggerToast("Failed to modify target asset visibility status.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  // 🛠️ কাস্টম এডিট ফর্মের ব্লুপ্রিন্ট ডাটাবেজে সাবমিট করার ফাংশন ভাই
  const handleSaveBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsActionProcessing(true);

    const cleanProductId = typeof product._id === 'object' && product._id !== null 
      ? (product._id as any).$oid || (product._id as any).toString()
      : product._id;

    const payload = {
      title: editTitle.trim(),
      price: Number(editPrice),
      deliveryFee: Number(editDeliveryFee),
      stock: Number(editStock),
      status: editStatus
    };

    try {
      const success = await updateFurnitureInBackend(cleanProductId, payload);
      if (success) {
        setProduct({
          ...product,
          title: payload.title,
          price: payload.price,
          deliveryFee: payload.deliveryFee,
          stock: payload.stock,
          status: payload.status as any
        });
        setShowEditDrawer(false); 
        triggerToast("Asset blueprint synchronized and saved successfully.");
      } else {
        triggerToast("Failed to commit blueprint update to Express node.");
      }
    } catch (err) {
      console.error("❌ Blueprint sync error:", err);
      triggerToast("Critical exception during asset modification.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  // 🛠️ প্রোডাক্ট ডিলিট লজিক
  const handleExecuteDelete = async () => {
    if (!product) return;
    setIsActionProcessing(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/v1/furniture/${product._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setShowDeleteModal(false); 
        triggerToast("Asset ledger purged successfully. Redirecting...");
        const targetDashboard = userRole === 'manager' ? '/dashboard/manager' : '/dashboard/admin';
        setTimeout(() => { router.push(targetDashboard); }, 2000);
      } else {
        triggerToast("Critical Error: Database purge operation rejected.");
      }
    } catch (err) {
      triggerToast("Critical Error: Communication with server terminated.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-24 pb-16 font-sans relative overflow-x-hidden">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 right-4 sm:right-8 z-50 p-4 bg-stone-950 text-white text-xs tracking-wide border-l-2 border-amber-600 rounded-sm shadow-xl flex items-center gap-2 select-none">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 কাস্টম স্লাইডিং ফর্ম প্যানেল/ড্রয়ার */}
      <AnimatePresence>
        {showEditDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setShowEditDrawer(false)} />
            
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full relative z-10 shadow-2xl flex flex-col justify-between p-6 text-left"
            >
              <div className="space-y-6 overflow-y-auto pr-1 pb-20">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                  <h3 className="font-serif text-xl text-stone-950 font-light">Asset Clearance Decision</h3>
                  <button onClick={() => setShowEditDrawer(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveBlueprint} className="space-y-5 text-stone-700 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Asset Title</label>
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full h-11 bg-stone-50 border border-stone-200 rounded-md px-3 text-sm font-light text-stone-900 focus:outline-hidden focus:border-stone-950 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Price (USD)</label>
                      <input 
                        type="number" 
                        value={editPrice} 
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full h-11 bg-stone-50 border border-stone-200 rounded-md px-3 text-sm font-light text-stone-900 focus:outline-hidden focus:border-stone-950 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Delivery Fee (USD)</label>
                      <input 
                        type="number" 
                        value={editDeliveryFee} 
                        onChange={(e) => setEditDeliveryFee(Number(e.target.value))}
                        className="w-full h-11 bg-stone-50 border border-stone-200 rounded-md px-3 text-sm font-light text-stone-900 focus:outline-hidden focus:border-stone-950 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Stock Available</label>
                      <input 
                        type="number" 
                        value={editStock} 
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        className="w-full h-11 bg-stone-50 border border-stone-200 rounded-md px-3 text-sm font-light text-stone-900 focus:outline-hidden focus:border-stone-950 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Clearance Status Override</label>
                      <select 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full h-11 bg-stone-50 border border-stone-200 rounded-md px-3 text-sm font-light text-stone-900 focus:outline-hidden focus:border-stone-950 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Published">Published (Approve)</option>
                        <option value="Pending ">Pending (Hold)</option>
                        <option value="Pending Approval">Pending Approval</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditDrawer(false)} 
                  className="flex-1 h-12 border border-stone-200 text-stone-700 text-xs uppercase tracking-wider font-medium rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveBlueprint}
                  disabled={isActionProcessing}
                  className="flex-1 h-12 bg-stone-950 text-white text-xs uppercase tracking-wider font-medium rounded-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isActionProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 কাস্টম ডিলিট কনফার্মেশন মডাল */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-sm bg-white p-6 rounded-xl border border-stone-200 shadow-2xl flex flex-col space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium text-stone-900">Purge Asset Record?</h4>
                <p className="text-xs text-stone-500 font-sans leading-relaxed px-2">Are you absolutely sure you want to purge this record from central database? This node operation cannot be undone.</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowDeleteModal(false)} disabled={isActionProcessing} className="flex-1 h-11 border border-stone-200 text-stone-700 text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleExecuteDelete} disabled={isActionProcessing} className="flex-1 h-11 bg-red-700 hover:bg-red-800 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
                  {isActionProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Purge Node
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 ইনভয়েস রিসিট মডাল প্যানেল */}
      <AnimatePresence>
        {showReceipt && product && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md bg-white p-6 rounded-sm flex flex-col space-y-5 text-left shadow-2xl">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h4 className="font-serif text-lg text-stone-950 font-light flex items-center gap-1.5"><Receipt className="w-4 h-4" /> Studio Asset Invoice</h4>
                <button onClick={() => setShowReceipt(false)} className="text-stone-400 hover:text-stone-900"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4 text-xs font-mono text-stone-600 bg-stone-50 p-4 rounded-xs border border-stone-100">
                <div className="flex justify-between"><span className="text-stone-400">Client Node:</span><span className="text-stone-950 font-medium">{session?.user?.name}</span></div>
                <div className="flex justify-between truncate"><span className="text-stone-400">Registry Email:</span><span className="text-stone-950">{session?.user?.email}</span></div>
                <div className="border-t border-stone-200/60 my-2 pt-2 flex justify-between"><span className="text-stone-400">Product:</span><span className="text-stone-950 font-sans truncate max-w-[180px]">{product?.title || ""}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Valuation:</span><span className="text-stone-950">${product?.price?.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-stone-300 mt-3 pt-3 text-sm font-sans"><span className="font-serif text-stone-950 font-medium">Total Price:</span><span className="font-mono font-bold text-stone-950">${((product?.price || 0) + (product?.deliveryFee || 0)).toFixed(2)}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowReceipt(false)} className="flex-1 h-11 border border-stone-200 text-stone-700 text-xs uppercase tracking-wider rounded-sm hover:bg-stone-50">Cancel</button>
                <button onClick={handleConfirmPurchase} disabled={isProcessingOrder} className="flex-1 h-11 bg-stone-950 text-white text-xs uppercase tracking-wider rounded-sm hover:bg-stone-800 flex items-center justify-center gap-1.5 disabled:bg-stone-400">
                  {isProcessingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />} Confirm Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Back to Catalog
        </button>

        {/* Product Meta Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="w-full aspect-[4/3.5] bg-[#eadecf] rounded-[2rem] overflow-hidden shadow-sm">
            {product?.image && (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover object-center" />
            )}
          </div>

          <div className="flex flex-col h-full text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-100">{product?.category} / {product?.subCategory}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded-sm border bg-stone-950 text-white border-stone-900`}>Status: {product?.status}</span>
                <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded-sm border ${product && product.stock > 0 ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-rose-50 text-rose-800 border-rose-100"}`}>{product && product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 tracking-tight mb-4">{product?.title}</h1>
            
            {/* Rating Meta Info */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${product && i < Math.floor(product.rating) ? "text-stone-950 fill-stone-950" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 mt-0.5">{product?.rating}</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-sm text-gray-600 font-light font-mono">({reviews.length} Ledger Reviews)</span>
            </div>

            <div className="flex flex-col space-y-1 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-gray-950">${product?.price}</span>
              {product?.deliveryFee !== undefined && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500 pt-1"><Truck className="w-3.5 h-3.5" /> Delivery Cost: <span>${product.deliveryFee.toFixed(2)}</span></div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">{product?.description}</p>
            </div>

            {/* Spec Table */}
            <div className="mb-6 p-4 bg-white/60 border border-gray-200/60 rounded-xl space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-medium text-gray-400 uppercase">Material Composition</span><span className="text-gray-900 font-light">{product?.material}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-medium text-gray-400 uppercase">Dimensions (W×H×D)</span><span className="text-gray-900 font-mono">{product?.dimensions?.width}×{product?.dimensions?.height}×{product?.dimensions?.depth}</span></div>
              <div className="flex justify-between"><span className="font-medium text-gray-400 uppercase">Warranty Structure</span><span className="text-gray-900 font-light">{product?.warranty}</span></div>
            </div>

            {/* Color Swatch */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-3"><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Colors Configuration</h3></div>
              <div className="flex items-center gap-3">
                {product?.colors?.map((color) => (
                  <button key={color.name} onClick={() => setSelectedColor(color.name)} className={`w-8 h-8 rounded-full border transition-all ${selectedColor === color.name ? "border-gray-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: color.hex }} title={color.name}>
                    {selectedColor === color.name && <span className="w-2 h-2 rounded-full bg-white block mx-auto mt-2.5 mix-blend-difference" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── 🛠️ বাটন কন্ট্রোল প্যানেল ─── */}
            <div className="mt-auto pt-4">
              {isAdminOrManager ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 border border-stone-200 p-4 rounded-xl shadow-xs">
                  <button 
                    onClick={() => setShowEditDrawer(true)} 
                    className="h-12 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Spec
                  </button>

                  <button 
                    onClick={handleToggleStatus} 
                    disabled={isActionProcessing} 
                    className={`h-12 border text-xs uppercase tracking-wider font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      product?.status?.toLowerCase().trim() === "published" 
                        ? "border-amber-600 text-amber-800 hover:bg-amber-50" 
                        : "border-emerald-600 text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    {isActionProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : product?.status?.toLowerCase().trim() === "published" ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    {product?.status?.toLowerCase().trim() === "published" ? "Unpublish" : "Publish Live"}
                  </button>

                  <button onClick={() => setShowDeleteModal(true)} disabled={isActionProcessing} className="h-12 bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Asset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => { if(!session) { triggerToast("Authentication Required: Please log in to complete purchase."); } else { setShowReceipt(true); } }} disabled={product?.stock === 0} className="w-full bg-[#111827] hover:bg-black text-white text-sm font-medium py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:bg-gray-300">
                    <ShoppingBag className="w-4 h-4" /> Buy Now
                  </button>
                  <button onClick={handleAddToCart} disabled={product?.stock === 0 || isAddingToCart} className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium py-4 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:text-gray-400">
                    {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ─── 📊 লাইভ রিভিউ সেকশন প্যানেল ─── */}
        <section className="mt-16 pt-12 border-t border-stone-200/60 text-left">
  <div className="flex items-center justify-between mb-8">
    <h2 className="font-serif text-xl sm:text-2xl text-stone-900">Customer Ledger Narratives</h2>
    <span className="text-xs font-mono bg-stone-900 text-white px-3 py-1 rounded-xs">{reviews.length} Logs</span>
  </div>

  {reviewsLoading ? (
    <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>
  ) : reviews.length === 0 ? (
    <div className="py-12 text-center bg-white/40 border rounded-xl">
      <p className="font-serif text-sm text-stone-400 italic">No validated narratives logged for this product.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review, idx) => (
        <motion.div key={idx} className="bg-white border p-5 rounded-xl flex gap-4">
          <div className="w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-xs">
            {review.userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h5 className="text-xs font-semibold">{review.userName}</h5>
            <p className="text-xs text-stone-600 mt-1">"{review.comment}"</p>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-stone-950 fill-stone-950" : "text-stone-200"}`} />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</section>

      </div>
    </main>
  );
}