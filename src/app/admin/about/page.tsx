'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, User, Briefcase, GraduationCap, Code, Plus, Trash2, Check, Upload, X } from 'lucide-react';

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

const defaultData: AboutData = {
  name: '',
  title: '',
  profileImage: '',
  location: '',
  email: '',
  website: '',
  bio: '',
  cvUrl: '',
  portfolioUrl: '',
  techStack: '',
  tools: '',
  experiences: [],
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
          setData({ ...defaultData, ...result });
        }
        setIsLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    await fetch('/api/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/about/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (result.url) {
      setData(prev => ({ ...prev, profileImage: result.url }));
    }
    setIsUploading(false);
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
        description: '',
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
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your about page content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>

          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0">
                {data.profileImage ? (
                  <>
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isUploading ? 'Uploading...' : 'Upload photo'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, min 200x200px</p>
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
              helperText="Link download CV/Resume"
            />
            <Input
              label="Portfolio URL"
              type="url"
              value={data.portfolioUrl}
              onChange={e => setData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
              placeholder="https://drive.google.com/..."
              helperText="Link download portfolio digital"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              value={data.bio}
              onChange={e => setData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself..."
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tech Stack</h2>
          </div>

          <Input
            label="Technologies"
            value={data.techStack}
            onChange={e => setData(prev => ({ ...prev, techStack: e.target.value }))}
            placeholder="JavaScript, TypeScript, React, Next.js, Node.js"
            helperText="Comma separated list of technologies"
          />
        </div>

        {/* Tools */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tools</h2>
          </div>

          <Input
            label="Tools & Software"
            value={data.tools}
            onChange={e => setData(prev => ({ ...prev, tools: e.target.value }))}
            placeholder="VS Code, Figma, Docker, Git, Postman, Notion"
            helperText="Comma separated list of tools (icons will be shown automatically)"
          />
        </div>

        {/* Experience Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addExperience} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <div className="space-y-6">
            {data.experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-500">Experience #{index + 1}</span>
                  <button type="button" onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mulai</label>
                    <select
                      value={exp.startMonth}
                      onChange={e => updateExperience(exp.id, 'startMonth', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">&nbsp;</label>
                    <select
                      value={exp.startYear}
                      onChange={e => updateExperience(exp.id, 'startYear', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selesai</label>
                    <select
                      value={exp.endMonth}
                      onChange={e => updateExperience(exp.id, 'endMonth', e.target.value)}
                      disabled={exp.isCurrent}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">&nbsp;</label>
                    <select
                      value={exp.endYear}
                      onChange={e => updateExperience(exp.id, 'endYear', e.target.value)}
                      disabled={exp.isCurrent}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.isCurrent}
                    onChange={e => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700 dark:text-gray-300">Posisi saat ini</label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your responsibilities..."
                  />
                </div>
              </div>
            ))}
            {data.experiences.length === 0 && (
              <p className="text-center text-gray-500 py-4">No experience added yet</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addEducation} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <div className="space-y-6">
            {data.educations.map((edu, index) => (
              <div key={edu.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-500">Education #{index + 1}</span>
                  <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Computer Science"
                  />
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                  <Input
                    label="Period"
                    value={edu.period}
                    onChange={e => updateEducation(edu.id, 'period', e.target.value)}
                    placeholder="2016 - 2020"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details..."
                  />
                </div>
              </div>
            ))}
            {data.educations.length === 0 && (
              <p className="text-center text-gray-500 py-4">No education added yet</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center gap-4">
          {saved && (
            <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <Check className="h-4 w-4" /> Saved!
            </span>
          )}
          <Button type="submit" disabled={isSaving} className="gap-2 px-8">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
