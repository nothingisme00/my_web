import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getCategories, deleteCategory } from "@/lib/actions";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

type CategoryWithCount = Category & {
  _count?: {
    Post: number;
  };
};

export default async function CategoriesAdminPage() {
  const categories = (await getCategories()) as CategoryWithCount[];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Categories
        </h1>
        <Link href="/admin/categories/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Category
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Posts
                </th>
                <th
                  scope="col"
                  className="relative px-6 py-4 whitespace-nowrap">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      /{category.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">
                      {category.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                      {category._count?.Post || 0} posts
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={deleteCategory.bind(null, category.id)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No categories found. Create one to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
