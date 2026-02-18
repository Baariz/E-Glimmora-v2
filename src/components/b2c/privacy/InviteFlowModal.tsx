'use client';

/**
 * Invite Flow Modal Component (PRIV-04, PRIV-05, PRIV-06)
 * End-to-end invite flow for spouse/heir/advisor with role-specific messaging
 */

import { useState } from 'react';
import { B2CRole } from '@/lib/types/roles';
import { useServices } from '@/lib/hooks/useServices';
import { cn } from '@/lib/utils/cn';
import { X, Mail, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'Spouse' | 'LegacyHeir' | 'ElanAdvisor';
  onInviteComplete: (invitedUserId: string) => void;
}

const ROLE_CONFIG = {
  Spouse: {
    title: 'Invite Your Spouse',
    description: 'Grant your spouse access to journeys and memories you choose to share.',
    accessDescription: 'Your spouse will be able to view journeys and memories you explicitly share with them.',
    color: 'teal',
  },
  LegacyHeir: {
    title: 'Invite a Legacy Heir',
    description: 'Grant a trusted family member access to your legacy planning and selected journeys.',
    accessDescription: 'Your heir will be able to view journeys and memories you explicitly share, excluding locked items.',
    color: 'sand',
  },
  ElanAdvisor: {
    title: 'Invite an Elan Advisor',
    description: 'Grant an advisor access to specific journeys, intelligence briefs, and shared memories.',
    accessDescription: 'You will configure granular access controls after the invitation is accepted.',
    color: 'rose',
  },
} as const;

type InviteStatus = 'form' | 'sending' | 'success';

export function InviteFlowModal({ isOpen, onClose, role, onInviteComplete }: InviteFlowModalProps) {
  const services = useServices();
  const config = ROLE_CONFIG[role];

  const [status, setStatus] = useState<InviteStatus>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Create invite code
      const invite = await services.inviteCode.createInviteCode({
        type: 'b2c',
        createdBy: 'mock-uhni-user-id', // In real app, use actual user ID
        assignedRoles: {
          b2c: role as B2CRole,
        },
        maxUses: 1,
      });

      setInviteCode(invite.code);

      // Create mock user (in real app, user would register via invite link)
      const newUser = await services.user.createUser({
        email: formData.email,
        name: formData.name,
        roles: {
          b2c: role as B2CRole,
        },
      });

      // Simulate delay for sending email
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      onInviteComplete(newUser.id);
    } catch (error) {
      console.error('Failed to create invite:', error);
      setStatus('form');
    }
  };

  const handleClose = () => {
    setStatus('form');
    setFormData({ name: '', email: '', message: '' });
    setInviteCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/40"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <Mail className={cn('w-6 h-6', `text-${config.color}-600`)} />
              <h2 className="font-serif text-2xl text-stone-900">{config.title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {status === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-stone-600 leading-relaxed">{config.description}</p>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Enter their name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="their.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="Add a personal note to your invitation..."
                  />
                </div>

                <div className={cn('p-4 rounded-lg', `bg-${config.color}-50`)}>
                  <div className="text-sm font-medium text-stone-700 mb-1">What They&apos;ll Access</div>
                  <p className="text-sm text-stone-600">{config.accessDescription}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 border-2 border-stone-300 rounded-lg text-stone-700 font-medium hover:border-stone-400 hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-all"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}

            {status === 'sending' && (
              <div className="py-12 flex flex-col items-center">
                <Loader2 className="w-12 h-12 animate-spin text-rose-600 mb-4" />
                <p className="text-stone-600">Sending invitation...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-serif text-2xl text-center text-stone-900 mb-2">
                  Invitation Sent
                </h3>
                <p className="text-center text-stone-600 mb-6">
                  An email invitation has been sent to <strong>{formData.email}</strong>
                </p>

                <div className="bg-stone-50 rounded-lg p-4 mb-6">
                  <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">
                    Invite Code
                  </div>
                  <div className="font-mono text-lg text-stone-900">{inviteCode}</div>
                  <p className="text-xs text-stone-500 mt-2">
                    They can also use this code during registration
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
