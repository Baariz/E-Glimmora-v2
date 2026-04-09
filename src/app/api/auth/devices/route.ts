/**
 * Trusted Devices API Route
 * GET /api/auth/devices - List user's trusted devices
 * POST /api/auth/devices - Register a new trusted device
 * Proxies to real backend API
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateDeviceToken, getDeviceName } from '@/lib/auth/device-recognition';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

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

    const apiToken = (session as any).apiToken;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'No API token in session' },
        { status: 401 }
      );
    }

    // Call real backend
    const response = await fetch(
      `${API_BASE_URL}/api/auth/devices?userId=${encodeURIComponent(session.user.id)}`,
      {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to get devices' },
        { status: response.status }
      );
    }

    // Map backend snake_case to frontend camelCase
    const devices = (result.data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      deviceToken: d.device_token,
      deviceName: d.device_name,
      lastUsed: d.last_used,
      status: d.status,
      createdAt: d.created_at,
    }));

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

    const apiToken = (session as any).apiToken;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'No API token in session' },
        { status: 401 }
      );
    }

    const deviceToken = generateDeviceToken();
    const deviceName = getDeviceName();

    // Call real backend
    const response = await fetch(`${API_BASE_URL}/api/auth/devices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: session.user.id,
        device_token: deviceToken,
        device_name: deviceName,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Failed to register device' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      deviceToken,
    });
  } catch (error) {
    console.error('Register device error:', error);
    return NextResponse.json(
      { error: 'Failed to register device' },
      { status: 500 }
    );
  }
}
