const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  // Connect to NeonDB
  const neonPool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_AXQJ6mMyRwB8@ep-billowing-dream-atekeq7y-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
  });

  console.log("Connecting to NeonDB...");
  const neonClient = await neonPool.connect();
  let products = [];
  try {
    const res = await neonClient.query('SELECT * FROM "Product"');
    products = res.rows;
    console.log(`Found ${products.length} products in NeonDB.`);
  } catch(e) {
    console.error("Error querying Neon:", e);
    process.exit(1);
  } finally {
    neonClient.release();
  }

  if (products.length === 0) {
    console.log("No products to migrate.");
    process.exit(0);
  }

  console.log("Connecting to Supabase via Prisma...");
  const prisma = new PrismaClient();

  try {
    console.log("Seeding Supabase database...");
    const created = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });
    console.log(`Successfully migrated ${created.count} products to Supabase!`);
  } catch (e) {
    console.error("Error inserting into Supabase:", e);
  } finally {
    await prisma.$disconnect();
    await neonPool.end();
  }
}

main();
