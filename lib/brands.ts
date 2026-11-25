import { apiRequest, withQuery } from "./api";

export type ApiBrand = { _id: string; name: string; image: string; slug?: string };

export async function getBrands(limit = 50) {
  const result = await apiRequest<ApiBrand[] | { data: ApiBrand[] }>(`/brands${withQuery({ limit })}`);
  return Array.isArray(result) ? result : result.data;
}
