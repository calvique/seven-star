import React from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'underline';
  className?: string;
  fullWidth?: boolean;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'line', className, fullWidth = false }: TabsProps) {
  const variants = {
    line: 'border-b border-gray-200',
    pills: 'bg-gray-100 rounded-lg p-1',
    underline: 'border-b border-gray-200',
  };

  return (
    <div className={clsx(variants[variant], className)} role="tablist" aria-orientation="horizontal">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          className={clsx(
            'relative px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            tab.disabled && 'opacity-50 cursor-not-allowed',
            fullWidth && 'flex-1 text-center',
            variant === 'line' &&
              (activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'),
            variant === 'pills' &&
              (activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'),
            variant === 'underline' &&
              (activeTab === tab.id
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700')
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'px-1.5 py-0.5 text-xs font-medium rounded-full',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className }: TabPanelProps) {
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={`${id}-tab`}
      className={clsx('animate-fade-in', className)}
    >
      {children}
    </div>
  );
}