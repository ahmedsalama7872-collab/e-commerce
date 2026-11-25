import Link from "next/link";
import { ArrowRight, BadgeCheck, Search } from "lucide-react";
import { getBrands } from "@/lib/brands";

const brands = [
  { id: "brand-01", name: "Brand Name", category: "Fresh Market", products: 24, mark: "B", color: "bg-emerald-50 text-emerald-700" },
  { id: "brand-02", name: "Brand Name", category: "Fashion", products: 18, mark: "B", color: "bg-violet-50 text-violet-700" },
  { id: "brand-03", name: "Brand Name", category: "Home & Kitchen", products: 32, mark: "B", color: "bg-amber-50 text-amber-700" },
  { id: "brand-04", name: "Brand Name", category: "Electronics", products: 16, mark: "B", color: "bg-sky-50 text-sky-700" },
  { id: "brand-05", name: "Brand Name", category: "Beauty & Health", products: 21, mark: "B", color: "bg-rose-50 text-rose-700" },
  { id: "brand-06", name: "Brand Name", category: "Baby & Toys", products: 14, mark: "B", color: "bg-orange-50 text-orange-700" },
  { id: "brand-07", name: "Brand Name", category: "Fashion", products: 27, mark: "B", color: "bg-indigo-50 text-indigo-700" },
  { id: "brand-08", name: "Brand Name", category: "Supermarket", products: 39, mark: "B", color: "bg-lime-50 text-lime-700" },
];

export default async function BrandsPage() {
  const brands = await getBrands().catch(() => []);
  return (
    <main className="min-h-[65vh] bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-4 text-[11px] text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800">Brands</span></nav>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Our partners</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Shop by Brand</h1><p className="mt-1 text-xs text-slate-500">Discover trusted names across the FreshCart collection.</p></div>
          <label className="flex h-10 w-full max-w-xs items-center gap-2 rounded-md border border-slate-200 px-3 text-xs text-slate-400"><span className="sr-only">Search brands</span><Search size={15} /><input className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search brands" /></label>
        </header>
        <div className="mb-4 flex items-center justify-between"><p className="text-xs text-slate-500"><b className="text-slate-800">{brands.length}</b> featured brands</p><Link href="/shop" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900">Browse all products <ArrowRight size={14} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {brands.map((brand, index) => <Link href={`/shop?brand=${brand._id}`} key={brand._id} className="group rounded-lg border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5"><div className="grid size-16 place-items-center overflow-hidden rounded-xl bg-slate-50"><img src={brand.image} alt="" className="size-full object-contain p-2" /></div><div className="mt-4 flex items-center gap-1.5"><h2 className="text-sm font-semibold text-slate-800">{brand.name}</h2><BadgeCheck size={14} className="text-emerald-600" /></div><p className="mt-1 text-[11px] text-slate-500">FreshCart partner</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[10px] text-slate-500">Brand #{index + 1}</span><ArrowRight size={14} className="text-emerald-700 transition group-hover:translate-x-0.5" /></div></Link>)}
        </div>
      </div>
    </main>
  );
}
