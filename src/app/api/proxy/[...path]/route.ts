/**
 * API Proxy Route
 * Forwards client-side requests to the real backend to avoid CORS issues.
 * /api/proxy/intent/123 → https://backend/api/intent/123
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const backendPath = `/api/${path.join('/')}`;

  // Get API token from session
  const session = await auth();
  const apiToken = (session as any)?.apiToken;

  // Build query string
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';

  const url = `${BACKEND_URL}${backendPath}${queryString}`;

  // Forward headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  // Only set Content-Type for non-GET requests with body
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  if (hasBody) {
    try {
      fetchOptions.body = await request.text();
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROXY_ERROR', message: 'Failed to reach backend', status: 502 } },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
