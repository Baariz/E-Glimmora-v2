/**
 * Single Device API Route
 * DELETE /api/auth/devices/[id] - Revoke a trusted device
 * Proxies to real backend API
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: deviceId } = await params;

    // Call real backend
    const response = await fetch(`${API_BASE_URL}/api/auth/devices/${deviceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || 'Device not found or unauthorized' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revoke device error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke device' },
      { status: 500 }
    );
  }
}
