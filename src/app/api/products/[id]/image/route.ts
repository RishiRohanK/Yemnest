import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      select: { image1: true },
    });

    if (!product || !product.image1) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const dataUri = product.image1;
    // Data URI format: data:image/jpeg;base64,...
    const matches = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    // If it's not a data URI (e.g., a regular URL), we can just redirect to it
    if (dataUri.startsWith('http')) {
      return NextResponse.redirect(dataUri);
    }

    return new NextResponse("Invalid image format", { status: 400 });
  } catch (error) {
    console.error("Failed to fetch product image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
