/**
 * WebSocket event types for Elan Glimmora real-time push channel.
 * See: FRONTEND_WEBSOCKET_INTEGRATION.docx for full protocol spec.
 */

// ── Frame envelope ──────────────────────────────────────────────────

export interface WSFrame<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}

// ── Control events ──────────────────────────────────────────────────

export interface WSConnectedPayload {
  user_id: string;
}

export interface WSPongPayload {
  echo?: unknown;
  idle?: boolean;
}

export interface WSErrorPayload {
  message: string;
}

// ── Domain events ───────────────────────────────────────────────────

export interface MessageCreatedPayload {
  thread_id: string;
  message: {
    id: string;
    thread_id: string;
    sender_id: string;
    content: string;
    type: string;
    read_by: string[];
    sent_at: string;
    attachments: Array<{
      id: string;
      filename: string;
      file_url: string;
      mime_type: string;
      size: number;
    }>;
  };
}

export interface JourneyStatusChangedPayload {
  journey_id: string;
  title: string;
  previous_status: string;
  new_status: string;
  transition: string;
  actor_id: string;
}

export interface JourneyFeedbackSubmittedPayload {
  journey_id: string;
  title: string;
  mood: number;
  has_reflection: boolean;
}

export interface CrisisDisruptionStatusPayload {
  disruption_id: string;
  status: string;
  institution_id: string;
}

export interface CrisisProtocolActivatedPayload {
  protocol_id: string;
  institution_id: string;
  activated_by: string;
}

export interface PredictiveAlertAcknowledgedPayload {
  alert_id: string;
  institution_id: string;
  acknowledged_by: string;
}

// ── Event type constants ────────────────────────────────────────────

export const WS_EVENTS = {
  // Control
  CONNECTED: 'ws.connected',
  PONG: 'ws.pong',
  ERROR: 'ws.error',
  // Client → Server
  PING: 'ws.ping',
  // Domain
  MESSAGE_CREATED: 'message.created',
  JOURNEY_STATUS_CHANGED: 'journey.status_changed',
  JOURNEY_FEEDBACK_SUBMITTED: 'journey.feedback_submitted',
  CRISIS_DISRUPTION_STATUS: 'crisis.disruption_status',
  CRISIS_PROTOCOL_ACTIVATED: 'crisis.protocol_activated',
  PREDICTIVE_ALERT_ACKNOWLEDGED: 'predictive.alert_acknowledged',
} as const;

export type WSEventType = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

// ── Handler map type ────────────────────────────────────────────────

export type WSEventHandler<T = unknown> = (
  payload: T,
  frame: { type: string; timestamp: string }
) => void;

export type WSHandlers = {
  [WS_EVENTS.CONNECTED]?: WSEventHandler<WSConnectedPayload>;
  [WS_EVENTS.PONG]?: WSEventHandler<WSPongPayload>;
  [WS_EVENTS.ERROR]?: WSEventHandler<WSErrorPayload>;
  [WS_EVENTS.MESSAGE_CREATED]?: WSEventHandler<MessageCreatedPayload>;
  [WS_EVENTS.JOURNEY_STATUS_CHANGED]?: WSEventHandler<JourneyStatusChangedPayload>;
  [WS_EVENTS.JOURNEY_FEEDBACK_SUBMITTED]?: WSEventHandler<JourneyFeedbackSubmittedPayload>;
  [WS_EVENTS.CRISIS_DISRUPTION_STATUS]?: WSEventHandler<CrisisDisruptionStatusPayload>;
  [WS_EVENTS.CRISIS_PROTOCOL_ACTIVATED]?: WSEventHandler<CrisisProtocolActivatedPayload>;
  [WS_EVENTS.PREDICTIVE_ALERT_ACKNOWLEDGED]?: WSEventHandler<PredictiveAlertAcknowledgedPayload>;
};

// ── Close codes ─────────────────────────────────────────────────────

export const WS_CLOSE_CODES = {
  NORMAL: 1000,
  ABNORMAL: 1006,
  SERVER_ERROR: 1011,
  INVALID_TOKEN: 4401,
  MFA_REQUIRED: 4402,
} as const;
