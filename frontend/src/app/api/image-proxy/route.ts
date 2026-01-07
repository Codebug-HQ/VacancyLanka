// src/app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Only allow proxying from your WordPress domain
  const allowedDomain = 'vacaylanka.atwebpages.com';
  try {
    const url = new URL(imageUrl);
    if (url.hostname !== allowedDomain) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Force HTTP (since your backend doesn't have SSL)
    const httpUrl = imageUrl.replace('https://', 'http://');
    
    const response = await fetch(httpUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` }, 
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' }, 
      { status: 500 }
    );
  }
}