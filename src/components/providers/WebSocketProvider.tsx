'use client';

/**
 * WebSocket Provider for Elan Glimmora.
 *
 * Mounts the WebSocket connection when authenticated and dispatches
 * real-time events to invalidate React Query caches + show toasts.
 *
 * Role-based filtering: crisis.* and predictive.* events are dropped
 * for non-advisor roles (UHNI, Spouse, LegacyHeir) per the spec.
 *
 * See: FRONTEND_WEBSOCKET_INTEGRATION.docx §8, §10, §11
 */

import React, { ReactNode, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { getAuthToken, setAuthToken } from '@/lib/services/api/client';
import { WS_EVENTS, WSHandlers } from '@/lib/types/websocket';
import { B2BRole, AdminRole, UserRoles } from '@/lib/types';
import { logger } from '@/lib/utils/logger';
import { messageNotificationsStore } from '@/lib/stores/messageNotifications';

// ── Helpers ─────────────────────────────────────────────────────────

const ADVISOR_ROLES = new Set<string>([
  B2BRole.RelationshipManager,
  B2BRole.PrivateBanker,
  B2BRole.FamilyOfficeDirector,
  B2BRole.ComplianceOfficer,
  B2BRole.InstitutionalAdmin,
  AdminRole.SuperAdmin,
]);

function isAdvisorUser(roles: UserRoles): boolean {
  return Object.values(roles).some(
    (r) => typeof r === 'string' && ADVISOR_ROLES.has(r)
  );
}

/**
 * Derive the WS URL from the REST base URL.
 * https://... → wss://...   |  http://... → ws://...
 */
function getWsUrl(): string {
  const env = process.env.NEXT_PUBLIC_WS_URL;
  if (env) return env;

  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://elan-glimmora-api.onrender.com';
  return base.replace(/^http/, 'ws');
}

// ── Provider ────────────────────────────────────────────────────────

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const wsUrl = useMemo(getWsUrl, []);
  const isAdvisor = user?.roles ? isAdvisorUser(user.roles) : false;
  const currentUserId = user?.id;

  // One-shot lifecycle logs so the full WS path is traceable in prod logs.
  useEffect(() => {
    logger.info('WS', 'provider mounted', { wsUrl });
    return () => logger.info('WS', 'provider unmounted');
  }, [wsUrl]);

  useEffect(() => {
    if (!isAuthenticated) {
      logger.debug('WS', 'disabled — not authenticated');
      return;
    }
    logger.info('WS', 'enabled for user', {
      userId: currentUserId,
      isAdvisor,
    });
  }, [isAuthenticated, currentUserId, isAdvisor]);

  const handlers = useMemo<WSHandlers>(
    () => ({
      // ── Control ────────────────────────────────────────
      [WS_EVENTS.CONNECTED]: () => {
        logger.info('WS', 'server handshake ack');
      },

      // ── Messages ───────────────────────────────────────
      [WS_EVENTS.MESSAGE_CREATED]: ({ thread_id, message }) => {
        logger.info('Messages', 'new message received', { threadId: thread_id });
        queryClient.invalidateQueries({ queryKey: ['messages', thread_id] });
        queryClient.invalidateQueries({ queryKey: ['threads'] });
        if (currentUserId && message.sender_id === currentUserId) return;
        messageNotificationsStore.push({
          id: message.id,
          thread_id,
          sender_id: message.sender_id,
          preview: message.content.slice(0, 140),
          created_at: message.sent_at,
          read: false,
        });
        toast('New message received', { icon: '✉️' });
      },

      // ── Journey lifecycle ──────────────────────────────
      [WS_EVENTS.JOURNEY_STATUS_CHANGED]: ({
        journey_id,
        new_status,
        title,
      }) => {
        logger.info('Journey', 'status changed', {
          journeyId: journey_id,
          newStatus: new_status,
          title,
        });
        queryClient.invalidateQueries({ queryKey: ['journey', journey_id] });
        queryClient.invalidateQueries({ queryKey: ['journeys'] });
        queryClient.invalidateQueries({ queryKey: ['briefing'] });
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        toast(`${title} → ${new_status}`);
      },

      [WS_EVENTS.JOURNEY_FEEDBACK_SUBMITTED]: ({ journey_id }) => {
        logger.info('Journey', 'feedback submitted', { journeyId: journey_id });
        queryClient.invalidateQueries({ queryKey: ['journey', journey_id] });
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      },

      // ── Crisis (advisor-only) ──────────────────────────
      [WS_EVENTS.CRISIS_DISRUPTION_STATUS]: (payload) => {
        if (!isAdvisor) {
          logger.debug('Crisis', 'disruption dropped — non-advisor');
          return;
        }
        logger.warn('Crisis', 'disruption status', { status: payload.status });
        queryClient.invalidateQueries({ queryKey: ['crisis', 'disruptions'] });
        toast.error(`Crisis disruption: ${payload.status}`);
      },

      [WS_EVENTS.CRISIS_PROTOCOL_ACTIVATED]: () => {
        if (!isAdvisor) {
          logger.debug('Crisis', 'protocol dropped — non-advisor');
          return;
        }
        logger.warn('Crisis', 'extraction protocol activated');
        queryClient.invalidateQueries({ queryKey: ['crisis', 'protocols'] });
        toast.error('Extraction protocol activated', { duration: 10_000 });
      },

      // ── Predictive (advisor-only) ──────────────────────
      [WS_EVENTS.PREDICTIVE_ALERT_ACKNOWLEDGED]: () => {
        if (!isAdvisor) {
          logger.debug('Predictive', 'alert ack dropped — non-advisor');
          return;
        }
        logger.info('Predictive', 'alert acknowledged');
        queryClient.invalidateQueries({
          queryKey: ['predictive', 'alerts'],
        });
      },
    }),
    [queryClient, isAdvisor, currentUserId]
  );

  useWebSocket({
    wsUrl,
    getToken: getAuthToken,
    onTokenInvalid: async () => {
      logger.warn('WS', 'token invalid — refreshing session before reconnect');
      toast.error('Session expired — refreshing...');
      // Clear the stale cached token so the next reconnect reads a fresh one.
      setAuthToken(null);
      // Force NextAuth to re-fetch the session (which re-issues apiToken from the JWT).
      try {
        await fetch('/api/auth/session', { cache: 'no-store' });
      } catch (err) {
        logger.error('WS', 'session refresh fetch failed', err);
      }
      // Hard reload to re-mount the WS provider with the new token.
      // NOTE: For a truly silent refresh, the backend must expose a
      // /api/auth/refresh endpoint and NextAuth must be wired to call it.
      window.location.reload();
    },
    onMfaRequired: () => {
      logger.warn('WS', 'MFA required — redirecting');
      toast.error('MFA verification required');
      window.location.href = '/auth/verify-mfa';
    },
    handlers: handlers as Record<string, any>,
    enabled: isAuthenticated,
  });

  return <>{children}</>;
}
