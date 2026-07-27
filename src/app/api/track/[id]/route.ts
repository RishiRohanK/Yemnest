import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const cleanId = id.replace(/^#/, "").toLowerCase().trim();

    const order = await prisma.order.findFirst({
      where: {
        id: {
          startsWith: cleanId,
        }
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        deliveredAt: true,
        items: true,
        totalPrice: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
