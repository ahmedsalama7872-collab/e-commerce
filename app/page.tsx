import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Headphones,
  Leaf,
  RotateCcw,
  Truck,
} from "lucide-react";
import { ProductCard } from "./_components/ProductCard";
import { categories, products } from "./_components/store-data";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { toProduct } from "@/lib/product-view";

const services = [
  { title: "Free Shipping", detail: "On orders over 500 EGP", icon: Truck },
  { title: "Secure Payment", detail: "100% protected checkout", icon: CreditCard },
  { title: "Easy Returns", detail: "14-day return policy", icon: RotateCcw },
  { title: "24/7 Support", detail: "Here whenever you need", icon: Headphones },
];

export default async function Home() {
  const [apiProducts, apiCategories] = await Promise.allSettled([getProducts({ limit: 10 }), getCategories()]);
  const featuredProducts = apiProducts.status === "fulfilled" ? apiProducts.value.map(toProduct) : products;
  const categoryItems = apiCategories.status === "fulfilled" ? apiCategories.value : null;
  return (
    <main className="bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <section className="relative mt-4 grid min-h-[320px] overflow-hidden rounded-lg bg-gradient-to-r from-[#14803e] via-[#19a34a] to-[#7cbf42] sm:min-h-[400px] lg:grid-cols-2" aria-label="Fresh products delivered to your door">
          <div className="relative z-10 flex flex-col items-start justify-center px-7 py-10 text-white sm:px-12 lg:px-16">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium"><Leaf size={14} /> Fresh from the farm</span>
            <h1 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Fresh Products Delivered to Your Door</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">The best of the season, picked with care and brought straight to your home.</p>
            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-white/90"><Clock3 size={14} /> Get 20% off your first order</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/shop" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50">Shop Now</Link><Link href="/shop#deals" className="rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">View Deals</Link></div>
          </div>
          <div className="relative hidden min-h-[400px] items-center justify-center overflow-hidden lg:flex" aria-hidden="true">
            <div className="absolute right-[-9%] top-[-35%] size-[520px] rounded-full border border-white/20 bg-white/5" />
            <div className="absolute right-[6%] top-[4%] size-[390px] rounded-full border border-white/20 bg-lime-200/15" />
            <span className="absolute right-[17%] top-[19%] text-[96px] drop-shadow-lg">🥬</span><span className="absolute right-[49%] top-[25%] text-[76px] drop-shadow-lg">🍊</span><span className="absolute right-[24%] top-[47%] text-[110px] drop-shadow-lg">🍎</span><span className="absolute right-[54%] top-[54%] text-[82px] drop-shadow-lg">🥕</span><span className="absolute right-[16%] bottom-[7%] text-[72px] drop-shadow-lg">🥑</span>
            <div className="absolute bottom-0 right-0 h-1/3 w-full bg-gradient-to-t from-emerald-900/20 to-transparent" />
          </div>
          <button aria-label="Previous slide" className="absolute left-3 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-emerald-800 shadow sm:left-4"><ChevronLeft size={18} /></button><button aria-label="Next slide" className="absolute right-3 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-emerald-800 shadow sm:right-4"><ChevronRight size={18} /></button>
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5"><i className="h-1.5 w-6 rounded-full bg-white" /><i className="size-1.5 rounded-full bg-white/60" /><i className="size-1.5 rounded-full bg-white/60" /></div>
        </section>

        <section className="grid grid-cols-2 border-b border-slate-100 py-4 md:grid-cols-4" aria-label="Shopping benefits">
          {services.map(({ title, detail, icon: Icon }) => <div className="flex items-center gap-2.5 px-2 py-2 sm:justify-center sm:gap-3" key={title}><span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon size={17} /></span><span><b className="block text-xs font-semibold text-slate-800">{title}</b><small className="mt-0.5 block text-[10px] text-slate-500">{detail}</small></span></div>)}
        </section>

        <section className="py-8 sm:py-10" aria-labelledby="categories-heading">
          <div className="mb-5 flex items-end justify-between"><h2 id="categories-heading" className="border-l-[3px] border-emerald-600 pl-2 text-lg font-bold">Shop By Category</h2><Link href="/shop" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">View All Categories <ArrowRight size={14} /></Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categoryItems ? categoryItems.map(({ _id, name, image }, index) => { const color = categories[index % categories.length].color; return <Link href={`/shop?category=${_id}`} key={_id} className="group flex flex-col items-center gap-2 rounded-lg py-2 text-center"><span className={`grid size-16 place-items-center overflow-hidden rounded-full transition group-hover:scale-105 ${color}`}><img src={image} alt="" className="size-full object-cover" /></span><span className="text-[11px] font-medium text-slate-700">{name}</span></Link>; }) : categories.map(({ name, icon: Icon, color }) => <Link href="/shop" key={name} className="group flex flex-col items-center gap-2 rounded-lg py-2 text-center"><span className={`grid size-16 place-items-center rounded-full transition group-hover:scale-105 ${color}`}><Icon size={27} strokeWidth={1.6} /></span><span className="text-[11px] font-medium text-slate-700">{name}</span></Link>)}</div>
        </section>

        <section id="deals" className="grid gap-4 pb-9 md:grid-cols-2" aria-label="Current deals">
          <Link href="/shop" className="relative flex min-h-36 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#108945] to-[#2db55d] p-5 text-white sm:p-7"><span className="absolute -right-3 -top-7 text-8xl opacity-25">🍊</span><span className="absolute bottom-0 right-24 text-7xl opacity-35">🥑</span><span className="relative z-10 max-w-[70%]"><small className="font-semibold uppercase tracking-wide text-white/80">Fresh deal of the week</small><b className="mt-1 block text-xl font-bold">Fresh Organic Fruits</b><span className="mt-1 block text-xs">Get up to 40% off selected picks</span><span className="mt-3 inline-flex items-center gap-1 rounded bg-white px-3 py-1.5 text-[10px] font-semibold text-emerald-800">Shop now <ArrowRight size={13} /></span></span></Link>
          <Link href="/shop" className="relative flex min-h-36 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#eb8c1c] via-[#f05732] to-[#e63352] p-5 text-white sm:p-7"><span className="absolute -right-1 -top-8 text-8xl opacity-30">🥕</span><span className="absolute bottom-0 right-24 text-7xl opacity-35">🥦</span><span className="relative z-10 max-w-[70%]"><small className="font-semibold uppercase tracking-wide text-white/80">Today&apos;s special</small><b className="mt-1 block text-xl font-bold">Exotic Vegetables</b><span className="mt-1 block text-xs">Save 25% on garden favorites</span><span className="mt-3 inline-flex items-center gap-1 rounded bg-white px-3 py-1.5 text-[10px] font-semibold text-rose-700">Shop now <ArrowRight size={13} /></span></span></Link>
        </section>

        <section className="pt-5" aria-labelledby="featured-heading">
          <div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Picked for you</p><h2 id="featured-heading" className="mt-1 text-xl font-bold text-slate-800">Featured Products</h2></div><Link href="/shop" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">View all <ArrowRight size={14} /></Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{featuredProducts.slice(0, 5).map((product) => <ProductCard product={product} key={product.id} />)}</div>
        </section>
      </div>
    </main>
  );
}
