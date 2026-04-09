/**
 * POST /api/invite/validate
 * Validates invite code against real backend API
 */

import { NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Validate request body
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Call real backend validation endpoint (public, no auth needed)
    const response = await fetch(
      `${API_BASE_URL}/api/invites/validate?code=${encodeURIComponent(code)}`,
      { method: 'GET', headers: { 'Accept': 'application/json' } }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.valid) {
      return NextResponse.json(
        { valid: false, error: result.data?.message || result.error?.message || 'Invalid invite code' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { valid: true, type: result.data.type },
      { status: 200 }
    );
  } catch (error) {
    console.error('Invite validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
