"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { deletePost, archivePost, restorePost } from "@/lib/actions";
import { toast } from "@/hooks/useToast";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Eye,
  Archive,
  RotateCcw,
} from "lucide-react";
import { Post, Category } from "@prisma/client";

type PostWithCategory = Post & {
  category: Category | null;
};

interface PostsTableProps {
  initialPosts: PostWithCategory[];
  categories: Category[];
}

export function PostsTable({ initialPosts, categories }: PostsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    post: PostWithCategory | null;
  }>({
    isOpen: false,
    post: null,
  });
  const [isPending, startTransition] = useTransition();

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.status === "published") ||
        (statusFilter === "draft" && post.status === "draft") ||
        (statusFilter === "archived" && post.status === "archived");

      const matchesCategory =
        categoryFilter === "all" || post.categoryId === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [initialPosts, searchQuery, statusFilter, categoryFilter]);

  const handleDeleteClick = (post: PostWithCategory) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;

    const postToDelete = deleteModal.post;
    startTransition(async () => {
      try {
        await deletePost(postToDelete.id);
        toast.success("Post deleted successfully!");
        setDeleteModal({ isOpen: false, post: null });
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete post. Please try again.");
      }
    });
  };

  const handleArchive = async (post: PostWithCategory) => {
    startTransition(async () => {
      try {
        await archivePost(post.id);
        toast.success("Post archived successfully!");
      } catch (error) {
        console.error("Archive failed:", error);
        toast.error("Failed to archive post. Please try again.");
      }
    });
  };

  const handleRestore = async (post: PostWithCategory) => {
    startTransition(async () => {
      try {
        await restorePost(post.id);
        toast.success("Post restored and published!");
      } catch (error) {
        console.error("Restore failed:", error);
        toast.error("Failed to restore post. Please try again.");
      }
    });
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Posts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredPosts.length} of {initialPosts.length} posts
            </p>
          </div>
          <Link href="/admin/posts/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
            />
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Views
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : post.status === "archived"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                        {post.status === "published"
                          ? "Published"
                          : post.status === "archived"
                          ? "Archived"
                          : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Archive/Restore Button */}
                        {post.status === "archived" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(post)}
                            disabled={isPending}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Restore & Publish">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : post.status === "published" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchive(post)}
                            disabled={isPending}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            title="Archive">
                            <Archive className="h-4 w-4" />
                          </Button>
                        ) : null}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(post)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No posts found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first post to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        itemName={deleteModal.post?.title}
        isDeleting={isPending}
      />
    </>
  );
}
