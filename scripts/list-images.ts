import sql from "../lib/db";

async function listImages() {
  console.log("Listing images in database...");
  
  try {
    const images = await sql`
      SELECT * FROM images
      ORDER BY created_at DESC
      LIMIT 10
    `;
    
    console.log(`Found ${images.length} images:`);
    
    images.forEach((image, index) => {
      console.log(`\nImage ${index + 1}:`);
      console.log(`  ID: ${image.id}`);
      console.log(`  User ID: ${image.user_id}`);
      console.log(`  Filename: ${image.original_filename}`);
      console.log(`  S3 Key: ${image.s3_key}`);
      console.log(`  Size: ${image.file_size} bytes`);
      console.log(`  Type: ${image.mime_type}`);
      console.log(`  Created: ${image.created_at}`);
      console.log(`  Processed: ${image.processed}`);
    });
    
  } catch (error) {
    console.error("Failed to list images:", error);
  } finally {
    // Close the connection
    await sql.end();
  }
}

// Run the function
listImages().catch(console.error); 