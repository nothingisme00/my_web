'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AccordionSection } from '@/components/admin/AccordionSection';
import { Save, User, Share2, Search, Check, Loader2, Github, Linkedin, Twitter, Instagram, MessageCircle } from 'lucide-react';


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

    await fetch('/api/settings', {
      method: 'POST',
      body: new FormData(e.currentTarget),
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure your site information, social links, and SEO settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Site Information */}
        <AccordionSection icon={User} title="Site Information" subtitle="Basic information about your website" color="blue" defaultOpen={true}>
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
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full-stack developer passionate about creating amazing web experiences..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                A short description about you or your site
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </AccordionSection>

        {/* Social Media Links */}
        <AccordionSection icon={Share2} title="Social Media Links" subtitle="Connect your social media profiles" color="purple" defaultOpen={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  label={
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>GitHub</span>
                    </div>
                  }
                  name="social_github"
                  id="social_github"
                  type="url"
                  defaultValue={settings.social_github || ''}
                  placeholder="https://github.com/username"
                />
                {settings.social_github && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 truncate">
                    {settings.social_github}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label={
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </div>
                  }
                  name="social_linkedin"
                  id="social_linkedin"
                  type="url"
                  defaultValue={settings.social_linkedin || ''}
                  placeholder="https://linkedin.com/in/username"
                />
                {settings.social_linkedin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 truncate">
                    {settings.social_linkedin}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label={
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-500" />
                      <span>Twitter</span>
                    </div>
                  }
                  name="social_twitter"
                  id="social_twitter"
                  type="url"
                  defaultValue={settings.social_twitter || ''}
                  placeholder="https://twitter.com/username"
                />
                {settings.social_twitter && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 truncate">
                    {settings.social_twitter}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label={
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                  }
                  name="social_instagram"
                  id="social_instagram"
                  type="url"
                  defaultValue={settings.social_instagram || ''}
                  placeholder="https://instagram.com/username"
                />
                {settings.social_instagram && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 truncate">
                    {settings.social_instagram}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label={
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span>WhatsApp Number</span>
                    </div>
                  }
                  name="social_whatsapp"
                  id="social_whatsapp"
                  type="tel"
                  defaultValue={settings.social_whatsapp || ''}
                  placeholder="6281234567890"
                  helperText="Format: Country code + Number (e.g., 628...)"
                />
                {settings.social_whatsapp && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">
                    +{settings.social_whatsapp}
                  </p>
                )}
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* SEO Settings */}
        <AccordionSection icon={Search} title="SEO Settings" subtitle="Optimize your site for search engines" color="green" defaultOpen={false}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meta Description
                </label>
                <span className={`text-xs font-medium ${
                  (settings.seo_description?.length || 0) > 160
                    ? 'text-red-600 dark:text-red-400'
                    : (settings.seo_description?.length || 0) > 150
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {settings.seo_description?.length || 0}/160
                </span>
              </div>
              <textarea
                name="seo_description"
                id="seo_description"
                rows={3}
                maxLength={160}
                defaultValue={settings.seo_description || ''}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A portfolio and blog showcasing my work as a full-stack developer..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Recommended: 150-160 characters for optimal search results
              </p>
            </div>

            <div>
              <Input
                label="Meta Keywords"
                name="seo_keywords"
                id="seo_keywords"
                defaultValue={settings.seo_keywords || ''}
                placeholder="portfolio, developer, web development, blog"
                helperText="Comma-separated keywords for search engines"
              />
              {settings.seo_keywords && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {settings.seo_keywords.split(',').map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Settings saved successfully</span>
            </div>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
