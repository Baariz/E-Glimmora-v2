'use client';

/**
 * Privacy & Access Control — Sovereign Command Center
 * Deep obsidian header with concentric ring pattern (unique — like a security vault)
 * Emerald accents for trust/security, editorial sections
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, AlertTriangle } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { DiscretionTierSelector } from '@/components/b2c/privacy/DiscretionTierSelector';
import { InvisibleItineraryDefault } from '@/components/b2c/privacy/InvisibleItineraryDefault';
import { AdvisorVisibilityScope } from '@/components/b2c/privacy/AdvisorVisibilityScope';
import { InviteFlowModal } from '@/components/b2c/privacy/InviteFlowModal';
import { RemoveAccessFlow } from '@/components/b2c/privacy/RemoveAccessFlow';
import { DataVisibilityRules } from '@/components/b2c/privacy/DataVisibilityRules';
import { GlobalEraseFlow } from '@/components/b2c/privacy/GlobalEraseFlow';
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal';
import { fadeUp } from '@/styles/variants';

import type { PrivacySettings, Journey, DiscretionTier, AdvisorResourcePermissions, User } from '@/lib/types';

export default function PrivacyPage() {
  const { data: session } = useSession();
  const services = useServices();

  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean;
    role: 'Spouse' | 'LegacyHeir' | 'ElanAdvisor' | null;
  }>({
    isOpen: false,
    role: null,
  });

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    const loadData = async () => {
      try {
        const [privacySettings, userJourneys, allUsers] = await Promise.all([
          services.privacy.getSettings(userId),
          services.journey.getJourneys(userId, 'b2c'),
          services.user.getUsers(),
        ]);

        if (!privacySettings) {
          const defaultSettings = await services.privacy.updateSettings(userId, {
            discretionTier: 'Standard',
            invisibleItineraryDefault: false,
          });
          setSettings(defaultSettings);
        } else {
          setSettings(privacySettings);
        }

        setJourneys(userJourneys);

        const invited = allUsers.filter(
          (u) => u.id !== userId && u.roles.b2c && u.roles.b2c !== 'UHNI'
        );
        setInvitedUsers(invited);
      } catch (error) {
        console.error('Failed to load privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session?.user?.id, services]);

  const handleDiscretionTierChange = async (tier: DiscretionTier) => {
    if (!session?.user?.id || !settings) return;
    setSaving(true);
    try {
      const updated = await services.privacy.updateSettings(session.user.id, { discretionTier: tier });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update discretion tier:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInvisibleDefaultChange = async (value: boolean) => {
    if (!session?.user?.id || !settings) return;
    setSaving(true);
    try {
      const updated = await services.privacy.updateSettings(session.user.id, { invisibleItineraryDefault: value });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update invisible itinerary default:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdvisorPermissionsChange = async (permissions: Record<string, AdvisorResourcePermissions>) => {
    if (!session?.user?.id || !settings) return;
    setSaving(true);
    try {
      const updated = await services.privacy.updateSettings(session.user.id, { advisorResourcePermissions: permissions });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update advisor permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInviteComplete = async (invitedUserId: string) => {
    try {
      const allUsers = await services.user.getUsers();
      const invited = allUsers.filter(
        (u) => u.id !== session?.user?.id && u.roles.b2c && u.roles.b2c !== 'UHNI'
      );
      setInvitedUsers(invited);
    } catch (error) {
      console.error('Failed to reload users:', error);
    }
  };

  const handleRemoveAccess = async (userId: string) => {
    try {
      await services.user.deleteUser(userId);
      setInvitedUsers(invitedUsers.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Failed to remove user access:', error);
    }
  };

  const handleRestrictAccess = (userId: string) => {
    console.log('Restrict access for:', userId);
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#f5f4f2] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-8 h-8 border-2 border-stone-300 border-t-emerald-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-stone-400 text-[11px] font-sans tracking-wide">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div
        className="min-h-screen bg-[#f5f4f2] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <p className="text-stone-500 font-sans text-sm">Failed to load privacy settings.</p>
      </div>
    );
  }

  const advisorIds = settings.advisorVisibilityScope || [];
  const journeyOptions = journeys.map((j) => ({ id: j.id, title: j.title }));

  return (
    <div
      className="min-h-screen bg-[#f5f4f2] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ OBSIDIAN SECURITY HEADER ═══════ */}
      <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111] overflow-hidden">
        {/* Concentric ring pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
                style={{ width: `${(i + 1) * 140}px`, height: `${(i + 1) * 140}px` }}
              />
            ))}
          </div>
        </div>
        {/* Emerald glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-emerald-400/[0.02] rounded-full blur-[100px] translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Shield size={15} className="text-emerald-400/60" />
              </div>
              <p className="text-emerald-400/40 text-[10px] font-sans uppercase tracking-[5px]">
                Sovereignty Controls
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl text-white leading-[1] tracking-[-0.03em] mb-5"
          >
            Privacy & Access
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/20 font-sans text-sm max-w-lg leading-[1.8] tracking-wide"
          >
            Complete sovereignty over your data. Control who sees your journeys,
            how your information is shared, and manage access to your private world.
          </motion.p>
        </div>
      </div>

      {/* ═══════ SAVING INDICATOR ═══════ */}
      {saving && (
        <div className="sticky top-16 z-20 bg-emerald-50 border-b border-emerald-200/60">
          <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-2.5 flex items-center gap-2">
            <motion.div
              className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-emerald-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-emerald-700 text-[11px] font-sans tracking-wide">Saving changes...</p>
          </div>
        </div>
      )}

      {/* ═══════ SECTIONS ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16">

        {/* Discretion Level */}
        <ScrollReveal variant={fadeUp} delay={0}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-emerald-600/70 mb-3">
                Section I
              </p>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Discretion Level</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Choose how much visibility your institution has into your journeys and activities.
              </p>
            </div>
            <DiscretionTierSelector
              value={settings.discretionTier}
              onChange={handleDiscretionTierChange}
            />
          </section>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        {/* Journey Visibility */}
        <ScrollReveal variant={fadeUp} delay={0.05}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-emerald-600/70 mb-3">
                Section II
              </p>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Journey Visibility</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Control the default visibility of new journeys you create.
              </p>
            </div>
            <InvisibleItineraryDefault
              value={settings.invisibleItineraryDefault}
              onChange={handleInvisibleDefaultChange}
            />
          </section>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        {/* Your Circle */}
        <ScrollReveal variant={fadeUp} delay={0.1}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-emerald-600/70 mb-3">
                Section III
              </p>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Your Circle</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Invite trusted people to access your journeys and memories.
              </p>
            </div>

            {/* Invite buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { role: 'Spouse' as const, label: 'Invite Spouse' },
                { role: 'LegacyHeir' as const, label: 'Invite Heir' },
                { role: 'ElanAdvisor' as const, label: 'Invite Advisor' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => setInviteModal({ isOpen: true, role: item.role })}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-stone-900 text-white font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-800 transition-all shadow-sm"
                >
                  <UserPlus size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            <RemoveAccessFlow
              invitedUsers={invitedUsers}
              onRemoveAccess={handleRemoveAccess}
              onRestrictAccess={handleRestrictAccess}
            />
          </section>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        {/* Advisor Access */}
        <ScrollReveal variant={fadeUp} delay={0.15}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-emerald-600/70 mb-3">
                Section IV
              </p>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Advisor Access</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Grant specific advisors access to journeys, intelligence briefs, and shared memories.
              </p>
            </div>
            <AdvisorVisibilityScope
              advisorIds={advisorIds}
              advisorResourcePermissions={settings.advisorResourcePermissions || {}}
              journeys={journeyOptions}
              onChange={handleAdvisorPermissionsChange}
            />
          </section>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        {/* Data Visibility */}
        <ScrollReveal variant={fadeUp} delay={0.2}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-emerald-600/70 mb-3">
                Section V
              </p>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Data Visibility</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Understand what each role in your circle can access.
              </p>
            </div>
            <DataVisibilityRules />
          </section>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        {/* Danger Zone */}
        <ScrollReveal variant={fadeUp} delay={0.25}>
          <section className="py-14 sm:py-16">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                  <AlertTriangle size={14} className="text-rose-500" />
                </div>
                <p className="text-[10px] font-sans uppercase tracking-[4px] text-rose-500">
                  Danger Zone
                </p>
              </div>
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Global Data Erase</h2>
              <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-xl">
                Irreversible actions that permanently affect your data and account.
              </p>
            </div>
            <GlobalEraseFlow userId={session?.user?.id || ''} />
          </section>
        </ScrollReveal>
      </div>

      {/* ═══════ CLOSING FOOTER ═══════ */}
      <div className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111]">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-center">
          <div className="w-8 h-px bg-gradient-to-r from-emerald-400/40 to-emerald-500/20 mx-auto mb-6" />
          <p className="font-serif text-2xl sm:text-3xl text-white/80 leading-[1.3] tracking-[-0.01em] mb-6">
            Your privacy is your sovereign right.
          </p>
          <p className="text-white/20 font-sans text-sm leading-[1.8] tracking-wide max-w-md mx-auto">
            All changes are encrypted and take effect immediately.
            Contact your relationship manager for assistance.
          </p>
        </div>
      </div>

      {/* ═══════ INVITE MODAL ═══════ */}
      {inviteModal.role && (
        <InviteFlowModal
          isOpen={inviteModal.isOpen}
          onClose={() => setInviteModal({ isOpen: false, role: null })}
          role={inviteModal.role}
          onInviteComplete={handleInviteComplete}
        />
      )}
    </div>
  );
}
