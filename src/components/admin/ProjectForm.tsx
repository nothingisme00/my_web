'use client';

import { createProject, updateProject } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Project } from '@prisma/client';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { useState } from 'react';

interface ProjectFormProps {
  initialData?: Project;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 justify-center">
      <Save className="h-4 w-4" />
      {pending ? 'Saving...' : (isEditing ? 'Update Project' : 'Save Project')}
    </Button>
  );
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const isEditing = !!initialData;
  const action = isEditing ? updateProject.bind(null, initialData.id) : createProject;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/projects" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h1>
      </div>

      <form action={action} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Input
              label="Title"
              name="title"
              id="title"
              required
              defaultValue={initialData?.title}
              placeholder="Enter project title"
            />
            
            <Input
              label="Slug"
              name="slug"
              id="slug"
              required
              defaultValue={initialData?.slug}
              placeholder="url-friendly-slug"
            />

            <Input
              label="Tech Stack"
              name="techStack"
              id="techStack"
              defaultValue={initialData?.techStack || ''}
              placeholder="React, Next.js, Tailwind"
              helperText="Comma separated list of technologies"
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                required
                defaultValue={initialData?.description || ''}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-y"
                placeholder="Brief overview of the project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <input type="hidden" name="content" value={content} />
              <TipTapEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Write your project case study here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
              <Input
                label="Image URL"
                name="image"
                id="image"
                type="url"
                defaultValue={initialData?.image || ''}
                placeholder="https://..."
                helperText="Direct link to project screenshot"
              />

              <Input
                label="Demo URL"
                name="demoUrl"
                id="demoUrl"
                type="url"
                defaultValue={initialData?.demoUrl || ''}
                placeholder="https://demo.example.com"
                helperText="Live demo link"
              />

              <Input
                label="GitHub URL"
                name="githubUrl"
                id="githubUrl"
                type="url"
                defaultValue={initialData?.githubUrl || ''}
                placeholder="https://github.com/..."
                helperText="Source code repository"
              />

              <div className="pt-2">
                <SubmitButton isEditing={isEditing} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
