/**
 * MFA Setup API Route
 * POST /api/auth/mfa/setup
 * Generates a new MFA secret for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateMFASecret } from '@/lib/auth/mfa';
import { services } from '@/lib/services';

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

    // Generate MFA secret
    const { secret, uri } = generateMFASecret(session.user.email);

    // Store secret on user (mfaEnabled will be false until verified)
    await services.user.updateUser(session.user.id, {
      mfaSecret: secret,
      mfaEnabled: false,
    });

    // Return only the otpauth URI (never return the secret to client)
    return NextResponse.json({ otpauthUri: uri });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}
