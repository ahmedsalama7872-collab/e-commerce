import { apiRequest, withQuery } from "./api";

export type ApiCategory = { _id: string; name: string; image: string; slug?: string };

export async function getCategories(limit = 20) {
  const result = await apiRequest<ApiCategory[] | { data: ApiCategory[] }>(`/categories${withQuery({ limit })}`);
  return Array.isArray(result) ? result : result.data;
}
