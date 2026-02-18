/**
 * MFA Verification API Route
 * POST /api/auth/mfa/verify
 * Verifies a TOTP code and enables MFA for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { verifyMFAToken } from '@/lib/auth/mfa';
import { services } from '@/lib/services';

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

    // Get user from service to retrieve mfaSecret
    const user = await services.user.getUserById(session.user.id);
    if (!user || !user.mfaSecret) {
      return NextResponse.json(
        { error: 'MFA not set up for this user' },
        { status: 400 }
      );
    }

    // Verify the TOTP code
    const isValid = verifyMFAToken(user.mfaSecret, code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Enable MFA for the user
    await services.user.updateUser(session.user.id, {
      mfaEnabled: true,
    });

    // TODO: Log audit event
    // await services.audit.logEvent({
    //   event: 'mfa.enabled',
    //   userId: session.user.id,
    //   resourceType: 'user',
    //   resourceId: session.user.id,
    //   action: 'UPDATE',
    //   context: 'b2c',
    //   timestamp: new Date().toISOString(),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
