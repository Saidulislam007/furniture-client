"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryProducts } from "@/services/api/getCategoryProducts";
import type { Product } from "@/types/product";
import { shopCategories, slugify } from "@/components/categories/category-data";

const productSlug = (product: Product) => `${slugify(product.title)}-${product._id}`;
const PRODUCTS_PER_PAGE = 8;

export default function CategoryPage() {
  const params = useParams<{ category?: string }>();
  const pathname = usePathname();
  const standaloneCategory = ["sofas", "storage", "bedroom", "office", "study", "kitchen", "kids", "outdoor"].find(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`),
  ) || "";
  const categorySlug = params?.category || standaloneCategory;
  const category = shopCategories.find((item) => item.slug === categorySlug);
  const categoryPath = standaloneCategory
    ? `/${standaloneCategory}`
    : `/categories/${categorySlug}`;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await getCategoryProducts(categorySlug);
      const requiresExactCategory = ["sofas", "storage", "bedroom", "office", "study", "kitchen", "kids", "outdoor"].includes(categorySlug);
      const categoryProducts = requiresExactCategory
        ? data.filter((product) => product.category?.trim().toLowerCase() === categorySlug)
        : data;
      setProducts(categoryProducts);
      setCurrentPage(1);
      setLoading(false);
    };

    if (categorySlug) loadProducts();
  }, [categorySlug]);


  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    requestAnimationFrame(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (!category) {
    return <main className="min-h-screen bg-[#f4f0eb] px-6 pt-32 text-center"><h1 className="font-serif text-4xl text-stone-900">Category not found</h1><Link href="/" className="mt-6 inline-block text-sm text-amber-800 hover:underline">Return home</Link></main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] pt-24">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <Link href="/" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-stone-500 transition hover:text-amber-800"><ChevronLeft className="h-4 w-4" /> Home</Link>
          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div><p className="text-xs uppercase tracking-[0.28em] text-amber-700">Atelier collection</p><h1 className="mt-3 font-serif text-4xl text-stone-950 sm:text-5xl">{category.name}</h1></div>
            <p className="max-w-md text-sm leading-7 text-stone-600">Explore refined {category.name.toLowerCase()} pieces created to bring lasting comfort and character to your space.</p>
          </div>
        </div>
      </section>

      <section ref={productsSectionRef} className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        {loading ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-stone-200" />)}</div> : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center"><h2 className="font-serif text-2xl text-stone-800">New {category.name} pieces are coming soon.</h2><p className="mt-3 text-sm text-stone-500">Browse all currently available furniture in our shop.</p><Link href="/products" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 hover:underline">View all products <ArrowRight className="h-4 w-4" /></Link></div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => <Link key={product._id} href={`${categoryPath}/${productSlug(product)}`} className="group"><div className="aspect-[4/3.3] overflow-hidden rounded-[1.4rem] bg-[#eadecf]"><img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-stone-400">{product.category || category.name}</p><div className="mt-1 flex items-start justify-between gap-3"><h2 className="font-serif text-xl text-stone-900 group-hover:text-amber-800">{product.title}</h2><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-stone-500 transition-transform group-hover:translate-x-1" /></div><p className="mt-2 text-sm font-semibold text-stone-800">৳{product.price.toLocaleString()}</p></Link>)}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Category products pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-10 items-center gap-1 border border-stone-300 bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-900 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 border px-3 text-sm transition ${
                      currentPage === page
                        ? "border-stone-950 bg-stone-950 text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-10 items-center gap-1 border border-stone-300 bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-900 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
