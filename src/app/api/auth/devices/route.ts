/**
 * Trusted Devices API Route
 * GET /api/auth/devices - List user's trusted devices
 * POST /api/auth/devices - Register a new trusted device
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { services } from '@/lib/services';
import { registerTrustedDevice } from '@/lib/auth/device-recognition';

export async function GET(request: NextRequest) {
  try {
    // Require authenticated session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all trusted devices for this user
    const devices = await services.device.getDevicesByUserId(session.user.id);

    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { error: 'Failed to get devices' },
      { status: 500 }
    );
  }
}

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

    // Register the current device as trusted
    const deviceToken = await registerTrustedDevice(session.user.id);

    return NextResponse.json({
      success: true,
      deviceToken
    });
  } catch (error) {
    console.error('Register device error:', error);
    return NextResponse.json(
      { error: 'Failed to register device' },
      { status: 500 }
    );
  }
}
