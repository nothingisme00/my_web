'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  helperText?: string;
  meta?: ReactNode;
}

export function Accordion({ trigger, children, defaultOpen = false, helperText, meta }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-lg px-2 group"
      >
        <div className="flex-1 pt-1">{trigger}</div>
        <div className="ml-4 flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            {meta && (
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {meta}
              </div>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex-shrink-0 p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </motion.div>
          </div>
          {helperText && (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
              {helperText}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
