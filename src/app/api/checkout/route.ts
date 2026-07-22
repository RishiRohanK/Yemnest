import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userId, 
      userName, 
      userEmail, 
      houseNo, 
      addressLine1, 
      city, 
      state, 
      pincode, 
      phoneNumber, 
      alternativeMobileNumber, 
      items, 
      subTotal, 
      tax, 
      shipping, 
      discount, 
      totalPrice, 
      couponCode 
    } = body;

    // Validate essential fields
    if (!userName || !userEmail || !phoneNumber || !houseNo || !addressLine1 || !city || !state || !pincode || !items || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields for checkout" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: userId || null,
        userName,
        userEmail,
        houseNo,
        addressLine1,
        city,
        state,
        pincode,
        phoneNumber,
        alternativeMobileNumber: alternativeMobileNumber || "",
        items: JSON.stringify(items),
        subTotal: parseFloat(subTotal),
        tax: parseFloat(tax),
        shipping: parseFloat(shipping),
        discount: parseFloat(discount),
        totalPrice: parseFloat(totalPrice),
        couponCode: couponCode || null,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating checkout order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
