"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, MapPin, ShoppingBag } from "lucide-react";
import { getCart, notifyCartChanged, type CartData } from "@/lib/cart";
import { createCashOrder, type ShippingAddress } from "@/lib/orders";

const formatPrice = (price: number) => `${Number(price || 0).toLocaleString("en-EG")} EGP`;

export function CheckoutPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const loadCart = useCallback(async () => {
    if (!window.localStorage.getItem("freshcart-token")) {
      setError("Sign in to continue to checkout.");
      setLoading(false);
      return;
    }
    try {
      setCart(await getCart());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t load your cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCart(); }, [loadCart]);

  const lines = cart?.products ?? cart?.cartItems ?? [];
  const subtotal = cart?.totalCartPrice ?? lines.reduce((sum, line) => sum + line.price * line.count, 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart || !lines.length) return;
    const formData = new FormData(event.currentTarget);
    const shippingAddress: ShippingAddress = {
      details: String(formData.get("details") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
    };
    setSubmitting(true);
    setError("");
    try {
      const cartId = cart._id ?? cart.cartId;
      if (!cartId) throw new Error("We couldn’t find your cart ID. Reload the cart and try again.");
      const order = await createCashOrder(cartId, shippingAddress);
      setPlacedOrderId(order._id ?? order.id ?? "");
      setOrderPlaced(true);
      setCart(null);
      notifyCartChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[65vh] bg-slate-50 pb-16 text-slate-800">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-5 text-xs text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><span aria-hidden="true">/</span><Link href="/cart" className="hover:text-emerald-700">Cart</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800">Checkout</span></nav>

        {orderPlaced ? (
          <section className="grid min-h-80 place-items-center rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
            <div className="max-w-lg"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={32} /></span><h1 className="mt-5 text-2xl font-bold text-slate-900">Order placed successfully</h1><p className="mt-2 text-sm text-slate-500">Your cash on delivery order has been received{placedOrderId ? ` (order ${placedOrderId})` : ""}.</p><Link href="/shop" className="mt-6 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Continue shopping</Link></div>
          </section>
        ) : (
          <>
            <header className="mb-7 border-b border-slate-200 pb-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">Almost there</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Checkout</h1><p className="mt-2 text-sm text-slate-500">Confirm your delivery details to place your order.</p></header>
            {loading ? <div className="grid min-h-64 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">Loading checkout…</div> : error && !cart ? (
              <section className="grid min-h-64 place-items-center rounded-xl border border-slate-200 bg-white p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShoppingBag size={24} /></span><h2 className="mt-4 text-lg font-bold text-slate-900">Checkout isn’t ready</h2><p className="mt-2 text-sm text-slate-500">{error}</p><Link href={error.includes("Sign in") ? "/login" : "/cart"} className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">{error.includes("Sign in") ? "Sign in" : "Return to cart"}</Link></div></section>
            ) : !lines.length ? (
              <section className="grid min-h-64 place-items-center rounded-xl border border-slate-200 bg-white p-8 text-center"><div><h2 className="text-lg font-bold text-slate-900">Your cart is empty</h2><p className="mt-2 text-sm text-slate-500">Add products before checking out.</p><Link href="/shop" className="mt-5 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">Browse products</Link></div></section>
            ) : (
              <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><MapPin size={19} className="text-emerald-600" />Delivery address</h2>
                  <p className="mt-1 text-sm text-slate-500">Where should we deliver your order?</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Address details<input name="details" required autoComplete="street-address" placeholder="Building, street, apartment" className="mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
                    <label className="text-xs font-semibold text-slate-700">City<input name="city" required autoComplete="address-level2" placeholder="Cairo" className="mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
                    <label className="text-xs font-semibold text-slate-700">Postal code<input name="postalCode" required autoComplete="postal-code" placeholder="11511" className="mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
                    <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Phone number<input name="phone" required type="tel" autoComplete="tel" placeholder="01X XXX XXXX" className="mt-1.5 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
                  </div>
                  <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-sm font-semibold text-slate-800">Payment method</p><p className="mt-1 text-xs text-slate-600">Cash on delivery</p></div>
                  {error && <p className="mt-4 text-sm text-rose-600" role="alert">{error}</p>}
                </section>

                <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                  <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
                  <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto border-b border-slate-100 pb-4">{lines.map((line) => <li key={line._id} className="flex items-start justify-between gap-3 text-xs"><span className="min-w-0 text-slate-600"><b className="mr-1 text-slate-800">{line.count}×</b>{line.product.title}</span><span className="shrink-0 font-semibold text-slate-800">{formatPrice(line.price * line.count)}</span></li>)}</ul>
                  <div className="flex justify-between py-4 text-sm"><span className="text-slate-500">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-4"><span className="font-bold text-slate-900">Total</span><span className="text-lg font-bold text-emerald-700">{formatPrice(subtotal)}</span></div>
                  <p className="mt-2 text-[11px] text-slate-500">Delivery fee is confirmed by the store during fulfillment.</p>
                  <button type="submit" disabled={submitting} className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{submitting ? "Placing order…" : "Place cash on delivery order"}</button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400"><LockKeyhole size={12} />Your information is sent securely.</p>
                  <Link href="/cart" className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"><ArrowLeft size={13} />Back to cart</Link>
                </aside>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
