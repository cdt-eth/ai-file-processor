import { FileUpload } from "@/components/file-upload";

export default function Home() {
  return (
    <main className="p-8 space-y-4 flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUpload />
        </div>
      </div>
    </main>
  );
}
