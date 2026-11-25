import { apiRequest, apiRequestWithMeta, withQuery } from "./api";

export type ApiProduct = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  ratingsQuantity?: number;
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
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export type ProductPage = {
  products: ApiProduct[];
  results: number;
  currentPage: number;
  numberOfPages?: number;
};

export async function getProductsPage(query: ProductQuery = {}): Promise<ProductPage> {
  const params: Record<string, string | number | undefined> = {
    page: query.page,
    limit: query.limit,
    sort: query.sort,
    keyword: query.keyword,
    brand: query.brand,
    "price[gte]": query.minPrice,
    "price[lte]": query.maxPrice,
    "ratingsAverage[gte]": query.minRating,
  };
  if (query.category) params["category[in]"] = query.category;
  if (query.subcategory) params["subcategory[in]"] = query.subcategory;
  const result = await apiRequestWithMeta<ApiProduct[]>(`/products${withQuery(params)}`);
  if (Array.isArray(result)) return { products: result, results: result.length, currentPage: query.page ?? 1 };
  const envelope = result as { data?: ApiProduct[]; results?: number; metadata?: { currentPage?: number; numberOfPages?: number } };
  return {
    products: envelope.data ?? [],
    results: envelope.results ?? envelope.data?.length ?? 0,
    currentPage: envelope.metadata?.currentPage ?? query.page ?? 1,
    numberOfPages: envelope.metadata?.numberOfPages,
  };
}

export async function getProducts(query: ProductQuery = {}) {
  return (await getProductsPage(query)).products;
}

export async function getProduct(id: string) {
  return apiRequest<ApiProduct>(`/products/${encodeURIComponent(id)}`);
}

export async function getProductsByCategory(categoryId: string, limit = 8) {
  return getProducts({ category: categoryId, limit });
}
