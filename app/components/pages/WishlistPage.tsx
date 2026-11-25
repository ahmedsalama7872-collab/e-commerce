"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { getWishlist, onWishlistChanged, removeFromWishlist } from "@/lib/wishlist";
import type { ApiProduct } from "@/lib/products";

const formatPrice = (price: number) => `${Number(price || 0).toLocaleString("en-EG")} EGP`;

export function WishlistPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadWishlist = useCallback(async () => {
    if (!window.localStorage.getItem("freshcart-token")) {
      setSignedIn(false);
      setProducts([]);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    setError("");
    try {
      setProducts(await getWishlist());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t load your favorites.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWishlist();
    return onWishlistChanged(() => void loadWishlist());
  }, [loadWishlist]);

  async function remove(productId: string) {
    setBusyId(productId);
    setNotice("");
    try {
      await removeFromWishlist(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      setNotice("Removed from favorites.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn’t remove this product.");
    } finally {
      setBusyId(null);
    }
  }

  async function addProduct(productId: string) {
    setBusyId(productId);
    setNotice("");
    try {
      await addToCart(productId);
      setNotice("Added to cart.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn’t add this product to your cart.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-[65vh] bg-slate-50 pb-14 text-slate-800">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-5 text-xs text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800">Favorites</span></nav>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">Saved for later</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Favorites</h1><p className="mt-2 text-sm text-slate-500">{products.length} {products.length === 1 ? "product" : "products"} saved</p></div><Link href="/shop" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">Discover products<ArrowRight size={15} /></Link></header>

        {loading ? <div className="grid min-h-64 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">Loading your favorites…</div> : !signedIn ? (
          <section className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><div className="max-w-md"><span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-50 text-rose-500"><Heart size={27} /></span><h2 className="mt-5 text-xl font-bold text-slate-900">Sign in to see your favorites</h2><p className="mt-2 text-sm text-slate-500">Save products to your wishlist and find them here later.</p><Link href="/login" className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Sign in</Link></div></section>
        ) : error && !products.length ? (
          <section className="grid min-h-64 place-items-center rounded-xl border border-slate-200 bg-white p-8 text-center"><div><h2 className="text-lg font-bold text-slate-900">Couldn’t load favorites</h2><p className="mt-2 text-sm text-slate-500">{error}</p><button type="button" onClick={() => void loadWishlist()} className="mt-5 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">Try again</button></div></section>
        ) : products.length === 0 ? (
          <section className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-50 text-rose-500"><Heart size={27} /></span><h2 className="mt-5 text-xl font-bold text-slate-900">No favorites yet</h2><p className="mt-2 text-sm text-slate-500">Tap the heart on a product to save it here.</p><Link href="/shop" className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Browse products</Link></div></section>
        ) : (
          <>
            {(error || notice) && <p className={`mb-4 text-sm ${error ? "text-rose-600" : "text-emerald-700"}`} role="status">{error || notice}</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{products.map((product) => <article key={product._id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative grid h-44 place-items-center bg-slate-50">
                {/* API supplied product imagery. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageCover} alt={product.title} className="size-full object-contain p-4 transition group-hover:scale-105" />
                <button type="button" aria-label={`Remove ${product.title} from favorites`} disabled={busyId === product._id} onClick={() => void remove(product._id)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white text-rose-500 shadow-sm hover:bg-rose-50 disabled:opacity-50"><Trash2 size={15} /></button>
              </div>
              <div className="p-3.5"><p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700">{product.category?.name ?? "FreshCart"}</p><h2 className="mt-1.5 truncate text-sm font-semibold text-slate-900">{product.title}</h2><div className="mt-2 flex items-center justify-between gap-2"><span className="text-sm font-bold text-slate-900">{formatPrice(product.priceAfterDiscount ?? product.price)}</span>{product.priceAfterDiscount && <del className="text-[10px] text-slate-400">{formatPrice(product.price)}</del>}</div><button type="button" disabled={busyId === product._id} onClick={() => void addProduct(product._id)} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"><ShoppingBag size={14} />Add to cart</button></div>
            </article>)}</div>
          </>
        )}
      </div>
    </main>
  );
}
