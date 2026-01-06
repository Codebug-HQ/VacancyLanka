// src/app/api/graphql/proxy/route.ts
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 204, 
    headers: corsHeaders 
  });
}

export async function POST(req: Request) {
  const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
  const WP_USERNAME = process.env.WP_APP_USERNAME;
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

  console.log('Proxy called - Env check:', {
    url: WP_GRAPHQL_URL ? 'present' : 'MISSING',
    username: WP_USERNAME ? 'present' : 'MISSING',
    password: WP_APP_PASSWORD ? `present (length: ${WP_APP_PASSWORD?.length})` : 'MISSING',
  });

  if (!WP_GRAPHQL_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    console.error('Missing env vars - cannot proxy');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    const basicAuth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

    console.log('Fetching from WordPress:', WP_GRAPHQL_URL);

    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        // Add cookie header to bypass bot protection if you have the cookie
        // 'Cookie': '__test=your-cookie-value-here',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('WordPress response status:', res.status);
    console.log('WordPress response headers:', Object.fromEntries(res.headers.entries()));

    const contentType = res.headers.get('content-type');
    const text = await res.text();

    // Check if response is the bot protection HTML
    if (text.includes('slowAES.decrypt') || text.includes('/aes.js')) {
      console.error('Bot protection detected! Response:', text.substring(0, 500));
      return NextResponse.json(
        { 
          error: 'WordPress hosting bot protection detected',
          message: 'Your WordPress host (42web.io) is blocking automated requests. You may need to: 1) Upgrade hosting, 2) Whitelist your Vercel IPs, or 3) Contact 42web.io support.',
          details: 'The server returned a JavaScript challenge instead of GraphQL data.'
        },
        { status: 503, headers: corsHeaders }
      );
    }

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(text);
      return NextResponse.json(data, {
        status: res.status,
        headers: corsHeaders,
      });
    } else {
      console.error('Non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { error: 'Invalid response from WordPress', details: text.substring(0, 1000) },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err: any) {
    console.error('Proxy fetch error:', err);
    return NextResponse.json(
      { error: 'Proxy failed', message: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}