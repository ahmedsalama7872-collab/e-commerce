import Image from "next/image";
import Link from "next/link";
import { Headset, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Free Shipping", detail: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", detail: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", detail: "100% secure checkout" },
  { icon: Headset, title: "24/7 Support", detail: "Contact us anytime" },
];

const footerGroups = [
  { title: "Shop", links: ["All Products", "Categories", "Brands", "Electronics", "Men's Fashion", "Women's Fashion"] },
  { title: "Account", links: ["My Account", "Order History", "Wishlist", "Shopping Cart", "Sign In", "Create Account"] },
  { title: "Support", links: ["Contact Us", "Help Center", "Shipping Info", "Returns & Refunds", "Track Order"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="bg-emerald-50/80">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4 lg:gap-8 lg:py-5">
          {benefits.map(({ icon: Icon, title, detail }) => (
            <div className="flex items-center gap-3" key={title}>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><Icon size={17} /></span>
              <span><span className="block text-xs font-semibold text-slate-800">{title}</span><span className="mt-0.5 block text-[10px] text-slate-500">{detail}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-8 gap-y-8 px-5 py-9 md:grid-cols-[1.7fr_repeat(4,1fr)] lg:py-11">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="FreshCart home" className="inline-flex rounded bg-white px-2 py-1">
              <Image src="/freshcart-logo.49f1b44d.svg" width={132} height={26} alt="FreshCart" />
            </Link>
            <p className="mt-4 max-w-xs text-[11px] leading-5 text-slate-400">FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p>
            <div className="mt-4 space-y-2 text-[11px] text-slate-400">
              <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-white"><Phone size={12} className="text-emerald-400" />+1 (800) 123-4567</a>
              <a href="mailto:support@freshcart.com" className="flex items-center gap-2 hover:text-white"><span className="text-emerald-400">✉</span>support@freshcart.com</a>
              <span className="flex items-center gap-2"><MapPin size={12} className="text-emerald-400" />123 Commerce Street, New York, NY 10001</span>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-xs font-semibold text-white">{group.title}</h2>
              <ul className="space-y-2.5 text-[10px] text-slate-400">
                {group.links.map((label) => (
                  <li key={label}><Link href={label === "Sign In" ? "/login" : label === "Create Account" ? "/signup" : label === "Brands" ? "/brands" : "/"} className="hover:text-emerald-300">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-3 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 FreshCart. All rights reserved.</span>
            <span>▰ Visa　▰ Mastercard　▰ PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
