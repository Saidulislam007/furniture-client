import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
// ১. আপনার তৈরি করা Navbar কম্পোনেন্টটি ইম্পোর্ট করুন
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";

// Luxury look এর জন্য Inter (Sans) এবং Playfair Display (Serif) ফন্ট সেটআপ
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Atelier | Luxury Furniture Store",
  description: "Production-grade MERN/NextJS E-Commerce application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-stone-50 font-sans antialiased">
        {/* ২. <body> ট্যাগের ঠিক নিচে এবং children এর ওপরে Navbar টি বসিয়ে দিন */}
        <Navbar />
        
        {/* 🟢 ফিক্স: হিরো সেকশন এখান থেকে রিমুভ করা হয়েছে যাতে সব পেজে শো না করে */}
        <div className="w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}