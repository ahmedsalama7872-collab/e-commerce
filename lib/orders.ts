import { apiRequest } from "./api";
import { withQuery } from "./api";

export type ShippingAddress = {
  details: string;
  phone: string;
  city: string;
  postalCode: string;
};

export function createCashOrder(cartId: string, shippingAddress: ShippingAddress) {
  return apiRequest<{ _id?: string; id?: string }>(`/v2/orders/${encodeURIComponent(cartId)}`, {
    method: "POST",
    body: JSON.stringify({ shippingAddress }),
  });
}

export function createCheckoutSession(cartId: string, siteUrl: string) {
  return apiRequest<{ session?: { url?: string }; url?: string }>(`/orders/checkout-session/${encodeURIComponent(cartId)}${withQuery({ url: siteUrl })}`, { method: "POST" });
}

export type UserOrder = { _id: string; totalOrderPrice: number; createdAt: string; isPaid?: boolean; isDelivered?: boolean; cartItems?: Array<{ _id?: string; count: number; price: number; product: { _id: string; title: string; imageCover: string } }>; user?: string };

export function getUserOrders(userId: string) {
  return apiRequest<UserOrder[] | { data: UserOrder[] }>(`/orders/user/${encodeURIComponent(userId)}`).then((result) => Array.isArray(result) ? result : result.data);
}
