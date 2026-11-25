import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProduct, getProductsByCategory, type ApiProduct } from "@/lib/products";
import { toProduct } from "@/lib/product-view";
import { ProductCard } from "@/app/components/ProductCard";
import { ProductActions } from "@/app/components/ProductActions";

export const instant = false;
const price = (value: number) => `${value.toLocaleString("en-EG")} EGP`;

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: ApiProduct;
  try { product = await getProduct(id); } catch { notFound(); }
  const related = product.category?._id ? await getProductsByCategory(product.category._id, 6).catch(() => []) : [];
  const images = [...new Set([product.imageCover, ...(product.images ?? [])].filter(Boolean))];
  return <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
    <nav className="mb-6 flex gap-2 text-xs text-slate-500"><Link href="/">Home</Link><span>/</span><Link href="/shop">Shop</Link><span>/</span><span>{product.title}</span></nav>
    <section className="grid gap-8 md:grid-cols-2">
      <div className="grid gap-3 sm:grid-cols-2">{images.map((image, index) => <div key={image} className={`grid min-h-64 place-items-center overflow-hidden rounded-xl bg-slate-50 ${index === 0 ? "sm:col-span-2" : ""}`}><img src={image} alt={`${product.title} ${index + 1}`} className="max-h-[500px] w-full object-contain p-5" /></div>)}</div>
      <div className="self-center"><p className="text-sm text-emerald-700">{product.category?.name}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{product.title}</h1><div className="mt-4 flex items-center gap-2 text-amber-500"><Star fill="currentColor" size={17}/><span className="text-sm font-semibold text-slate-700">{(product.ratingsAverage ?? 0).toFixed(1)}</span><span className="text-xs text-slate-500">({product.ratingsQuantity ?? 0} ratings)</span></div><div className="mt-5 flex items-baseline gap-3"><span className="text-2xl font-bold text-slate-900">{price(product.priceAfterDiscount ?? product.price)}</span>{product.priceAfterDiscount && <del className="text-sm text-slate-400">{price(product.price)}</del>}</div><p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description}</p><div className="mt-7"><ProductActions productId={product._id}/></div></div>
    </section>
    {related.length > 0 && <section className="mt-14"><h2 className="mb-5 text-xl font-bold">Similar products</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{related.filter((item) => item._id !== product._id).map((item, index) => <ProductCard product={toProduct(item, index)} key={item._id}/>)}</div></section>}
  </main>;
}
