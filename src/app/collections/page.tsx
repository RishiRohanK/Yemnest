import { getProducts } from "@/lib/product-cache";
import CollectionsClient from "./CollectionsClient";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const products = await getProducts();
  return <CollectionsClient initialProducts={products as any} />;
}
