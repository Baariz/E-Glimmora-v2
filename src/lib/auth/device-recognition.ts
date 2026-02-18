/**
 * Device recognition and trusted device management
 * Allows users to skip MFA on recognized trusted devices
 */

import { services } from '@/lib/services';

/**
 * Generate a unique device token
 * Uses crypto.randomUUID for secure random tokens
 */
export function generateDeviceToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
  }
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Get a human-readable device name from user agent
 * Simple UA parsing to identify browser and OS
 */
export function getDeviceName(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';

  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  // Detect browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  // Detect OS
  if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';

  return `${browser} on ${os}`;
}

/**
 * Register a new trusted device for the current user
 * Stores the device token in localStorage for client-side reference
 *
 * NOTE: In production, device tokens should be httpOnly cookies
 * For mock-first development, we use localStorage
 */
export async function registerTrustedDevice(userId: string): Promise<string> {
  const deviceToken = generateDeviceToken();
  const deviceName = getDeviceName();

  await services.device.createDevice({
    userId,
    deviceToken,
    deviceName,
    lastUsed: new Date().toISOString(),
    status: 'active',
  });

  // Store device token in localStorage for client-side reference
  if (typeof window !== 'undefined') {
    localStorage.setItem('elan:device_token', deviceToken);
  }

  return deviceToken;
}

/**
 * Check if the current device is a trusted device for the given user
 * Returns true if the device token exists and is active
 */
export async function isTrustedDevice(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const deviceToken = localStorage.getItem('elan:device_token');
  if (!deviceToken) return false;

  const device = await services.device.getDeviceByToken(deviceToken);
  return device?.userId === userId && device?.status === 'active';
}
