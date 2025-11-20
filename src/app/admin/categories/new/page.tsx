import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createCategory } from '@/lib/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/categories" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Category</h1>
      </div>

      <form action={createCategory} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            required
            placeholder="e.g. Technology"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Slug
          </label>
          <Input
            type="text"
            name="slug"
            id="slug"
            required
            placeholder="e.g. technology"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            URL friendly version of the name. Must be unique.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Optional description for this category"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/categories">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" /> Save Category
          </Button>
        </div>
      </form>
    </div>
  );
}
