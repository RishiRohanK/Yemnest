import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("GET product by ID error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        subLine: body.subLine,
        price: body.price !== undefined ? parseFloat(body.price.toString()) : undefined,
        cutoffPrice: body.cutoffPrice !== undefined ? parseFloat(body.cutoffPrice.toString()) : undefined,
        price12Bar: body.price12Bar !== undefined ? (body.price12Bar ? parseFloat(body.price12Bar.toString()) : null) : undefined,
        cutoffPrice12Bar: body.cutoffPrice12Bar !== undefined ? (body.cutoffPrice12Bar ? parseFloat(body.cutoffPrice12Bar.toString()) : null) : undefined,
        description: body.description,
        stockCount: body.stockCount !== undefined ? parseInt(body.stockCount.toString(), 10) : undefined,
        image1: body.image1,
        image2: body.image2,
        image3: body.image3,
        image4: body.image4,
        category: body.category,
      },
    });
    
    // Refresh memory cache
    const { invalidateProductCache } = await import("@/lib/product-cache");
    invalidateProductCache();

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    await prisma.product.delete({
      where: { id },
    });

    const { invalidateProductCache } = await import("@/lib/product-cache");
    invalidateProductCache();
    
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
