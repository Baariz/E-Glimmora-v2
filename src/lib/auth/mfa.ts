/**
 * Multi-Factor Authentication (MFA) utilities
 * TOTP-based two-factor authentication using otpauth library
 */

import * as OTPAuth from 'otpauth';

/**
 * Generate a new MFA secret for a user
 * Returns both the base32 secret and the otpauth:// URI for QR code generation
 */
export function generateMFASecret(userEmail: string): { secret: string; uri: string } {
  const secret = new OTPAuth.Secret();
  const totp = new OTPAuth.TOTP({
    issuer: 'Elan Glimmora',
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  return {
    secret: secret.base32,
    uri: totp.toString(), // otpauth:// URI for QR code or manual entry
  };
}

/**
 * Verify a TOTP token against a secret
 * Returns true if the token is valid (allowing for 30-second clock drift)
 */
export function verifyMFAToken(secret: string, token: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    // Window of 1 allows 30-second clock drift tolerance (one period before/after)
    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  } catch (error) {
    console.error('MFA verification error:', error);
    return false;
  }
}
