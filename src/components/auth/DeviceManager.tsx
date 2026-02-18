'use client';

/**
 * Device Manager Component
 * Displays and manages trusted devices for MFA
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/shared/Button/Button';
import { Card } from '@/components/shared/Card/Card';
import { Modal } from '@/components/shared/Modal/Modal';
import { TrustedDevice } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

export function DeviceManager() {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokeDeviceId, setRevokeDeviceId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch devices on mount
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/devices');
      if (!response.ok) throw new Error('Failed to load devices');
      const data = await response.json();
      setDevices(data.devices);
    } catch (err) {
      console.error('Error loading devices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeDevice = async () => {
    if (!revokeDeviceId) return;

    setIsRevoking(true);
    try {
      const response = await fetch(`/api/auth/devices/${revokeDeviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke device');

      // Update local state
      setDevices(devices.map(d =>
        d.id === revokeDeviceId ? { ...d, status: 'revoked' } : d
      ));
      setRevokeDeviceId(null);
    } catch (err) {
      console.error('Error revoking device:', err);
    } finally {
      setIsRevoking(false);
    }
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const activeDevices = devices.filter(d => d.status === 'active');

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-charcoal-600">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-charcoal-900">Trusted Devices</h2>
        <p className="text-sm text-charcoal-600">
          Devices you&apos;ve trusted to skip two-factor authentication
        </p>
      </div>

      {activeDevices.length === 0 ? (
        <Card className="p-12 text-center">
          <Smartphone className="w-12 h-12 mx-auto text-charcoal-300 mb-4" />
          <p className="text-sm text-charcoal-600">No trusted devices</p>
          <p className="text-xs text-charcoal-500 mt-1">
            Trust a device during login to skip MFA on that device for 30 days
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "p-4 transition-colors",
                device.status === 'revoked' && "opacity-50 bg-sand-50"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Smartphone className={cn(
                      "w-5 h-5 mt-0.5",
                      device.status === 'active' ? "text-charcoal-700" : "text-charcoal-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm",
                        device.status === 'active' ? "text-charcoal-900" : "text-charcoal-500"
                      )}>
                        {device.deviceName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-charcoal-500">
                          Last used {formatLastUsed(device.lastUsed)}
                        </p>
                        {device.status === 'revoked' && (
                          <span className="text-xs text-red-600 font-medium">
                            Revoked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {device.status === 'active' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRevokeDeviceId(device.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      <Modal
        open={!!revokeDeviceId}
        onOpenChange={(open) => !open && !isRevoking && setRevokeDeviceId(null)}
        title="Revoke Device"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-charcoal-900 font-medium mb-1">
                This device will need to re-verify with MFA next time
              </p>
              <p className="text-xs text-charcoal-600">
                You&apos;ll be asked for a verification code when signing in from this device.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setRevokeDeviceId(null)}
              disabled={isRevoking}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRevokeDevice}
              disabled={isRevoking}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isRevoking ? 'Revoking...' : 'Revoke Device'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
