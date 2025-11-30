import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Instagram, Linkedin, Mail } from 'lucide-react';

interface AboutData {
  name: string;
  title: string;
  tagline: string;
  profileImage: string;
  email: string;
  website: string;
}

interface AboutMiniProps {
  aboutData: AboutData | null;
}

export function AboutMini({ aboutData }: AboutMiniProps) {
  const name = aboutData?.name || 'Alfattah';
  const title = aboutData?.title || 'QA & Software Testing Enthusiast';
  const tagline = aboutData?.tagline || 'Fresh graduate passionate about software quality';
  const profileImage = aboutData?.profileImage || '/default-avatar.png';
  const email = aboutData?.email || '';

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Profile Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-500/20 flex-shrink-0">
              {profileImage && profileImage !== '/default-avatar.png' ? (
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {name}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                {title}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tagline}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <a
                  href="https://instagram.com/alfattahatalarais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a
                  href="https://linkedin.com/in/alfattah-atalarais-ab2a91211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors group"
              >
                <span>Learn More About Me</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
