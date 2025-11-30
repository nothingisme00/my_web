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
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const isEditing = !!initialData;
  const action = isEditing ? updateProject.bind(null, initialData.id) : createProject;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-2 border-purple-200 dark:border-purple-800">
            <Save className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing ? 'Update your project details' : 'Showcase your amazing work'}
            </p>
          </div>
        </div>
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
            {/* Project Links */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Save className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Project Links</h3>
              </div>

              <div className="space-y-4">
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

                {/* Submit Button */}
                <div className="pt-2">
                  <SubmitButton isEditing={isEditing} />
                </div>
              </div>
            </div>

            {/* Featured Image Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Save className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Featured Image</h3>
              </div>

              <div className="space-y-3">
                <Input
                  label="Image URL"
                  name="image"
                  id="image"
                  type="url"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  placeholder="https://..."
                  helperText="Project screenshot"
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Invalid URL</text></svg>';
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
