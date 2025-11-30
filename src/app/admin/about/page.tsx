'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AccordionSection } from '@/components/admin/AccordionSection';
import { Save, User, Briefcase, GraduationCap, Code, Plus, Trash2, Check, Upload, X, Heart, Loader2 } from 'lucide-react';

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

const defaultData: AboutData = {
  name: '',
  title: '',
  tagline: '',
  profileImage: '',
  location: '',
  email: '',
  website: '',
  bio: '',
  cvUrl: '',
  portfolioUrl: '',
  techStack: '',
  tools: '',
  hobbies: '',
  experiences: [],
  volunteering: [],
  educations: [],
};


export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(result => {
        if (result && Object.keys(result).length > 0) {
          const migratedExperiences = result.experiences?.map((exp: Experience & { description?: string }) => ({
            ...exp,
            descriptionEn: exp.descriptionEn || exp.description || '',
            descriptionId: exp.descriptionId || exp.description || '',
          })) || [];

          setData({
            ...defaultData,
            ...result,
            experiences: migratedExperiences,
            volunteering: result.volunteering || []
          });
        }
        setIsLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Save failed:', error);
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
        setIsSaving(false);
        return;
      }

      const result = await response.json();
      console.log('Save successful:', result);

      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please check console for details.');
      setIsSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/about/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Upload failed: ${errorData.error || 'Unknown error'}`);
        setIsUploading(false);
        return;
      }

      const result = await res.json();

      if (result.url) {
        const updatedData = { ...data, profileImage: result.url };
        setData(updatedData);

        const saveRes = await fetch('/api/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (!saveRes.ok) {
          alert('Photo uploaded but failed to save. Please click Save button manually.');
          setIsUploading(false);
          return;
        }

        alert('✅ Profile photo uploaded successfully! Page will refresh...');
        setSaved(true);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage() {
    setData(prev => ({ ...prev, profileImage: '' }));
  }

  const months = [
    { value: '', label: 'Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = [{ value: '', label: 'Tahun' }, ...Array.from({ length: 50 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) }))];

  function addExperience() {
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        id: Date.now().toString(),
        title: '',
        company: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        descriptionEn: '',
        descriptionId: '',
        isCurrent: false,
      }],
    }));
  }

  function updateExperience(id: string, field: keyof Experience, value: string | boolean) {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  }

  function removeExperience(id: string) {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  }

  function addVolunteer() {
    setData(prev => ({
      ...prev,
      volunteering: [...prev.volunteering, {
        id: Date.now().toString(),
        role: '',
        organization: '',
        period: '',
        descriptionEn: '',
        descriptionId: '',
      }],
    }));
  }

  function updateVolunteer(id: string, field: keyof Volunteer, value: string) {
    setData(prev => ({
      ...prev,
      volunteering: prev.volunteering.map(vol =>
        vol.id === id ? { ...vol, [field]: value } : vol
      ),
    }));
  }

  function removeVolunteer(id: string) {
    setData(prev => ({
      ...prev,
      volunteering: prev.volunteering.filter(vol => vol.id !== id),
    }));
  }

  function addEducation() {
    setData(prev => ({
      ...prev,
      educations: [...prev.educations, {
        id: Date.now().toString(),
        degree: '',
        institution: '',
        period: '',
        description: '',
      }],
    }));
  }

  function updateEducation(id: string, field: keyof Education, value: string) {
    setData(prev => ({
      ...prev,
      educations: prev.educations.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  }

  function removeEducation(id: string) {
    setData(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id),
    }));
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information, experience, and education
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Section */}
        <AccordionSection icon={User} title="Profile Information" subtitle="Basic details and bio" color="blue" defaultOpen={true}>
          <div className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Profile Photo
              </label>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {data.profileImage ? (
                      <Image src={data.profileImage} alt="Profile" className="object-cover" fill unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-3xl font-semibold">
                        {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  {data.profileImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <label className="cursor-pointer block">
                    <div className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-2">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Photo</span>
                          </>
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: Square image, minimum 200x200px
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={data.name}
                onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
              <Input
                label="Title/Role"
                value={data.title}
                onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Learning Enthusiast"
              />
            </div>

            <Input
              label="Tagline"
              value={data.tagline}
              onChange={e => setData(prev => ({ ...prev, tagline: e.target.value }))}
              placeholder="Crafting digital experiences with passion..."
              helperText="This text will appear under the 'About Me' header"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={data.location}
                onChange={e => setData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Jakarta, Indonesia"
              />
              <Input
                label="Email"
                type="email"
                value={data.email}
                onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="hello@example.com"
              />
              <Input
                label="Website"
                value={data.website}
                onChange={e => setData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="example.com"
              />
              <Input
                label="CV URL"
                type="url"
                value={data.cvUrl}
                onChange={e => setData(prev => ({ ...prev, cvUrl: e.target.value }))}
                placeholder="https://drive.google.com/..."
              />
              <Input
                label="Portfolio URL"
                type="url"
                value={data.portfolioUrl}
                onChange={e => setData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea
                value={data.bio}
                onChange={e => setData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write about yourself..."
              />
            </div>
          </div>
        </AccordionSection>

        {/* Tech Stack */}
        <AccordionSection icon={Code} title="Tech Stack" subtitle="Technologies you work with" color="purple" defaultOpen={false}>
          <Input
            label="Technologies"
            value={data.techStack}
            onChange={e => setData(prev => ({ ...prev, techStack: e.target.value }))}
            placeholder="JavaScript, TypeScript, React, Next.js, Node.js"
            helperText="Comma separated list"
          />
        </AccordionSection>

        {/* Tools */}
        <AccordionSection icon={Code} title="Tools & Software" subtitle="Development and design tools" color="indigo" defaultOpen={false}>
          <Input
            label="Tools"
            value={data.tools}
            onChange={e => setData(prev => ({ ...prev, tools: e.target.value }))}
            placeholder="VS Code, Figma, Docker, Git"
            helperText="Comma separated list"
          />
        </AccordionSection>

        {/* Hobbies */}
        <AccordionSection icon={Heart} title="Hobbies & Interests" subtitle="What you enjoy doing" color="rose" defaultOpen={false}>
          <Input
            label="Hobbies"
            value={data.hobbies}
            onChange={e => setData(prev => ({ ...prev, hobbies: e.target.value }))}
            placeholder="Gaming, Hiking, Photography"
            helperText="Comma separated list"
          />
        </AccordionSection>

        {/* Experience Section */}
        <AccordionSection icon={Briefcase} title="Work Experience" subtitle="Your professional journey" color="green" defaultOpen={false} itemCount={data.experiences.length}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={addExperience} className="gap-2">
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </div>

            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    value={exp.title}
                    onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                    placeholder="Senior Developer"
                  />
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Tech Company"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Month</label>
                    <select
                      value={exp.startMonth}
                      onChange={e => updateExperience(exp.id, 'startMonth', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                    <select
                      value={exp.startYear}
                      onChange={e => updateExperience(exp.id, 'startYear', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Month</label>
                    <select
                      value={exp.endMonth}
                      onChange={e => updateExperience(exp.id, 'endMonth', e.target.value)}
                      disabled={exp.isCurrent}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                    <select
                      value={exp.endYear}
                      onChange={e => updateExperience(exp.id, 'endYear', e.target.value)}
                      disabled={exp.isCurrent}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={e => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Currently working here</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (EN)</label>
                    <textarea
                      value={exp.descriptionEn}
                      onChange={e => updateExperience(exp.id, 'descriptionEn', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your responsibilities..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deskripsi (ID)</label>
                    <textarea
                      value={exp.descriptionId}
                      onChange={e => updateExperience(exp.id, 'descriptionId', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jelaskan tanggung jawab Anda..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {data.experiences.length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">No experience added yet</p>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Volunteering Section */}
        <AccordionSection icon={Heart} title="Volunteering & Organization" subtitle="Community involvement and activities" color="teal" defaultOpen={false} itemCount={data.volunteering.length}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={addVolunteer} className="gap-2">
                <Plus className="h-4 w-4" /> Add Activity
              </Button>
            </div>

            {data.volunteering.map((vol, index) => (
              <div key={vol.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeVolunteer(vol.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Role" value={vol.role} onChange={e => updateVolunteer(vol.id, 'role', e.target.value)} placeholder="Member" />
                  <Input label="Organization" value={vol.organization} onChange={e => updateVolunteer(vol.id, 'organization', e.target.value)} placeholder="Org Name" />
                  <Input label="Period" value={vol.period} onChange={e => updateVolunteer(vol.id, 'period', e.target.value)} placeholder="2024" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (EN)</label>
                    <textarea
                      value={vol.descriptionEn}
                      onChange={e => updateVolunteer(vol.id, 'descriptionEn', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deskripsi (ID)</label>
                    <textarea
                      value={vol.descriptionId}
                      onChange={e => updateVolunteer(vol.id, 'descriptionId', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            {data.volunteering.length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">No activities added yet</p>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Education Section */}
        <AccordionSection icon={GraduationCap} title="Education" subtitle="Academic background and qualifications" color="orange" defaultOpen={false} itemCount={data.educations.length}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={addEducation} className="gap-2">
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            </div>

            {data.educations.map((edu, index) => (
              <div key={edu.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Education #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of CS" />
                  <Input label="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University" />
                  <Input label="Period" value={edu.period} onChange={e => updateEducation(edu.id, 'period', e.target.value)} placeholder="2016 - 2020" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}

            {data.educations.length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">No education added yet</p>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Changes saved successfully</span>
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
