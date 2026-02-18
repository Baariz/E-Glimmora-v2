/**
 * Single Device API Route
 * DELETE /api/auth/devices/[id] - Revoke a trusted device
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { services } from '@/lib/services';

export async function DELETE(
  request: NextRequest,
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

    const { id: deviceId } = await params;

    // Get all devices for this user to verify ownership
    const devices = await services.device.getDevicesByUserId(session.user.id);
    const device = devices.find((d) => d.id === deviceId);

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found or unauthorized' },
        { status: 404 }
      );
    }

    // Revoke the device
    await services.device.revokeDevice(deviceId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revoke device error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke device' },
      { status: 500 }
    );
  }
}
