import { FileUpload } from "@/components/file-upload";
import { AuthButton } from "@/components/auth-button";

export default function Home() {
  return (
    <main className="p-8 space-y-4 flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">AI Media Processing Pipeline</h1>
        <div className="mb-8">
          <AuthButton />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUpload />
        </div>
      </div>
    </main>
  );
}
