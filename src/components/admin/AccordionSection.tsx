"use client";

import { Accordion } from "@/components/ui/Accordion";
import { clsx } from "clsx";

type ColorVariant =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "teal"
  | "rose"
  | "indigo"
  | "amber";

interface AccordionSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  color: ColorVariant;
  defaultOpen?: boolean;
  itemCount?: number;
  children: React.ReactNode;
}

const colorClasses: Record<
  ColorVariant,
  { bg: string; text: string; badge: string }
> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    badge:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-600 dark:text-purple-400",
    badge:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-600 dark:text-green-400",
    badge:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-600 dark:text-orange-400",
    badge:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-600 dark:text-teal-400",
    badge:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-600 dark:text-rose-400",
    badge:
      "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-600 dark:text-indigo-400",
    badge:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

export function AccordionSection({
  icon: Icon,
  title,
  subtitle,
  color,
  defaultOpen = false,
  itemCount,
  children,
}: AccordionSectionProps) {
  const colors = colorClasses[color];

  const trigger = (
    <div className="flex items-center gap-3">
      <div className={clsx("p-2.5 rounded-lg", colors.bg)}>
        <Icon className={clsx("h-5 w-5", colors.text)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {itemCount !== undefined && itemCount > 0 && (
            <span
              className={clsx(
                "px-2 py-0.5 text-xs font-medium rounded-full border",
                colors.badge
              )}>
              {itemCount}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      <Accordion trigger={trigger} defaultOpen={defaultOpen}>
        <div className="px-6 py-6">{children}</div>
      </Accordion>
    </div>
  );
}
