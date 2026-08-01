import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const existing = await prisma.product.findFirst({
      where: { name: { contains: 'Anniversary' } }
    });

    if (existing) {
      return NextResponse.json({ message: 'Anniversary product already exists!', product: existing });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: 'Anniversary Special Box',
        subLine: 'Celebrate years of togetherness',
        price: 1499.00,
        cutoffPrice: 1999.00,
        description: 'A beautiful anniversary box with assorted premium chocolates.',
        stockCount: 50,
        image1: '/images/themes/anniversary/closed.jpg',
        image2: '/images/themes/anniversary/open.jpg',
        image3: '',
        image4: '',
        category: 'Gift Boxes',
        dietary: '["Vegetarian", "Contains Nuts"]'
      }
    });

    return NextResponse.json({ message: 'Successfully created Anniversary Special Box!', product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
