"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { addToWishlist } from "@/lib/wishlist";

export function ProductActions({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function perform(action: "cart" | "wishlist") {
    setBusy(true);
    setMessage("");
    try {
      if (action === "cart") await addToCart(productId);
      else await addToWishlist(productId);
      setMessage(action === "cart" ? "Added to cart" : "Added to favorites");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update your list.");
    } finally {
      setBusy(false);
    }
  }
  return <div><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => void perform("cart")} className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><ShoppingCart size={17} />Add to cart</button><button disabled={busy} onClick={() => void perform("wishlist")} className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-600 disabled:opacity-60"><Heart size={17} />Save to favorites</button></div>{message && <p className="mt-3 text-sm text-slate-600" role="status">{message}</p>}</div>;
}
