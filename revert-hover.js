const { Pool } = require('pg');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = env.match(/DATABASE_URL="([^"]+)"/);
if (!dbUrlMatch) {
  process.exit(1);
}
const dbUrl = dbUrlMatch[1];
const pool = new Pool({ connectionString: dbUrl });

async function main() {
  const client = await pool.connect();
  
  try {
    await client.query(`
      UPDATE "Product"
      SET image2 = 'https://ik.imagekit.io/dypkhqxip/bis'
      WHERE name = 'Biscoff Filling Kunafa'
    `);
    console.log("Successfully reverted the hover image back to the original remote URL!");
  } catch(e) {
    console.error("Error updating product:", e);
  } finally {
    client.release();
    pool.end();
    try { fs.unlinkSync('revert-hover.js'); } catch(e) {}
    try { fs.unlinkSync('public/kunafa_biscoff_zoom.png'); } catch(e) {} // Clean up the empty file
  }
}

main();
