/**
 * Branding Controls Component
 * Per-institution theme customization with color pickers and font selection
 */

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { BrandingTheme, DEFAULT_THEME, isValidHexColor } from '@/lib/branding/theme-tokens';
import { toast } from 'sonner';

interface BrandingControlsProps {
  currentTheme: BrandingTheme;
  onSave: (theme: BrandingTheme) => void;
  onReset: () => void;
}

const FONT_OPTIONS = [
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman (Serif)', value: '"Times New Roman", serif' },
  { label: 'Palatino (Serif)', value: 'Palatino, serif' },
  { label: 'System UI (Sans)', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Helvetica (Sans)', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Arial (Sans)', value: 'Arial, sans-serif' },
];

export function BrandingControls({
  currentTheme,
  onSave,
  onReset,
}: BrandingControlsProps) {
  const [editedTheme, setEditedTheme] = useState<BrandingTheme>(currentTheme);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (colorKey: keyof BrandingTheme['colors'], value: string) => {
    const newTheme = {
      ...editedTheme,
      colors: {
        ...editedTheme.colors,
        [colorKey]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    setEditedTheme(newTheme);
    setHasChanges(true);
  };

  const handleFontChange = (fontKey: keyof BrandingTheme['fonts'], value: string) => {
    const newTheme = {
      ...editedTheme,
      fonts: {
        ...editedTheme.fonts,
        [fontKey]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    setEditedTheme(newTheme);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validate colors
    if (!isValidHexColor(editedTheme.colors.primary)) {
      toast.error('Invalid primary color format. Use hex format (#RRGGBB)');
      return;
    }
    if (!isValidHexColor(editedTheme.colors.secondary)) {
      toast.error('Invalid secondary color format. Use hex format (#RRGGBB)');
      return;
    }
    if (editedTheme.colors.accent && !isValidHexColor(editedTheme.colors.accent)) {
      toast.error('Invalid accent color format. Use hex format (#RRGGBB)');
      return;
    }

    onSave(editedTheme);
    setHasChanges(false);
    toast.success('Branding theme saved successfully');
  };

  const handleReset = () => {
    setEditedTheme(DEFAULT_THEME);
    setHasChanges(false);
    onReset();
    toast.success('Reset to default theme');
  };

  const handlePreview = () => {
    // Apply theme temporarily for preview
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', editedTheme.colors.primary);
    root.style.setProperty('--brand-secondary', editedTheme.colors.secondary);
    if (editedTheme.colors.accent) {
      root.style.setProperty('--brand-accent', editedTheme.colors.accent);
    }
    root.style.setProperty('--font-heading', editedTheme.fonts.heading);
    root.style.setProperty('--font-body', editedTheme.fonts.body);

    toast.success('Theme preview applied (refresh page to revert)');
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-sans font-medium text-slate-900">
            Institutional Branding
          </h3>
          <p className="text-sm font-sans text-slate-600 mt-1">
            Customize colors and fonts for institution branding
          </p>
        </div>

        {/* Color Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-sans font-medium text-slate-700">Colors</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Color */}
            <div>
              <label className="block text-xs font-sans font-medium text-slate-600 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editedTheme.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editedTheme.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#RRGGBB"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-xs font-sans font-medium text-slate-600 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editedTheme.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editedTheme.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#RRGGBB"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-xs font-sans font-medium text-slate-600 mb-2">
                Accent Color (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editedTheme.colors.accent || '#14b8a6'}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editedTheme.colors.accent || ''}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  placeholder="#RRGGBB (optional)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-sans font-medium text-slate-700">Fonts</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heading Font */}
            <div>
              <label className="block text-xs font-sans font-medium text-slate-600 mb-2">
                Heading Font
              </label>
              <select
                value={editedTheme.fonts.heading}
                onChange={(e) => handleFontChange('heading', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {FONT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Font */}
            <div>
              <label className="block text-xs font-sans font-medium text-slate-600 mb-2">
                Body Font
              </label>
              <select
                value={editedTheme.fonts.body}
                onChange={(e) => handleFontChange('body', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {FONT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-sans font-medium text-slate-600 mb-3">
            Preview
          </p>
          <div className="space-y-2">
            <h4
              className="text-2xl font-medium"
              style={{
                fontFamily: editedTheme.fonts.heading,
                color: editedTheme.colors.primary,
              }}
            >
              Heading Sample
            </h4>
            <p
              className="text-sm"
              style={{
                fontFamily: editedTheme.fonts.body,
                color: editedTheme.colors.secondary,
              }}
            >
              Body text sample with secondary color.
            </p>
            {editedTheme.colors.accent && (
              <p
                className="text-sm font-medium"
                style={{
                  fontFamily: editedTheme.fonts.body,
                  color: editedTheme.colors.accent,
                }}
              >
                Accent color sample for highlights.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-sans text-sm hover:bg-slate-200 transition-colors"
          >
            Reset to Default
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={!hasChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-sans text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 bg-rose-700 text-white rounded-md font-sans text-sm hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
