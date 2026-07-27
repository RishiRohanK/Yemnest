import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, userId, userName, rating, comment } = body;

    if (!productId || !userId || !userName || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify buyer: Check if the user has an Order containing this productId
    // We check if the items field (which is a JSON string) contains the productId.
    // For a strict check, we could parse it, but for a simple check, a string includes works.
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: userId,
        items: {
          contains: productId
        }
      }
    });

    if (!hasOrdered) {
      return NextResponse.json(
        { error: "You must have purchased this item to leave a review." },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        userName,
        rating: parseInt(rating, 10),
        comment: comment || "",
      },
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
