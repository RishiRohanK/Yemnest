import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SuccessClient from "./SuccessClient";

export default async function SuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.orderId }
  });

  if (!order) {
    notFound();
  }

  return <SuccessClient order={order} />;
}
