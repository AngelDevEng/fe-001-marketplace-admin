const WC_KEY = process.env.NEXT_PUBLIC_WP_CS_KEY || '';
const WC_SECRET = process.env.NEXT_PUBLIC_WP_CS_SECRET || '';

function buildAuthParams(): string {
  return `consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;
}

export async function searchProducts(query: string, perPage = 10) {
  const auth = buildAuthParams();
  const searchParam = encodeURIComponent(query);
  const url = `https://lyriumbiomarketplace.com/wp-json/wc/v3/products?${auth}&search=${searchParam}&per_page=${perPage}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function searchCategories(query: string, perPage = 10) {
  const auth = buildAuthParams();
  const searchParam = encodeURIComponent(query);
  const url = `https://lyriumbiomarketplace.com/wp-json/wc/v3/products/categories?${auth}&search=${searchParam}&per_page=${perPage}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export async function getProductsByCategory(categoryId: number, perPage = 10) {
  const auth = buildAuthParams();
  const url = `https://lyriumbiomarketplace.com/wp-json/wc/v3/products?${auth}&category=${categoryId}&per_page=${perPage}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function getProductBySlug(slug: string) {
  const auth = buildAuthParams();
  const url = `https://lyriumbiomarketplace.com/wp-json/wc/v3/products?${auth}&slug=${encodeURIComponent(slug)}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  const products = await res.json();
  return products[0] || null;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: { id: number; src: string }[];
  categories: { id: number; name: string; slug: string }[];
  store?: {
    name: string;
    url: string;
  };
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image?: { src: string };
}
