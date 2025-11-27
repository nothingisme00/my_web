"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MapPin, Mail, Globe, Download, FileText, Briefcase, Users, Instagram, Phone } from "lucide-react";
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
  };
}

export function AboutContent({ aboutData, settings }: AboutContentProps) {
  const t = useTranslations('about');
  const locale = useLocale();

  // Use aboutData or fallback to settings/defaults
  const name = aboutData?.name || settings?.owner_name || 'Alfattah';
  const title = aboutData?.title || 'Learning Enthusiast';
  const tagline = aboutData?.tagline || '';
  const profileImage = aboutData?.profileImage || '';
  const location = aboutData?.location || '';
  const email = aboutData?.email || settings?.contact_email || '';
  const website = aboutData?.website || '';
  const bio = aboutData?.bio || '';
  const cvUrl = aboutData?.cvUrl || '';
  const portfolioUrl = aboutData?.portfolioUrl || '';
  const techStack = aboutData?.techStack ? aboutData.techStack.split(',').map(t => t.trim()) : [];
  const tools = aboutData?.tools ? aboutData.tools.split(',').map(t => t.trim()) : [];
  const hobbies = aboutData?.hobbies ? aboutData.hobbies.split(',').map(t => t.trim()) : [];
  const experiences = aboutData?.experiences || [];
  const volunteering = aboutData?.volunteering || [];
  const educations = aboutData?.educations || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="py-16 lg:py-20 transition-colors duration-300 min-h-screen relative">
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mx-auto max-w-3xl text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
              {t('title')}
            </h1>
            {(tagline || bio) && (
              <p className="text-xl leading-8 text-gray-600 dark:text-gray-300">
                {tagline || bio.split('\n')[0]}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Sidebar Info - GLASSMORPHISM CARD */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-8">
                <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 border-2 border-gray-200/60 dark:border-gray-700/60">
                  {/* Top Section: Photo, Name, Icons */}
                  <div className="p-8 md:p-10 pb-4 md:pb-4">
                    {/* Profile Avatar - Large & Centered */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 ring-4 ring-white/10 dark:ring-white/5">
                        {profileImage ? (
                          <Image src={profileImage} alt={name} className="object-cover" fill unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-4">{title}</p>
                      
                      {/* Contact Icons - Centered below Title */}
                      <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
                        {location && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all hover:scale-110"
                            title={location}
                          >
                            <MapPin className="h-5 w-5" />
                          </a>
                        )}
                        {email && (
                          <a 
                            href={`mailto:${email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all hover:scale-110"
                            title={email}
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                        {website && (
                          <a 
                            href={website.startsWith('http') ? website : `https://${website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all hover:scale-110"
                            title={website}
                          >
                            <Globe className="h-5 w-5" />
                          </a>
                        )}
                        {settings?.social_instagram && (
                          <a 
                            href={settings.social_instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-all hover:scale-110"
                            title="Instagram"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                        {settings?.social_whatsapp && (
                          <a 
                            href={`https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all hover:scale-110"
                            title="WhatsApp"
                          >
                            <Phone className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider - Full Width */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-50" />

                  {/* Action Buttons */}
                  {(cvUrl || portfolioUrl) && (
                    <div className="p-8 md:p-10 pt-4 md:pt-4 space-y-3">
                      {cvUrl && (
                        <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <Button className="w-full py-6 text-base gap-3 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-none justify-center rounded-xl">
                            <Download className="h-5 w-5" /> {t('downloadCV')}
                          </Button>
                        </a>
                      )}
                      {portfolioUrl && (
                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <Button variant="outline" className="w-full py-6 text-base gap-3 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:-translate-y-1 transition-all duration-300 justify-center rounded-xl border-2">
                            <FileText className="h-5 w-5" /> Portfolio
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content - Transparent with High Contrast Border */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 border-2 border-gray-200/60 dark:border-gray-700/60">
                
                {/* Bio */}
                {bio && (
                  <div className="p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('bio')}</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {bio.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {educations.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('education')}</h2>
                      <div className="space-y-8">
                        {educations.map((edu) => (
                          <div key={edu.id} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white/30 dark:ring-gray-900/30" />
                            <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</span>
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{edu.institution}</p>
                            <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Experience - Accordion Style */}
                {experiences.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('experience')}</h2>
                      <div className="space-y-4">
                        {experiences.map((exp) => (
                          <Accordion
                            key={exp.id}
                            helperText={t('clickToView')}
                            trigger={
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 hidden sm:block">
                                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                                  <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent)}
                                  </p>
                                </div>
                              </div>
                            }
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                              {locale === 'id' ? exp.descriptionId : exp.descriptionEn}
                            </p>
                          </Accordion>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Volunteering & Organization */}
                {volunteering.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('volunteering.title')}</h2>
                      <div className="space-y-4">
                        {volunteering.map((vol) => (
                          <Accordion
                            key={vol.id}
                            helperText={t('clickToView')}
                            trigger={
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg shrink-0 hidden sm:block">
                                  <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vol.role}</h3>
                                  <p className="text-teal-600 dark:text-teal-400 font-medium">{vol.organization}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{vol.period}</p>
                                </div>
                              </div>
                            }
                          >
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                              {locale === 'id' ? vol.descriptionId : vol.descriptionEn}
                            </p>
                          </Accordion>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Hobbies */}
                {hobbies.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('hobbies')}</h2>
                      <div className="flex flex-wrap gap-3">
                        {hobbies.map((hobby) => (
                          <span
                            key={hobby}
                            className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/20 px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Tech Stack */}
                {techStack.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('techStack')}</h2>
                      <div className="flex flex-wrap gap-3">
                        {techStack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:scale-105"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Tools */}
                {tools.length > 0 && (
                  <>
                    <div className="my-8 h-[1.5px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-800 to-transparent" />
                    <div className="p-8 md:p-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('tools')}</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {tools.map((tool) => (
                          <div
                            key={tool}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <div className="flex-shrink-0 w-5 h-5 text-gray-700 dark:text-gray-300">
                              {getToolIcon(tool)}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {tool}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.section variants={itemVariants} className="border-t border-gray-200 dark:border-gray-800 pt-20 mt-20">
            <div className="mx-auto max-w-3xl">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('contact.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t('contact.description')}
                </p>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-700 shadow-xl">
                <ContactForm />
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
