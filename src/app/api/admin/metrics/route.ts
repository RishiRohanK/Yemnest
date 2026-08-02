import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    const totalRevenue = orders.reduce((sum: number, order: { totalPrice: number }) => sum + order.totalPrice, 0);

    // Calculate daily sales for chart
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const salesData = last7Days.map(dateLabel => {
      const dailyOrders = orders.filter(o => 
        new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateLabel
      );
      return {
        name: dateLabel,
        revenue: dailyOrders.reduce((sum: number, o: { totalPrice: number }) => sum + o.totalPrice, 0)
      };
    });

    // Fetch low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: { stockCount: { lte: 5 } },
      select: { id: true, name: true, stockCount: true, category: true },
      orderBy: { stockCount: 'asc' }
    });

    const allProducts = await prisma.product.findMany({
      select: { category: true, stockCount: true }
    });
    
    const inventoryMap: Record<string, { name: string; value: number }> = {};
    allProducts.forEach(p => {
      if (!inventoryMap[p.category]) {
        inventoryMap[p.category] = { name: p.category, value: 0 };
      }
      inventoryMap[p.category].value += p.stockCount;
    });
    const inventoryByCategory = Object.values(inventoryMap);

    return NextResponse.json(
      {
        metrics: {
          totalUsers,
          totalOrders,
          totalRevenue,
          salesData,
          lowStockProducts,
          inventoryByCategory,
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
