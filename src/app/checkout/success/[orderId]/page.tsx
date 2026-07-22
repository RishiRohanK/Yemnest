import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SuccessClient from "./SuccessClient";

export default async function SuccessPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId }
  });

  if (!order) {
    notFound();
  }

  return <SuccessClient order={order} />;
}
