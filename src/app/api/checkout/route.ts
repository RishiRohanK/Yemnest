import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

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

    // Send WhatsApp order confirmation asynchronously
    sendWhatsAppMessage({
      to: phoneNumber, // Assumes the user provided their phone number in the checkout form
      body: `Hello ${userName}, thank you for your order!\n\nYour order (ID: *${newOrder.id}*) has been placed successfully.\nTotal Price: ₹${totalPrice}\n\nWe will notify you once your order is shipped.\n\n- Yemnest Team`
    }).catch(console.error);

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating checkout order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
