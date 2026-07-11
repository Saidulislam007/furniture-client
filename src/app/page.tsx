"use client"; // ক্লায়েন্ট-সাইড স্টেট (useState, useEffect) হ্যান্ডেল করার জন্য Next.js-এ এটি জরুরি

import { useState, useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CategoryGrid from "@/components/sections/CategorySection"; // 🚀 কাস্টম এডিটোনিয়াল ক্যাটাগরি সেকশন
import { ProductSection, Product } from "@/components/ProductSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import StatsSection from "@/components/sections/StatsSection";

// 📝 নতুন লাক্সারি ইন্টেরিয়র/ফার্নিচার থিমের সাথে মিল রেখে ডেমো প্রোডাক্ট ডেটা
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

// 📝 ইমেজের থিমের সাথে মিল রেখে ৩টি কাস্টম অ্যাসাইমেট্রিক ক্যাটাগরি ডেটা
const editorialCategories = [
  { 
    title: "Living Room Architecture", 
    slug: "living-room", 
    count: 24, 
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800" // বামের বড় ইমেজ
  },
  { 
    title: "Minimalist Workspace", 
    slug: "workspace", 
    count: 14, 
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800" // ডানের ওপরে
  },
  { 
    title: "Outdoor Living", 
    slug: "outdoor", 
    count: 9, 
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800" // ডানের নিচে
  }
];

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);

  // ⏳ ইউজার এক্সপেরিয়েন্স এবং স্কেলেটন স্ক্রিন টেস্ট করার জন্য ২ সেকেন্ডের কৃত্রিম লোডিং টাইমার
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🛒 অ্যাকশন বাটন (Circle Arrow) ক্লিক হ্যান্ডলার
  const handleAction = (product: Product) => {
    console.log("Action triggered for product:", product.title);
  };

  // 🔍 カードクリックハンドラー (ডিটেইলস পেজে যাওয়ার জন্য)
  const handleViewDetails = (id: string) => {
    console.log("Navigate to details page for product ID:", id);
  };

  return (
    <>
      {/* 🚀 ১. হিরো সেকশন */}
      <HeroSection />

      {/* 📂 ২. কাস্টম এডিটোনিয়াল ক্যাটাগরি গ্রিড (আপলোড করা ইমেজের মতো লেআউট) */}
      
      
     
      <ProductSection
        title="Shaping Elegant Spaces"
        subtitle="Our mission is to provide clean, effective, and gentle alternatives to traditional."
        products={dummyProducts} 
        isLoading={loading}
        onAddToCart={handleAction}
        onViewDetails={handleViewDetails}
      />
      <StatsSection/>
       {/* 🛍️ ৩. ওয়ান-ফাইল প্রিমিয়াম প্রোডাক্ট সেকশন */}
      <CategoryGrid 
        categories={editorialCategories}
        sectionTitle="Curated Spaces"
        sectionSubtitle="Select by Architecture"
      />
      <NewsletterSection/>
      {/* হোম পেজের অন্যান্য কন্টেন্ট বা সেকশন */}
      <div className="max-w-[1920px] mx-auto px-4">
        
      </div>
    </>
  );
}