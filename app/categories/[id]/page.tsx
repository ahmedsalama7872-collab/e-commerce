import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getSubcategoriesByCategory } from "@/lib/categories";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/app/components/ProductCard";
import { toProduct } from "@/lib/product-view";

export const instant = false;
export default async function CategoryDetailsPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 let category; try { category=await getCategory(id); } catch { notFound(); }
 const [subcategories, products]=await Promise.all([getSubcategoriesByCategory(id).catch(()=>[]),getProducts({category:id,limit:20}).catch(()=>[])]);
 return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><nav className="mb-5 flex gap-2 text-xs text-slate-500"><Link href="/">Home</Link><span>/</span><Link href="/categories">Categories</Link><span>/</span><span>{category.name}</span></nav><h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
  <h2 className="mb-4 mt-8 text-lg font-semibold">Subcategories</h2>{subcategories.length ? <div className="mb-9 flex flex-wrap gap-2">{subcategories.map((sub)=> <Link key={sub._id} href={`/shop?category=${encodeURIComponent(id)}&subcategory=${encodeURIComponent(sub._id)}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-700">{sub.name}</Link>)}</div> : <p className="mb-9 text-sm text-slate-500">No subcategories available.</p>}
  <h2 className="mb-4 text-lg font-semibold">Products</h2>{products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{products.map((item,index)=><ProductCard key={item._id} product={toProduct(item,index)}/>)}</div> : <p className="rounded-lg border border-slate-200 p-8 text-center text-slate-500">No products in this category.</p>}</main>;
}
