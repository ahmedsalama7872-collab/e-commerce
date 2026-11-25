import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  ChevronRight,
  Filter,
  Grid2X2,
  List,
  Search,
  Star,
} from "lucide-react";
import { ProductCard } from "../../_components/ProductCard";
import { categories, products } from "../../_components/store-data";
import { getProducts } from "@/lib/products";
import { toProduct } from "@/lib/product-view";

const brands = ["Fresh Market", "Green Valley", "Daily Choice", "Home Basics", "Good Life"];
const priceRanges = ["Under 250 EGP", "250 – 500 EGP", "500 – 1,000 EGP", "Over 1,000 EGP"];

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; brand?: string; keyword?: string }> }) {
  const params = await searchParams;
  const result = await getProducts({ limit: 40, category: params.category, brand: params.brand, keyword: params.keyword }).catch(() => null);
  const shownProducts = result ? result.map(toProduct) : products;
  return (
    <main className="min-h-[65vh] bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-4 text-[11px] text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><ChevronRight size={13} /><span className="font-medium text-slate-800">Shop</span></nav>
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Browse the collection</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Shop All Products</h1><p className="mt-1 text-xs text-slate-500">Find something good for every day.</p></div>
          <div className="flex items-center gap-2"><button type="button" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 lg:hidden"><Filter size={14} /> Filters</button><form action="/shop" className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs text-slate-400"><Search size={14} /><input name="keyword" defaultValue={params.keyword} className="w-32 bg-transparent text-slate-700 outline-none placeholder:text-slate-400 sm:w-44" placeholder="Search products" /></form></div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[245px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              <section className="py-4"><h2 className="mb-3 text-sm font-bold">Categories</h2><div className="space-y-2.5">{categories.map(({ name }) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={name}><input type="checkbox" className="size-3.5 accent-emerald-600" />{name}<span className="ml-auto text-[10px] text-slate-400">{(name.length * 7) % 31 + 12}</span></label>)}</div></section>
              <section className="py-4"><h2 className="mb-3 text-sm font-bold">Price</h2><div className="space-y-2.5">{priceRanges.map((range) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={range}><input type="checkbox" className="size-3.5 accent-emerald-600" />{range}</label>)}</div><div className="mt-4 flex items-center gap-2"><input aria-label="Minimum price" placeholder="Min" className="w-1/2 rounded border border-slate-200 px-2 py-1.5 text-[10px] outline-none focus:border-emerald-500" /><input aria-label="Maximum price" placeholder="Max" className="w-1/2 rounded border border-slate-200 px-2 py-1.5 text-[10px] outline-none focus:border-emerald-500" /></div></section>
              <section className="py-4"><h2 className="mb-3 text-sm font-bold">Brands</h2><div className="space-y-2.5">{brands.map((brand) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={brand}><input type="checkbox" className="size-3.5 accent-emerald-600" />{brand}</label>)}</div></section>
              <section className="py-4"><h2 className="mb-3 text-sm font-bold">Rating</h2><div className="space-y-2.5">{[4, 3, 2].map((rating) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={rating}><input type="checkbox" className="size-3.5 accent-emerald-600" /><span className="flex text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill={index < rating ? "currentColor" : "none"} />)}</span><span className="text-slate-400">& up</span></label>)}</div></section>
            </div>
          </aside>

          <section aria-label="Product results">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2.5 sm:px-4">
              <p className="text-xs text-slate-600">Showing <b className="text-slate-800">1–{shownProducts.length}</b> products</p>
              <div className="flex items-center gap-2"><label className="flex h-8 items-center gap-2 rounded border border-slate-200 bg-white px-2 text-[10px] text-slate-600"><ArrowDownWideNarrow size={13} /><span className="hidden sm:inline">Sort by:</span><select className="bg-transparent outline-none"><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Top rated</option></select><ChevronDown size={12} /></label><button aria-label="Grid view" className="grid size-8 place-items-center rounded border border-emerald-600 bg-emerald-600 text-white"><Grid2X2 size={14} /></button><button aria-label="List view" className="hidden size-8 place-items-center rounded border border-slate-200 bg-white text-slate-500 sm:grid"><List size={15} /></button></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{shownProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>
            <div className="mt-7 flex items-center justify-center gap-1"><button className="grid size-8 place-items-center rounded border border-slate-200 text-slate-500"><ChevronRight className="rotate-180" size={14} /></button><button className="grid size-8 place-items-center rounded bg-emerald-600 text-xs font-semibold text-white">1</button><button className="grid size-8 place-items-center rounded border border-slate-200 text-xs text-slate-600">2</button><button className="grid size-8 place-items-center rounded border border-slate-200 text-xs text-slate-600">3</button><span className="px-1 text-xs text-slate-400">…</span><button className="grid size-8 place-items-center rounded border border-slate-200 text-xs text-slate-600">8</button><button className="grid size-8 place-items-center rounded border border-slate-200 text-slate-500"><ChevronRight size={14} /></button></div>
          </section>
        </div>
      </div>
    </main>
  );
}
