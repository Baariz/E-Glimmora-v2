'use client';

/**
 * Privacy & Access Control Page
 * Complete privacy sovereignty interface for UHNI
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useServices } from '@/lib/hooks/useServices';
import { PrivacySettings, Journey, DiscretionTier, AdvisorResourcePermissions, User } from '@/lib/types';
import { DiscretionTierSelector } from '@/components/b2c/privacy/DiscretionTierSelector';
import { InvisibleItineraryDefault } from '@/components/b2c/privacy/InvisibleItineraryDefault';
import { AdvisorVisibilityScope } from '@/components/b2c/privacy/AdvisorVisibilityScope';
import { InviteFlowModal } from '@/components/b2c/privacy/InviteFlowModal';
import { RemoveAccessFlow } from '@/components/b2c/privacy/RemoveAccessFlow';
import { DataVisibilityRules } from '@/components/b2c/privacy/DataVisibilityRules';
import { GlobalEraseFlow } from '@/components/b2c/privacy/GlobalEraseFlow';
import { Loader2, Shield, UserPlus, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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

        // Create default settings if none exist
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

        // Filter to only show invited users (those with B2C roles and not UHNI)
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
      const updated = await services.privacy.updateSettings(session.user.id, {
        discretionTier: tier,
      });
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
      const updated = await services.privacy.updateSettings(session.user.id, {
        invisibleItineraryDefault: value,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update invisible itinerary default:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdvisorPermissionsChange = async (
    permissions: Record<string, AdvisorResourcePermissions>
  ) => {
    if (!session?.user?.id || !settings) return;

    setSaving(true);
    try {
      const updated = await services.privacy.updateSettings(session.user.id, {
        advisorResourcePermissions: permissions,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update advisor permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInviteComplete = async (invitedUserId: string) => {
    // Reload users list
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
    // Navigate to advisor visibility section (in real app)
    console.log('Restrict access for:', userId);
    // Could scroll to advisor section or open a modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-600">Failed to load privacy settings.</p>
      </div>
    );
  }

  const advisorIds = settings.advisorVisibilityScope || [];
  const journeyOptions = journeys.map(j => ({ id: j.id, title: j.title }));

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-rose-600" />
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900">
              Privacy & Access Control
            </h1>
          </div>
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
            You have complete sovereignty over your data. These settings determine who can see your
            journeys, what level of detail they can access, and how your information is shared.
          </p>
        </motion.div>

        {/* Saving Indicator */}
        {saving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2 text-sm text-stone-600"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving changes...
          </motion.div>
        )}

        {/* Discretion Level Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Discretion Level</h2>
            <p className="text-stone-600 leading-relaxed">
              Choose how much visibility your institution has into your journeys and activities.
            </p>
          </div>
          <DiscretionTierSelector
            value={settings.discretionTier}
            onChange={handleDiscretionTierChange}
          />
        </motion.section>

        {/* Journey Visibility Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Journey Visibility</h2>
            <p className="text-stone-600 leading-relaxed">
              Control the default visibility of new journeys you create.
            </p>
          </div>
          <InvisibleItineraryDefault
            value={settings.invisibleItineraryDefault}
            onChange={handleInvisibleDefaultChange}
          />
        </motion.section>

        {/* Your Circle Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-stone-700" />
              <h2 className="font-serif text-2xl text-stone-900">Your Circle</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Invite trusted people to access your journeys and memories.
            </p>
          </div>

          {/* Invite Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setInviteModal({ isOpen: true, role: 'Spouse' })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Invite Spouse
            </button>
            <button
              onClick={() => setInviteModal({ isOpen: true, role: 'LegacyHeir' })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-sand-600 text-white font-medium rounded-lg hover:bg-sand-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Invite Heir
            </button>
            <button
              onClick={() => setInviteModal({ isOpen: true, role: 'ElanAdvisor' })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Invite Advisor
            </button>
          </div>

          {/* Invited People List */}
          <RemoveAccessFlow
            invitedUsers={invitedUsers}
            onRemoveAccess={handleRemoveAccess}
            onRestrictAccess={handleRestrictAccess}
          />
        </motion.section>

        {/* Advisor Access Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Advisor Access</h2>
            <p className="text-stone-600 leading-relaxed">
              Grant specific advisors access to journeys, intelligence briefs, and shared memories.
            </p>
          </div>
          <AdvisorVisibilityScope
            advisorIds={advisorIds}
            advisorResourcePermissions={settings.advisorResourcePermissions || {}}
            journeys={journeyOptions}
            onChange={handleAdvisorPermissionsChange}
          />
        </motion.section>

        {/* Data Visibility Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Data Visibility</h2>
            <p className="text-stone-600 leading-relaxed">
              Understand what each role in your circle can access.
            </p>
          </div>
          <DataVisibilityRules />
        </motion.section>

        {/* Danger Zone Section - UHNI only */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <h2 className="font-serif text-2xl text-rose-900">Danger Zone</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Irreversible actions that permanently affect your data and account.
            </p>
          </div>
          <GlobalEraseFlow userId={session?.user?.id || ''} />
        </motion.section>
      </div>

      {/* Invite Modal */}
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
