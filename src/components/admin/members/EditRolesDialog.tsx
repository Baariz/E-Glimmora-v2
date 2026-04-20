'use client';

/**
 * Edit Roles Dialog (§5.4 User Role Management)
 *
 * Opens per-member and lets SuperAdmin (and InstitutionalAdmin for staff roles)
 * replace the user's roles across the b2c / b2b / admin domains.
 *
 * Calls PATCH /api/users/:id/roles via `services.user.updateUserRoles()`.
 * Per spec: InstitutionalAdmin cannot assign SuperAdmin or InstitutionalAdmin.
 */

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useServices } from '@/lib/hooks/useServices';
import { useAuth } from '@/lib/hooks/useAuth';
import { B2CRole, B2BRole, AdminRole, type User, type UserRoles } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

interface EditRolesDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSaved: () => void;
}

const B2C_OPTIONS: (B2CRole | '')[] = [
  '',
  B2CRole.UHNI,
  B2CRole.Spouse,
  B2CRole.LegacyHeir,
  B2CRole.ElanAdvisor,
];

const B2B_OPTIONS: (B2BRole | '')[] = [
  '',
  B2BRole.RelationshipManager,
  B2BRole.PrivateBanker,
  B2BRole.FamilyOfficeDirector,
  B2BRole.ComplianceOfficer,
  B2BRole.InstitutionalAdmin,
];

const ADMIN_OPTIONS: (AdminRole | '')[] = ['', AdminRole.SuperAdmin];

/** Roles that InstitutionalAdmin is not allowed to assign per §5.4. */
const INST_ADMIN_FORBIDDEN = new Set<string>([
  AdminRole.SuperAdmin,
  B2BRole.InstitutionalAdmin,
]);

export function EditRolesDialog({ open, user, onClose, onSaved }: EditRolesDialogProps) {
  const services = useServices();
  const { user: actingUser } = useAuth();
  const [b2c, setB2c] = useState<B2CRole | ''>('');
  const [b2b, setB2b] = useState<B2BRole | ''>('');
  const [admin, setAdmin] = useState<AdminRole | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // True if the acting user is a SuperAdmin; otherwise treat as InstAdmin restrictions.
  const actorIsSuperAdmin = actingUser?.roles?.admin === AdminRole.SuperAdmin;

  useEffect(() => {
    if (open) {
      setB2c((user.roles?.b2c as B2CRole) || '');
      setB2b((user.roles?.b2b as B2BRole) || '');
      setAdmin((user.roles?.admin as AdminRole) || '');
      setErr(null);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, user]);

  const restrictedSelection = useMemo(() => {
    if (actorIsSuperAdmin) return null;
    if (admin && INST_ADMIN_FORBIDDEN.has(admin)) {
      return 'Only SuperAdmin can assign the SuperAdmin role.';
    }
    if (b2b && INST_ADMIN_FORBIDDEN.has(b2b)) {
      return 'Only SuperAdmin can assign the InstitutionalAdmin role.';
    }
    return null;
  }, [actorIsSuperAdmin, admin, b2b]);

  const handleSave = async () => {
    if (restrictedSelection) {
      setErr(restrictedSelection);
      return;
    }
    const next: Partial<UserRoles> = {};
    if (b2c) next.b2c = b2c;
    if (b2b) next.b2b = b2b;
    if (admin) next.admin = admin;

    if (Object.keys(next).length === 0) {
      setErr('At least one role must be assigned.');
      return;
    }

    setSubmitting(true);
    setErr(null);
    logger.action('Admin/Members', 'edit roles', {
      userId: user.id,
      domains: Object.keys(next),
    });

    try {
      await services.user.updateUserRoles(user.id, next);
      toast.success(`${user.name || user.email}: roles updated`);
      onSaved();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update roles';
      logger.error('Admin/Members', 'updateUserRoles failed', e, { userId: user.id });
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-sand-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-rose-700" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-rose-900">Edit Roles</h2>
                <p className="text-xs font-sans text-sand-500 mt-0.5">
                  {user.name || user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-sand-400 hover:text-sand-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-xs font-sans text-sand-600 leading-relaxed">
              Assign at most one role per domain. Leave a domain blank to remove that
              role. Existing roles are replaced.
            </p>

            <RoleSelect
              label="Client (B2C)"
              value={b2c}
              onChange={(v) => setB2c(v as B2CRole | '')}
              options={B2C_OPTIONS}
            />

            <RoleSelect
              label="Institutional (B2B)"
              value={b2b}
              onChange={(v) => setB2b(v as B2BRole | '')}
              options={B2B_OPTIONS}
              disabledValues={actorIsSuperAdmin ? [] : [B2BRole.InstitutionalAdmin]}
            />

            <RoleSelect
              label="Platform"
              value={admin}
              onChange={(v) => setAdmin(v as AdminRole | '')}
              options={ADMIN_OPTIONS}
              disabledValues={actorIsSuperAdmin ? [] : [AdminRole.SuperAdmin]}
            />

            {err && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {err}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-6 border-t border-sand-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Roles
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Internal ──────────────────────────────────────────────────────────

interface RoleSelectProps<T extends string> {
  label: string;
  value: T | '';
  options: readonly (T | '')[];
  onChange: (v: T | '') => void;
  disabledValues?: readonly T[];
}

function RoleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabledValues = [],
}: RoleSelectProps<T>) {
  return (
    <div>
      <label className="block text-[11px] font-sans uppercase tracking-[2px] text-sand-500 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | '')}
        className="w-full px-3 py-2 text-sm font-sans bg-white border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
      >
        {options.map((opt) => (
          <option
            key={opt || '__none'}
            value={opt}
            disabled={opt !== '' && disabledValues.includes(opt as T)}
          >
            {opt === '' ? '— None —' : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
