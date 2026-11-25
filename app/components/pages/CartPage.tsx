"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { getCart, onCartChanged, removeCartItem, updateCartQuantity, type CartData, type CartLine } from "@/lib/cart";

const formatPrice = (price: number) => `${Number(price || 0).toLocaleString("en-EG")} EGP`;

export function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyItem, setBusyItem] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    if (!window.localStorage.getItem("freshcart-token")) {
      setCart(null);
      setLoading(false);
      setMessage("Sign in to see the items saved in your cart.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      setCart(await getCart());
    } catch (error) {
      setCart(null);
      setMessage(error instanceof Error ? error.message : "We couldn’t load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCart();
    return onCartChanged(() => void loadCart());
  }, [loadCart]);

  const lines = useMemo(() => cart?.products ?? cart?.cartItems ?? [], [cart]);
  const itemCount = lines.reduce((total, line) => total + line.count, 0);
  const subtotal = cart?.totalCartPrice ?? lines.reduce((total, line) => total + line.price * line.count, 0);

  async function changeQuantity(line: CartLine, count: number) {
    if (count < 1) return;
    setBusyItem(line._id);
    setMessage("");
    try {
      await updateCartQuantity(line.product._id, count);
      await loadCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn’t update this item.");
    } finally {
      setBusyItem(null);
    }
  }

  async function removeItem(line: CartLine) {
    setBusyItem(line._id);
    setMessage("");
    try {
      await removeCartItem(line.product._id);
      await loadCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn’t remove this item.");
    } finally {
      setBusyItem(null);
    }
  }

  return (
    <main className="min-h-[65vh] bg-slate-50 pb-16 text-slate-800">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700">Home</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800">Shopping Cart</span>
        </nav>

        <header className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">FreshCart</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Your Cart</h1><p className="mt-2 text-sm text-slate-500">{loading ? "Loading your items…" : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}</p></div>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"><ArrowLeft size={16} />Continue shopping</Link>
        </header>

        {message && !loading && !lines.length ? (
          <section className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="max-w-md"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShoppingBag size={28} /></span><h2 className="mt-5 text-xl font-bold text-slate-900">{message.includes("Sign in") ? "Your cart is waiting" : "We couldn’t load your cart"}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{message}</p><Link href={message.includes("Sign in") ? "/login" : "/shop"} className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">{message.includes("Sign in") ? "Sign in" : "Browse products"}</Link></div>
          </section>
        ) : loading ? (
          <div className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">Loading your cart…</div>
        ) : lines.length === 0 ? (
          <section className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShoppingBag size={28} /></span><h2 className="mt-5 text-xl font-bold text-slate-900">Your cart is empty</h2><p className="mt-2 text-sm text-slate-500">Find something fresh for your home.</p><Link href="/shop" className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Start shopping</Link></div></section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Cart items">
              <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_40px] gap-5 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:grid"><span>Product</span><span className="text-center">Quantity</span><span className="text-right">Price</span><span /></div>
              {lines.map((line) => <article key={line._id} className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-slate-100 p-4 pr-12 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_110px_110px_40px] sm:items-center sm:gap-5 sm:px-5">
                <div className="col-span-2 flex min-w-0 items-center gap-4 sm:col-span-1">
                  <div className="grid size-[76px] shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50">
                  {/* API supplied product imagery. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={line.product.imageCover} alt={line.product.title} className="size-full object-contain p-2" />
                  </div>
                  <div className="min-w-0 self-center"><p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700">{line.product.category?.name ?? "FreshCart"}</p><h2 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{line.product.title}</h2><p className="mt-1 text-xs text-slate-500">{formatPrice(line.price)} each</p></div>
                </div>
                <div className="flex h-9 w-fit items-center rounded-md border border-slate-200 sm:justify-self-center"><button type="button" aria-label={`Decrease ${line.product.title} quantity`} disabled={busyItem === line._id || line.count <= 1} onClick={() => void changeQuantity(line, line.count - 1)} className="grid size-8 place-items-center text-slate-500 hover:text-emerald-700 disabled:opacity-40"><Minus size={14} /></button><span className="min-w-7 text-center text-xs font-semibold">{line.count}</span><button type="button" aria-label={`Increase ${line.product.title} quantity`} disabled={busyItem === line._id} onClick={() => void changeQuantity(line, line.count + 1)} className="grid size-8 place-items-center text-slate-500 hover:text-emerald-700 disabled:opacity-40"><Plus size={14} /></button></div>
                <p className="text-sm font-bold text-slate-900 sm:text-right">{formatPrice(line.price * line.count)}</p>
                <button type="button" aria-label={`Remove ${line.product.title}`} disabled={busyItem === line._id} onClick={() => void removeItem(line)} className="absolute right-4 top-4 text-slate-400 hover:text-rose-600 disabled:opacity-40 sm:static sm:justify-self-end"><Trash2 size={17} /></button>
              </article>)}
              {message && <p className="px-5 pb-4 text-sm text-rose-600" role="alert">{message}</p>}
            </section>

            <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
              <div className="mt-5 flex justify-between border-b border-slate-100 pb-4 text-sm"><span className="text-slate-500">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span><span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-4 text-sm"><span className="text-slate-500">Delivery</span><span className="text-slate-500">Calculated at checkout</span></div>
              <div className="flex justify-between pt-4"><span className="font-bold text-slate-900">Total</span><span className="text-lg font-bold text-emerald-700">{formatPrice(subtotal)}</span></div>
              <p className="mt-2 text-[11px] text-slate-500">Delivery and any discounts are applied at checkout.</p>
              <Link href="/checkout" className="mt-5 block w-full rounded-md bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700">Proceed to checkout</Link>
              <Link href="/shop" className="mt-3 block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
