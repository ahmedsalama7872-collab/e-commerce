import { apiRequest, withQuery } from "./api";

export type ApiProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage?: number;
  category?: { _id: string; name: string; image?: string };
  brand?: { _id: string; name: string; image?: string };
  quantity?: number;
};

export type ProductQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function getProducts(query: ProductQuery = {}) {
  const params: Record<string, string | number | undefined> = {
    page: query.page,
    limit: query.limit,
    sort: query.sort,
    keyword: query.keyword,
    brand: query.brand,
    "price[gte]": query.minPrice,
    "price[lte]": query.maxPrice,
  };
  if (query.category) params["category[in]"] = query.category;
  const result = await apiRequest<ApiProduct[] | { data: ApiProduct[] }>(`/products${withQuery(params)}`);
  return Array.isArray(result) ? result : result.data;
}

export async function getProduct(id: string) {
  return apiRequest<ApiProduct>(`/products/${encodeURIComponent(id)}`);
}
