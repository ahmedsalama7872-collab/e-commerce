import type { Metadata } from "next";
import { CartPage } from "@/app/_components/CartPage";

export const metadata: Metadata = {
  title: "Your Cart | FreshCart",
  description: "Review and update the items in your FreshCart cart.",
};

export default function CartRoute() {
  return <CartPage />;
}
