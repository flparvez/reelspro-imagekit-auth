"use client";
import { IKImage } from "imagekitio-next";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import { IVideo } from "@/models/Video";
import { useSession } from "next-auth/react";

// Define IUser interface matching NextAuth's session user
interface IUser {
  id: string; // Change to string for NextAuth compatibility
  name: string;
  email: string;
  role: string;
  videos: string[]; // Store video IDs as strings
}

const urlEndpoint: string = process.env.NEXT_PUBLIC_URL_ENDPOINT || "";

export default function VideoListTable() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  
  // Ensure user is properly typed
  const user: IUser | null = session?.user ? (session.user as IUser) : null;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data: IVideo[] = await apiClient.getVideos();
      setVideos(data);
    } catch (error) {
      toast.error("Failed to fetch videos: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  // Ensure user is defined before filtering videos
  const filteredVideos = user
    ? videos.filter((video: IVideo) => video.user._id?.toString() === user.id)
    : [];

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await apiClient.deleteVideo(id);
      toast.success("Video deleted successfully");

      // Filter the videos using `toString()` to handle ObjectId correctly
      setVideos((prev: IVideo[]) =>
        prev.filter((video: IVideo) => video._id?.toString() !== id)
      );
    } catch (error) {
      toast.error("Failed to delete video: " + String(error));
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-xl font-bold mb-4">📹 Video List</h2>
      <table className="table w-full border border-base-300">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4">Loading videos...</td>
            </tr>
          ) : filteredVideos.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">No videos found</td>
            </tr>
          ) : (
            filteredVideos.map((video: IVideo, index: number) => (
              <tr key={video._id?.toString() || index} className="hover">
                <td>{index + 1}</td>
                <td>
                  <IKImage
                    urlEndpoint={urlEndpoint}
                    path={video.thumbnailUrl || "default-image.jpg"}
                    width={400}
                    height={400}
                    alt={video.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="font-semibold">{video.title}</td>
                <td>
                  <button
                    onClick={() => handleDelete(video._id?.toString() || "")}
                    className="btn text-primary btn-error btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
