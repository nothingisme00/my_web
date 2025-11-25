import { Button } from "@/components/ui/Button";
import { Download, Mail, MapPin, Globe, FileText } from "lucide-react";
import { getSettings } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/contact/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { getToolIcon } from "@/lib/tool-icons";
import { getTranslations } from 'next-intl/server';

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
  description: string;
  isCurrent: boolean;
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
  profileImage: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  cvUrl: string;
  portfolioUrl: string;
  techStack: string;
  tools: string;
  experiences: Experience[];
  educations: Education[];
}

async function getAboutContent(): Promise<AboutData | null> {
  const setting = await prisma.settings.findUnique({
    where: { key: 'about_page_content' },
  });

  if (!setting) return null;

  try {
    return JSON.parse(setting.value);
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [aboutData, settings, t] = await Promise.all([
    getAboutContent(),
    getSettings(),
    getTranslations('about'),
  ]);

  // Use aboutData or fallback to settings/defaults
  const name = aboutData?.name || settings.owner_name || 'Alfattah';
  const title = aboutData?.title || 'Learning Enthusiast';
  const profileImage = aboutData?.profileImage || '';
  const location = aboutData?.location || '';
  const email = aboutData?.email || settings.contact_email || '';
  const website = aboutData?.website || '';
  const bio = aboutData?.bio || '';
  const cvUrl = aboutData?.cvUrl || '';
  const portfolioUrl = aboutData?.portfolioUrl || '';
  const techStack = aboutData?.techStack ? aboutData.techStack.split(',').map(t => t.trim()) : [];
  const tools = aboutData?.tools ? aboutData.tools.split(',').map(t => t.trim()) : [];
  const experiences = aboutData?.experiences || [];
  const educations = aboutData?.educations || [];

  return (
    <div className="bg-white dark:bg-gray-900 py-16 lg:py-20 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            {t('title')}
          </h1>
          {bio && (
            <p className="text-xl leading-8 text-gray-600 dark:text-gray-300">
              {bio.split('\n')[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 p-8 border-0">
                {/* Profile Avatar */}
                <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-blue-500 to-blue-600">
                  {profileImage ? (
                    <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{name}</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-6">{title}</p>

                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-8">
                  {location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      <span>{email}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4" />
                      <span>{website}</span>
                    </div>
                  )}
                </div>

                {(cvUrl || portfolioUrl) && (
                  <div className="space-y-3">
                    {cvUrl && (
                      <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <Download className="h-4 w-4" /> {t('downloadCV')}
                        </Button>
                      </a>
                    )}
                    {portfolioUrl && (
                      <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" className="w-full gap-2">
                          <FileText className="h-4 w-4" /> {t('downloadPortfolio')}
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Bio */}
            {bio && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('bio')}</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {bio.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('education')}</h2>
                <div className="space-y-8">
                  {educations.map((edu) => (
                    <div key={edu.id} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-900" />
                      <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</span>
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{edu.institution}</p>
                      <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience - Accordion Style */}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('experience')}</h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <Accordion
                      key={exp.id}
                      trigger={
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent)}
                            </span>
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{exp.company}</p>
                          {exp.isCurrent && (
                            <span className="inline-flex items-center mt-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                              {t('currentlyWorking')}
                            </span>
                          )}
                        </div>
                      }
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                        {exp.description}
                      </p>
                    </Accordion>
                  ))}
                </div>
              </section>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <section>
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
              </section>
            )}

            {/* Tools */}
            {tools.length > 0 && (
              <section>
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
              </section>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <section className="border-t border-gray-200 dark:border-gray-800 pt-20 mt-20">
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
        </section>
      </div>
    </div>
  );
}
