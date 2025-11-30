'use client';

import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Input } from './Input';
import { Button } from './Button';

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
}

export function PillSelector({
  label,
  options,
  selectedIds,
  onChange,
  onCreateNew,
  onDelete,
  placeholder = 'Select...',
  helperText,
  multiSelect = false,
  required = false,
}: PillSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const handleToggle = (id: string) => {
    if (multiSelect) {
      // Multi-select: toggle the item
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      // Single-select: replace selection
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
      setNewItemName('');
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewItemName('');
    setIsCreating(false);
  };

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {onCreateNew && !isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New
          </button>
        )}
      </div>

      {/* Create New Input */}
      {isCreating && (
        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter new ${label.toLowerCase()}`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateNew();
                } else if (e.key === 'Escape') {
                  handleCancelCreate();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleCreateNew}
              disabled={!newItemName.trim()}
              className="px-3"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelCreate}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {options.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">
            {placeholder}
          </p>
        ) : (
          options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <div key={option.id} className="relative group">
                <button
                  type="button"
                  onClick={() => handleToggle(option.id)}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    'border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                    onDelete && 'pr-8',
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {option.name}
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, option.id)}
                    className={clsx(
                      'absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-200',
                      'opacity-0 group-hover:opacity-100',
                      'hover:bg-red-500 hover:text-white',
                      isSelected
                        ? 'text-white/70 hover:bg-red-600'
                        : 'text-gray-400 dark:text-gray-500 hover:bg-red-500 hover:text-white'
                    )}
                    title="Delete this item"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
