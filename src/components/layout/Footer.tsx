import { Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { getSettings } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const settings = await getSettings();
  const t = await getTranslations("footer");

  const socialLinks = [
    {
      name: "GitHub",
      href: settings.social_github,
      icon: Github,
      hoverColor: "hover:text-gray-500 dark:hover:text-gray-300",
    },
    {
      name: "LinkedIn",
      href: settings.social_linkedin,
      icon: Linkedin,
      hoverColor: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      name: "Twitter",
      href: settings.social_twitter,
      icon: Twitter,
      hoverColor: "hover:text-blue-400 dark:hover:text-blue-300",
    },
    {
      name: "Instagram",
      href: settings.social_instagram,
      icon: Instagram,
      hoverColor: "hover:text-pink-500 dark:hover:text-pink-400",
    },
    {
      name: "Email",
      href: settings.contact_email ? `mailto:${settings.contact_email}` : "",
      icon: Mail,
      hoverColor: "hover:text-red-500 dark:hover:text-red-400",
    },
  ].filter((link) => link.href);

  return (
    <footer className="mt-16 md:mt-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        {socialLinks.length > 0 && (
          <div className="flex justify-center space-x-6 md:order-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 ${link.hoverColor} transition-all duration-200 ease-out hover:scale-110`}>
                <span className="sr-only">{link.name}</span>
                <link.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            {settings.owner_name || "Alfattah"}. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
