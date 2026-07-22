import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ShopClient initialProducts={products} />;
}
