import { getTagById, updateTag } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tag = await getTagById(id);

  if (!tag) {
    notFound();
  }

  const updateWithId = updateTag.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/tags" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Tags
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Tag</h1>
      </div>

      <form action={updateWithId} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <Input
          label="Name"
          name="name"
          id="name"
          required
          defaultValue={tag.name}
          placeholder="Tag name"
        />

        <Input
          label="Slug"
          name="slug"
          id="slug"
          required
          defaultValue={tag.slug}
          placeholder="tag-slug"
        />

        <Button type="submit" className="w-full gap-2 justify-center">
          <Save className="h-4 w-4" /> Update Tag
        </Button>
      </form>
    </div>
  );
}
