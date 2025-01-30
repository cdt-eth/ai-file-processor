import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    console.log("formData", formData);
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    console.log("file", file);
    // Here you would typically:
    // 1. Validate the file (size, type, etc.)
    // 2. Process the file (upload to storage, etc.)
    // For now, we'll just return success

    return NextResponse.json(
      { message: "File received", fileName: file.name },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
