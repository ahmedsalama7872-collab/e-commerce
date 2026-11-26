"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/categories";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof getCategories>>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let live = true; getCategories().catch(() => []).then(value => { if (live) { setCategories(value); setLoading(false); } }); return () => { live = false; }; }, []);
  if (loading) return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8">Loading…</main>;
  return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><h1 className="mb-6 text-3xl font-bold text-slate-900">Categories</h1>{categories.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{categories.map((category) => <Link key={category._id} href={`/category?id=${encodeURIComponent(category._id)}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"><img src={category.image} alt={category.name} className="h-40 w-full object-cover"/><h2 className="p-4 font-semibold text-slate-800">{category.name}</h2></Link>)}</div> : <p className="rounded-lg border border-slate-200 p-8 text-center text-slate-500">No categories available.</p>}</main>;
}
