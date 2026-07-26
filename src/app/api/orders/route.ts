import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

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

    // Decrement stock for each purchased item
    try {
      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      if (Array.isArray(parsedItems)) {
        for (const item of parsedItems) {
          if (item.id && item.quantity) {
            await prisma.product.update({
              where: { id: item.id },
              data: {
                stockCount: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to decrement stock:", err);
    }

    // Send admin notification
    if (process.env.ADMIN_EMAIL) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #106636;">New Order Received!</h2>
          <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
          <p><strong>Total Price:</strong> ₹${totalPrice}</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin">View in Admin Panel</a></p>
        </div>
      `;
      // Don't await so it doesn't block the checkout response
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Yemnest Order - ₹${totalPrice}`,
        html: emailHtml,
      }).catch(err => console.error("Admin email failed:", err));
    }

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
      where: { 
        userEmail: email,
        status: { not: "PENDING" }
      },
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
