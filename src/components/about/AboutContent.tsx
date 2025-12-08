"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  Briefcase,
  Users,
  Instagram,
  MessageCircle,
  Github,
  GraduationCap,
  Heart,
  Code,
  Wrench,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getToolIcon } from "@/lib/tool-icons";
import { useTranslations, useLocale } from "next-intl";
import { clsx } from "clsx";

const monthNamesEn: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const monthNamesId: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mei",
  "06": "Jun",
  "07": "Jul",
  "08": "Agu",
  "09": "Sep",
  "10": "Okt",
  "11": "Nov",
  "12": "Des",
};

function formatPeriod(
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  isCurrent: boolean,
  locale: string,
  presentText: string
): string {
  const monthNames = locale === "id" ? monthNamesId : monthNamesEn;
  const start =
    startMonth && startYear
      ? `${monthNames[startMonth] || ""} ${startYear}`
      : startYear || "";
  const end = isCurrent
    ? presentText
    : endMonth && endYear
    ? `${monthNames[endMonth] || ""} ${endYear}`
    : endYear || "";
  return start && end ? `${start} - ${end}` : start || end || "";
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
  period?: string; // Legacy field
  startYear?: string;
  endYear?: string;
  description: string;
  gpa?: string;
  thesis?: string;
  locationUrl?: string;
}

interface AboutData {
  name: string;
  title: string;
  titleEn?: string;
  tagline: string;
  taglineEn?: string;
  profileImage: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  bioEn?: string;
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

// Card configuration for "Know More" section
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  children: React.ReactNode;
  className?: string;
}

// Static Info Card Component - displays content directly
function InfoCard({
  icon,
  title,
  bgColor,
  children,
  className,
}: InfoCardProps) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full",
        className
      )}>
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className={clsx("p-2 rounded-xl", bgColor)}>{icon}</div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}

// Icon Badge for Tech Stack & Tools - Icon only without frame
function IconBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="group relative inline-flex items-center justify-center p-1.5 hover:scale-110 transition-transform duration-300 z-0 hover:z-50">
      <div className="grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500 ease-out">
        {icon}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-[100] shadow-lg">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
}

// Experience Card with Accordion for job descriptions
interface ExperienceCardProps {
  experiences: Experience[];
  t: ReturnType<typeof useTranslations<"about">>;
  locale: string;
}

function ExperienceCard({ experiences, t, locale }: ExperienceCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t("experience")}
          </h3>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            const description =
              locale === "id" ? exp.descriptionId : exp.descriptionEn;
            const hasDescription = description && description.trim().length > 0;

            return (
              <div
                key={exp.id}
                className="relative p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="pl-4 border-l-3 border-blue-400 dark:border-blue-500">
                  {/* Main Info - Always visible */}
                  <div
                    className={clsx(
                      "cursor-pointer",
                      hasDescription && "hover:opacity-80"
                    )}
                    onClick={() => hasDescription && toggleExpand(exp.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                            {exp.title}
                          </h4>
                          {exp.isCurrent && (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                              {t("currentlyWorking")}
                            </span>
                          )}
                        </div>
                        <p className="text-base text-blue-600 dark:text-blue-400 font-medium mt-1">
                          {exp.company}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatPeriod(
                            exp.startMonth,
                            exp.startYear,
                            exp.endMonth,
                            exp.endYear,
                            exp.isCurrent,
                            locale,
                            t("present")
                          )}
                        </p>
                      </div>
                      {hasDescription && (
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}>
                          <ChevronDown
                            className={clsx(
                              "h-5 w-5 text-gray-400 transition-transform duration-300",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {isExpanded && hasDescription && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Education Card with Accordion for details
interface EducationCardProps {
  educations: Education[];
  t: ReturnType<typeof useTranslations<"about">>;
}

function EducationCard({ educations, t }: EducationCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t("education")}
          </h3>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          {educations.map((edu) => {
            const isExpanded = expandedId === edu.id;
            // Check for expandable details
            const hasDetails = edu.thesis || edu.locationUrl;

            // Format period from startYear and endYear, fallback to legacy period field
            const periodDisplay = edu.startYear
              ? `${edu.startYear} - ${edu.endYear || "Present"}`
              : edu.period || "";

            return (
              <div
                key={edu.id}
                className="relative p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="pl-4 border-l-3 border-orange-400 dark:border-orange-500">
                  {/* Main Info - Always visible */}
                  <div
                    className={clsx(
                      hasDetails && "cursor-pointer hover:opacity-80"
                    )}
                    onClick={() => hasDetails && toggleExpand(edu.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {/* 1. Institution Name */}
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                          {edu.institution}
                        </h4>
                        {/* 2. Degree */}
                        <p className="text-base text-orange-600 dark:text-orange-400 font-medium mt-1">
                          {edu.degree}
                        </p>
                        {/* 3. GPA - Always visible, subtle */}
                        {edu.gpa && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            GPA:{" "}
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {edu.gpa}
                            </span>
                          </p>
                        )}
                        {/* 4. Period */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                          {periodDisplay}
                        </p>
                      </div>
                      {hasDetails && (
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}>
                          <ChevronDown
                            className={clsx(
                              "h-5 w-5 text-gray-400 transition-transform duration-300",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && hasDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                          {edu.thesis && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Thesis:
                              </span>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                                {edu.thesis}
                              </p>
                            </div>
                          )}
                          {edu.locationUrl && (
                            <div
                              className={clsx(
                                edu.thesis &&
                                  "pt-2 mt-2 border-t border-gray-100 dark:border-gray-600"
                              )}>
                              <a
                                href={edu.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    fill="#EA4335"
                                  />
                                  <circle cx="12" cy="9" r="2.5" fill="#fff" />
                                </svg>
                                View Location
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Volunteering Card with Accordion for descriptions
interface VolunteeringCardProps {
  volunteering: Volunteer[];
  t: ReturnType<typeof useTranslations<"about">>;
  locale: string;
}

function VolunteeringCard({ volunteering, t, locale }: VolunteeringCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/30">
            <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t("volunteering.title")}
          </h3>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          {volunteering.map((vol) => {
            const isExpanded = expandedId === vol.id;
            const description =
              locale === "id" ? vol.descriptionId : vol.descriptionEn;
            const hasDescription = description && description.trim().length > 0;

            return (
              <div
                key={vol.id}
                className="relative p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="pl-4 border-l-3 border-teal-400 dark:border-teal-500">
                  {/* Main Info - Always visible */}
                  <div
                    className={clsx(
                      hasDescription && "cursor-pointer hover:opacity-80"
                    )}
                    onClick={() => hasDescription && toggleExpand(vol.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                          {vol.role}
                        </h4>
                        <p className="text-base text-teal-600 dark:text-teal-400 font-medium mt-1">
                          {vol.organization}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {vol.period}
                        </p>
                      </div>
                      {hasDescription && (
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}>
                          <ChevronDown
                            className={clsx(
                              "h-5 w-5 text-gray-400 transition-transform duration-300",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {isExpanded && hasDescription && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AboutContent({ aboutData, settings }: AboutContentProps) {
  const t = useTranslations("about");
  const locale = useLocale();

  // Use aboutData or fallback to settings/defaults
  const name = aboutData?.name || settings?.owner_name || "Alfattah";
  // Bilingual support for title, tagline, bio
  const title =
    locale === "en" && aboutData?.titleEn
      ? aboutData.titleEn
      : aboutData?.title || "Learning Enthusiast";
  const tagline =
    locale === "en" && aboutData?.taglineEn
      ? aboutData.taglineEn
      : aboutData?.tagline || "";
  const bio =
    locale === "en" && aboutData?.bioEn
      ? aboutData.bioEn
      : aboutData?.bio || "";
  const profileImage = aboutData?.profileImage || "";
  const cvUrl = aboutData?.cvUrl || "";
  const portfolioUrl = aboutData?.portfolioUrl || "";
  const techStack = aboutData?.techStack
    ? aboutData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const tools = aboutData?.tools
    ? aboutData.tools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const hobbies = aboutData?.hobbies
    ? aboutData.hobbies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const experiences = aboutData?.experiences || [];
  const volunteering = aboutData?.volunteering || [];
  const educations = aboutData?.educations || [];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Check if Know More section should be shown
  const hasKnowMoreContent =
    educations.length > 0 ||
    experiences.length > 0 ||
    volunteering.length > 0 ||
    hobbies.length > 0 ||
    techStack.length > 0 ||
    tools.length > 0;

  return (
    <div className="transition-colors duration-300 min-h-screen">
      {/* Hero Section - Split Layout */}
      <section className="relative pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}>
            {/* Back/Title Label */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <ArrowLeft className="h-4 w-4" />
                {t("title")}
              </span>
            </motion.div>

            {/* Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              {/* Left - Text Content (wider: 3 columns) */}
              <motion.div
                variants={itemVariants}
                className="order-2 lg:order-1 lg:col-span-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  {locale === "id" ? "Saya " : "I'm "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {name}
                  </span>
                  {locale === "id" ? "," : ","}
                  <br />
                  <span className="text-gray-700 dark:text-gray-300">
                    {title}
                  </span>
                </h1>

                {tagline && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-2xl">
                    {tagline}
                  </p>
                )}

                {bio && (
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl">
                    {bio.split("\n")[0]}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {cvUrl && (
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                      <Download className="h-5 w-5" />
                      {t("downloadCV")}
                    </a>
                  )}
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white text-gray-900 dark:text-white rounded-full font-semibold transition-all duration-300">
                      <ExternalLink className="h-5 w-5" />
                      Portfolio
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {settings?.social_github && (
                    <a
                      href={settings.social_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                      aria-label="GitHub">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {settings?.social_instagram && (
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                      aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {settings?.social_whatsapp && (
                    <a
                      href={settings.social_whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                      aria-label="WhatsApp">
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Right - Profile Image (narrower: 2 columns) */}
              <motion.div
                variants={itemVariants}
                className="order-1 lg:order-2 lg:col-span-2 flex justify-center lg:justify-end">
                <div className="relative w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-112">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={name}
                      className="object-cover object-top"
                      fill
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white text-7xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Know More About Me Section */}
      {hasKnowMoreContent && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={containerVariants}>
              {/* Section Header */}
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("knowMore.title")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t("knowMore.subtitle")}
                </p>
              </motion.div>

              {/* Bento Grid Layout */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Education - Full width with accordion */}
                {educations.length > 0 && (
                  <EducationCard educations={educations} t={t} />
                )}

                {/* Experience - Full width with accordion */}
                {experiences.length > 0 && (
                  <ExperienceCard
                    experiences={experiences}
                    t={t}
                    locale={locale}
                  />
                )}

                {/* Volunteering - Full width with accordion */}
                {volunteering.length > 0 && (
                  <VolunteeringCard
                    volunteering={volunteering}
                    t={t}
                    locale={locale}
                  />
                )}

                {/* Hobbies - 1/3 width, side by side with Tech Stack and Tools */}
                {hobbies.length > 0 && (
                  <InfoCard
                    icon={
                      <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    }
                    title={t("hobbies")}
                    bgColor="bg-rose-100 dark:bg-rose-900/30">
                    <div className="flex flex-wrap gap-2">
                      {hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 text-sm font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </InfoCard>
                )}

                {/* Tech Stack - 1/3 width */}
                {techStack.length > 0 && (
                  <InfoCard
                    icon={
                      <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    }
                    title={t("techStack")}
                    bgColor="bg-purple-100 dark:bg-purple-900/30">
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech) => (
                        <IconBadge
                          key={tech}
                          icon={getToolIcon(tech)}
                          label={tech}
                        />
                      ))}
                    </div>
                  </InfoCard>
                )}

                {/* Tools - 1/3 width */}
                {tools.length > 0 && (
                  <InfoCard
                    icon={
                      <Wrench className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    }
                    title={t("tools")}
                    bgColor="bg-indigo-100 dark:bg-indigo-900/30">
                    <div className="flex flex-wrap gap-2">
                      {tools.map((tool) => (
                        <IconBadge
                          key={tool}
                          icon={getToolIcon(tool)}
                          label={tool}
                        />
                      ))}
                    </div>
                  </InfoCard>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={containerVariants}>
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("contact.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("contact.description")}
              </p>
            </motion.div>

              <motion.div
                variants={itemVariants}
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-10 border border-gray-200 dark:border-gray-700 shadow-xl">
                <ContactForm />
              </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
