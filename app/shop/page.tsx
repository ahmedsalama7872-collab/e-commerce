import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid2X2,
  List,
  Search,
  Star,
} from "lucide-react";
import { ProductCard } from "../_components/ProductCard";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { toProduct } from "@/lib/product-view";
import { getProductsPage, type ProductQuery } from "@/lib/products";

export const instant = false;

type SearchParams = {
  category?: string | string[];
  subcategory?: string;
  brand?: string;
  keyword?: string;
  minPrice?: string;
  maxPrice?: string;
  priceRange?: string;
  rating?: string;
  sort?: string;
  page?: string;
  view?: string;
};

function entries(query: SearchParams) {
  return Object.entries(query).flatMap(([key, value]) =>
    value === undefined ? [] : (Array.isArray(value) ? value : [value]).map((item) => [key, item] as const),
  );
}

function queryString(query: SearchParams, overrides: Partial<SearchParams> = {}) {
  const params = new URLSearchParams();
  const replaced = new Set(Object.keys(overrides));
  for (const [key, value] of entries(query)) if (!replaced.has(key)) params.append(key, value);
  for (const [key, value] of entries(overrides as SearchParams)) params.append(key, value);
  return params.toString();
}

function HiddenQuery({ query, exclude = [] }: { query: SearchParams; exclude?: string[] }) {
  return <>{entries(query).filter(([key]) => !exclude.includes(key)).map(([key, value], index) => <input key={`${key}-${value}-${index}`} type="hidden" name={key} value={value} />)}</>;
}

function FilterControls({ query, categories, brands }: {
  query: SearchParams;
  categories: Awaited<ReturnType<typeof getCategories>>;
  brands: Awaited<ReturnType<typeof getBrands>>;
}) {
  const selectedCategories = Array.isArray(query.category) ? query.category : query.category ? query.category.split(",") : [];
  const currentRange = query.priceRange ?? "";
  const customPriceSelected = currentRange === "custom";
  const priceRanges = [
    { value: "0:250", label: "Under 250 EGP" },
    { value: "250:500", label: "250 – 500 EGP" },
    { value: "500:1000", label: "500 – 1,000 EGP" },
    { value: "1000:", label: "Over 1,000 EGP" },
  ];

  return (
    <form action="/shop" className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-4">
      <HiddenQuery query={query} exclude={["category", "brand", "priceRange", "minPrice", "maxPrice", "rating", "page"]} />
      <section className="py-4"><h2 className="mb-3 text-sm font-bold">Categories</h2><div className="max-h-64 space-y-2.5 overflow-auto">{categories.map((category) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={category._id}><input type="checkbox" name="category" value={category._id} defaultChecked={selectedCategories.includes(category._id)} className="size-3.5 accent-emerald-600" />{category.name}</label>)}</div>{categories.length === 0 && <p className="text-xs text-slate-400">Categories are unavailable.</p>}</section>
      <section className="py-4"><h2 className="mb-3 text-sm font-bold">Price</h2><div className="space-y-2.5">{priceRanges.map((range) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={range.value}><input type="radio" name="priceRange" value={range.value} defaultChecked={currentRange === range.value} className="size-3.5 accent-emerald-600" />{range.label}</label>)}<label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="radio" name="priceRange" value="" defaultChecked={!currentRange} className="size-3.5 accent-emerald-600" />Any price</label><label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="radio" name="priceRange" value="custom" defaultChecked={customPriceSelected} className="size-3.5 accent-emerald-600" />Custom range</label></div><p className="mb-2 mt-4 text-[11px] text-slate-500">Custom range (EGP)</p><div className="flex items-center gap-2"><input name="minPrice" type="number" min="0" defaultValue={customPriceSelected ? query.minPrice : undefined} aria-label="Minimum price" placeholder="Min" className="w-1/2 rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-500" /><input name="maxPrice" type="number" min="0" defaultValue={customPriceSelected ? query.maxPrice : undefined} aria-label="Maximum price" placeholder="Max" className="w-1/2 rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-500" /></div></section>
      <section className="py-4"><h2 className="mb-3 text-sm font-bold">Brands</h2><select name="brand" defaultValue={query.brand ?? ""} className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-emerald-500"><option value="">All brands</option>{brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}</select>{brands.length === 0 && <p className="mt-2 text-xs text-slate-400">Brands are unavailable.</p>}</section>
      <section className="py-4"><h2 className="mb-3 text-sm font-bold">Rating</h2><div className="space-y-2.5">{[4, 3, 2].map((rating) => <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600" key={rating}><input type="radio" name="rating" value={rating} defaultChecked={query.rating === String(rating)} className="size-3.5 accent-emerald-600" /><span className="flex text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill={index < rating ? "currentColor" : "none"} />)}</span><span className="text-slate-400">& up</span></label>)}<label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input type="radio" name="rating" value="" defaultChecked={!query.rating} className="size-3.5 accent-emerald-600" />Any rating</label></div></section>
      <div className="flex gap-2 py-4"><button type="submit" className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Apply filters</button><Link href={`/shop${query.keyword ? `?keyword=${encodeURIComponent(query.keyword)}` : ""}`} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-300">Clear</Link></div>
    </form>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const selectedCategory = Array.isArray(params.category) ? params.category.join(",") : params.category;
  let minPrice = params.priceRange === "custom" && params.minPrice ? Number(params.minPrice) : undefined;
  let maxPrice = params.priceRange === "custom" && params.maxPrice ? Number(params.maxPrice) : undefined;
  if (params.priceRange && params.priceRange !== "custom") {
    const [minimum, maximum] = params.priceRange.split(":");
    minPrice = minimum ? Number(minimum) : undefined;
    maxPrice = maximum ? Number(maximum) : undefined;
  }
  const page = Math.max(1, Number(params.page) || 1);
  const query: ProductQuery = {
    page,
    limit: 20,
    category: selectedCategory,
    subcategory: params.subcategory,
    brand: params.brand,
    keyword: params.keyword,
    minPrice,
    maxPrice,
    minRating: params.rating ? Number(params.rating) : undefined,
    sort: params.sort && params.sort !== "featured" ? params.sort : undefined,
  };

  const [categories, brands, productPage] = await Promise.all([
    getCategories(100).catch(() => []),
    getBrands(100).catch(() => []),
    getProductsPage(query).catch(() => null),
  ]);
  const shownProducts = productPage?.products.map(toProduct) ?? [];
  const totalPages = productPage?.numberOfPages;
  const hasPrevious = page > 1;
  const hasNext = totalPages ? page < totalPages : shownProducts.length === 20;
  const view = params.view === "list" ? "list" : "grid";

  return (
    <main className="min-h-[65vh] bg-white pb-14 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-4 text-[11px] text-slate-500"><Link href="/" className="hover:text-emerald-700">Home</Link><ChevronRight size={13} /><span className="font-medium text-slate-800">Shop</span></nav>
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-700">Browse the collection</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Shop All Products</h1><p className="mt-1 text-xs text-slate-500">Find something good for every day.</p></div>
          <form action="/shop" className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs text-slate-400">
            <HiddenQuery query={params} exclude={["keyword", "page"]} />
            <label className="sr-only" htmlFor="shop-search">Search products</label><Search size={14} /><input id="shop-search" name="keyword" defaultValue={params.keyword} className="w-36 bg-transparent text-slate-700 outline-none placeholder:text-slate-400 sm:w-52" placeholder="Search products" /><button type="submit" aria-label="Search products" className="text-emerald-700"><ChevronRight size={15} /></button>
          </form>
        </header>

        <div className="mb-5 lg:hidden"><details className="group"><summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><Filter size={14} /> Filters</summary><div className="mt-3"><FilterControls query={params} categories={categories} brands={brands} /></div></details></div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[245px_minmax(0,1fr)]">
          <aside className="hidden lg:block"><FilterControls query={params} categories={categories} brands={brands} /></aside>

          <section aria-label="Product results">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2.5 sm:px-4">
              <p className="text-xs text-slate-600">{productPage ? `Page ${page}${totalPages ? ` of ${totalPages}` : ""} · ${productPage.results} results` : "Products are temporarily unavailable"}</p>
              <div className="flex items-center gap-2">
                <form action="/shop" className="flex h-8 items-center gap-2 rounded border border-slate-200 bg-white px-2 text-[10px] text-slate-600"><HiddenQuery query={params} exclude={["sort", "page"]} /><ArrowDownWideNarrow size={13} /><label htmlFor="shop-sort" className="hidden sm:inline">Sort by:</label><select id="shop-sort" name="sort" defaultValue={params.sort ?? "featured"} className="bg-transparent outline-none"><option value="featured">Featured</option><option value="price">Price: Low to High</option><option value="-price">Price: High to Low</option><option value="ratingsAverage">Top rated</option></select><button type="submit" className="font-semibold text-emerald-700">Apply</button></form>
                <Link href={`/shop?${queryString(params, { view: "grid" })}`} aria-label="Grid view" aria-pressed={view === "grid"} className={`grid size-8 place-items-center rounded border ${view === "grid" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}><Grid2X2 size={14} /></Link>
                <Link href={`/shop?${queryString(params, { view: "list" })}`} aria-label="List view" aria-pressed={view === "list"} className={`grid size-8 place-items-center rounded border ${view === "list" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}><List size={15} /></Link>
              </div>
            </div>
            {shownProducts.length ? <div className={view === "list" ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"}>{shownProducts.map((product) => <ProductCard product={product} layout={view} key={product.id} />)}</div> : <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-14 text-center"><h2 className="text-base font-semibold text-slate-800">No products found</h2><p className="mt-1 text-xs text-slate-500">Try changing or clearing your filters.</p><Link href="/shop" className="mt-4 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Clear filters</Link></div>}
            <nav aria-label="Product pages" className="mt-7 flex items-center justify-center gap-1">
              {hasPrevious && <Link href={`/shop?${queryString(params, { page: String(page - 1) })}`} aria-label="Previous page" className="grid size-8 place-items-center rounded border border-slate-200 text-slate-500"><ChevronLeft size={14} /></Link>}
              <span aria-current="page" className="grid size-8 place-items-center rounded bg-emerald-600 text-xs font-semibold text-white">{page}</span>
              {hasNext && <Link href={`/shop?${queryString(params, { page: String(page + 1) })}`} aria-label="Next page" className="grid size-8 place-items-center rounded border border-slate-200 text-slate-500"><ChevronRight size={14} /></Link>}
            </nav>
          </section>
        </div>
      </div>
    </main>
  );
}
