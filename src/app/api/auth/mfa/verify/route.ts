/**
 * MFA Verification API Route
 * POST /api/auth/mfa/verify
 * Proxies to real backend API for TOTP code verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Require authenticated session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Verification code required' },
        { status: 400 }
      );
    }

    const apiToken = (session as any).apiToken;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'No API token in session' },
        { status: 401 }
      );
    }

    // Call real backend
    const response = await fetch(`${API_BASE_URL}/api/auth/mfa/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: code }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.detail?.error?.message || result.error?.message || 'Invalid verification code';
      return NextResponse.json(
        { error: errorMsg },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
