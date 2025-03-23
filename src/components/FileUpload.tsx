import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    const imageMaxSize = 10 * 1024 * 1024; // 10MB
    const videoMaxSize = 400 * 1024 * 1024; // 400MB
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/mov", "video/avi", "video/webm", "video/mkv"];

    if (file.type.startsWith("image/")) {
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > imageMaxSize) {
        setError("Image size must be less than 10MB");
        return false;
      }
    } else if (file.type.startsWith("video/")) {
      if (!validVideoTypes.includes(file.type)) {
        setError("Please upload a valid video file (MP4, MOV, AVI, WEBM, MKV)");
        return false;
      }
      if (file.size > videoMaxSize) {
        setError("Video size must be less than 400MB");
        return false;
      }
    } else {
      setError("Invalid file type. Please upload an image or video.");
      return false;
    }

    setError(null);
    return true;
  };

  // Encode "Unique Store BD" into Base64
  const encodedText = btoa("Unique Store BD");

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="file-input file-input-bordered w-full"
        useUniqueFileName={true}
        folder={fileType === "video" ? "/videos" : "/images"}
        isPrivateFile={false}
        transformation={{
          pre: `l-text,${encodedText},co_orange,fs-40,fw-700,g-center`,
          post: [
            {
              type: "transformation",
              value: "w-100",
            },
          ],
        }}
      />

      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={handleFileChange}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
