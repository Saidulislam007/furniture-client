import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // min-h-screen ব্যবহার করায় এটি পুরো স্ক্রিন জুড়ে জায়গা নেবে, সাদা স্ক্রিন উধাও হয়ে যাবে!
    <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50 font-sans text-stone-900 selection:bg-amber-800 selection:text-white">
      
      <main className="flex flex-col items-center justify-center text-center px-6 max-w-2xl py-20 mt-20">
        
        {/* Next.js Logo - Fixed aspect ratio warning with h-auto className */}
        <div className="mb-12">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={140}
            height={28}
            priority
            className="h-auto w-auto dark:invert opacity-80"
          />
        </div>

        {/* Brand & Setup Message */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide leading-tight text-stone-800">
            Atelier Luxury Furniture
          </h1>
          <p className="max-w-md text-base md:text-lg font-light leading-relaxed text-stone-600">
            Development environment status: <span className="text-emerald-700 font-medium">Ready</span>. 
            To start building your portfolio application, open and edit <code className="bg-stone-200/60 px-1.5 py-0.5 rounded font-mono text-sm">src/app/page.tsx</code>.
          </p>
        </div>

        {/* Call to Actions (UX Clean Targets) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded bg-amber-800 px-8 text-sm uppercase tracking-wider text-white transition-colors hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-700 min-w-[160px]"
            href="/products"
          >
            Explore Store
          </Link>
          
          <a
            className="flex h-12 items-center justify-center rounded border border-solid border-stone-300 px-8 text-sm uppercase tracking-wider text-stone-700 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 min-w-[160px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>

      </main>

    </div>
  );
}