import { getSettings, getAboutContent } from "@/lib/actions";
import { AboutContent } from "@/components/about/AboutContent";
import { isPageEnabled } from "@/lib/page-visibility";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let aboutData = null;
  let settings = null;
  let hasError = false;

  try {
    // Check if page is enabled
    const pageEnabled = await isPageEnabled("page_about");
    if (!pageEnabled) {
      notFound();
    }

    [aboutData, settings] = await Promise.all([
      getAboutContent(),
      getSettings(),
    ]);
  } catch (error) {
    console.error("Database error:", error);
    hasError = true;
  }

  // If there's an error or no settings, show a minimal page with contact form
  if (hasError || !settings) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About Me
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Content is being set up. Please check back later or contact me
            below.
          </p>

          {/* Contact Form Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Get in Touch
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    );
  }

  // Pass aboutData (can be null) to AboutContent - it handles null case
  return <AboutContent aboutData={aboutData} settings={settings} />;
}
