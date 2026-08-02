import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!id) return { title: "Product Not Found" };

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Yemnest`,
    description: product.subLine || "Discover our exclusive chocolate collection.",
    openGraph: {
      title: `${product.name} | Yemnest`,
      description: product.subLine || "Discover our exclusive chocolate collection.",
      images: [
        {
          url: product.image1,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ],
    },
  };
}

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
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  let relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  if (relatedProducts.length === 0) {
    relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
      },
      take: 4,
    });
  }

  type ReviewRecord = { id: string; rating: number; comment: string; userName: string; createdAt: Date };
  type ProductRecord = { id: string; name: string; subLine: string; category: string; price: number; cutoffPrice: number; price12Bar?: number | null; cutoffPrice12Bar?: number | null; description: string; stockCount: number; image1: string; image2?: string; image3?: string; image4?: string; createdAt: Date };

  const serializedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    reviews: product.reviews.map((r: ReviewRecord) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  const serializedRelatedProducts = relatedProducts.map((rp: ProductRecord) => ({
    ...rp,
    createdAt: rp.createdAt.toISOString(),
  }));

  return <ProductDetailClient product={serializedProduct} relatedProducts={serializedRelatedProducts} />;
}
