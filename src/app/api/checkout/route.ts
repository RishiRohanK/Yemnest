import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { invalidateProductCache } from "@/lib/product-cache";

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
        status: "CONFIRMED"
      }
    });

    // Decrement stock for each purchased item
    try {
      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      if (Array.isArray(parsedItems)) {
        for (const item of parsedItems) {
          const productId = item.product?.id || item.id;
          if (productId && item.quantity) {
            await prisma.product.update({
              where: { id: productId },
              data: {
                stockCount: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
      }
      
      // Invalidate the cache so the frontend immediately shows the updated stock
      invalidateProductCache();
    } catch (err) {
      console.error("Failed to decrement stock during checkout:", err);
    }

    // Send WhatsApp order confirmation asynchronously to customer
    sendWhatsAppMessage({
      to: phoneNumber, // Assumes the user provided their phone number in the checkout form
      body: `Hello ${userName}, thank you for your order!\n\nYour order (ID: *${newOrder.id}*) has been placed successfully.\nTotal Price: ₹${totalPrice}\n\nWe will notify you once your order is shipped.\n\n- Yemnest Team`
    }).catch(console.error);

    // Send WhatsApp notification to Admin
    sendWhatsAppMessage({
      to: "919876543210",
      body: `🚨 New Order Received!\n\nOrder ID: *${newOrder.id}*\nCustomer: ${userName}\nTotal: ₹${totalPrice}\n\nPlease check the admin dashboard for details.`
    }).catch(console.error);

    // Create a website Notification for the Admin
    try {
      await prisma.notification.create({
        data: {
          message: `New Order #${newOrder.id.slice(0, 8)} placed by ${userName} for ₹${totalPrice}`,
          type: "ORDER",
        }
      });
    } catch (notificationError) {
      console.error("Failed to create admin notification:", notificationError);
    }

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating checkout order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
