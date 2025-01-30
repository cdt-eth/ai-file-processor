import { UploadIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="p-8 space-y-4 flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadIcon className="w-6 h-6" strokeWidth={2.5} />
          <h1 className="font-bold text-2xl">Upload your files</h1>
        </div>
      </div>
    </main>
  );
}
