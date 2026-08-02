import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(request: Request) {
  try {
    const { orderIds, status } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || !status) {
      return NextResponse.json(
        { error: "orderIds array and status are required." },
        { status: 400 }
      );
    }

    // Fetch the orders to get customer emails
    const ordersToUpdate = await prisma.order.findMany({
      where: { id: { in: orderIds } },
    });

    const updateData: { status: string; deliveredAt?: Date } = { status };
    if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    // Update statuses in the database
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: updateData,
    });

    // Send emails in the background
    let subject = "";
    if (status === "SHIPPED") {
      subject = "Your Yemnest Order Has Shipped!";
    } else if (status === "DELIVERED") {
      subject = "Your Yemnest Order Has Been Delivered!";
    } else if (status === "CANCELLED") {
      subject = "Update on your Yemnest Order";
    }

    if (subject) {
      ordersToUpdate.forEach((order) => {
        let messageBody = "";
        if (status === "SHIPPED") {
          messageBody = `Your Yemnest order <strong>#${order.id}</strong> has been shipped and is on its way to you.`;
        } else if (status === "DELIVERED") {
          messageBody = `Great news! Your Yemnest order <strong>#${order.id}</strong> has been successfully delivered. We hope you enjoy your chocolates!`;
        } else if (status === "CANCELLED") {
          messageBody = `Your Yemnest order <strong>#${order.id}</strong> has been cancelled. If you have any questions, please contact our support team.`;
        }

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

        sendEmail({
          to: "gnapikakada47@gmail.com", // Hardcoded for testing as requested by user previously, though usually order.userEmail
          subject,
          html: emailHtml,
        }).catch((err) => console.error(`Failed to send ${status} bulk email:`, err));
      });
    }

    return NextResponse.json(
      { message: `Successfully updated ${orderIds.length} orders` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Bulk update order status error:", error);
    return NextResponse.json(
      { error: "Failed to update orders." },
      { status: 500 }
    );
  }
}
