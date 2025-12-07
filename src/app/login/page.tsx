"use client";

import Link from "next/link";
import { login } from "@/lib/actions";
import { Input } from "@/components/ui/Input";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import {
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 dark:shadow-indigo-500/30 hover:shadow-indigo-600/40 dark:hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Sign In</span>
        </>
      )}
    </button>
  );
}

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Subtle accent glow - top right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />

        {/* Subtle accent glow - bottom left */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-400/10 dark:bg-slate-600/5 rounded-full blur-3xl" />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-600/25 dark:shadow-indigo-500/25 mb-4">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-slate-950/50 p-8 border border-slate-200 dark:border-slate-800">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 py-2 px-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Secure authentication enabled
            </span>
          </div>

          <form className="space-y-5" action={formAction}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your Email Here"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                showPasswordToggle
                className="h-12"
              />
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  {state.error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to website
            </Link>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Protected by rate limiting • 5 attempts per 15 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
