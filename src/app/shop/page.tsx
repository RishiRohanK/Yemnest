import { getProducts } from "@/lib/product-cache";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8 text-center text-zinc-500">Loading shop...</div>}>
      <ShopClient initialProducts={products as any} />
    </Suspense>
  );
}
