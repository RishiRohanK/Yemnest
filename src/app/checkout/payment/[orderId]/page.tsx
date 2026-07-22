import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentClient from "./PaymentClient";

export default async function PaymentPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId }
  });

  if (!order) {
    notFound();
  }

  return <PaymentClient order={order} />;
}
