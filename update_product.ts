import { config } from 'dotenv';
config({ path: '.env.local' });

process.env.DATABASE_URL = "postgresql://postgres.kwugxdmymmrcfebhefxh:Choco%402026Supabase!@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function main() {
  const { prisma } = await import('./src/lib/prisma');
  const updatedProduct = await prisma.product.updateMany({
    where: {
      name: "Hazelnut Filling Kunafa"
    },
    data: {
      image1: "/images/hazelnut_filling_kunafa.png",
      image2: "/images/hazelnut_filling_kunafa.png"
    }
  });

  console.log("Updated products count:", updatedProduct.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
