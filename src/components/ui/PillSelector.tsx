"use client";

import { useState } from "react";
import { Check, Plus, X, ChevronDown, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { Input } from "./Input";

interface PillOption {
  id: string;
  name: string;
}

interface PillSelectorProps {
  label: string;
  options: PillOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  onCreateNew?: (name: string) => void;
  onDelete?: (id: string) => void;
  placeholder?: string;
  helperText?: string;
  multiSelect?: boolean;
  required?: boolean;
  compact?: boolean;
}

export function PillSelector({
  label,
  options,
  selectedIds,
  onChange,
  onCreateNew,
  onDelete,
  // placeholder is reserved for future dropdown feature
  helperText,
  multiSelect = false,
  required = false,
  compact = true,
}: PillSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));
  // Filter unselected options for dropdown
  const _unselectedOptions = options.filter(
    (opt) => !selectedIds.includes(opt.id)
  );
  void _unselectedOptions; // Reserved for future dropdown feature

  const handleToggle = (id: string) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      if (selectedIds.includes(id)) {
        onChange([]);
      } else {
        onChange([id]);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleCreateNew = () => {
    if (newItemName.trim() && onCreateNew) {
      onCreateNew(newItemName.trim());
      setNewItemName("");
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewItemName("");
    setIsCreating(false);
  };

  return (
    <div className="w-full">
      {/* Label Row */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {onCreateNew && !isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
            New
          </button>
        )}
      </div>

      {/* Create New Input */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-out",
          isCreating ? "max-h-32 opacity-100 mb-3" : "max-h-0 opacity-0"
        )}>
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="flex gap-2">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${label.toLowerCase()} name`}
              autoFocus
              className="text-sm flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateNew();
                } else if (e.key === "Escape") {
                  handleCancelCreate();
                }
              }}
            />
            <button
              type="button"
              onClick={handleCreateNew}
              disabled={!newItemName.trim()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95">
              Add
            </button>
            <button
              type="button"
              onClick={handleCancelCreate}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Selected Items Preview */}
      {compact && selectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedOptions.map((option, index) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-sm animate-in fade-in slide-in-from-left-1 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}>
              {option.name}
              <button
                type="button"
                onClick={() => handleToggle(option.id)}
                className="p-0.5 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Container */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-sm">
        {/* Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            "w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-800 transition-all duration-200",
            isExpanded
              ? "bg-gray-50 dark:bg-gray-750"
              : "hover:bg-gray-50 dark:hover:bg-gray-750"
          )}>
          <span
            className={clsx(
              "text-sm transition-colors duration-200",
              selectedIds.length > 0
                ? "text-indigo-600 dark:text-indigo-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            )}>
            {selectedIds.length === 0
              ? `Select ${label.toLowerCase()}...`
              : `${selectedIds.length} selected`}
          </span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 text-gray-400 transition-all duration-300",
              isExpanded && "rotate-180 text-indigo-500"
            )}
          />
        </button>

        {/* Options List */}
        <div
          className={clsx(
            "border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-out",
            isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0 border-t-0"
          )}>
          <div className="max-h-48 overflow-y-auto">
            {options.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400 dark:text-gray-500">
                <Sparkles className="h-5 w-5 mb-2 opacity-50" />
                <p className="text-sm">No {label.toLowerCase()} available</p>
                <p className="text-xs mt-1">
                  Click &quot;New&quot; to create one
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {options.map((option, index) => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      className="group flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200"
                      style={{ animationDelay: `${index * 30}ms` }}>
                      <button
                        type="button"
                        onClick={() => handleToggle(option.id)}
                        className={clsx(
                          "flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200",
                          isSelected
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                        )}>
                        <div
                          className={clsx(
                            "w-4 h-4 rounded flex items-center justify-center transition-all duration-200",
                            isSelected
                              ? "bg-indigo-600 dark:bg-indigo-500 shadow-sm scale-110"
                              : "border-2 border-gray-300 dark:border-gray-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-500"
                          )}>
                          <Check
                            className={clsx(
                              "h-3 w-3 text-white transition-all duration-200",
                              isSelected
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-50"
                            )}
                          />
                        </div>
                        {option.name}
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, option.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                          title="Delete">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
