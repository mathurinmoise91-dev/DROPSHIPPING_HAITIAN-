/**
 * The single place the storefront reads catalogue data from.
 *
 * No database is connected yet, so every function returns a genuinely empty
 * result. That is deliberate: the pages render real zeroes and real empty
 * states rather than sample content, and swapping these bodies for Prisma
 * queries later changes nothing above this layer.
 */

export type CategorySummary = {
  /** Message key under the `categories` namespace. */
  key: "electronics" | "household" | "beauty" | "fashion";
  slug: string;
  productCount: number;
};

export type ShopSummary = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  /** Stored in centimes so no rounding happens client-side. */
  priceCentimes: number;
  compareAtCentimes: number | null;
  inStock: boolean;
};

export async function getCategories(): Promise<CategorySummary[]> {
  return [
    { key: "electronics", slug: "electronique", productCount: 0 },
    { key: "household", slug: "maison", productCount: 0 },
    { key: "beauty", slug: "beaute", productCount: 0 },
    { key: "fashion", slug: "mode", productCount: 0 },
  ];
}

export async function getFeaturedShops(): Promise<ShopSummary[]> {
  return [];
}

export async function getPopularProducts(): Promise<ProductSummary[]> {
  return [];
}

export async function getMarketplaceStats(): Promise<{
  shops: number;
  products: number;
}> {
  return { shops: 0, products: 0 };
}
