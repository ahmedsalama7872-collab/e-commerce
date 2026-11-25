import type { Metadata } from "next";
import { CheckoutPage } from "@/app/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | FreshCart",
  description: "Enter your delivery details and place your FreshCart order.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
