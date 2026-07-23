import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentClient from "./PaymentClient";

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.orderId }
  });

  if (!order) {
    notFound();
  }

  return <PaymentClient order={order} />;
}
