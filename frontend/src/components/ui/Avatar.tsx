import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: 'circle' | 'square';
}

export function Avatar({ src, alt, name, size = 'md', className, shape = 'circle' }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-primary-500',
      'bg-secondary-500',
      'bg-accent-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx(sizes[size], shapeClasses, 'object-cover', className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        sizes[size],
        shapeClasses,
        'flex items-center justify-center font-medium text-white',
        getColorFromName(name || ''),
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
}