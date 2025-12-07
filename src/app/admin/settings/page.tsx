"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AccordionSection } from "@/components/admin/AccordionSection";
import {
  Save,
  User,
  Share2,
  Search,
  Check,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageCircle,
  Eye,
  Lock,
  AlertCircle,
  Globe,
  Shield,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Languages,
} from "lucide-react";
import { DeepLUsageWidget } from "@/components/admin/DeepLUsageWidget";

// Login Activity interface
interface LoginActivityItem {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  reason: string | null;
  createdAt: string;
}

// Toggle component
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between py-4 cursor-pointer group">
      <div className="flex-1">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          checked
            ? "bg-indigo-600 dark:bg-indigo-500 focus:ring-indigo-500/50"
            : "bg-slate-300 dark:bg-slate-600 focus:ring-slate-400/50"
        }`}>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("site"); // Controlled accordion state

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Login activity states
  const [loginActivity, setLoginActivity] = useState<LoginActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setIsLoading(false);
      });
  }, []);

  // Fetch login activity
  const fetchLoginActivity = async () => {
    setIsLoadingActivity(true);
    setActivityError("");
    try {
      const res = await fetch("/api/admin/login-activity");
      const data = await res.json();
      if (data.success) {
        setLoginActivity(data.data);
      } else {
        setActivityError("Failed to load login activity");
      }
    } catch {
      setActivityError("Failed to load login activity");
    } finally {
      setIsLoadingActivity(false);
    }
  };

  // Format date for login activity
  const formatActivityDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    await fetch("/api/settings", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handlePasswordChange() {
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field harus diisi");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Gagal mengubah password");
        return;
      }

      setPasswordSuccess("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch {
      setPasswordError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-600/20">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 ml-[52px]">
          Manage your website configuration and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Site Information */}
        <AccordionSection
          icon={User}
          title="Site Information"
          subtitle="Your website identity and contact details"
          color="blue"
          isOpen={openSection === "site"}
          onToggle={(open) => setOpenSection(open ? "site" : null)}>
          <div className="space-y-5">
            <Input
              label="Site Name"
              name="site_name"
              id="site_name"
              defaultValue={settings.site_name || ""}
              placeholder="My Portfolio"
              helperText="The name displayed in browser tabs and search results"
            />

            <div>
              <label
                htmlFor="site_bio"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Site Bio / Tagline
              </label>
              <textarea
                name="site_bio"
                id="site_bio"
                rows={4}
                defaultValue={settings.site_bio || ""}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:focus:border-indigo-500 transition-all resize-none"
                placeholder="Full-stack developer passionate about creating amazing web experiences..."
              />
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">
                A short description about you or your site
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Owner Name"
                name="owner_name"
                id="owner_name"
                defaultValue={settings.owner_name || ""}
                placeholder="John Doe"
                helperText="Your full name"
              />

              <Input
                label="Contact Email"
                name="contact_email"
                id="contact_email"
                type="email"
                defaultValue={settings.contact_email || ""}
                placeholder="hello@example.com"
                helperText="Your public contact email"
              />
            </div>
          </div>
        </AccordionSection>

        {/* Social Media Links */}
        <AccordionSection
          icon={Share2}
          title="Social Media"
          subtitle="Connect your social profiles"
          color="violet"
          isOpen={openSection === "social"}
          onToggle={(open) => setOpenSection(open ? "social" : null)}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label={
                  <span className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </span>
                }
                name="social_github"
                id="social_github"
                type="url"
                defaultValue={settings.social_github || ""}
                placeholder="https://github.com/username"
              />

              <Input
                label={
                  <span className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                    LinkedIn
                  </span>
                }
                name="social_linkedin"
                id="social_linkedin"
                type="url"
                defaultValue={settings.social_linkedin || ""}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label={
                  <span className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    Twitter
                  </span>
                }
                name="social_twitter"
                id="social_twitter"
                type="url"
                defaultValue={settings.social_twitter || ""}
                placeholder="https://twitter.com/username"
              />

              <Input
                label={
                  <span className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-[#E4405F]" />
                    Instagram
                  </span>
                }
                name="social_instagram"
                id="social_instagram"
                type="url"
                defaultValue={settings.social_instagram || ""}
                placeholder="https://instagram.com/username"
              />
            </div>

            <Input
              label={
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </span>
              }
              name="social_whatsapp"
              id="social_whatsapp"
              type="tel"
              defaultValue={settings.social_whatsapp || ""}
              placeholder="6281234567890"
              helperText="Format: Country code + Number (e.g., 628...)"
            />
          </div>
        </AccordionSection>

        {/* SEO Settings */}
        <AccordionSection
          icon={Search}
          title="SEO Settings"
          subtitle="Optimize for search engines"
          color="emerald"
          isOpen={openSection === "seo"}
          onToggle={(open) => setOpenSection(open ? "seo" : null)}>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="seo_description"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Meta Description
                </label>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    (settings.seo_description?.length || 0) > 160
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  }`}>
                  {settings.seo_description?.length || 0}/160
                </span>
              </div>
              <textarea
                name="seo_description"
                id="seo_description"
                rows={4}
                maxLength={160}
                defaultValue={settings.seo_description || ""}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:focus:border-indigo-500 transition-all resize-none"
                placeholder="A portfolio and blog showcasing my work as a full-stack developer..."
              />
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2">
                This description appears in search engine results. Keep it
                between 150-160 characters.
              </p>
            </div>

            <div>
              <Input
                label="Meta Keywords"
                name="seo_keywords"
                id="seo_keywords"
                defaultValue={settings.seo_keywords || ""}
                placeholder="portfolio, developer, web development, blog"
                helperText="Separate keywords with commas"
              />
              {settings.seo_keywords && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {settings.seo_keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* Page Visibility */}
        <AccordionSection
          icon={Eye}
          title="Page Visibility"
          subtitle="Show or hide pages from visitors"
          color="amber"
          isOpen={openSection === "visibility"}
          onToggle={(open) => setOpenSection(open ? "visibility" : null)}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Toggle
              checked={settings.page_blog !== "false"}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  page_blog: checked ? "true" : "false",
                })
              }
              label="Blog"
              description="Display blog posts and articles"
            />
            <input
              type="hidden"
              name="page_blog"
              value={settings.page_blog === "false" ? "false" : "true"}
            />

            <Toggle
              checked={settings.page_portfolio !== "false"}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  page_portfolio: checked ? "true" : "false",
                })
              }
              label="Portfolio"
              description="Showcase your projects and work"
            />
            <input
              type="hidden"
              name="page_portfolio"
              value={settings.page_portfolio === "false" ? "false" : "true"}
            />

            <Toggle
              checked={settings.page_watchlist !== "false"}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  page_watchlist: checked ? "true" : "false",
                })
              }
              label="Watchlist"
              description="Share your movie and anime watchlist"
            />
            <input
              type="hidden"
              name="page_watchlist"
              value={settings.page_watchlist === "false" ? "false" : "true"}
            />

            <Toggle
              checked={settings.page_about !== "false"}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  page_about: checked ? "true" : "false",
                })
              }
              label="About"
              description="Personal information and background"
            />
            <input
              type="hidden"
              name="page_about"
              value={settings.page_about === "false" ? "false" : "true"}
            />
          </div>
        </AccordionSection>

        {/* DeepL Translation Usage */}
        <AccordionSection
          icon={Languages}
          title="DeepL Translation"
          subtitle="Monitor penggunaan kuota terjemahan otomatis"
          color="blue"
          isOpen={openSection === "deepl"}
          onToggle={(open) => setOpenSection(open ? "deepl" : null)}>
          <DeepLUsageWidget />
        </AccordionSection>

        {/* Account Security */}
        <AccordionSection
          icon={Lock}
          title="Account Security"
          subtitle="Manage your password and security settings"
          color="rose"
          isOpen={openSection === "security"}
          onToggle={(open) => setOpenSection(open ? "security" : null)}>
          <div className="space-y-5">
            {/* Error Message */}
            {passwordError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {passwordError}
                </span>
              </div>
            )}

            {/* Success Message */}
            {passwordSuccess && (
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {passwordSuccess}
                </span>
              </div>
            )}

            <div className="grid gap-4">
              <Input
                label="Current Password"
                type="password"
                id="current_password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                variant="outline"
                className="gap-2 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 font-semibold transition-all">
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </AccordionSection>

        {/* Login Activity */}
        <AccordionSection
          icon={Shield}
          title="Login Activity"
          subtitle="Monitor recent login attempts to your account"
          color="slate"
          isOpen={openSection === "activity"}
          onToggle={(isOpen) => {
            setOpenSection(isOpen ? "activity" : null);
            if (isOpen && loginActivity.length === 0) {
              fetchLoginActivity();
            }
          }}>
          <div className="space-y-4">
            {/* Refresh Button */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing last 20 login attempts
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchLoginActivity}
                disabled={isLoadingActivity}
                className="gap-2 text-sm">
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingActivity ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>

            {/* Error */}
            {activityError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  {activityError}
                </span>
              </div>
            )}

            {/* Loading */}
            {isLoadingActivity && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            )}

            {/* Activity List */}
            {!isLoadingActivity && loginActivity.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                          Status
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                          Email
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                          IP Address
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loginActivity.map((activity) => (
                        <tr
                          key={activity.id}
                          className={`${
                            activity.success
                              ? "bg-white dark:bg-slate-900"
                              : "bg-red-50/50 dark:bg-red-950/20"
                          }`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {activity.success ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  activity.success
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}>
                                {activity.success ? "Success" : "Failed"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                              {activity.email}
                            </span>
                            {activity.reason && !activity.success && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {activity.reason === "invalid-password" &&
                                  "Wrong password"}
                                {activity.reason === "user-not-found" &&
                                  "User not found"}
                                {activity.reason === "rate-limited" &&
                                  "Rate limited"}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                              {activity.ipAddress}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {formatActivityDate(activity.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingActivity &&
              loginActivity.length === 0 &&
              !activityError && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No login activity recorded yet</p>
                </div>
              )}

            {/* Security Tips */}
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                🔒 Security Tips
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                <li>
                  • Failed login attempts are automatically rate-limited (5
                  attempts per 15 min)
                </li>
                <li>• Login sessions expire after 7 days of inactivity</li>
                <li>• Always use a strong, unique password</li>
                <li>• Check this log regularly for suspicious activity</li>
              </ul>
            </div>
          </div>
        </AccordionSection>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 dark:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20">
                <Check className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  Settings saved successfully
                </span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSaving}
            className="gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
