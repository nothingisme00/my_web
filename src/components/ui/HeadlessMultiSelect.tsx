"use client"

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useFloating, offset, flip, shift, autoUpdate, size, FloatingPortal } from '@floating-ui/react';

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
  placeholder = 'Select options',
  disabled = false,
  className,
}: MultiSelectProps) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const displayValue =
    selectedOptions.length > 0
      ? selectedOptions.map((opt) => opt.label).join(', ')
      : placeholder;

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const { refs, floatingStyles } = useFloating({
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  });

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled} multiple>
        {({ open }) => (
          <>
            <Listbox.Button
              ref={refs.setReference}
              className={clsx(
                'relative w-full px-4 py-3 pr-10 rounded-2xl border transition-all duration-200 cursor-pointer text-left',
                'bg-white dark:bg-gray-900',
                'text-gray-900 dark:text-white text-sm font-medium',
                'border-gray-200 dark:border-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'hover:border-blue-400 dark:hover:border-blue-600',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <span className="block truncate">{displayValue}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className={clsx(
                  'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                  open && 'rotate-180'
                )} />
              </span>
            </Listbox.Button>

            <FloatingPortal>
              <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Listbox.Options
                  ref={refs.setFloating}
                  style={floatingStyles}
                  className="z-[99999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden focus:outline-none ring-1 ring-black ring-opacity-5"
                >
                  <div className="max-h-60 overflow-y-auto py-1">
                    {options.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          clsx(
                            'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors',
                            active
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'text-gray-900 dark:text-white'
                          )
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggle(option.value);
                        }}
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => {}}
                                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                />
                              </span>
                              <span className="block truncate text-sm ml-7">
                                {option.label}
                              </span>
                            </div>
                            {option.count !== undefined && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({option.count})
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </Listbox.Options>
              </Transition>
            </FloatingPortal>
          </>
        )}
      </Listbox>
    </div>
  );
}
