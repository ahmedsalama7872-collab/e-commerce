"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Search } from "lucide-react";
import { getBrands } from "@/lib/brands";


export function BrandsPage() {
  const keyword = useSearchParams().get("keyword") ?? "";
  const [brands, setBrands] = useState<Awaited<ReturnType<typeof getBrands>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let live = true; setLoading(true); getBrands(100).catch(() => []).then(value => { if (live) { setBrands(value); setLoading(false); } }); return () => { live = false; }; }, [keyword]);
  const visibleBrands = brands.filter(brand => brand.name.toLowerCase().includes(keyword.toLowerCase()));
  if (loading) return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8">Loading…</main>;
  return (
    <main className="min-h-[65vh] bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-4 text-[11px] text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800">Brands</span></nav>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Our partners</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Shop by Brand</h1><p className="mt-1 text-xs text-slate-500">Discover trusted names across the FreshCart collection.</p></div>
          <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brands/`} className="flex h-10 w-full max-w-xs items-center gap-2 rounded-md border border-slate-200 px-3 text-xs text-slate-400"><label className="sr-only" htmlFor="brand-search">Search brands</label><Search size={15} /><input id="brand-search" name="keyword" defaultValue={keyword} className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search brands" /><button aria-label="Search brands" type="submit" className="text-emerald-700"><ArrowRight size={15} /></button></form>
        </header>
        <div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500"><b className="text-slate-800">{visibleBrands.length}</b> brands from our catalog</p><Link href="/shop" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">Browse all products <ArrowRight size={14} /></Link></div>
        {visibleBrands.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleBrands.map((brand) => <Link href={`/brand?id=${encodeURIComponent(brand._id)}`} key={brand._id} className="group rounded-lg border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5"><div className="grid size-16 place-items-center overflow-hidden rounded-xl bg-slate-50"><img src={brand.image} alt={brand.name} className="size-full object-contain p-2" /></div><div className="mt-4 flex items-center gap-1.5"><h2 className="text-sm font-semibold text-slate-800">{brand.name}</h2><BadgeCheck size={14} className="text-emerald-600" /></div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[10px] text-slate-500">View brand products</span><ArrowRight size={14} className="text-emerald-700 transition group-hover:translate-x-0.5" /></div></Link>)}
        </div> : <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">No brands match this search.</div>}
      </div>
    </main>
  );
}
