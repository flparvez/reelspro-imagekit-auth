import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){

    try {
         const {name,email, password} = await request.json();
         if (!email || !password ) {
            return NextResponse.json(
                {error : "Email and Password is required"}, {status: 400}
            )
         }

         await connectToDb();

          const existingUser =  await User.findOne({email})

          if (existingUser) {
            return NextResponse.json(
                {error : "User already exists"}, {status: 400}
            )
         }

          await User.create({
            name,
            email,
             password
        })

         return NextResponse.json(
            {message : "User Registered Succesfully"},
            { status: 201}
         );
    } catch (error) {
        return NextResponse.json(
            {error : "Failed to register user"+error}, {status: 500}
        )
    }
}

export async function GET(){
    connectToDb()

    const user = await User.find();
    return NextResponse.json({user})
}