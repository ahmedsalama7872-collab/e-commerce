import { apiRequest, withQuery } from "./api";

export type ApiBrand = { _id: string; name: string; image: string; slug?: string };

export async function getBrands(limit = 50, keyword?: string) {
  const result = await apiRequest<ApiBrand[] | { data: ApiBrand[] }>(`/brands${withQuery({ limit, keyword })}`);
  return Array.isArray(result) ? result : result.data;
}

export function getBrand(id: string) {
  return apiRequest<ApiBrand>(`/brands/${encodeURIComponent(id)}`);
}
