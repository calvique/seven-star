import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SchoolSettings, Setting } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: SchoolSettings;
  isLoading: boolean;
  getSetting: (group: string, key: string) => Setting | undefined;
  getSettingValue: (group: string, key: string, defaultValue?: string) => string;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getPublicSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = useCallback((group: string, key: string): Setting | undefined => {
    return settings[group]?.find((s) => s.key === key);
  }, [settings]);

  const getSettingValue = useCallback((group: string, key: string, defaultValue = ''): string => {
    const setting = getSetting(group, key);
    if (!setting) return defaultValue;
    return String(setting.value ?? defaultValue);
  }, [getSetting]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, getSetting, getSettingValue, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}