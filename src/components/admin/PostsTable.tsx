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
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-4 shadow-sm">
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
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Views
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-150">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-md border ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50"
                            : post.status === "archived"
                            ? "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
                            : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
                        }`}>
                        {post.status === "published"
                          ? "Published"
                          : post.status === "archived"
                          ? "Archived"
                          : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-gray-400" />
                        <span className="tabular-nums">
                          {post.views.toLocaleString()}
                        </span>
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
                      <div className="flex justify-end items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30"
                            title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Archive/Restore Button */}
                        {post.status === "archived" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(post)}
                            disabled={isPending}
                            className="h-8 w-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30"
                            title="Restore & Publish">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : post.status === "published" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleArchive(post)}
                            disabled={isPending}
                            className="h-8 w-8 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30"
                            title="Archive">
                            <Archive className="h-4 w-4" />
                          </Button>
                        ) : null}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(post)}
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30"
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
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                <Filter className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No posts found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
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
