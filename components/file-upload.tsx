"use client";

import { useState } from "react";
import { UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadResponse {
  message: string;
  fileName: string;
}

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data: UploadResponse = await response.json();
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  function onFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;
    uploadFile(event.target.files[0]);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label
        className={cn(
          "flex h-[400px] w-[600px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-4 transition duration-300",
          isDragging
            ? "border-blue-500 bg-blue-50 text-blue-500"
            : "hover:border-gray-300 hover:bg-gray-50 text-gray-500",
          isUploading && "pointer-events-none opacity-60"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          onChange={onFileSelect}
          disabled={isUploading}
        />
        <UploadIcon className={cn("h-6 w-6")} strokeWidth={2} />
        <h1 className="text-lg font-semibold">
          {isUploading
            ? "Uploading..."
            : "Drop your files here or click to upload"}
        </h1>
      </label>
    </div>
  );
}
