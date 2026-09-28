// Typed access to the JSON content in src/content. Components never
// hardcode copy, prices or photos — everything flows through here.
import brandJson from '../content/brand.json';
import productsJson from '../content/products.json';
import categoriesJson from '../content/categories.json';
import homeJson from '../content/home.json';
import uiJson from '../content/ui.json';
import imagesJson from '../content/images.json';
import placeholdersJson from '../content/placeholders.json';

export type Lang = 'es' | 'en';
export type Localized = Record<Lang, string>;
export type Badge = 'popular' | 'fresh' | 'seasonal';

export interface Product {
  id: string;
  category: string;
  image: string;
  price: number;
  featured?: boolean;
  badges: Badge[];
  name: Localized;
  description: Localized;
}

export interface Category {
  id: string;
  image: string;
  name: Localized;
  blurb: Localized;
}

export interface ImageEntry {
  source: string;
  credit: string;
  alt: Localized;
}

export const brand = brandJson;
export const home = homeJson;
export const ui = uiJson;
export const products = productsJson as Product[];
export const categories = categoriesJson as Category[];
export const images = imagesJson as unknown as Record<string, ImageEntry>;
export const placeholders = placeholdersJson as Record<string, string>;

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const productsIn = (categoryId: string) => products.filter((p) => p.category === categoryId);
export const featuredProducts = products.filter((p) => p.featured);
export const popularProducts = products.filter((p) => p.badges.includes('popular'));

const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatPrice = (n: number) => priceFormat.format(n);

export const fullAddress = `${brand.address.street}, ${brand.address.city}, ${brand.address.state} ${brand.address.zip}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
export const appleMapsUrl = `https://maps.apple.com/?daddr=${encodeURIComponent(fullAddress)}`;

/** Strip accents + lowercase so "cafe" matches "Café". */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
