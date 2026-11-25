import type { LucideIcon } from "lucide-react";
import {
  Baby,
  HeartPulse,
  House,
  Milk,
  Shirt,
  ShoppingBasket,
  Smartphone,
} from "lucide-react";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  rating: number;
  image?: string;
  color: string;
};

export const categories: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "Milk & Dairy", icon: Milk, color: "bg-[#e9f5fc] text-[#4197bd]" },
  { name: "Men Fashion", icon: Shirt, color: "bg-[#f3effa] text-[#8667a9]" },
  { name: "Women Fashion", icon: Shirt, color: "bg-[#fff0f1] text-[#df7a88]" },
  { name: "Supermarket", icon: ShoppingBasket, color: "bg-[#edf6e7] text-[#69a348]" },
  { name: "Baby & Toys", icon: Baby, color: "bg-[#fff5df] text-[#d59b35]" },
  { name: "Home & Kitchen", icon: House, color: "bg-[#f9eee5] text-[#c98856]" },
  { name: "Beauty & Health", icon: HeartPulse, color: "bg-[#fff0f2] text-[#d8758c]" },
  { name: "Electronics", icon: Smartphone, color: "bg-[#edf2fa] text-[#6484b7]" },
];

// Replace these sample rows with your catalog. Home and shop both map this array.
export const products: Product[] = [
  { id: "item-01", name: "Product name goes here", category: "Fresh Market", price: 499, previousPrice: 699, rating: 4.8, color: "from-emerald-100 to-lime-50" },
  { id: "item-02", name: "Product name goes here", category: "Home & Kitchen", price: 349, rating: 4.6, color: "from-rose-100 to-orange-50" },
  { id: "item-03", name: "Product name goes here", category: "Women Fashion", price: 899, previousPrice: 1199, rating: 4.9, color: "from-violet-100 to-fuchsia-50" },
  { id: "item-04", name: "Product name goes here", category: "Men Fashion", price: 649, rating: 4.7, color: "from-sky-100 to-blue-50" },
  { id: "item-05", name: "Product name goes here", category: "Fresh Market", price: 219, rating: 4.5, color: "from-amber-100 to-yellow-50" },
  { id: "item-06", name: "Product name goes here", category: "Beauty & Health", price: 389, previousPrice: 499, rating: 4.8, color: "from-pink-100 to-rose-50" },
  { id: "item-07", name: "Product name goes here", category: "Electronics", price: 1299, rating: 4.6, color: "from-slate-200 to-slate-50" },
  { id: "item-08", name: "Product name goes here", category: "Baby & Toys", price: 575, rating: 4.9, color: "from-cyan-100 to-sky-50" },
];

export const formatPrice = (price: number) => `${price.toLocaleString("en-EG")} EGP`;
