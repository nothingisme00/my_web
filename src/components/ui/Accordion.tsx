"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean; // Controlled mode
  helperText?: string;
  meta?: ReactNode;
  headerClassName?: string;
  onToggle?: (isOpen: boolean) => void;
}

export function Accordion({
  trigger,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  helperText,
  meta,
  headerClassName,
  onToggle,
}: AccordionProps) {
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newState);
    }
    onToggle?.(newState);
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between py-4 text-left transition-colors duration-200 rounded-t-2xl px-4 group ${
          headerClassName || "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}>
        <div className="flex-1">{trigger}</div>
        <div className="flex items-center gap-3">
          {meta && (
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {meta}
            </div>
          )}
          {helperText && (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap hidden sm:inline-block">
              {helperText}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="shrink-0 p-1 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            style={{ overflow: isAnimating ? "hidden" : "visible" }}>
            <div className="pb-3 px-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
