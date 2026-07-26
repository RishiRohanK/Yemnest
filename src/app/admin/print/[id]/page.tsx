import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintClient from "./PrintClient";

export default async function PrintInvoicePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return notFound();
  }

  // Parse items
  let items = [];
  try {
    items = JSON.parse(order.items);
    if (!Array.isArray(items)) {
      items = [];
    }
  } catch (e) {
    items = [];
  }

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <PrintClient 
      order={order} 
      items={items} 
      orderDate={orderDate} 
    />
  );
}
