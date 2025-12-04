"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  emptyMessage = "No data available",
}: TableProps<T>) {
  return (
    <div
      className={twMerge(
        "overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm",
        className
      )}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={twMerge(
                  clsx(
                    "px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-700",
                    column.className
                  )
                )}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="group hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-indigo-500">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
