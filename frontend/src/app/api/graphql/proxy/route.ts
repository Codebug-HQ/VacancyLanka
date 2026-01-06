import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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

  if (!WP_GRAPHQL_URL) {
    console.error('Missing NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL');
    return NextResponse.json(
      { error: 'GraphQL URL not configured' },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();
    
    // Prepare headers to mimic a real browser request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/javascript, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': WP_GRAPHQL_URL.replace('/graphql', ''),
      'Origin': WP_GRAPHQL_URL.replace('/graphql', ''),
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    };

    // Add Basic Auth if credentials are provided
    if (WP_USERNAME && WP_APP_PASSWORD) {
      const basicAuth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    console.log('🚀 Proxying GraphQL request to:', WP_GRAPHQL_URL);

    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    console.log('📥 Response status:', res.status);
    console.log('📥 Content-Type:', contentType);

    // Check for bot protection HTML
    if (
      text.includes('slowAES.decrypt') || 
      text.includes('/aes.js') ||
      text.includes('challenge') ||
      (text.includes('<html') && !contentType.includes('json'))
    ) {
      console.error('🚫 Bot protection detected');
      return NextResponse.json(
        { 
          error: 'Bot protection active',
          message: 'InfinityFree is blocking the request. Solutions: 1) Upgrade to paid hosting ($2-5/mo), 2) Try a different free host (Render, Railway), 3) Contact InfinityFree support to whitelist Vercel.',
          provider: '42web.io / InfinityFree',
          suggestion: 'This is a hosting limitation, not a code issue.'
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Try to parse as JSON
    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        console.log('✅ GraphQL request successful');
        return NextResponse.json(data, {
          status: res.status,
          headers: corsHeaders,
        });
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON response', raw: text.substring(0, 500) },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // Non-JSON response
    console.error('❌ Non-JSON response received:', text.substring(0, 300));
    return NextResponse.json(
      { 
        error: 'Unexpected response format',
        contentType,
        preview: text.substring(0, 500)
      },
      { status: 500, headers: corsHeaders }
    );

  } catch (err: any) {
    console.error('❌ Proxy error:', err.message);
    
    // Handle timeout
    if (err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout', message: 'WordPress server took too long to respond (>30s)' },
        { status: 504, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { 
        error: 'Proxy request failed', 
        message: err.message,
        type: err.name 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}