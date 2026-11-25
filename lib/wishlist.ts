import { apiRequest } from "./api";
import type { ApiProduct } from "./products";

const WISHLIST_CHANGED_EVENT = "freshcart:wishlist-changed";

function notifyWishlistChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT));
}

export function onWishlistChanged(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(WISHLIST_CHANGED_EVENT, listener);
  return () => window.removeEventListener(WISHLIST_CHANGED_EVENT, listener);
}

export function getWishlist() {
  return apiRequest<ApiProduct[] | { data: ApiProduct[] }>("/wishlist").then((result) =>
    Array.isArray(result) ? result : result.data,
  );
}

export async function addToWishlist(productId: string) {
  const result = await apiRequest<unknown>("/wishlist", { method: "POST", body: JSON.stringify({ productId }) });
  notifyWishlistChanged();
  return result;
}

export async function removeFromWishlist(productId: string) {
  const result = await apiRequest<unknown>(`/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
  notifyWishlistChanged();
  return result;
}
