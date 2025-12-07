# Multi-Language (i18n) Migration Guide

This guide will help you complete the multi-language setup for your website (English/Indonesian).

## ✅ Already Completed

The following has been set up for you:

1. ✅ `next-intl` package installed
2. ✅ i18n configuration files created (`src/i18n/config.ts`, `src/i18n/request.ts`)
3. ✅ Translation files created (`src/i18n/messages/en.json`, `src/i18n/messages/id.json`)
4. ✅ Middleware updated to handle locale routing
5. ✅ `next.config.ts` updated with next-intl plugin
6. ✅ `LanguageSwitcher` component created
7. ✅ Contact form placeholders updated ("Your Name", "Input Your Email", etc.)

## 📋 What You Need to Do

To complete the multi-language implementation, you need to migrate your app structure to use `[locale]` dynamic routing.

---

## 🚀 Step-by-Step Migration

### Step 1: Restructure App Directory

You need to move all your current pages into a `[locale]` folder.

#### Current Structure:
```
src/app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
├── blog/
├── projects/
└── ...
```

#### Target Structure:
```
src/app/
├── [locale]/               # NEW: Dynamic locale route
│   ├── layout.tsx          # Move from src/app/layout.tsx
│   ├── page.tsx            # Move from src/app/page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   ├── projects/
│   └── ...
├── admin/                  # Keep as is (no i18n for admin)
├── api/                    # Keep as is
└── login/                  # Keep as is
```

#### Migration Commands:

**Option A: Using Git (Recommended - preserves history)**
```bash
# Create [locale] directory
mkdir -p src/app/\[locale\]

# Move public pages (NOT admin/api/login)
git mv src/app/layout.tsx src/app/\[locale\]/layout.tsx
git mv src/app/page.tsx src/app/\[locale\]/page.tsx
git mv src/app/about src/app/\[locale\]/about

# Move other pages as needed:
# git mv src/app/blog src/app/\[locale\]/blog
# git mv src/app/projects src/app/\[locale\]/projects
```

**Option B: Using File Explorer (Windows)**
1. Create folder `src/app/[locale]` (use `[locale]` exactly - brackets included)
2. Move these folders/files INTO `[locale]`:
   - `layout.tsx`
   - `page.tsx`
   - `about/`
   - Any other public pages (blog/, projects/, etc.)
3. **DO NOT move:**
   - `admin/`
   - `api/`
   - `login/`
   - `globals.css`

---

### Step 2: Update Root Layout

Create a new simple root layout at `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Full Stack Developer Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

This is a minimal wrapper. The actual layout logic stays in `[locale]/layout.tsx`.

---

### Step 3: Update `[locale]/layout.tsx`

Update the layout file you moved to use translations:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Footer } from '@/components/layout/Footer';
import { getSettings } from '@/lib/actions';
import { ScrollToTop } from '@/components/blog/ScrollToTop';
import { ReCaptchaProvider } from '@/components/providers/ReCaptchaProvider';
import { locales } from '@/i18n/config';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.site_name || 'My Portfolio',
      template: `%s | ${settings.site_name || 'My Portfolio'}`,
    },
    description: settings.seo_description || 'Personal portfolio and blog website',
    keywords: settings.seo_keywords || undefined,
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <ReCaptchaProvider>
            <ScrollToTop />
            <LayoutWrapper settings={settings} footer={<Footer />}>
              {children}
            </LayoutWrapper>
          </ReCaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

### Step 4: Add LanguageSwitcher to Header/Navbar

Find your Header or Navbar component and add the LanguageSwitcher:

**Example for `src/components/layout/Header.tsx` or similar:**

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  return (
    <header className="...">
      <nav className="...">
        {/* Your existing nav items */}

        {/* Add Language Switcher */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

Place it wherever makes sense in your design (usually top-right corner of navbar).

---

### Step 5: Update Components to Use Translations

For **client components** (with 'use client'), use `useTranslations`:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('contact.form');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('submit')}</button>
    </div>
  );
}
```

For **server components**, use `getTranslations`:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('home.hero');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

---

### Step 6: Update ContactForm to Use Translations

Update `src/components/contact/ContactForm.tsx` to use translation keys:

**Example replacements:**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact.form');

  // Replace hardcoded text with translation keys:
  // "Send me a message" -> t('title')
  // "Your Name" -> t('name.placeholder')
  // "Name" -> t('name.label')
  // etc.

  return (
    <form>
      <h3>{t('title')}</h3>

      <label>{t('name.label')}</label>
      <input placeholder={t('name.placeholder')} />

      {/* Error messages */}
      {error && <p>{t('error.general')}</p>}

      {/* Success */}
      {isSuccess && <h2>{t('success.title')}</h2>}

      {/* etc. */}
    </form>
  );
}
```

---

### Step 7: Update Navigation Links

All internal links need to include the locale:

**Before:**
```tsx
<Link href="/about">About</Link>
```

**After:**
```tsx
import { Link } from 'next-intl';

<Link href="/about">About</Link>
```

OR with useRouter:

```tsx
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const router = useRouter();
const locale = useLocale();

// Navigate with locale
router.push(`/${locale}/about`);
```

**NOTE:** The `Link` from `next-intl` automatically adds the locale prefix!

---

## 🧪 Testing

After migration, test the following:

### 1. URL Structure
- **English (default)**: `http://localhost:3000/` or `http://localhost:3000/en`
- **Indonesian**: `http://localhost:3000/id`
- **English About**: `http://localhost:3000/about` or `http://localhost:3000/en/about`
- **Indonesian About**: `http://localhost:3000/id/about`

### 2. Language Switching
1. Open website
2. Click LanguageSwitcher dropdown
3. Select "Indonesia"
4. Page should reload with Indonesian text
5. URL should change to `/id/...`
6. Refresh page - should stay in Indonesian
7. Switch back to English - should work

### 3. Form Translations
1. Go to Contact form
2. Switch language
3. All labels, placeholders, errors should translate
4. Submit form - success/error messages should be translated

### 4. Admin Routes (Should NOT be affected)
- `/admin` - Should still work normally
- `/api/*` - Should still work normally
- `/login` - Should still work normally

---

## 🎨 Customization

### Adding More Languages

To add more languages (e.g., Japanese):

1. Edit `src/i18n/config.ts`:
```ts
export const locales = ['en', 'id', 'ja'] as const;

export const localeNames: Record<Locale, string> = {
  en: 'English',
  id: 'Indonesia',
  ja: '日本語',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  id: '🇮🇩',
  ja: '🇯🇵',
};
```

2. Create `src/i18n/messages/ja.json` with Japanese translations

3. Done! The switcher will automatically show the new language.

### Changing Default Language

Edit `src/i18n/config.ts`:
```ts
export const defaultLocale = 'id' as const; // Change to Indonesian
```

### Customizing Switcher Appearance

Edit `src/components/LanguageSwitcher.tsx`:
- Change button styles
- Add/remove flags
- Change dropdown position
- Add icons
- etc.

---

## 📝 Translation File Structure

All translations are in JSON format in `src/i18n/messages/*.json`.

Structure example:
```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "contact": {
    "form": {
      "title": "Send me a message",
      "name": {
        "label": "Name",
        "placeholder": "Your Name",
        "error": "Name is required"
      }
    }
  }
}
```

Access in components:
```ts
const t = useTranslations('nav');
t('home') // "Home"

const tf = useTranslations('contact.form');
tf('title') // "Send me a message"
tf('name.label') // "Name"
```

---

## 🐛 Troubleshooting

### Error: "Page not found" after migration

**Cause:** Files not moved correctly to `[locale]` folder.

**Fix:**
1. Check that files are in `src/app/[locale]/` (not `src/app/locale/`)
2. Brackets `[]` are required in folder name
3. Make sure you didn't move admin/api/login folders

### Error: "Cannot find module './[locale]/layout'"

**Cause:** Missing root layout.

**Fix:** Create simple root `src/app/layout.tsx` as shown in Step 2.

### Language switcher not working

**Cause:** Not wrapped in NextIntlClientProvider.

**Fix:** Make sure `[locale]/layout.tsx` wraps children with `<NextIntlClientProvider messages={messages}>`.

### Translations not showing

**Possible causes:**
1. Translation key typo - check exact key in JSON file
2. JSON syntax error - validate JSON files
3. Not using correct hook - use `useTranslations` for client, `getTranslations` for server

**Debug:**
```tsx
const t = useTranslations('contact.form');
console.log(t.raw('name')); // Shows entire 'name' object
```

### Admin routes redirecting to locale routes

**Cause:** Middleware misconfiguration.

**Fix:** Middleware already configured to skip admin/api/login routes. Check `src/middleware.ts` line 18.

---

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Translation JSON Editor](https://jsoneditoronline.org/)

---

## ✅ Checklist

Before going live, ensure:

- [ ] All pages moved to `[locale]` folder (except admin/api/login)
- [ ] Root layout created at `src/app/layout.tsx`
- [ ] `[locale]/layout.tsx` updated with NextIntlClientProvider
- [ ] LanguageSwitcher added to navbar/header
- [ ] ContactForm updated with translations
- [ ] Other components updated with translations
- [ ] All `<Link>` imports changed to `next-intl`
- [ ] Tested both English and Indonesian
- [ ] Tested language switching
- [ ] Tested all pages in both languages
- [ ] Admin panel still works
- [ ] API routes still work
- [ ] Forms submit correctly in both languages

---

## 🎉 Done!

Once you complete these steps, your website will have full multi-language support with:

- 🌐 English & Indonesian languages
- 🔄 Easy language switching with dropdown
- 🎯 SEO-friendly URLs (`/en/about`, `/id/about`)
- 💾 Language preference saved in localStorage
- 🎨 Beautiful LanguageSwitcher component
- 📱 Mobile-friendly
- ♿ Accessible
- 🚀 Production-ready

If you need help with any step, refer to the next-intl documentation or check the examples in the JSON files!
