import { s3Client } from "../src/lib/s3";
import fs from "fs";
import path from "path";

async function testS3Upload() {
  console.log("Testing S3 upload...");
  
  try {
    // Create a test file
    const testFilePath = path.join(__dirname, "test-file.txt");
    fs.writeFileSync(testFilePath, "This is a test file for S3 upload.");
    
    console.log("Test file created at:", testFilePath);
    
    // Read the file
    const fileContent = fs.readFileSync(testFilePath);
    
    // Generate a key for S3
    const key = `test-uploads/test-file-${Date.now()}.txt`;
    
    console.log("Uploading to S3...");
    console.log("Bucket:", process.env.S3_BUCKET_NAME);
    console.log("Key:", key);
    
    // Upload to S3
    await s3Client.putObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: "text/plain"
    });
    
    console.log("S3 upload successful!");
    
    // Generate URL
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log("File URL:", url);
    
    // Clean up
    fs.unlinkSync(testFilePath);
    console.log("Test file cleaned up.");
    
  } catch (error) {
    console.error("S3 upload test failed:", error);
  }
}

// Run the function
testS3Upload().catch(console.error); 