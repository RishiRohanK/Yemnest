import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { status } = await request.json();
    
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    let subject = "";
    let messageBody = "";

    if (status === "SHIPPED") {
      subject = "Your Yemnest Order Has Shipped!";
      messageBody = `Your Yemnest order <strong>#${order.id}</strong> has been shipped and is on its way to you.`;
    } else if (status === "DELIVERED") {
      subject = "Your Yemnest Order Has Been Delivered!";
      messageBody = `Great news! Your Yemnest order <strong>#${order.id}</strong> has been successfully delivered. We hope you enjoy your chocolates!`;
    } else if (status === "CANCELLED") {
      subject = "Update on your Yemnest Order";
      messageBody = `Your Yemnest order <strong>#${order.id}</strong> has been cancelled. If you have any questions, please contact our support team.`;
    }

    if (subject) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #106636;">Order Update: ${status}</h2>
          <p>${messageBody}</p>
          <p><strong>Shipping Address:</strong><br/>
            ${order.houseNo}, ${order.addressLine1}<br/>
            ${order.pincode}
          </p>
          <br/>
          <p>Thank you for choosing Yemnest!</p>
        </div>
      `;

      // Don't await so it doesn't crash the API response if email is unconfigured
      sendEmail({
        to: "gnapikakada47@gmail.com", // Hardcoded for testing as requested
        subject,
        html: emailHtml,
      }).catch(err => console.error(`Failed to send ${status} email:`, err));
    }

    return NextResponse.json(
      { message: "Order status updated successfully", order },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
