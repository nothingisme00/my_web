'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, User, Share2, Search, Check } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);

    await fetch('/api/settings', {
      method: 'POST',
      body: formData,
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your site configuration, social links, and SEO settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Basic information about your site</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Site Name"
              name="site_name"
              id="site_name"
              defaultValue={settings.site_name || ''}
              placeholder="My Portfolio"
              helperText="The name of your website"
            />

            <div>
              <label htmlFor="site_bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Bio / Tagline
              </label>
              <textarea
                name="site_bio"
                id="site_bio"
                rows={3}
                defaultValue={settings.site_bio || ''}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full-stack developer passionate about creating amazing web experiences..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                A short description about you or your site
              </p>
            </div>

            <Input
              label="Owner Name"
              name="owner_name"
              id="owner_name"
              defaultValue={settings.owner_name || ''}
              placeholder="John Doe"
              helperText="Your full name"
            />

            <Input
              label="Contact Email"
              name="contact_email"
              id="contact_email"
              type="email"
              defaultValue={settings.contact_email || ''}
              placeholder="hello@example.com"
              helperText="Your public contact email"
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your social media profiles</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="GitHub"
              name="social_github"
              id="social_github"
              type="url"
              defaultValue={settings.social_github || ''}
              placeholder="https://github.com/username"
            />

            <Input
              label="LinkedIn"
              name="social_linkedin"
              id="social_linkedin"
              type="url"
              defaultValue={settings.social_linkedin || ''}
              placeholder="https://linkedin.com/in/username"
            />

            <Input
              label="Twitter"
              name="social_twitter"
              id="social_twitter"
              type="url"
              defaultValue={settings.social_twitter || ''}
              placeholder="https://twitter.com/username"
            />

            <Input
              label="Instagram"
              name="social_instagram"
              id="social_instagram"
              type="url"
              defaultValue={settings.social_instagram || ''}
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Default meta tags for search engines</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                name="seo_description"
                id="seo_description"
                rows={3}
                defaultValue={settings.seo_description || ''}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A portfolio and blog showcasing my work as a full-stack developer..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default description for search engines (150-160 characters)
              </p>
            </div>

            <Input
              label="Meta Keywords"
              name="seo_keywords"
              id="seo_keywords"
              defaultValue={settings.seo_keywords || ''}
              placeholder="portfolio, developer, web development, blog"
              helperText="Comma-separated keywords"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center gap-4">
          {saved && (
            <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <Check className="h-4 w-4" /> Settings saved!
            </span>
          )}
          <Button type="submit" disabled={isSaving} className="gap-2 px-8">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
