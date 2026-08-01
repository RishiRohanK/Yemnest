import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

// We use the direct connection string since pgbouncer might cause issues for scripts
process.env.DATABASE_URL = "postgresql://postgres.kwugxdmymmrcfebhefxh:Choco%402026Supabase!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function main() {
  const { prisma } = await import('./src/lib/prisma');
  const newProduct = await prisma.product.create({
    data: {
      name: "Hazelnut Filling Kunafa",
      subLine: "Dark signature hazelnut filling kunafa.",
      price: 1899.00,
      cutoffPrice: 2299.00,
      description: "Experience the rich harmony of hazelnut and premium kunafa pastry.",
      stockCount: 50,
      image1: "https://ik.imagekit.io/dypkhqxip/collectiosn6", // Placeholder, user will update if needed
      image2: "https://ik.imagekit.io/dypkhqxip/collectiosn6",
      image3: "",
      image4: "",
      category: "Kunafa Bars",
      displayOrder: 2
    }
  });

  console.log("Created product:", newProduct.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
