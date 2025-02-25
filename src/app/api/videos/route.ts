import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import ImageKit from "imagekit";
import mongoose from "mongoose"; // Add this import
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



// ✅ Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
});

export async function GET(){
    try {
        await connectToDb();

        const videos =await Video.find({}).sort({createdAt: -1}).lean().populate("user");
        if (!videos ||  videos.length === 0) {
            return NextResponse.json(
                {error : "No videos found"}, {status: 404}
        )  
        }
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {error : "Failed to fetch videos"+ error}, {status: 500}
        )
    }
}


export async function POST(request: NextRequest){
    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            NextResponse.json(
                {error : "Unauthorized"}, {status: 401}
            )
        }
        
        await connectToDb();

        const body:IVideo = await request.json();
        if (
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ) {
            return NextResponse.json(
                {error : "All fields are required"}, {status: 400}
            )
        }

        const videoData = {
            ...body,
            user: session?.user.id,
            controls: body.controls ?? true,

            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100,
              },
     
            
        }
  
        const newVideo = await Video.create(videoData);
        if (!newVideo) {
            return NextResponse.json(
                {error : "Failed to create video"}, {status: 500}
            )
        }
  return NextResponse.json({newVideo})
    } catch (error) {
        return NextResponse.json(
            {error : "Failed to create video"+ error}, {status: 500}
        )               
    }
}





export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDb();

        // Extract video ID from the request URL
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get("id");

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
            return NextResponse.json({ error: "Invalid or missing video ID" }, { status: 400 });
        }

        // Find video from database
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // ✅ Extract ImageKit file ID from video URL
        const fileId = video.imageKitFileId; // Make sure your schema has this field

        // ✅ Delete video from ImageKit
        if (fileId) {
            await imagekit.deleteFile(fileId);
        }

        // ✅ Delete video from database
        await Video.findByIdAndDelete(videoId);

        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete video: " + error },
            { status: 500 }
        );
    }
}
