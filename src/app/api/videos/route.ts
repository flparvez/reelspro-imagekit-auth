import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDb();

        const videos =await Video.find({}).sort({createdAt: -1}).lean();
        if (!videos ||  videos.length === 0) {
            return NextResponse.json(
                {error : "No videos found"}, {status: 404}
        )  
        }
        return NextResponse.json({videos})
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