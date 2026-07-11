"use client"; // ক্লায়েন্ট-সাইড স্টেট হ্যান্ডেল করার জন্য Next.js-এ এটি জরুরি

import { useState, useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CategoryGrid from "@/components/sections/CategorySection"; 
import StatsSection from "@/components/sections/StatsSection";
import { ProductSection, Product } from "@/components/ProductSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { BlogList, BlogPostData } from "@/components/sections/BlogSection"; // 🚀 ব্লগ লিস্ট ও টাইপ ইম্পোর্ট
import ReviewsSection from "@/components/sections/ReviewsSection";
import VideoSection from "@/components/sections/VideoSection";

// 📝 ১. ফার্নিচার থিমের সাথে মিল রেখে ডেমো প্রোডাক্ট ডেটা
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

// 📝 ২. অ্যাসাইমেট্রিক ক্যাটাগরি ডেটা
const editorialCategories = [
  { 
    title: "Living Room Architecture", 
    slug: "living-room", 
    count: 24, 
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800"
  },
  { 
    title: "Minimalist Workspace", 
    slug: "workspace", 
    count: 14, 
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800"
  },
  { 
    title: "Outdoor Living", 
    slug: "outdoor", 
    count: 9, 
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
  }
];

// 🚀 📝 ৩. ফিক্স: লোকাল লাক্সারি ব্লগ মক ডেটা (যা বিল্ড এরর দূর করবে)
const dummyBlogPosts: BlogPostData[] = [
  {
    title: "The Subtle Art of Structural Minimalism",
    slug: "structural-minimalism",
    excerpt: "Exploring how negative space and honest materiality redefine contemporary high-end residential living rooms.",
    featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800",
    tags: ["Architecture", "Minimalism"],
    readingTime: "5 MIN READ",
    publishedAt: "July 10, 2026",
    author: {
      name: "Soren Lassen",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    }
  },
  {
    title: "Preserving Heritage Woodwork in Modern Design",
    slug: "heritage-woodwork",
    excerpt: "A deep dive into how our master artisans merge centuries-old joinery techniques with sleek texturized modern linears.",
    featuredImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
    tags: ["Craftsmanship", "Timber"],
    readingTime: "7 MIN READ",
    publishedAt: "July 02, 2026",
    author: {
      name: "Marcus Vance",
      role: "Master Artisan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    }
  },
  {
    title: "Lighting Configurations for Continuous Spaces",
    slug: "lighting-configurations",
    excerpt: "How to balance architectural white oak profiles with calculated ambient lux to capture shifting structural daylight paths.",
    featuredImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
    tags: ["Lighting", "Interior"],
    readingTime: "4 MIN READ",
    publishedAt: "June 24, 2026",
    author: {
      name: "Elena Rostova",
      role: "Spatial Stylist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    }
  }
];

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (product: Product) => {
    console.log("Action triggered for product:", product.title);
  };

  const handleViewDetails = (id: string) => {
    console.log("Navigate to details page for product ID:", id);
  };

  return (
    <>
      {/* 🚀 ১. হিরো সেকশন */}
      <HeroSection />

      {/* 📂 ২. ক্যাটাগরি গ্রিড */}
      <CategoryGrid 
        categories={editorialCategories}
        sectionTitle="Curated Spaces"
        sectionSubtitle="Select by Architecture"
      />
      
      {/* 📊 ৩. অ্যানিমেটেড স্ট্যাটস সেকশন */}
      <StatsSection />
      <VideoSection/>

      {/* 🛍️ ৪. প্রিমিয়াম প্রোডাক্ট সেকশন */}
      <ProductSection
        title="Shaping Elegant Spaces"
        subtitle="Our mission is to provide clean, effective, and gentle alternatives to traditional."
        products={dummyProducts} 
        isLoading={loading}
        onAddToCart={handleAction}
        onViewDetails={handleViewDetails}
      />

      {/* ✍️ ৫. ব্লগ ল্যান্ডিং প্রিভিউ সেকশন */}
      <BlogList posts={dummyBlogPosts} isLandingPreview={true} />

      <ReviewsSection/>
      
      {/* ✉️ 巧妙 ৬. নেটিভ নিউজলেটার সেকশন */}
      <NewsletterSection />
    </>
  );
}