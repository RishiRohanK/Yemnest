import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all products
export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching products." },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      subLine,
      price,
      cutoffPrice,
      description,
      stockCount,
      image1,
      image2,
      image3,
      image4,
      category,
    } = body;

    // Validate fields
    if (
      !name ||
      !subLine ||
      price === undefined ||
      cutoffPrice === undefined ||
      !description ||
      stockCount === undefined ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4 ||
      !category
    ) {
      return NextResponse.json(
        { error: "Please fill in all product fields, including all 4 images." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        subLine,
        price: parseFloat(price.toString()),
        cutoffPrice: parseFloat(cutoffPrice.toString()),
        description,
        stockCount: parseInt(stockCount.toString(), 10),
        image1,
        image2,
        image3,
        image4,
        category,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST product error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the product." },
      { status: 500 }
    );
  }
}
