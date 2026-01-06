// src/app/api/graphql/proxy/route.ts
import { NextResponse } from 'next/server';

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // Configure this based on your needs
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

// Handle preflight requests
export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;
  const WP_USERNAME = process.env.WP_APP_USERNAME;       // NO NEXT_PUBLIC_ !
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;   // NO NEXT_PUBLIC_ !

  console.log('Proxy called - Env check:', {
    url: WP_GRAPHQL_URL ? 'present' : 'MISSING',
    username: WP_USERNAME ? 'present' : 'MISSING',
    password: WP_APP_PASSWORD ? 'present (length: ' + WP_APP_PASSWORD?.length + ')' : 'MISSING',
  });

  if (!WP_GRAPHQL_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    console.error('Missing env vars - cannot proxy');
    return NextResponse.json(
      { error: 'Server configuration error' }, 
      { status: 500, headers: corsHeaders() }
    );
  }

  try {
    const body = await req.json();

    const basicAuth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, { 
        status: res.status,
        headers: corsHeaders()
      });
    } else {
      // Likely an error page (HTML) or other non-JSON response
      const text = await res.text();
      console.error('Proxy received non-JSON response:', text);
      return NextResponse.json(
        { error: 'Proxy failed', details: text }, 
        { status: 500, headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.error('Proxy fetch error:', err.message);
    return NextResponse.json(
      { error: 'Proxy failed' }, 
      { status: 500, headers: corsHeaders() }
    );
  }
}