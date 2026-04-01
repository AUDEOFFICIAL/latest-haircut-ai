import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // We add the keys here on the server where they are safe and CORS doesn't exist
    formData.append('api_key', process.env.NEXT_PUBLIC_FACEPP_KEY!);
    formData.append('api_secret', process.env.NEXT_PUBLIC_FACEPP_SECRET!);
    formData.append('return_attributes', 'face_shape');

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}