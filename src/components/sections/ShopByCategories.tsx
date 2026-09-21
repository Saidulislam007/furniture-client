"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { shopCategories } from "@/components/categories/category-data";

export default function ShopByCategories() {
  return (
    <section id="categories" className="border-b border-stone-200 bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-700">Explore our collection</p>
          <h2 className="font-serif text-4xl font-medium tracking-wide text-stone-950 sm:text-5xl lg:text-6xl">Shop By Categories</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-12 lg:grid-cols-5 xl:grid-cols-8 xl:gap-x-6">
          {shopCategories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.28) }}
            >
              <Link href={`/categories/${category.slug}`} className="group mx-auto flex max-w-[190px] flex-col items-center text-center focus:outline-none">
                <div className="aspect-square w-full overflow-hidden rounded-full bg-[#f8dfd2] ring-1 ring-stone-100 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <img
                    src={category.image}
                    alt={`${category.name} furniture`}
                    className="h-full w-full object-cover mix-blend-multiply transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <span className="mt-4 font-serif text-lg tracking-wide text-stone-900 transition-colors duration-300 group-hover:text-amber-800 sm:text-xl">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
