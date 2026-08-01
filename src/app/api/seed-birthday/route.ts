import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const existing = await prisma.product.findFirst({
      where: { name: { contains: 'Birthday' } }
    });

    if (existing) {
      return NextResponse.json({ message: 'Birthday product already exists!', product: existing });
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

    return NextResponse.json({ message: 'Successfully created Birthday Special Box!', product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
