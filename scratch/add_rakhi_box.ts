import { prisma } from '../src/lib/prisma';
import fs from 'fs';

async function main() {
  const imagePath = "C:\\Users\\91812\\Desktop\\rakhi.jpeg";
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  const product = await prisma.product.create({
    data: {
      name: "Raksha Bandhan Special Box",
      subLine: "Celebrate the eternal sibling bond",
      category: "Gift Boxes",
      price: 1499.00,
      cutoffPrice: 1999.00,
      description: "Make this Raksha Bandhan unforgettable with a beautifully curated premium gift box. Featuring 4 customized chocolate bars crafted with love, specifically designed with beautiful Rakhi motifs. Each bite represents the sweetness of your eternal bond. Includes a beautifully decorated sturdy black box.",
      stockCount: 50,
      image1: imageBase64,
      image2: imageBase64,
      image3: imageBase64,
      image4: imageBase64,
    }
  });

  console.log("Created Raksha Bandhan product:", product.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
