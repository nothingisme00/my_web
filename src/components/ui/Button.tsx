'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
            {
              'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100': variant === 'primary',
              'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700': variant === 'secondary',
              'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white': variant === 'outline',
              'hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white': variant === 'ghost',
              'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700': variant === 'destructive',
              'h-9 px-4 text-sm': size === 'sm',
              'h-10 px-6 py-2': size === 'md',
              'h-12 px-8 text-lg': size === 'lg',
              'h-10 w-10': size === 'icon',
            },
            className
          )
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
