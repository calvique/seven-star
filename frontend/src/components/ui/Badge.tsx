import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'primary', size = 'md', className, dot = false }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', variant === 'success' && 'bg-green-500', variant === 'warning' && 'bg-yellow-500', variant === 'danger' && 'bg-red-500', variant === 'primary' && 'bg-primary-500', 'bg-gray-400')} />}
      {children}
    </span>
  );
}