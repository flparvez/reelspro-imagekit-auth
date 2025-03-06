import { IKVideo } from "imagekitio-next";
import mongoose from "mongoose";
import Link from "next/link";

export interface IVideo {

  _id: mongoose.Types.ObjectId;
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
    video: mongoose.Types.ObjectId[];
  }
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
        <IKVideo
  path={video.videoUrl}
  transformation={[
    {
      height: "1920",
      width: "1080",
    },
    {
      overlayText: "Unique Store BD", // ✅ Watermark text
      overlayTextFontSize: "50", // ✅ Font size (adjust as needed)
      overlayTextFontFamily: "Arial", // ✅ Font style
      overlayTextColor: "FFFFFF", // ✅ White text color
      overlayTextTransparency: "30", // ✅ 0-100 (Lower = more visible)
      overlayTextBackground: "000000", // ✅ Black background (optional)
      overlayTextPadding: "20", // ✅ Padding around the text
      overlayTextPosition: "bottom_right", // ✅ Position: center, top_left, etc.
    },
  ]}
  controls={video.controls}
  className="w-full h-full object-cover"
/>

          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
          <h2 className="card-title text-lg">Author : {video?.user.name}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}