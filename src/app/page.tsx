"use client"; // ক্লায়েন্ট-সাইড স্টেট (useState, useEffect) হ্যান্ডেল করার জন্য Next.js-এ এটি জরুরি

import { useState, useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import { ProductSection, Product } from "@/components/ProductSection";

// 📝 নতুন লাক্সারি ইন্টেরিয়র/ফার্নিচার থিমের সাথে মিল রেখে ডেমো ডেটা
const dummyProducts: Product[] = [
  {
    id: "1",
    title: "Timeless Craftsmanship",
    description: "Each creation is a masterpiece — blending heritage craftsmanship, premium materials, and innovative design.",
    image: "https://images.unsplash.com/photo-1581782361327-0402ca001ba9?q=80&w=600" 
  },
  {
    id: "2",
    title: "Modern Aesthetics",
    description: "We design spaces that reflect your personality while embracing the latest functional trends.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600"
  },
  {
    id: "3",
    title: "Functional Elegance",
    description: "Our interiors are thoughtfully planned to combine beauty, comfort, and ultimate everyday practicality.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=600"
  }
];

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);

  // ⏳ ইউজার এক্সপেরিয়েন্স এবং স্কেলেটন স্ক্রিন টেস্ট করার জন্য ২ সেকেন্ডের কৃত্রিম লোডিং টাইমার
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🛒 অ্যাকশন বাটন (Circle Arrow) ক্লিক হ্যান্ডলার
  const handleAction = (product: Product) => {
    console.log("Action triggered for product:", product.title);
    // এখানে পরবর্তীতে তোমার নিজস্ব লজিক অ্যাড করতে পারবে
  };

  // 🔍 কার্ড ক্লিক হ্যান্ডলার (ডিটেইলস পেজে যাওয়ার জন্য)
  const handleViewDetails = (id: string) => {
    console.log("Navigate to details page for product ID:", id);
  };

  return (
    <>
      {/* 🚀 হিরো সেকশন */}
      <HeroSection />
      
      {/* 🛍️ ওয়ান-ফাইল প্রিমিয়াম প্রোডাক্ট সেকশন */}
      {/* এটি স্বয়ংক্রিয়ভাবে ৩২০ পিক্সেল থেকে ১৯২০ পিক্সেল পর্যন্ত ৩-কলাম লেআউট ও অফ-হোয়াইট ব্যাকগ্রাউন্ড হ্যান্ডেল করবে */}
      <ProductSection
        title="Shaping Elegant Spaces"
        subtitle="Our mission is to provide clean, effective, and gentle alternatives to traditional."
        products={dummyProducts} 
        isLoading={loading}
        onAddToCart={handleAction}
        onViewDetails={handleViewDetails}
      />
      
      {/* হোম পেজের অন্যান্য কন্টেন্ট বা সেকশন */}
      <div className="max-w-[1920px] mx-auto px-4 py-12">
        {/* অন্যান্য সেকশন এখানে বসাতে পারো */}
      </div>
    </>
  );
}