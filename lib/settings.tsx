'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_text: string;
  footer_text: string;
  theme_color: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'WikiVault',
  site_description: 'Your self-hosted home for guides, docs and support articles.',
  logo_text: 'WV',
  footer_text: 'WikiVault — free, self-hosted knowledge management.',
  theme_color: '#6d5dfc',
};

interface SettingsContextValue {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  refreshSettings: async () => {},
});

function hexToHslTriplet(hex: string) {
  const value = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return '249 86% 67%';
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch('/api/settings', { cache: 'no-store' });
    if (!res.ok) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(await res.json()) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const refreshSettings = useCallback(async () => {
    const s = await fetchSettings();
    setSettings(s);
    document.documentElement.style.setProperty('--primary', hexToHslTriplet(s.theme_color));
  }, []);

  useEffect(() => { refreshSettings(); }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
