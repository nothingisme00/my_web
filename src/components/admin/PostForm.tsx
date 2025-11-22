'use client';

import { createPost, updatePost } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Category, Tag, Post } from '@prisma/client';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { useState } from 'react';

interface PostWithRelations extends Post {
  tags: Tag[];
}

interface PostFormProps {
  categories: Category[];
  tags: Tag[];
  initialData?: PostWithRelations;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 justify-center">
      <Save className="h-4 w-4" />
      {pending ? 'Saving...' : (isEditing ? 'Update Post' : 'Save Post')}
    </Button>
  );
}

export default function PostForm({ categories, tags, initialData }: PostFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  const isEditing = !!initialData;
  const action = isEditing ? updatePost.bind(null, initialData.id) : createPost;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/posts" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Posts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Post' : 'Create New Post'}
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
              placeholder="Enter post title"
            />
            
            <Input
              label="Slug"
              name="slug"
              id="slug"
              required
              defaultValue={initialData?.slug}
              placeholder="url-friendly-slug"
            />

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                defaultValue={initialData?.excerpt || ''}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 resize-y"
                placeholder="Brief summary of the post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <input type="hidden" name="content" value={content} />
              <TipTapEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Write your amazing post content here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {isCreatingCategory ? 'Select Existing' : 'Create New'}
                  </button>
                </div>
                
                {isCreatingCategory ? (
                  <Input
                    name="newCategory"
                    placeholder="Enter new category name"
                    autoFocus
                  />
                ) : (
                  <Select
                    name="categoryId"
                    options={categoryOptions}
                    defaultValue={initialData?.categoryId || ''}
                  />
                )}
              </div>

              <Input
                label="Image URL"
                name="image"
                id="image"
                type="url"
                defaultValue={initialData?.image || ''}
                placeholder="https://..."
                helperText="Direct link to image (Unsplash, etc)"
              />

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <Input
                  name="tagsInput"
                  placeholder="React, Next.js, Tutorial (comma separated)"
                  defaultValue={initialData?.tags.map(t => t.name).join(', ') || ''}
                  helperText="Separate tags with commas. New tags will be created automatically."
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={initialData?.published ?? true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 dark:border-gray-600 dark:bg-gray-800 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">Publish immediately</span>
                </label>
              </div>

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
