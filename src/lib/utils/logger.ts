/**
 * Structured frontend logger.
 *
 * All output carries a feature tag, timestamp, and optional context object.
 * Enable/disable via NEXT_PUBLIC_LOG_LEVEL ("silent" | "error" | "warn" | "info" | "debug").
 * Defaults to "info" in dev, "warn" in production.
 *
 * Usage:
 *   logger.info('Dashboard', 'mounted');
 *   logger.action('Journey', 'submit feedback', { journeyId });
 *   logger.error('API', 'GET /briefing failed', err, { status: 403 });
 *
 *   const t = logger.apiStart('API', 'GET', '/api/briefing');
 *   logger.apiSuccess('API', 'GET', '/api/briefing', t);
 */

type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';
type LogContext = Record<string, unknown>;

const LEVEL_RANK: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

function resolveLevel(): LogLevel {
  const env = (process.env.NEXT_PUBLIC_LOG_LEVEL || '').toLowerCase() as LogLevel;
  if (env && env in LEVEL_RANK) return env;
  return process.env.NODE_ENV === 'production' ? 'warn' : 'info';
}

const currentLevel = resolveLevel();

function shouldLog(level: Exclude<LogLevel, 'silent'>): boolean {
  return LEVEL_RANK[currentLevel] >= LEVEL_RANK[level];
}

function tag(feature: string, event: string): string {
  const t = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  return `${t} [${feature}] ${event}`;
}

export const logger = {
  debug(feature: string, event: string, context?: LogContext) {
    if (!shouldLog('debug')) return;
    context ? console.debug(tag(feature, event), context) : console.debug(tag(feature, event));
  },

  info(feature: string, event: string, context?: LogContext) {
    if (!shouldLog('info')) return;
    context ? console.log(tag(feature, event), context) : console.log(tag(feature, event));
  },

  warn(feature: string, event: string, context?: LogContext) {
    if (!shouldLog('warn')) return;
    context ? console.warn(tag(feature, event), context) : console.warn(tag(feature, event));
  },

  error(feature: string, event: string, error?: unknown, context?: LogContext) {
    if (!shouldLog('error')) return;
    const payload = { error, ...(context || {}) };
    console.error(tag(feature, event), payload);
  },

  /** Log a user action (button click, form submit). Returns quickly; non-blocking. */
  action(feature: string, action: string, payload?: LogContext) {
    if (!shouldLog('info')) return;
    payload
      ? console.log(tag(feature, `⚡ ${action}`), payload)
      : console.log(tag(feature, `⚡ ${action}`));
  },

  // ── API lifecycle helpers ─────────────────────────────────────────────
  /** Call at request start. Returns a start timestamp used by apiSuccess/apiError. */
  apiStart(feature: string, method: string, path: string): number {
    if (shouldLog('info')) {
      console.log(tag(feature, `→ ${method} ${path}`));
    }
    return performance.now();
  },

  apiSuccess(feature: string, method: string, path: string, startedAt: number, context?: LogContext) {
    if (!shouldLog('info')) return;
    const ms = Math.round(performance.now() - startedAt);
    const base = tag(feature, `✓ ${method} ${path} (${ms}ms)`);
    context ? console.log(base, context) : console.log(base);
  },

  apiError(
    feature: string,
    method: string,
    path: string,
    startedAt: number,
    error: unknown,
    context?: LogContext
  ) {
    const ms = Math.round(performance.now() - startedAt);
    console.error(tag(feature, `✗ ${method} ${path} (${ms}ms)`), { error, ...(context || {}) });
  },
};

export type { LogLevel, LogContext };
