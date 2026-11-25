import type { ApiProduct } from "./products";
import type { Product } from "@/app/_components/store-data";

const colors = [
  "from-emerald-100 to-lime-50", "from-rose-100 to-orange-50", "from-violet-100 to-fuchsia-50",
  "from-sky-100 to-blue-50", "from-amber-100 to-yellow-50", "from-pink-100 to-rose-50",
  "from-slate-200 to-slate-50", "from-cyan-100 to-sky-50",
];

export function toProduct(product: ApiProduct, index = 0): Product {
  return {
    id: product._id,
    name: product.title,
    category: product.category?.name ?? "General",
    price: product.priceAfterDiscount ?? product.price,
    previousPrice: product.priceAfterDiscount ? product.price : undefined,
    rating: product.ratingsAverage ?? 0,
    image: product.imageCover,
    color: colors[index % colors.length],
  };
}
