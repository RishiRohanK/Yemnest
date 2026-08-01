import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Altering table Product...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN "price12Bar" DOUBLE PRECISION;`);
    console.log("Added price12Bar");
  } catch (e: any) {
    console.log("Error adding price12Bar:", e.message);
  }
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN "cutoffPrice12Bar" DOUBLE PRECISION;`);
    console.log("Added cutoffPrice12Bar");
  } catch (e: any) {
    console.log("Error adding cutoffPrice12Bar:", e.message);
  }
  
  console.log("Done!");
  process.exit(0);
}

main().catch(console.error);
