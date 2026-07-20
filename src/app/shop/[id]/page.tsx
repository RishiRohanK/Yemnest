import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Convert Date objects to ISO string representation to make them fully serializable
  const serializedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
  };

  return <ProductDetailClient product={serializedProduct} />;
}
