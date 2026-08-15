export type Product = {
  id: string;
  name: string;
  category: string;
  /** Price in gourdes (HTG), the currency shoppers see at checkout. */
  price: number;
  /** Crossed-out reference price, when the item is discounted. */
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: "nouveau" | "promo" | "rupture";
  inStock: boolean;
};

/**
 * Placeholder catalogue so the storefront renders before a real supplier feed
 * is wired in. Replace with the dropshipping provider's API.
 */
export const products: Product[] = [
  {
    id: "casque-bluetooth-pro",
    name: "Casque Bluetooth Pro",
    category: "Électronique",
    price: 4500,
    compareAt: 6200,
    rating: 4.6,
    reviews: 128,
    badge: "promo",
    inStock: true,
  },
  {
    id: "montre-connectee-active",
    name: "Montre connectée Active",
    category: "Électronique",
    price: 7900,
    rating: 4.4,
    reviews: 86,
    badge: "nouveau",
    inStock: true,
  },
  {
    id: "sac-a-dos-antivol",
    name: "Sac à dos antivol",
    category: "Bagagerie",
    price: 3200,
    compareAt: 4000,
    rating: 4.8,
    reviews: 214,
    badge: "promo",
    inStock: true,
  },
  {
    id: "lampe-solaire-portable",
    name: "Lampe solaire portable",
    category: "Maison",
    price: 1850,
    rating: 4.7,
    reviews: 341,
    inStock: true,
  },
  {
    id: "ventilateur-rechargeable",
    name: "Ventilateur rechargeable",
    category: "Maison",
    price: 2750,
    rating: 4.3,
    reviews: 97,
    inStock: false,
    badge: "rupture",
  },
  {
    id: "kit-beaute-naturelle",
    name: "Kit beauté naturelle",
    category: "Beauté",
    price: 2400,
    compareAt: 3100,
    rating: 4.9,
    reviews: 452,
    badge: "promo",
    inStock: true,
  },
  {
    id: "enceinte-portable-bass",
    name: "Enceinte portable Bass",
    category: "Électronique",
    price: 3900,
    rating: 4.5,
    reviews: 173,
    inStock: true,
  },
  {
    id: "set-cuisine-inox",
    name: "Set cuisine inox 6 pièces",
    category: "Maison",
    price: 5600,
    rating: 4.2,
    reviews: 64,
    badge: "nouveau",
    inStock: true,
  },
];

const gourdes = new Intl.NumberFormat("fr-HT", {
  style: "currency",
  currency: "HTG",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return gourdes.format(value);
}

export const categories = [
  "Tous",
  ...Array.from(new Set(products.map((p) => p.category))),
];
