import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/brands";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/app/components/ProductCard";
import { toProduct } from "@/lib/product-view";

export const instant = false;
export default async function BrandDetailsPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; let brand; try { brand=await getBrand(id); } catch { notFound(); }
 const products=await getProducts({brand:id,limit:20}).catch(()=>[]);
 return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><nav className="mb-5 flex gap-2 text-xs text-slate-500"><Link href="/">Home</Link><span>/</span><Link href="/brands">Brands</Link><span>/</span><span>{brand.name}</span></nav><header className="mb-8 flex items-center gap-5 rounded-xl border border-slate-200 p-5"><img src={brand.image} alt={brand.name} className="size-20 rounded-lg object-contain"/><h1 className="text-3xl font-bold text-slate-900">{brand.name}</h1></header><h2 className="mb-5 text-xl font-bold">Products by {brand.name}</h2>{products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{products.map((item,index)=><ProductCard key={item._id} product={toProduct(item,index)}/>)}</div> : <p className="rounded-lg border border-slate-200 p-8 text-center text-slate-500">No products are available for this brand.</p>}</main>;
}
