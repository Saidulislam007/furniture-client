import HeroSection from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <>
      {/* 🚀 হিরো সেকশনটি এখন শুধু মেইন ল্যান্ডিং পেজে থাকবে */}
      <HeroSection />
      
      {/* আপনার হোম পেজের অন্যান্য কন্টেন্ট বা সেকশন */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Products, Categories etc. */}
      </div>
    </>
  );
}