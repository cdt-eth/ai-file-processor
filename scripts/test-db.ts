import sql from "../lib/db";

async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("✅ Database connection successful!");
    console.log("Current time:", result[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await sql.end();
  }
}

testConnection();
