"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  Headphones,
  Leaf,
  RotateCcw,
  Truck,
} from "lucide-react";
import { ProductCard } from "../ProductCard";
import { HeroProductSlider } from "../HeroProductSlider";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { toProduct } from "@/lib/product-view";


const services = [
  { title: "Free Shipping", detail: "On orders over 500 EGP", icon: Truck },
  { title: "Secure Payment", detail: "100% protected checkout", icon: CreditCard },
  { title: "Easy Returns", detail: "14-day return policy", icon: RotateCcw },
  { title: "24/7 Support", detail: "Here whenever you need", icon: Headphones },
];

export function HomePage() {
  const [apiProducts, setApiProducts] = useState<Awaited<ReturnType<typeof getProducts>>>([]);
  const [categoryItems, setCategoryItems] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let live = true; Promise.all([getProducts({ limit: 10 }).catch(() => []), getCategories().catch(() => [])]).then(([products, categories]) => { if (live) { setApiProducts(products); setCategoryItems(categories); setLoading(false); } }); return () => { live = false; }; }, []);
  const featuredProducts = apiProducts.map(toProduct);
  if (loading) return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8">Loading…</main>;
  return (
    <main className="bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <section className="relative mt-4 grid min-h-[320px] overflow-hidden rounded-lg bg-gradient-to-r from-[#14803e] via-[#19a34a] to-[#7cbf42] sm:min-h-[400px] lg:grid-cols-2" aria-label="Fresh products delivered to your door">
          <div className="relative z-10 flex flex-col items-start justify-center px-7 py-10 text-white sm:px-12 lg:px-16">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium"><Leaf size={14} /> Fresh from the farm</span>
            <h1 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Fresh Products Delivered to Your Door</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">The best of the season, picked with care and brought straight to your home.</p>
            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-white/90"><Clock3 size={14} /> Browse the latest products from our catalog</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/shop" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50">Shop Now</Link><Link href="/categories" className="rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Browse categories</Link></div>
          </div>
          <HeroProductSlider products={featuredProducts.slice(0, 5)} />
        </section>

        <section className="grid grid-cols-2 border-b border-slate-100 py-4 md:grid-cols-4" aria-label="Shopping benefits">
          {services.map(({ title, detail, icon: Icon }) => <div className="flex items-center gap-2.5 px-2 py-2 sm:justify-center sm:gap-3" key={title}><span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon size={17} /></span><span><b className="block text-xs font-semibold text-slate-800">{title}</b><small className="mt-0.5 block text-[10px] text-slate-500">{detail}</small></span></div>)}
        </section>

        <section className="py-8 sm:py-10" aria-labelledby="categories-heading">
          <div className="mb-5 flex items-end justify-between"><h2 id="categories-heading" className="border-l-[3px] border-emerald-600 pl-2 text-lg font-bold">Shop By Category</h2><Link href="/categories" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">View all categories <ArrowRight size={14} /></Link></div>
          {categoryItems.length ? <div className="flex gap-3 overflow-x-auto pb-3">{categoryItems.map(({ _id, name, image }) => <Link href={`/category?id=${encodeURIComponent(_id)}`} key={_id} className="group flex w-28 shrink-0 flex-col items-center gap-2 rounded-lg py-2 text-center"><span className="grid size-16 place-items-center overflow-hidden rounded-full bg-emerald-50 transition group-hover:scale-105"><img src={image} alt="" className="size-full object-cover" /></span><span className="line-clamp-2 text-[11px] font-medium text-slate-700">{name}</span></Link>)}</div> : <p className="py-8 text-center text-sm text-slate-500">No categories available.</p>}
        </section>


        <section className="pt-5" aria-labelledby="featured-heading">
          <div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Picked for you</p><h2 id="featured-heading" className="mt-1 text-xl font-bold text-slate-800">Featured Products</h2></div><Link href="/shop" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">View all <ArrowRight size={14} /></Link></div>
          {featuredProducts.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{featuredProducts.slice(0, 5).map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p className="rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500">No products are available right now.</p>}
        </section>
      </div>
    </main>
  );
}
