import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { couponCode, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to validate this coupon." },
        { status: 400 }
      );
    }

    if (couponCode === "FINESTCOCOA") {
      const orderCount = await prisma.order.count({
        where: { 
          userEmail: email,
          status: { not: "PENDING" }
        },
      });

      if (orderCount > 0) {
        return NextResponse.json(
          { error: "FINESTCOCOA is only valid for first-time orders." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, discountPercentage: 0.15 });
    }

    if (couponCode === "YEMNEST10") {
      return NextResponse.json({ success: true, discountPercentage: 0.10 });
    }

    // Check dynamic coupons from database
    const dbCoupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    if (dbCoupon && dbCoupon.isActive) {
      return NextResponse.json({ 
        success: true, 
        discountPercentage: dbCoupon.discountPercentage / 100 
      });
    }

    return NextResponse.json(
      { error: "Invalid coupon code." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
