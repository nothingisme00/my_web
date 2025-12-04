"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
            {
              "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm hover:shadow-md hover:shadow-indigo-500/25 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:shadow-indigo-500/20":
                variant === "primary",
              "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white":
                variant === "secondary",
              "border border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-white":
                variant === "outline",
              "hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white":
                variant === "ghost",
              "bg-red-600 text-white hover:bg-red-500 shadow-sm hover:shadow-md hover:shadow-red-500/25 dark:bg-red-600 dark:hover:bg-red-500":
                variant === "destructive",
              "h-9 px-4 text-sm": size === "sm",
              "h-10 px-5 py-2": size === "md",
              "h-12 px-8 text-lg": size === "lg",
              "h-10 w-10": size === "icon",
            },
            className
          )
        )}
        {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
