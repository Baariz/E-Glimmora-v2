'use client';

/**
 * MFA Setup Component
 * Three-step flow: Setup (generate secret), Verify (enter TOTP code), Complete
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Shield } from 'lucide-react';
import { Button } from '@/components/shared/Button/Button';
import { Input } from '@/components/shared/Input/Input';
import { cn } from '@/lib/utils/cn';

type Step = 'setup' | 'verify' | 'complete';

interface MFASetupProps {
  onComplete?: () => void;
}

export function MFASetup({ onComplete }: MFASetupProps) {
  const [step, setStep] = useState<Step>('setup');
  const [otpauthUri, setOtpauthUri] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate MFA secret on mount
  useEffect(() => {
    const setupMFA = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/mfa/setup', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to setup MFA');
        }

        const data = await response.json();
        setOtpauthUri(data.otpauthUri);
      } catch (err) {
        setError('Failed to initialize MFA setup. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (step === 'setup') {
      setupMFA();
    }
  }, [step]);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(otpauthUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid code');
      }

      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code, please try again');
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Step indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {(['setup', 'verify', 'complete'] as const).map((s, idx) => (
          <div
            key={s}
            className={cn(
              'h-1.5 w-12 rounded-full transition-colors',
              step === s ? 'bg-rose-500' : idx < ['setup', 'verify', 'complete'].indexOf(step) ? 'bg-rose-500/30' : 'bg-sand-200'
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Setup Step */}
        {step === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <Shield className="w-12 h-12 mx-auto text-rose-500" />
              <h2 className="font-serif text-2xl text-charcoal-900">Set Up Authenticator</h2>
              <p className="text-sm text-charcoal-600">
                Add this account to your authenticator app
              </p>
            </div>

            {isLoading ? (
              <div className="bg-sand-50 rounded-lg p-8 text-center">
                <p className="text-sm text-charcoal-600">Generating secret...</p>
              </div>
            ) : otpauthUri ? (
              <div className="space-y-4">
                <div className="bg-sand-50 rounded-lg p-4 border border-sand-200">
                  <label className="block text-xs font-medium text-charcoal-600 mb-2">
                    Manual Entry URI
                  </label>
                  <div className="relative">
                    <code className="block font-mono text-xs bg-white p-3 rounded border border-sand-200 break-all text-charcoal-800">
                      {otpauthUri}
                    </code>
                    <button
                      onClick={handleCopyUri}
                      className="absolute top-2 right-2 p-1.5 hover:bg-sand-100 rounded transition-colors"
                      title="Copy URI"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-charcoal-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-charcoal-600 space-y-1">
                  <p>1. Open your authenticator app (Google Authenticator, Authy, etc.)</p>
                  <p>2. Select &ldquo;Add account&rdquo; or &ldquo;Scan QR code&rdquo;</p>
                  <p>3. Choose &ldquo;Enter a setup key&rdquo; or &ldquo;Manual entry&rdquo;</p>
                  <p>4. Paste the URI above</p>
                </div>
              </div>
            ) : null}

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              onClick={() => setStep('verify')}
              disabled={!otpauthUri || isLoading}
              className="w-full"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Verify Step */}
        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl text-charcoal-900">Verify Code</h2>
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
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep('setup')}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-charcoal-900">All Set</h2>
              <p className="text-sm text-charcoal-600">
                Two-factor authentication is now active on your account
              </p>
            </div>

            <Button
              onClick={onComplete}
              className="w-full"
            >
              Continue to Elan Glimmora
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
