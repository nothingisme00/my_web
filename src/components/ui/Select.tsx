"use client"

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              clsx(
                'w-full px-4 py-3 pr-10 rounded-2xl border transition-all duration-200 ease-out appearance-none cursor-pointer',
                'bg-white dark:bg-gray-900',
                'text-gray-900 dark:text-white text-sm font-medium',
                'border-gray-200 dark:border-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm',
                'hover:border-blue-400 dark:hover:border-blue-600',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300',
                error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                className
              )
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown
              className={clsx(
                'h-4 w-4 transition-colors',
                error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500',
                props.disabled && 'opacity-50'
              )}
            />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
