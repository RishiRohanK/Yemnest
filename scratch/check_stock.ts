import { prisma } from '../src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, stockCount: true }
  });
  console.log("Products:");
  console.table(products);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log("Recent Orders:");
  orders.forEach(o => console.log(o.id, o.items));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
