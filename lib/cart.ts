import { apiRequest } from "./api";
import type { ApiProduct } from "./products";

export type CartLine = {
  _id: string;
  count: number;
  price: number;
  product: ApiProduct;
};

export type CartData = {
  _id: string;
  products?: CartLine[];
  cartItems?: CartLine[];
  totalCartPrice: number;
  numOfCartItems?: number;
  cartId?: string;
};

const CART_CHANGED_EVENT = "freshcart:cart-changed";

export function notifyCartChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

export function onCartChanged(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(CART_CHANGED_EVENT, listener);
  return () => window.removeEventListener(CART_CHANGED_EVENT, listener);
}

export async function addToCart(productId: string) {
  const result = await apiRequest<unknown>("/v2/cart", { method: "POST", body: JSON.stringify({ productId }) });
  notifyCartChanged();
  return result;
}

export function getCart() {
  return apiRequest<CartData>("/cart");
}

export async function updateCartQuantity(productId: string, count: number) {
  const result = await apiRequest<unknown>(`/cart/${encodeURIComponent(productId)}`, {
    method: "PUT",
    body: JSON.stringify({ count: String(count) }),
  });
  notifyCartChanged();
  return result;
}

export async function removeCartItem(productId: string) {
  const result = await apiRequest<unknown>(`/cart/${encodeURIComponent(productId)}`, { method: "DELETE" });
  notifyCartChanged();
  return result;
}
