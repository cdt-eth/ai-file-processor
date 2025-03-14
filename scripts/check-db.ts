import sql from "../lib/db";

async function checkDatabase() {
  console.log("Checking database connection...");
  
  try {
    // Check if we can connect to the database
    const result = await sql`SELECT 1 as connection_test`;
    console.log("Database connection successful:", result);
    
    // Check if the images table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log("Tables in database:", tables.map(t => t.table_name));
    
    const imagesTableExists = tables.some(t => t.table_name === 'images');
    
    if (!imagesTableExists) {
      console.log("Images table does not exist. Creating it...");
      
      await sql`
        CREATE TABLE images (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          s3_key TEXT NOT NULL,
          original_filename TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          mime_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          processed BOOLEAN DEFAULT FALSE,
          metadata JSONB
        )
      `;
      
      console.log("Images table created successfully!");
    } else {
      console.log("Images table exists. Checking structure...");
      
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'images'
      `;
      
      console.log("Columns in images table:", columns.map(c => `${c.column_name} (${c.data_type})`));
    }
    
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    // Close the connection
    await sql.end();
  }
}

// Run the function
checkDatabase().catch(console.error); 