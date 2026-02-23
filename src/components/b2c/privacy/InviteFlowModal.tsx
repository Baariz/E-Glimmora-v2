'use client';

/**
 * Invite Flow Modal Component (PRIV-04, PRIV-05, PRIV-06)
 * Luxury modal — end-to-end invite flow for spouse/heir/advisor
 */

import { useState } from 'react';
import { B2CRole } from '@/lib/types/roles';
import { useServices } from '@/lib/hooks/useServices';
import { cn } from '@/lib/utils/cn';
import { X, Mail, Check, UserPlus } from 'lucide-react';
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
  },
  LegacyHeir: {
    title: 'Invite a Legacy Heir',
    description: 'Grant a trusted family member access to your legacy planning and selected journeys.',
    accessDescription: 'Your heir will be able to view journeys and memories you explicitly share, excluding locked items.',
  },
  ElanAdvisor: {
    title: 'Invite an Advisor',
    description: 'Grant an advisor access to specific journeys, intelligence briefs, and shared memories.',
    accessDescription: 'You will configure granular access controls after the invitation is accepted.',
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
      const invite = await services.inviteCode.createInviteCode({
        type: 'b2c',
        createdBy: 'mock-uhni-user-id',
        assignedRoles: { b2c: role as B2CRole },
        maxUses: 1,
      });

      setInviteCode(invite.code);

      const newUser = await services.user.createUser({
        email: formData.email,
        name: formData.name,
        roles: { b2c: role as B2CRole },
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-stone-200/60">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all"
            >
              <X size={14} />
            </button>

            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center mb-4">
              <UserPlus size={17} className="text-white" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-1.5">
              {config.title}
            </h2>
            <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">
              {config.description}
            </p>
          </div>

          {/* Content */}
          <div className="px-7 py-6">
            {status === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 placeholder:text-stone-300"
                    placeholder="Enter their name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 placeholder:text-stone-300"
                    placeholder="their.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                    Personal Message <span className="normal-case tracking-normal text-[11px]">(optional)</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 resize-none placeholder:text-stone-300"
                    placeholder="Add a personal note..."
                  />
                </div>

                <div className="px-4 py-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl">
                  <p className="text-[10px] font-sans uppercase tracking-[3px] text-emerald-600 mb-1">
                    What they&apos;ll access
                  </p>
                  <p className="text-sm font-sans text-stone-600 leading-[1.6]">
                    {config.accessDescription}
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3.5 bg-stone-100 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-stone-900 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-stone-800 transition-all shadow-sm"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}

            {status === 'sending' && (
              <div className="py-14 flex flex-col items-center">
                <motion.div
                  className="w-10 h-10 border-2 border-stone-300 border-t-stone-900 rounded-full mb-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-stone-500 font-sans text-sm tracking-wide">Sending invitation...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 bg-emerald-50 border border-emerald-200/60 rounded-full flex items-center justify-center">
                  <Check size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2">Invitation Sent</h3>
                <p className="text-stone-400 text-sm font-sans tracking-wide mb-6">
                  An email has been sent to <span className="text-stone-600 font-medium">{formData.email}</span>
                </p>

                <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-4 mb-7 text-left">
                  <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-1.5">
                    Invite Code
                  </p>
                  <p className="font-mono text-lg text-stone-900">{inviteCode}</p>
                  <p className="text-[11px] text-stone-400 mt-1.5 tracking-wide">
                    They can also use this code during registration
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 bg-stone-900 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-stone-800 transition-all shadow-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
