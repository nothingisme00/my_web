"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { X, Search } from "lucide-react";
import { availableIcons, iconMap } from "@/lib/tool-icons";
import { cn } from "@/lib/utils";

interface TechStackInputProps {
  label: string;
  value: string; // Comma-separated string
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

export function TechStackInput({
  label,
  value,
  onChange,
  placeholder = "Search technologies...",
  helperText,
}: TechStackInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated value to array - memoized to prevent re-renders
  const selectedItems = useMemo(
    () =>
      value
        ? value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    [value]
  );

  // Filter available icons based on search query
  const filteredOptions = searchQuery
    ? availableIcons.filter(
        (icon) =>
          icon.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedItems.some(
            (selected) => selected.toLowerCase() === icon.toLowerCase()
          )
      )
    : availableIcons.filter(
        (icon) =>
          !selectedItems.some(
            (selected) => selected.toLowerCase() === icon.toLowerCase()
          )
      );

  // Handle click outside to close dropdown
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

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle search query change - reset highlighted index
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(0);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const addItem = useCallback(
    (item: string) => {
      const trimmedItem = item.trim();
      if (!trimmedItem) return;

      // Check if already selected (case-insensitive)
      if (
        selectedItems.some((s) => s.toLowerCase() === trimmedItem.toLowerCase())
      ) {
        return;
      }

      const newItems = [...selectedItems, trimmedItem];
      onChange(newItems.join(", "));
      setSearchQuery("");
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [selectedItems, onChange]
  );

  const removeItem = useCallback(
    (itemToRemove: string) => {
      const newItems = selectedItems.filter(
        (item) => item.toLowerCase() !== itemToRemove.toLowerCase()
      );
      onChange(newItems.join(", "));
    },
    [selectedItems, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalOptions = filteredOptions.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (totalOptions > 0) {
          setHighlightedIndex((prev) => (prev + 1) % totalOptions);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && totalOptions > 0) {
          setHighlightedIndex(
            (prev) => (prev - 1 + totalOptions) % totalOptions
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && filteredOptions[highlightedIndex]) {
          addItem(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Backspace":
        if (!searchQuery && selectedItems.length > 0) {
          // Remove last item when backspace on empty input
          removeItem(selectedItems[selectedItems.length - 1]);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        {label}
      </label>

      {/* Selected Items (Badges) - Above Input */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item) => {
            const iconIdentifier =
              iconMap[item] ||
              iconMap[
                Object.keys(iconMap).find(
                  (k) => k.toLowerCase() === item.toLowerCase()
                ) || ""
              ];

            return (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {iconIdentifier ? (
                  <Icon icon={iconIdentifier} width="16" height="16" />
                ) : (
                  <Icon
                    icon="mdi:code-tags"
                    width="16"
                    height="16"
                    className="text-zinc-500"
                  />
                )}
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-0.5 p-0.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label={`Remove ${item}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-9 pr-4 py-2.5 rounded-lg border transition-colors",
            "bg-white dark:bg-zinc-900",
            "border-zinc-300 dark:border-zinc-700",
            "text-zinc-900 dark:text-zinc-100",
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "dark:focus:ring-blue-400/20 dark:focus:border-blue-400"
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute z-50 w-full mt-1 py-1 rounded-lg shadow-lg",
            "bg-white dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-700",
            "max-h-60 overflow-y-auto"
          )}>
          {/* Available Options */}
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.slice(0, 50).map((option, index) => {
                const iconIdentifier = iconMap[option];
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    key={option}
                    type="button"
                    data-index={index}
                    onClick={() => addItem(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "w-full px-3 py-2 flex items-center gap-3 text-left transition-colors",
                      isHighlighted
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    )}>
                    {iconIdentifier ? (
                      <Icon icon={iconIdentifier} width="20" height="20" />
                    ) : (
                      <Icon
                        icon="mdi:code-tags"
                        width="20"
                        height="20"
                        className="text-zinc-400"
                      />
                    )}
                    <span className="flex-1">{option}</span>
                    {isHighlighted && (
                      <span className="text-xs text-zinc-400">
                        Enter to add
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Show more indicator */}
              {filteredOptions.length > 50 && (
                <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                  Showing 50 of {filteredOptions.length} results. Type to filter
                  more...
                </div>
              )}
            </>
          ) : (
            /* No results - Not Found */
            <div className="px-3 py-4 text-center text-zinc-500 dark:text-zinc-400">
              <Icon
                icon="mdi:alert-circle-outline"
                width="24"
                height="24"
                className="mx-auto mb-2 opacity-50"
              />
              <p className="text-sm font-medium">Not Found</p>
              {searchQuery && (
                <p className="text-xs mt-1">
                  No icon available for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
