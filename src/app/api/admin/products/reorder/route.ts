import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid payload. 'updates' must be an array." },
        { status: 400 }
      );
    }

    // Use a transaction to perform all updates atomically
    await prisma.$transaction(
      updates.map((update: { id: string; displayOrder: number }) =>
        prisma.product.update({
          where: { id: update.id },
          data: { displayOrder: update.displayOrder },
        })
      )
    );

    return NextResponse.json(
      { message: "Products reordered successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin products reorder API error:", error);
    return NextResponse.json(
      { error: "An error occurred while reordering products. Please try again." },
      { status: 500 }
    );
  }
}
