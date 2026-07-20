import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Fetch users (excluding passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        houseNo: true,
        addressLine1: true,
        pincode: true,
        phoneNumber: true,
        alternativeMobileNumber: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch orders
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate metrics
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return NextResponse.json(
      {
        metrics: {
          totalUsers,
          totalOrders,
          totalRevenue,
        },
        users,
        orders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin metrics API error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching metrics. Please try again." },
      { status: 500 }
    );
  }
}
