"use client";

import { Accordion } from "@/components/ui/Accordion";

type ColorScheme = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

interface AccordionSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  isOpen?: boolean; // Controlled mode
  itemCount?: number;
  color?: ColorScheme;
  onToggle?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const colorStyles: Record<
  ColorScheme,
  {
    iconBg: string;
    badge: string;
    hoverBorder: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-600 dark:bg-blue-500",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    hoverBorder: "hover:border-blue-200 dark:hover:border-blue-900/50",
  },
  violet: {
    iconBg: "bg-violet-600 dark:bg-violet-500",
    badge:
      "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
    hoverBorder: "hover:border-violet-200 dark:hover:border-violet-900/50",
  },
  emerald: {
    iconBg: "bg-emerald-600 dark:bg-emerald-500",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/50",
  },
  amber: {
    iconBg: "bg-amber-600 dark:bg-amber-500",
    badge:
      "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-900/50",
  },
  rose: {
    iconBg: "bg-rose-600 dark:bg-rose-500",
    badge: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-900/50",
  },
  slate: {
    iconBg: "bg-slate-700 dark:bg-slate-600",
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    hoverBorder: "hover:border-slate-300 dark:hover:border-slate-600",
  },
};

// Universal gray header background for all sections
const headerBg =
  "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/80";

export function AccordionSection({
  icon: Icon,
  title,
  subtitle,
  defaultOpen = false,
  isOpen,
  itemCount,
  color = "blue",
  onToggle,
  children,
}: AccordionSectionProps) {
  const styles = colorStyles[color];

  const trigger = (
    <div className="flex items-center gap-4 w-full">
      <div className={`p-2.5 rounded-xl shadow-sm ${styles.iconBg}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          {itemCount !== undefined && itemCount > 0 && (
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles.badge}`}>
              {itemCount}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
        styles.hoverBorder
      } ${isOpen ? "z-20" : "z-0"}`}>
      <Accordion
        trigger={trigger}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        headerClassName={headerBg}
        onToggle={onToggle}>
        <div className="px-6 pb-6 pt-4 bg-white dark:bg-slate-900">
          {children}
        </div>
      </Accordion>
    </div>
  );
}
