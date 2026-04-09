/**
 * Service Singletons
 * Re-exports the service registry from config.ts.
 * All services are created once at module load — shared for entire session.
 */

export { services } from './config';
