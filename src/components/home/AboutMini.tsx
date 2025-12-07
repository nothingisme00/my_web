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
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
            {/* Profile Image - Minimal */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
              {profileImage && profileImage !== '/default-avatar.png' ? (
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white text-2xl font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content - Clean & Minimal */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {tagline}
              </p>

              {/* Social Icons - Minimal */}
              <div className="flex items-center gap-2 mb-5 justify-center md:justify-start">
                <a
                  href="https://instagram.com/alfattahatalarais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com/in/alfattah-atalarais-ab2a91211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Minimal Text Link */}
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <span>Learn more about me</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
