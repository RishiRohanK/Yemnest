import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons, { status: 200 });
  } catch (error: any) {
    console.error("GET coupons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountPercentage, isActive } = body;

    if (!code || discountPercentage === undefined) {
      return NextResponse.json(
        { error: "Code and discountPercentage are required." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercentage: parseFloat(discountPercentage.toString()),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    console.error("POST coupon error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A coupon with this code already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create coupon." },
      { status: 500 }
    );
  }
}
