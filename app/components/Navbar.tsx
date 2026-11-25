"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  Gift,
  Heart,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import { getCart, onCartChanged } from "@/lib/cart";

const logo = "/freshcart-logo.49f1b44d.svg";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    if (!window.localStorage.getItem("freshcart-token")) {
      setCartCount(0);
      return;
    }
    try {
      const response = await getCart();
      const lines = response.products ?? response.cartItems ?? [];
      setCartCount(lines.reduce((total, line) => total + line.count, 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    void refreshCartCount();
    return onCartChanged(() => void refreshCartCount());
  }, [refreshCartCount]);

  return (
    <header className="w-full border-b border-slate-100 bg-white">
      <div className="hidden border-b border-slate-100 text-sm text-slate-500 md:block">
        <div className="mx-auto flex max-w-[2300px] items-center justify-between px-[clamp(20px,3vw,56px)] py-3">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Truck size={15} className="text-emerald-600" />Free Shipping on Orders 500 EGP</span>
            <span className="flex items-center gap-1.5"><Gift size={15} className="text-emerald-600" />New Arrivals Daily</span>
          </div>
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-1.5" href="tel:+18001234567"><Phone size={14} />+1 (800) 123-4567</a>
            <a className="flex items-center gap-1.5" href="mailto:support@freshcart.com"><Mail size={14} />support@freshcart.com</a>
            <span className="h-4 w-px bg-slate-200" />
            <Link className="flex items-center gap-1.5 hover:text-emerald-700" href="/login"><UserRound size={14} />Sign In</Link>
            <Link className="flex items-center gap-1.5 hover:text-emerald-700" href="/signup"><UserRoundPlus size={14} />Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[2300px] items-center gap-[clamp(16px,1.6vw,32px)] px-[clamp(20px,3vw,56px)] py-5">
        <Link href="/" aria-label="FreshCart home" className="shrink-0">
          <Image src={logo} width={235} height={46} className="h-auto w-[clamp(150px,8.5vw,210px)]" alt="FreshCart" priority />
        </Link>

        <form action="/shop" className="hidden h-14 min-w-32 flex-1 items-center rounded-full border border-slate-200 bg-slate-50/70 px-4 text-slate-400 md:flex">
          <label className="sr-only" htmlFor="site-search">Search products</label>
          <input id="site-search" name="keyword" className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search for products, brands and more..." />
          <button aria-label="Search" className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700" type="submit"><Search size={18} /></button>
        </form>

        <nav aria-label="Main navigation" className="hidden items-center gap-[clamp(12px,1vw,20px)] whitespace-nowrap text-[18px] text-slate-700 xl:flex">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <Link href="/shop" className="hover:text-emerald-700">Shop</Link>
          <Link href="/categories" className="flex items-center gap-1 hover:text-emerald-700">Categories <ChevronDown size={13} /></Link>
          <Link href="/brands" className="hover:text-emerald-700">Brands</Link>
          <Link href="/orders" className="hover:text-emerald-700">Orders</Link>
          <Link href="/profile" className="hover:text-emerald-700">Profile</Link>
          <span className="flex items-center gap-2 text-xs text-slate-500"><span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Phone size={16} /></span><span>Support<br />24/7 Help</span></span>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-[clamp(12px,1.1vw,20px)] text-slate-600">
          <Link href="/wishlist" aria-label="Open favorites" className="block hover:text-rose-600"><Heart size={24} strokeWidth={1.7} /></Link>
          <Link href="/cart" aria-label={`Shopping cart, ${cartCount} items`} className="relative block hover:text-emerald-700"><ShoppingCart size={24} strokeWidth={1.7} />{cartCount > 0 && <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold leading-none text-white">{cartCount > 99 ? "99+" : cartCount}</span>}</Link>
          <Link href="/login" className="hidden items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 xl:flex"><UserRound size={18} />Sign In</Link>
          <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="grid size-9 place-items-center rounded-full bg-emerald-600 text-white xl:hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-slate-100 px-5 py-3 text-sm xl:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link href="/brands" onClick={() => setMenuOpen(false)}>Brands</Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <Link href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>Create an Account</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
