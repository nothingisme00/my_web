"use client";

import { useState, useEffect } from "react";
import { Languages, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeepLUsage {
  character_count: number;
  character_limit: number;
}

export function DeepLUsageWidget() {
  const [usage, setUsage] = useState<DeepLUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate?action=usage", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch usage");
      }

      setUsage(data.usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch usage");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            {error}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pastikan DEEPL_API_KEY sudah diatur di environment variables.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchUsage}
          className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!usage) return null;

  const usedPercentage = Math.round(
    (usage.character_count / usage.character_limit) * 100
  );
  const remaining = usage.character_limit - usage.character_count;
  const isWarning = usage.character_count >= 490000;
  const isCritical = usage.character_count >= 495000;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="space-y-5">
      {/* Usage Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Penggunaan Bulan Ini
          </span>
          <span
            className={`text-sm font-bold ${
              isCritical
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}>
            {usedPercentage}%
          </span>
        </div>

        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? "bg-red-500"
                : isWarning
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Terpakai
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {formatNumber(usage.character_count)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">karakter</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Tersisa
          </p>
          <p
            className={`text-lg font-bold ${
              isCritical
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-800 dark:text-slate-200"
            }`}>
            {formatNumber(remaining)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">karakter</p>
        </div>
      </div>

      {/* Warning/Status Messages */}
      {isCritical ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Kuota Hampir Habis!
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              Tersisa kurang dari 5,000 karakter. Penerjemahan mungkin akan
              gagal.
            </p>
          </div>
        </div>
      ) : isWarning ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Peringatan Kuota
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Penggunaan mendekati batas. Tersisa {formatNumber(remaining)}{" "}
              karakter.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Kuota Aman
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              Masih tersedia banyak kuota untuk penerjemahan.
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
          <Languages className="h-4 w-4" />
          Tentang DeepL Free
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
          <li>• Limit: 500,000 karakter per bulan</li>
          <li>• Reset: Setiap awal bulan</li>
          <li>• Digunakan untuk: Auto-translate Indonesia → English</li>
        </ul>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchUsage}
          className="gap-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
