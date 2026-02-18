/**
 * Institutional Theme Registry
 * Sample institutional branding themes for development
 * In production, these would be stored in database
 */

import { BrandingTheme, DEFAULT_THEME } from './theme-tokens';

/**
 * Sample institutional themes
 */
const INSTITUTIONAL_THEMES: BrandingTheme[] = [
  {
    id: 'goldman-sachs',
    institutionId: 'inst-001',
    name: 'Goldman Sachs',
    colors: {
      primary: '#0033A0', // Goldman blue
      secondary: '#000000', // Black
      accent: '#FFD700', // Gold
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'jp-morgan',
    institutionId: 'inst-002',
    name: 'JP Morgan Private Bank',
    colors: {
      primary: '#003366', // JP Morgan navy
      secondary: '#CC9966', // Bronze
      accent: '#006BA6', // Light blue
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ubs',
    institutionId: 'inst-003',
    name: 'UBS Wealth Management',
    colors: {
      primary: '#E60000', // UBS red
      secondary: '#333333', // Dark gray
      accent: '#999999', // Light gray
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'credit-suisse',
    institutionId: 'inst-004',
    name: 'Credit Suisse',
    colors: {
      primary: '#003C78', // CS blue
      secondary: '#E2001A', // CS red
      accent: '#78BE20', // Green
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

/**
 * Get all institutional themes
 * @returns Array of all themes
 */
export function getAllInstitutionalThemes(): BrandingTheme[] {
  return [...INSTITUTIONAL_THEMES];
}

/**
 * Get theme by institution ID
 * @param institutionId - Institution ID
 * @returns Theme or null if not found
 */
export function getInstitutionalTheme(
  institutionId: string
): BrandingTheme | null {
  return (
    INSTITUTIONAL_THEMES.find((theme) => theme.institutionId === institutionId) ||
    null
  );
}

/**
 * Get theme by theme ID
 * @param themeId - Theme ID
 * @returns Theme or default theme
 */
export function getThemeById(themeId: string): BrandingTheme {
  if (themeId === 'default') {
    return DEFAULT_THEME;
  }
  return (
    INSTITUTIONAL_THEMES.find((theme) => theme.id === themeId) || DEFAULT_THEME
  );
}

/**
 * Check if institution has custom theme
 * @param institutionId - Institution ID
 * @returns True if custom theme exists
 */
export function hasCustomTheme(institutionId: string): boolean {
  return INSTITUTIONAL_THEMES.some(
    (theme) => theme.institutionId === institutionId
  );
}
