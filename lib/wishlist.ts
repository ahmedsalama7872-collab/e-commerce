import { apiRequest } from "./api";

export function getWishlist() {
  return apiRequest<unknown>("/wishlist");
}

export function addToWishlist(productId: string) {
  return apiRequest<unknown>("/wishlist", { method: "POST", body: JSON.stringify({ productId }) });
}

export function removeFromWishlist(productId: string) {
  return apiRequest<unknown>(`/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
}
