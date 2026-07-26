import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { isActive } = await request.json();

    await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ message: "Coupon status updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH coupon error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the coupon." },
      { status: 500 }
    );
  }
}
