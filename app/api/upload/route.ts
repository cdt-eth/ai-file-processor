import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/src/lib/auth";
import { s3Client } from "@/src/lib/s3";
import sql from "@/lib/db";

export async function POST(request: NextRequest) {
  console.log("Upload API called");
  
  try {
    // Check authentication using Privy
    const user = await getUser(request);
    console.log("Auth check result:", user ? "Authenticated" : "Unauthenticated");
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      console.log("File received:", file ? file.name : "No file");

      if (!file) {
        return NextResponse.json({ error: "No file received" }, { status: 400 });
      }

      // Construct the S3 object key
      const key = `uploads/${user.id}/${Date.now()}-${file.name}`;
      console.log("S3 key:", key);

      // Convert the File (which is a Web API File) to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      console.log("Uploading to S3...");
      // Upload the file to S3
      try {
        console.log("S3 client:", s3Client ? "Initialized" : "Not initialized");
        console.log("S3 bucket:", process.env.S3_BUCKET_NAME);
        
        await s3Client.putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: Buffer.from(arrayBuffer),
          ContentType: file.type
        });
        console.log("S3 upload successful");
      } catch (error: any) {
        console.error("S3 upload error details:", error);
        return NextResponse.json(
          { error: `S3 upload failed: ${error.message || "Unknown S3 error"}` },
          { status: 500 }
        );
      }

      console.log("Saving to database...");
      // Store metadata in your Postgres/Neon DB
      let imageId;
      try {
        console.log("Database connection status:", !!sql);
        console.log("Database query params:", {
          userId: user.id,
          key,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        });
        
        const [image] = await sql`
          INSERT INTO images (
            user_id,
            s3_key,
            original_filename,
            file_size,
            mime_type
          ) VALUES (
            ${user.id},
            ${key},
            ${file.name},
            ${file.size},
            ${file.type}
          )
          RETURNING id
        `;
        imageId = image.id;
        console.log("Database save successful, image ID:", imageId);
      } catch (error: any) {
        console.error("Database error details:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message || "Unknown database error"}` },
          { status: 500 }
        );
      }

      // Generate a URL to retrieve the file
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log("Generated URL:", url);

      return NextResponse.json(
        {
          success: true,
          imageId,
          url,
          fileName: file.name,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Inner processing error:", error);
      return NextResponse.json(
        { error: `Processing error: ${error.message || "Unknown error"}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Outer API error:", error);
    return NextResponse.json(
      { error: `API error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
