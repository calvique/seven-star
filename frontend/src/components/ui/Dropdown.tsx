import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect?: (value: string, option: DropdownOption) => void;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, options, onSelect, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOption) => {
    if (!option.disabled) {
      onSelect?.(option.value, option);
      setIsOpen(false);
    }
  };

  const dropdownContent = isOpen ? (
    <div
      className={clsx(
        'fixed z-50 mt-1 min-w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 py-1',
        align === 'right' ? 'right-0' : 'left-0'
      )}
      ref={dropdownRef}
      role="menu"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => handleOptionClick(option)}
          disabled={option.disabled}
          className={clsx(
            'w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors',
            option.danger
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-700 hover:bg-gray-100',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
          role="menuitem"
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className={clsx('relative inline-block', className)} ref={triggerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown
          className={clsx('w-4 h-4 ml-1 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}

interface SelectDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  disabled,
  className,
  label,
  error,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'relative w-full px-4 py-3 rounded-lg border bg-white text-gray-900 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : '',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={clsx('block pr-10', !selectedOption && !value && 'text-gray-400')}>
          {selectedOption?.label || value || placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform pointer-events-none',
            isOpen && 'rotate-180'
          )}
        />
      </div>
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="fixed z-50 mt-1 w-full max-h-60 overflow-auto bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              disabled={option.disabled}
              className={clsx(
                'w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors',
                option.value === value
                  ? 'bg-primary-50 text-primary-700'
                  : option.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
              role="option"
              aria-selected={option.value === value}
            >
              {option.value === value && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}