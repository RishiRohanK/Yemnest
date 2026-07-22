/**
 * Global server-side in-memory cache for products.
 *
 * WHY THIS EXISTS:
 * The Product model stores base64-encoded image data directly in the database.
 * A single query returns 3-7MB of data which is too large for Next.js's
 * built-in `unstable_cache` (2MB limit). This module-level cache survives
 * across requests in the same Node.js process, so after the first load the
 * data is served instantly from memory with zero database hits.
 *
 * TTL is 5 minutes. To force a refresh (e.g. after admin adds a product),
 * call invalidateProductCache().
 */

import { prisma } from "@/lib/prisma";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type Product = {
  id: string;
  name: string;
  subLine: string;
  category: string;
  price: number;
  cutoffPrice: number;
  description: string;
  stockCount: number;
  image1: string;
  image2: string;
  image3?: string;
  image4?: string;
};

let _cache: Product[] | null = null;
let _cacheTimestamp = 0;

const LOCAL_IMAGES = [
  "/kunafa_pistachio.png",
  "/kunafa_biscoff.png",
  "/kunafa_hazelnut.png",
];

function pickImage(name: string, category: string, index: number): string {
  const n = (name + " " + category).toLowerCase();
  if (n.includes("pistachio")) return "/kunafa_pistachio.png";
  if (n.includes("biscoff") || n.includes("biscuit") || n.includes("caramel")) return "/kunafa_biscoff.png";
  if (n.includes("hazelnut") || n.includes("dark")) return "/kunafa_hazelnut.png";
  if (n.includes("kunafa")) return LOCAL_IMAGES[index % LOCAL_IMAGES.length];
  // Cycle through all 3 for anything else
  return LOCAL_IMAGES[index % LOCAL_IMAGES.length];
}

async function fetchFromDb(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    subLine: row.subLine,
    category: row.category,
    price: row.price,
    cutoffPrice: row.cutoffPrice,
    description: row.description,
    stockCount: row.stockCount,
    image1: row.image1,
    image2: row.image2,
    image3: row.image3,
    image4: row.image4,
  }));
}

export async function getProducts(): Promise<Product[]> {
  const now = Date.now();
  if (_cache && now - _cacheTimestamp < CACHE_TTL_MS) {
    return _cache;
  }
  const products = await fetchFromDb();
  _cache = products;
  _cacheTimestamp = now;
  return products;
}

export function invalidateProductCache() {
  _cache = null;
  _cacheTimestamp = 0;
}
