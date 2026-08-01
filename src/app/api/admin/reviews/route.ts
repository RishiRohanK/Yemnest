import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, userName, rating, comment } = body;

    if (!productId || !userName || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: "admin-added", // Hardcoded for manual admin additions
        userName,
        rating: parseInt(rating, 10),
        comment: comment || "",
      },
      include: {
        product: {
          select: { name: true, category: true }
        }
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
