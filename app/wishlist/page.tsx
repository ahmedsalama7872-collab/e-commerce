import type { Metadata } from "next";
import { WishlistPage } from "@/app/components/WishlistPage";

export const metadata: Metadata = {
  title: "Favorites | FreshCart",
  description: "Your saved FreshCart products.",
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
