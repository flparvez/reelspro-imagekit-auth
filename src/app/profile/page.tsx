"use client"
import VideoListTable from '@/components/VideoListAdmin';

import { useSession } from 'next-auth/react';


const ProfilePage = () => {

    const { data: session } = useSession();


  // const handleDelete = async (videoId: string) => {
  //   try {
  //     const response = await apiClient.deleteVideo(videoId);
  //     console.log(response.message); // Success message
  //   } catch (error) {
  //     console.error("Failed to delete video:", error);
  //   }
  // };
  return (
    <div>
      <h2>My Profile</h2>
      <h1>Wlcome {session?.user?.name}</h1>
<VideoListTable />
    </div>
  )
}

export default ProfilePage
