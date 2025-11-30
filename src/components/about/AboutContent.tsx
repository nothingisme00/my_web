"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Mail, Download, Briefcase, Users, Instagram, MessageCircle, Github } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { getToolIcon } from "@/lib/tool-icons";
import { useTranslations, useLocale } from 'next-intl';

const monthNames: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agu',
  '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

function formatPeriod(startMonth: string, startYear: string, endMonth: string, endYear: string, isCurrent: boolean): string {
  const start = startMonth && startYear ? `${monthNames[startMonth] || ''} ${startYear}` : startYear || '';
  const end = isCurrent ? 'Sekarang' : (endMonth && endYear ? `${monthNames[endMonth] || ''} ${endYear}` : endYear || '');
  return start && end ? `${start} - ${end}` : start || end || '';
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  descriptionEn: string;
  descriptionId: string;
  isCurrent: boolean;
}

interface Volunteer {
  id: string;
  role: string;
  organization: string;
  period: string;
  descriptionEn: string;
  descriptionId: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface AboutData {
  name: string;
  title: string;
  tagline: string;
  profileImage: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  cvUrl: string;
  portfolioUrl: string;
  techStack: string;
  tools: string;
  hobbies: string;
  experiences: Experience[];
  volunteering: Volunteer[];
  educations: Education[];
}

interface AboutContentProps {
  aboutData: AboutData | null;
  settings?: {
    owner_name?: string | null;
    contact_email?: string | null;
    social_instagram?: string | null;
    social_whatsapp?: string | null;
    social_github?: string | null;
  };
}

// Spacing and typography constants for bento grid
const SPACING = {
  heroCard: "p-8 md:p-10",
  card: "p-5 md:p-6",
  cardCompact: "p-4 md:p-5",
  cardGap: "gap-3",
  sectionTitle: "mb-4",
  itemGap: "space-y-3",
  iconSize: "w-4 h-4",
  profileImage: "w-48 h-48", // 192px
};

const TYPOGRAPHY = {
  sectionTitle: "text-xl font-bold text-gray-900 dark:text-white",
  cardTitle: "text-base font-bold text-gray-900 dark:text-white",
  subtitle: "text-sm font-medium",
  meta: "text-xs text-gray-500 dark:text-gray-400",
  body: "text-sm text-gray-700 dark:text-gray-300 leading-relaxed",
};

// Icon-only badge component with grayscale + color on hover
interface IconBadgeProps {
  icon: React.ReactNode;
  label: string;
}

function IconBadge({ icon, label }: IconBadgeProps) {
  return (
    <div className="group relative inline-flex items-center justify-center p-2">
      {/* Icon - grayscale by default, colored on hover with smooth transition */}
      <div className="grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:scale-110">
        {icon}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
        {label}
      </div>
    </div>
  );
}

export function AboutContent({ aboutData, settings }: AboutContentProps) {
  const t = useTranslations('about');
  const locale = useLocale();

  // Use aboutData or fallback to settings/defaults
  const name = aboutData?.name || settings?.owner_name || 'Alfattah';
  const title = aboutData?.title || 'Learning Enthusiast';
  const tagline = aboutData?.tagline || '';
  const profileImage = aboutData?.profileImage || '';
  const email = aboutData?.email || settings?.contact_email || '';
  const bio = aboutData?.bio || '';
  const cvUrl = aboutData?.cvUrl || '';
  const portfolioUrl = aboutData?.portfolioUrl || '';
  const techStack = aboutData?.techStack ? aboutData.techStack.split(',').map(t => t.trim()) : [];
  const tools = aboutData?.tools ? aboutData.tools.split(',').map(t => t.trim()) : [];
  const hobbies = aboutData?.hobbies ? aboutData.hobbies.split(',').map(t => t.trim()) : [];
  const experiences = aboutData?.experiences || [];
  const volunteering = aboutData?.volunteering || [];
  const educations = aboutData?.educations || [];

  // Animation variants - updated for faster, snappier animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="transition-colors duration-300 min-h-screen relative">
      {/* Hero Section - Compact */}
      <section className="relative pt-16 pb-3">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className={`bg-white dark:bg-gray-800 rounded-2xl ${SPACING.heroCard} shadow-xl`}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-12">
              {/* Profile Image - Compact */}
              <div className="flex-shrink-0">
                <div className={`relative ${SPACING.profileImage} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
                  {profileImage ? (
                    <Image src={profileImage} alt={name} className="object-cover" fill unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info & CTAs - Compact */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {name}
                </h1>
                <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  {title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 opacity-90">
                  {tagline || bio.split('\n')[0]}
                </p>

                {/* Social Media Icons - Borderless Minimal */}
                <div className="flex gap-3 justify-center md:justify-start mb-5">
                  {email && (
                    <div className="group relative">
                      <a
                        href={`mailto:${email}`}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                        aria-label="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
                        Email
                      </div>
                    </div>
                  )}
                  {settings?.social_instagram && (
                    <div className="group relative">
                      <a
                        href={settings.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
                        Instagram
                      </div>
                    </div>
                  )}
                  {settings?.social_whatsapp && (
                    <div className="group relative">
                      <a
                        href={settings.social_whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
                        WhatsApp
                      </div>
                    </div>
                  )}
                  {settings?.social_github && (
                    <div className="group relative">
                      <a
                        href={settings.social_github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                        aria-label="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
                        GitHub
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Buttons - Row 2 */}
                <div className="flex gap-3 justify-center md:justify-start">
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-300"
                    >
                      <Briefcase className="w-4 h-4" />
                      Portfolio
                    </a>
                  )}
                  {cvUrl && (
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 text-blue-600 dark:text-blue-400 rounded-lg font-semibold transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download CV
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Content Section */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 pt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={`grid grid-cols-1 ${SPACING.cardGap} auto-rows-auto`}
        >
          {/* Education Timeline - Full width */}
          {educations.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('education')}</h2>
              <div className={SPACING.itemGap}>
                {educations.map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l-[1.5px] border-gray-200 dark:border-gray-700">
                    <div className="absolute -left-[6.5px] top-0 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white/30 dark:ring-gray-900/30" />
                    <div className="mb-1 flex flex-col gap-1">
                      <h3 className={TYPOGRAPHY.cardTitle}>{edu.degree}</h3>
                      <span className={TYPOGRAPHY.meta}>{edu.period}</span>
                    </div>
                    <p className={`${TYPOGRAPHY.subtitle} text-blue-600 dark:text-blue-400 mb-2`}>{edu.institution}</p>
                    <p className={`${TYPOGRAPHY.body} text-xs`}>{edu.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience Section - Full width */}
          {experiences.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('experience')}</h2>
              <div className={SPACING.itemGap}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <Accordion
                      helperText={t('clickToView')}
                      trigger={
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                            <Briefcase className={`${SPACING.iconSize} text-blue-600 dark:text-blue-400`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={TYPOGRAPHY.cardTitle}>{exp.title}</h3>
                            <p className={`${TYPOGRAPHY.subtitle} text-blue-600 dark:text-blue-400`}>{exp.company}</p>
                            <p className={TYPOGRAPHY.meta}>
                              {formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent)}
                            </p>
                          </div>
                        </div>
                      }
                    >
                      <p className={`${TYPOGRAPHY.body} mt-2`}>
                        {locale === 'id' ? exp.descriptionId : exp.descriptionEn}
                      </p>
                    </Accordion>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Volunteering - Full width */}
          {volunteering.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('volunteering.title')}</h2>
              <div className={SPACING.itemGap}>
                {volunteering.map((vol) => (
                  <div key={vol.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <Accordion
                      helperText={t('clickToView')}
                      trigger={
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg shrink-0">
                            <Users className={`${SPACING.iconSize} text-teal-600 dark:text-teal-400`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={TYPOGRAPHY.cardTitle}>{vol.role}</h3>
                            <p className={`${TYPOGRAPHY.subtitle} text-teal-600 dark:text-teal-400`}>{vol.organization}</p>
                            <p className={TYPOGRAPHY.meta}>{vol.period}</p>
                          </div>
                        </div>
                      }
                    >
                      <p className={`${TYPOGRAPHY.body} mt-2`}>
                        {locale === 'id' ? vol.descriptionId : vol.descriptionEn}
                      </p>
                    </Accordion>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Hobbies - Full width */}
          {hobbies.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('hobbies')}</h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tech Stack - Icon Only */}
          {techStack.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('techStack')}</h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <IconBadge
                    key={tech}
                    icon={getToolIcon(tech)}
                    label={tech}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Tools - Icon Only */}
          {tools.length > 0 && (
            <motion.div variants={itemVariants} className={`col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${SPACING.card}`}>
              <h2 className={`${TYPOGRAPHY.sectionTitle} ${SPACING.sectionTitle} pb-1.5 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-3/4 after:h-[1px] after:bg-gray-400 dark:after:bg-gray-500`}>{t('tools')}</h2>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <IconBadge
                    key={tool}
                    icon={getToolIcon(tool)}
                    label={tool}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Section - Separate */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="border-t border-gray-200 dark:border-gray-800 pt-16 mt-16"
        >
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.title')}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                {t('contact.description')}
              </p>
            </div>

            {/* Contact Form */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl ${SPACING.heroCard} border border-gray-200 dark:border-gray-700 shadow-xl`}>
              <ContactForm />
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
