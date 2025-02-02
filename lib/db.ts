import postgres from "postgres";

// Create a single instance of the postgres client
const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export default sql;
