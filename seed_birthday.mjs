import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.product.findFirst({
    where: { name: { contains: 'Birthday' } }
  });

  if (existing) {
    console.log('Birthday product already exists!');
    return;
  }

  const newProduct = await prisma.product.create({
    data: {
      name: 'Birthday Special Box',
      subLine: 'Make every birthday sweeter',
      price: 1499.00,
      cutoffPrice: 1999.00,
      description: 'A beautiful birthday box with assorted premium chocolates.',
      stockCount: 50,
      image1: '/images/themes/birthday/closed.jpg',
      image2: '/images/themes/birthday/open.jpg',
      image3: '',
      image4: '',
      category: 'Gift Boxes',
      dietary: '["Vegetarian", "Contains Nuts"]'
    }
  });

  console.log('Successfully created Birthday Special Box with ID:', newProduct.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
