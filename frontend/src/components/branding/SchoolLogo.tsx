import React from 'react';
import { SCHOOL_LOGO_SRC } from '../../config/branding';

export function SchoolLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-9 h-9', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <span className={`${sizes[size]} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-gray-200 shadow-sm ${className}`}>
      <img src={SCHOOL_LOGO_SRC} alt="Seven Star English Boarding School logo" className="w-full h-full object-contain" />
    </span>
  );
}
