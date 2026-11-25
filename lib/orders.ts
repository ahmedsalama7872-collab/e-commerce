import { apiRequest } from "./api";

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
