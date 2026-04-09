/**
 * MFA Setup API Route
 * POST /api/auth/mfa/setup
 * Proxies to real backend API for MFA secret generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Require authenticated session
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    const response = await fetch(`${API_BASE_URL}/api/auth/mfa/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to setup MFA' },
        { status: response.status }
      );
    }

    // Return the otpauth URI for QR code generation
    return NextResponse.json({ otpauthUri: result.data.uri });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}
