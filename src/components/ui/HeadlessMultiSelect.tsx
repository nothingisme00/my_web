"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Select options",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const displayValue =
    selectedOptions.length > 0
      ? selectedOptions.map((opt) => opt.label).join(", ")
      : placeholder;

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={clsx("w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            "w-full px-4 py-3 pr-10 rounded-2xl border cursor-pointer text-left",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-white text-sm font-medium",
            "border-gray-200 dark:border-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "hover:border-blue-400 dark:hover:border-blue-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}>
          <span className="block truncate">{displayValue}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown
              className={clsx(
                "h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 cursor-pointer",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "text-gray-900 dark:text-white"
                    )}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({option.count})
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
