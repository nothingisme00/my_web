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
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
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
                "w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ease-out",
                "bg-slate-50 dark:bg-slate-800/50",
                "text-slate-900 dark:text-white",
                "border-slate-200 dark:border-slate-700",
                "focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:focus:border-indigo-500",
                "hover:border-slate-300 dark:hover:border-slate-600",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200",
                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                error && "border-red-500 focus:border-red-500",
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
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
        {error && (
          <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400">
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
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            clsx(
              "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ease-out resize-y",
              "bg-slate-50 dark:bg-slate-800/50",
              "text-slate-900 dark:text-white",
              "border-slate-200 dark:border-slate-700",
              "focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:focus:border-indigo-500",
              "hover:border-slate-300 dark:hover:border-slate-600",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              error && "border-red-500 focus:border-red-500",
              className
            )
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
