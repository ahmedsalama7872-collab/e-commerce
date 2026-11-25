"use client";

import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/product-view";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { addToWishlist } from "@/lib/wishlist";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function addProduct(action: "cart" | "wishlist") {
    setBusy(true);
    setMessage("");
    try {
      if (action === "cart") await addToCart(product.id);
      else await addToWishlist(product.id);
      setMessage(action === "cart" ? "Added to cart" : "Added to wishlist");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please sign in and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg hover:shadow-slate-900/5 ${layout === "list" ? "flex min-h-40" : "hover:-translate-y-1"}`}>
      <div className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${product.color} ${layout === "list" ? "w-28 sm:w-40" : "h-48 w-full"}`}>
      <Link href={`/products/${encodeURIComponent(product.id)}`} aria-label={`View ${product.name}`} className="grid size-full place-items-center">
        {product.image ? (
          // Catalog images are supplied by the product data.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105" />
        ) : null}
        {product.previousPrice && <span className="absolute left-3 top-3 rounded bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white">Sale</span>}
      </Link>
        <button type="button" aria-label={`Add ${product.name} to wishlist`} onClick={() => void addProduct("wishlist")} disabled={busy} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-rose-500 disabled:opacity-50"><Heart size={16} /></button>
      </div>
      <div className={`min-w-0 flex-1 p-3.5 ${layout === "list" ? "self-center" : ""}`}>
        <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700">{product.category}</p>
        <h3 className="mt-1.5 truncate text-sm font-semibold text-slate-800"><Link href={`/products/${encodeURIComponent(product.id)}`} className="hover:text-emerald-700">{product.name}</Link></h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor" /><span className="text-xs font-medium text-slate-600">{product.rating.toFixed(1)}</span></div>
          <div className="flex items-baseline gap-1.5"><span className="text-sm font-bold text-slate-900">{product.price.toLocaleString("en-EG")} EGP</span>{product.previousPrice && <del className="text-[10px] text-slate-400">{product.previousPrice.toLocaleString("en-EG")} EGP</del>}</div>
        </div>
        <button type="button" onClick={() => void addProduct("cart")} disabled={busy} className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"><Plus size={15} />{busy ? "Adding…" : "Add to cart"}</button>
        {message && <p className="mt-1.5 text-center text-[10px] text-slate-500" aria-live="polite">{message}</p>}
      </div>
    </article>
  );
}
