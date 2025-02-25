"use client"

import VideoFeed from '@/components/VideoFeed'


import { apiClient } from '@/lib/api-client'
import { IVideo } from '@/models/Video'

import React, { useEffect, useState } from 'react'

const Home = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();

        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
  

    <h1 className="text-3xl font-bold mb-8">Flparvez ReelsPro</h1>
    <VideoFeed videos={videos} />
  </main>
  )
}

export default Home
