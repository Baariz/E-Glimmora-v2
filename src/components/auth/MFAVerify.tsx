'use client';

/**
 * MFA Verification Component
 * Used during login to verify TOTP code for MFA-enabled users
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/shared/Button/Button';
import { Input } from '@/components/shared/Input/Input';

interface MFAVerifyProps {
  redirectTo?: string;
}

export function MFAVerify({ redirectTo = '/briefing' }: MFAVerifyProps) {
  const router = useRouter();
  const { update } = useSession();
  const [verificationCode, setVerificationCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verify the TOTP code
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid code');
      }

      // If user wants to trust this device, register it
      if (trustDevice) {
        try {
          await fetch('/api/auth/devices', {
            method: 'POST',
          });
        } catch (err) {
          console.error('Failed to register device:', err);
          // Don't block login if device registration fails
        }
      }

      // Update the session to set mfaVerified flag
      await update({ mfaVerified: true });

      // Redirect to intended destination
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code, please try again');
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 mx-auto text-rose-500" />
        <h2 className="font-serif text-2xl text-charcoal-900">Verify Your Identity</h2>
        <p className="text-sm text-charcoal-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-normal"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && verificationCode.length === 6) {
              handleVerify();
            }
          }}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-red-600 text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Trust device checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="w-4 h-4 rounded border-charcoal-300 text-rose-500 focus:ring-rose-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-charcoal-600 group-hover:text-charcoal-900 transition-colors">
            Trust this device for 30 days
          </span>
        </label>
      </div>

      <Button
        onClick={handleVerify}
        disabled={verificationCode.length !== 6 || isLoading}
        className="w-full"
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
    </div>
  );
}
