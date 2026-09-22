"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Box, Headphones, Heart, Minus, Plus, Share2, Wrench } from "lucide-react";
import { getCategoryProducts } from "@/services/api/getCategoryProducts";
import type { Product } from "@/types/product";
import { shopCategories, slugify } from "@/components/categories/category-data";

const productSlug = (product: Product) => `${slugify(product.title)}-${product._id}`;

export default function CategoryProductDetailsPage() {
  const params = useParams<{ category?: string; slug: string }>();
  const pathname = usePathname();
  const router = useRouter();
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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getCategoryProducts(categorySlug);
      const requiresExactCategory = ["sofas", "storage", "bedroom", "office", "study", "kitchen", "kids", "outdoor"].includes(categorySlug);
      const categoryProducts = requiresExactCategory
        ? data.filter((item) => item.category?.trim().toLowerCase() === categorySlug)
        : data;
      setProducts(categoryProducts);
      setLoading(false);
    };
    loadProduct();
  }, [categorySlug]);

  const product = useMemo(() => products.find((item) => productSlug(item) === params?.slug) || products.find((item) => slugify(item.title) === params?.slug), [products, params?.slug]);

  if (loading) return <main className="min-h-screen bg-[#f4f0eb] pt-24"><div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-stone-200" /><div className="space-y-5 pt-8"><div className="h-5 w-24 animate-pulse bg-stone-200" /><div className="h-14 w-3/4 animate-pulse bg-stone-200" /><div className="h-24 animate-pulse bg-stone-200" /></div></div></main>;

  if (!product || !category) return <main className="min-h-screen bg-[#f4f0eb] px-6 pt-32 text-center"><h1 className="font-serif text-4xl text-stone-900">Product not found</h1><Link href={categoryPath} className="mt-6 inline-block text-sm text-amber-800 hover:underline">Back to category</Link></main>;

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 text-stone-950">
      <div className="mx-auto max-w-[1680px] px-5 py-8 sm:px-8 lg:px-12">
        <Link href={categoryPath} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-stone-600 transition hover:text-amber-800"><ArrowLeft className="h-4 w-4" /> Back to {category.name}</Link>

        <div className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-16 xl:gap-24">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#faf8f5] sm:min-h-[560px] lg:min-h-[650px]">
            <img src={product.image} alt={product.title} className="h-full w-full object-contain p-6 sm:p-12" />
          </div>

          <section className="max-w-2xl py-2 lg:py-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">{category.name}{product.subCategory ? `, ${product.subCategory}` : ""}</p><h1 className="mt-2 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">{product.title}</h1></div>
              <div className="flex shrink-0 items-center gap-2"><button type="button" aria-label="Save to wishlist" className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 text-stone-700 transition hover:border-amber-800 hover:text-amber-800"><Heart className="h-5 w-5" /></button><button type="button" aria-label="Share product" className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 text-stone-700 transition hover:border-amber-800 hover:text-amber-800"><Share2 className="h-5 w-5" /></button></div>
            </div>

            <p className="mt-5 text-2xl font-medium tracking-wide sm:text-3xl">৳{product.price.toLocaleString()}</p>
            {product.oldPrice && product.oldPrice > product.price ? <p className="mt-1 text-sm text-stone-400 line-through">৳{product.oldPrice.toLocaleString()}</p> : null}
            <p className="mt-4 inline-flex bg-sky-50 px-4 py-2 text-sm text-sky-900">Buy and earn loyalty points with this order.</p>

            {product.colors?.length ? <div className="mt-7"><p className="text-sm font-medium">Choose colour</p><div className="mt-3 flex flex-wrap gap-3">{product.colors.map((color) => <span key={color.name} className="inline-flex items-center gap-2 border border-stone-200 px-3 py-2 text-xs text-stone-700"><span className="h-3.5 w-3.5 rounded-full border border-stone-300" style={{ backgroundColor: color.value }} />{color.name}</span>)}</div></div> : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-full border border-stone-300 px-2 sm:w-36"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="grid h-9 w-9 place-items-center text-stone-700 hover:text-amber-800"><Minus className="h-4 w-4" /></button><span className="text-sm font-medium">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(product.stock || 1, current + 1))} className="grid h-9 w-9 place-items-center text-stone-700 hover:text-amber-800"><Plus className="h-4 w-4" /></button></div>
              <Link href={`/products/${product._id}`} className="flex h-14 flex-1 items-center justify-center rounded-full border border-amber-800 px-7 text-xs font-bold uppercase tracking-[0.16em] text-amber-900 transition hover:bg-amber-50">Add to Cart</Link>
              <button type="button" disabled={product.stock === 0} onClick={() => router.push(`/checkout/${product._id}?quantity=${quantity}`)} className="h-14 flex-1 rounded-full bg-[#9d155f] px-7 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#7d0f4a] disabled:cursor-not-allowed disabled:bg-stone-300">Buy Now</button>
            </div>

            <p className="mt-7 inline-flex bg-amber-50 px-4 py-2 text-sm text-stone-600">Estimated delivery within 3–5 days.</p>
            <div className="mt-8 grid grid-cols-1 border border-amber-100 bg-[#fff4c9] sm:grid-cols-3"><a href="#support" className="flex min-h-28 flex-col items-center justify-center border-b border-amber-100 px-4 text-center text-xs text-stone-700 underline-offset-4 hover:underline sm:border-b-0 sm:border-r"><Box className="mb-2 h-6 w-6" />Return & Refund Policy</a><a href="#support" className="flex min-h-28 flex-col items-center justify-center border-b border-amber-100 px-4 text-center text-xs text-stone-700 underline-offset-4 hover:underline sm:border-b-0 sm:border-r"><Wrench className="mb-2 h-6 w-6" />Assembly & Product Support</a><a id="support" href="mailto:support@atelier.com" className="flex min-h-28 flex-col items-center justify-center px-4 text-center text-xs text-stone-700 underline-offset-4 hover:underline"><Headphones className="mb-2 h-6 w-6" />Have questions? Contact us</a></div>
          </section>
        </div>

        <section className="mt-14 border-t border-stone-200 pt-10 sm:mt-20 sm:pt-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_0.9fr_0.65fr] lg:gap-0">
            <article className="lg:border-r lg:border-stone-300 lg:pr-14"><h2 className="inline-block border-b-2 border-stone-950 pb-1 font-serif text-2xl">Description</h2><p className="mt-5 max-w-3xl text-base leading-8 text-stone-700">{product.description || "This carefully made Atelier piece brings refined material, everyday utility, and an enduring modern silhouette to your home."}</p></article>
            <article className="lg:border-r lg:border-stone-300 lg:px-14"><h2 className="inline-block border-b-2 border-stone-950 pb-1 font-serif text-2xl">Materials</h2><dl className="mt-5 space-y-2 text-base leading-7 text-stone-700"><div><dt className="inline font-medium">Material: </dt><dd className="inline">{product.material || "Premium furniture grade material"}</dd></div><div><dt className="inline font-medium">Category: </dt><dd className="inline">{category.name}</dd></div>{product.subCategory ? <div><dt className="inline font-medium">Style: </dt><dd className="inline">{product.subCategory}</dd></div> : null}</dl></article>
            <article className="lg:pl-14"><h2 className="inline-block border-b-2 border-stone-950 pb-1 font-serif text-2xl">Dimensions</h2><dl className="mt-5 space-y-2 text-base leading-7 text-stone-700">{product.dimensions ? <><div>Length: {product.dimensions.depth} mm</div><div>Width: {product.dimensions.width} mm</div><div>Height: {product.dimensions.height} mm</div></> : <div>Dimensions available on request.</div>}</dl></article>
          </div>
        </section>
      </div>
    </main>
  );
}
