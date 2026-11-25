import { apiRequest, withQuery } from "./api";

export type ApiCategory = { _id: string; name: string; image: string; slug?: string };
export type ApiSubcategory = { _id: string; name: string; slug?: string; category?: string };

export async function getCategories(limit = 20) {
  const result = await apiRequest<ApiCategory[] | { data: ApiCategory[] }>(`/categories${withQuery({ limit })}`);
  return Array.isArray(result) ? result : result.data;
}

export function getCategory(id: string) {
  return apiRequest<ApiCategory>(`/categories/${encodeURIComponent(id)}`);
}

export async function getSubcategoriesByCategory(id: string) {
  const result = await apiRequest<ApiSubcategory[] | { data: ApiSubcategory[] }>(`/categories/${encodeURIComponent(id)}/subcategories`);
  return Array.isArray(result) ? result : result.data;
}
