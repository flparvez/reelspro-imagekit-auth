import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const authenticationParameters = await imagekit.getAuthenticationParameters()
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate with ImageKit"+ error },
      { status: 500 }
    )
  }

}