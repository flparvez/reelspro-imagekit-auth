"use client"
import VideoListTable from '@/components/VideoListAdmin';

import { useSession } from 'next-auth/react';


const ProfilePage = () => {

    const { data: session } = useSession();


  return (
    <div>
      <h2>My Profile</h2>
      <h1>Wlcome {session?.user?.name}</h1>
<VideoListTable />
    </div>
  )
}

export default ProfilePage
