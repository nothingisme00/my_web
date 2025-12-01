"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  InputHTMLAttributes,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      type = "text",
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const inputType =
      isPasswordField && showPasswordToggle && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={twMerge(
              clsx(
                "w-full px-4 py-2 rounded-lg border transition-all duration-200 ease-out",
                "bg-white dark:bg-gray-900",
                "text-gray-900 dark:text-white",
                "border-gray-300 dark:border-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm",
                "hover:border-gray-400 dark:hover:border-gray-600",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                error &&
                  "border-red-500 focus:ring-red-500 focus:border-red-500",
                isPasswordField && showPasswordToggle && "pr-12",
                className
              )
            )}
            {...props}
          />
          {isPasswordField && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-4 py-2 rounded-lg border transition-all duration-200 ease-out resize-y",
              "bg-white dark:bg-gray-900",
              "text-gray-900 dark:text-white",
              "border-gray-300 dark:border-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm",
              "hover:border-gray-400 dark:hover:border-gray-600",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
