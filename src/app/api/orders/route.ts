import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, items, totalPrice } = body;

    if (!email || !items || totalPrice === undefined) {
      return NextResponse.json(
        { error: "Email, items, and totalPrice are required." },
        { status: 400 }
      );
    }

    // Find the user to get their address details
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found. Please log in first." },
        { status: 404 }
      );
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        houseNo: user.houseNo,
        addressLine1: user.addressLine1,
        pincode: user.pincode,
        phoneNumber: user.phoneNumber,
        alternativeMobileNumber: user.alternativeMobileNumber,
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalPrice: parseFloat(totalPrice.toString()),
      },
    });

    return NextResponse.json(
      { message: "Order placed successfully", order },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Checkout route error:", error);
    return NextResponse.json(
      { error: "An error occurred while placing the order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Fetch orders route error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching orders." },
      { status: 500 }
    );
  }
}
