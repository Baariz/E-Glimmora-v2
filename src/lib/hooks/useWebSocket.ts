'use client';

/**
 * Production-ready WebSocket hook for Elan Glimmora.
 *
 * Handles: JWT auth, exponential backoff reconnection, 30s keepalive ping,
 * close-code routing (4401 → token refresh, 4402 → MFA), graceful unmount.
 *
 * See: FRONTEND_WEBSOCKET_INTEGRATION.docx §10
 */

import { useEffect, useRef, useCallback } from 'react';
import { WSFrame, WS_EVENTS, WS_CLOSE_CODES } from '@/lib/types/websocket';
import { logger } from '@/lib/utils/logger';

type EventHandler = (payload: any, frame: { type: string; timestamp: string }) => void;
type Handlers = Record<string, EventHandler>;

interface UseWebSocketOptions {
  /** WebSocket base URL, e.g. wss://elan-glimmora-api.onrender.com */
  wsUrl: string;
  /** Callback that returns the current JWT. */
  getToken: () => string | null;
  /** Called when close code 4401 (expired/invalid JWT). Refresh token then re-mount. */
  onTokenInvalid?: () => void;
  /** Called when close code 4402 (MFA not verified). */
  onMfaRequired?: () => void;
  /** Event handlers keyed by event type string. */
  handlers: Handlers;
  /** Set false to disable the connection (e.g. when not authenticated). Default: true. */
  enabled?: boolean;
}

const MAX_BACKOFF_MS = 30_000;
const PING_INTERVAL_MS = 30_000;

export function useWebSocket({
  wsUrl,
  getToken,
  onTokenInvalid,
  onMfaRequired,
  handlers,
  enabled = true,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedByClient = useRef(false);
  const handlersRef = useRef<Handlers>(handlers);
  handlersRef.current = handlers;
  // Keep callbacks in refs so caller can pass inline fns without triggering
  // connect() reference changes → reconnect loops.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const onTokenInvalidRef = useRef(onTokenInvalid);
  onTokenInvalidRef.current = onTokenInvalid;
  const onMfaRequiredRef = useRef(onMfaRequired);
  onMfaRequiredRef.current = onMfaRequired;

  const connect = useCallback(() => {
    const token = getTokenRef.current();
    if (!token) {
      logger.debug('WS', 'connect skipped — no token');
      return;
    }

    logger.info('WS', 'connecting', { url: wsUrl, attempt: attemptsRef.current });
    const ws = new WebSocket(
      `${wsUrl}/ws?token=${encodeURIComponent(token)}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      logger.info('WS', 'open', { attempt: attemptsRef.current });
      attemptsRef.current = 0;
      // Start keepalive ping every 30s
      if (pingRef.current) clearInterval(pingRef.current);
      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: WS_EVENTS.PING,
              payload: { t: Date.now() },
            })
          );
        }
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (evt) => {
      try {
        const frame: WSFrame = JSON.parse(evt.data);
        logger.debug('WS', `message ${frame.type}`, { timestamp: frame.timestamp });
        const handler = handlersRef.current[frame.type];
        if (handler) {
          handler(frame.payload, {
            type: frame.type,
            timestamp: frame.timestamp,
          });
        } else {
          logger.debug('WS', `no handler for ${frame.type}`);
        }
      } catch (e) {
        logger.error('WS', 'parse error', e, { raw: evt.data });
      }
    };

    ws.onclose = (evt) => {
      if (pingRef.current) {
        clearInterval(pingRef.current);
        pingRef.current = null;
      }
      logger.info('WS', 'close', { code: evt.code, reason: evt.reason, clean: evt.wasClean });
      if (closedByClient.current) return;

      // Auth failures — user must act before reconnecting
      if (evt.code === WS_CLOSE_CODES.INVALID_TOKEN) {
        logger.warn('WS', 'token invalid — awaiting refresh');
        onTokenInvalidRef.current?.();
        return;
      }
      if (evt.code === WS_CLOSE_CODES.MFA_REQUIRED) {
        logger.warn('WS', 'MFA required');
        onMfaRequiredRef.current?.();
        return;
      }
      // Normal closure — no reconnect
      if (evt.code === WS_CLOSE_CODES.NORMAL) return;

      // Abnormal / server error — reconnect with exponential backoff
      const delay = Math.min(
        MAX_BACKOFF_MS,
        1000 * 2 ** attemptsRef.current
      );
      attemptsRef.current += 1;
      logger.warn('WS', 'reconnect scheduled', { delayMs: delay, attempt: attemptsRef.current });
      setTimeout(() => {
        if (!closedByClient.current) connect();
      }, delay);
    };

    ws.onerror = () => logger.warn('WS', 'socket error (details in onclose)');
  }, [wsUrl]);

  useEffect(() => {
    if (!enabled) return;
    closedByClient.current = false;
    connect();
    return () => {
      closedByClient.current = true;
      if (pingRef.current) clearInterval(pingRef.current);
      wsRef.current?.close(WS_CLOSE_CODES.NORMAL, 'client unmount');
    };
  }, [enabled, connect]);

  const send = useCallback(
    (type: string, payload: unknown = {}) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, payload }));
      }
    },
    []
  );

  return { send };
}
