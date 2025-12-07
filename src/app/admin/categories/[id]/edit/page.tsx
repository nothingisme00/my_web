import { getCategoryById, updateCategory } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const updateWithId = updateCategory.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Category
        </h1>
      </div>

      <form
        action={updateWithId}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <Input
          label="Name"
          name="name"
          id="name"
          required
          defaultValue={category.name}
          placeholder="Category name"
        />

        <Input
          label="Slug"
          name="slug"
          id="slug"
          required
          defaultValue={category.slug}
          placeholder="category-slug"
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            defaultValue={category.description || ""}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the category"
          />
        </div>

        <Button type="submit" className="w-full gap-2 justify-center">
          <Save className="h-4 w-4" /> Update Category
        </Button>
      </form>
    </div>
  );
}
