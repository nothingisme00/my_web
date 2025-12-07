"use client";

import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectCompactProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectCompact({
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  disabled = false,
  className,
}: SelectCompactProps) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={clsx(
            "w-full px-3 py-2 pr-8 rounded-lg border appearance-none cursor-pointer",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-white text-sm",
            "border-gray-300 dark:border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "hover:border-gray-400 dark:hover:border-gray-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-gray-500"
          )}>
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </div>
    </div>
  );
}
