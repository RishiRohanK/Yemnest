import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const existing = await prisma.product.findFirst({
      where: { name: { contains: 'Diwali' } }
    });

    if (existing) {
      return NextResponse.json({ message: 'Diwali product already exists!', product: existing });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: 'Diwali Special Box',
        subLine: 'Every bite, a Diwali celebration',
        price: 1499.00,
        cutoffPrice: 1999.00,
        description: 'A beautiful Diwali box with assorted premium chocolates to light up your festivities.',
        stockCount: 50,
        image1: '/images/themes/diwali/closed.jpg',
        image2: '/images/themes/diwali/open.jpg',
        image3: '',
        image4: '',
        category: 'Gift Boxes',
        dietary: '["Vegetarian", "Contains Nuts"]'
      }
    });

    return NextResponse.json({ message: 'Successfully created Diwali Special Box!', product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
