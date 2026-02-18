/**
 * Institutional Branding Theme Tokens
 * Allows per-institution customization of colors and fonts
 */

export interface BrandingTheme {
  id: string;
  institutionId: string;
  name: string;
  colors: {
    primary: string; // Hex color
    secondary: string; // Hex color
    accent?: string; // Optional hex color
  };
  fonts: {
    heading: string; // Font family
    body: string; // Font family
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Default platform theme (Élan brand)
 */
export const DEFAULT_THEME: BrandingTheme = {
  id: 'default',
  institutionId: 'platform',
  name: 'Élan Default',
  colors: {
    primary: '#be123c', // rose-700
    secondary: '#d4af37', // gold
    accent: '#14b8a6', // teal-500
  },
  fonts: {
    heading: 'Georgia, serif', // Mock Miller Display
    body: 'system-ui, -apple-system, sans-serif', // Mock Avenir
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * CSS variable names for theming
 */
export const CSS_VARIABLES = {
  primaryColor: '--brand-primary',
  secondaryColor: '--brand-secondary',
  accentColor: '--brand-accent',
  headingFont: '--font-heading',
  bodyFont: '--font-body',
} as const;

/**
 * Apply institutional theme to document root
 * Updates CSS custom properties for dynamic theming
 * @param theme - Branding theme to apply
 */
export function applyInstitutionalTheme(theme: BrandingTheme): void {
  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty(CSS_VARIABLES.primaryColor, theme.colors.primary);
  root.style.setProperty(CSS_VARIABLES.secondaryColor, theme.colors.secondary);
  if (theme.colors.accent) {
    root.style.setProperty(CSS_VARIABLES.accentColor, theme.colors.accent);
  }

  // Apply font variables
  root.style.setProperty(CSS_VARIABLES.headingFont, theme.fonts.heading);
  root.style.setProperty(CSS_VARIABLES.bodyFont, theme.fonts.body);

  // Store theme ID in localStorage for persistence
  localStorage.setItem('institutional-theme-id', theme.id);
}

/**
 * Reset to default platform theme
 */
export function resetToDefaultTheme(): void {
  applyInstitutionalTheme(DEFAULT_THEME);
}

/**
 * Get current theme ID from localStorage
 * @returns Theme ID or null if not set
 */
export function getCurrentThemeId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('institutional-theme-id');
}

/**
 * Load institutional theme for a specific institution
 * In production, this would fetch from API
 * @param institutionId - Institution ID
 * @returns Promise resolving to theme or default theme
 */
export async function loadInstitutionalTheme(
  institutionId: string
): Promise<BrandingTheme> {
  // In production, this would be an API call:
  // const response = await fetch(`/api/institutions/${institutionId}/theme`);
  // return response.json();

  // For now, import from institutional-themes file
  const { getInstitutionalTheme } = await import('./institutional-themes');
  return getInstitutionalTheme(institutionId) || DEFAULT_THEME;
}

/**
 * Validate hex color format
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) return null;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : null;
}
