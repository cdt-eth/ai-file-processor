"use client";

import { useState, useEffect } from "react";
import { UploadIcon } from "lucide-react";
import { cn, getUserDisplayName } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";

interface UploadResponse {
  success: boolean;
  imageId?: string;
  url?: string;
  fileName?: string;
  error?: string;
}

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const { authenticated, getAccessToken, user } = usePrivy();

  // Log authentication status changes
  useEffect(() => {
    console.log("Auth status:", authenticated ? "Authenticated" : "Not authenticated");
    if (authenticated && user) {
      console.log("User:", getUserDisplayName(user));
      console.log("User details:", user);
    }
  }, [authenticated, user]);

  async function uploadFile(file: File) {
    if (!authenticated) {
      console.log("Upload attempted without authentication");
      setUploadResult({ success: false, error: "Please sign in to upload files" });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);
    console.log("Starting upload for file:", file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get the authentication token
      console.log("Getting access token...");
      const token = await getAccessToken();
      console.log("Token received:", token ? "✓" : "✗");

      console.log("Sending upload request to API...");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data: UploadResponse = await response.json();
      console.log("API response:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadResult(data);
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
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
        {!authenticated && (
          <p className="text-red-500 mt-2">Please sign in to upload files</p>
        )}
      </label>

      {uploadResult && (
        <div className={`mt-4 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {uploadResult.success ? (
            <div>
              <p className="font-semibold">Upload successful!</p>
              <p>File: {uploadResult.fileName}</p>
              {uploadResult.url && (
                <a 
                  href={uploadResult.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              )}
            </div>
          ) : (
            <p>{uploadResult.error || "Upload failed"}</p>
          )}
        </div>
      )}
    </div>
  );
}
