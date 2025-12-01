"use client";

import {
  createPost,
  updatePost,
  deleteCategory,
  deleteTag,
  quickCreateCategory,
  quickCreateTag,
  archivePost,
} from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PillSelector } from "@/components/ui/PillSelector";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Send, Archive, Clock } from "lucide-react";
import { Category, Tag, Post } from "@prisma/client";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface PostWithRelations extends Post {
  tags: Tag[];
}

interface PostFormProps {
  categories: Category[];
  tags: Tag[];
  initialData?: PostWithRelations;
}

function SubmitButton({
  type,
  disabled,
}: {
  type: "draft" | "publish";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isPending = pending || disabled;

  if (type === "draft") {
    return (
      <Button
        type="submit"
        name="status"
        value="draft"
        disabled={isPending}
        variant="outline"
        className="flex-1 min-w-0 gap-2 justify-center whitespace-nowrap">
        <FileText className="h-4 w-4 shrink-0" />
        {pending ? "Saving..." : "Save Draft"}
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      name="status"
      value="published"
      disabled={isPending}
      className="flex-1 min-w-0 gap-2 justify-center whitespace-nowrap">
      <Send className="h-4 w-4 shrink-0" />
      {pending ? "Publishing..." : "Publish"}
    </Button>
  );
}

export default function PostForm({
  categories,
  tags,
  initialData,
}: PostFormProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categoryId ? [initialData.categoryId] : []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags.map((t) => t.id) || []
  );
  const [categoriesState, setCategoriesState] =
    useState<Category[]>(categories);
  const [tagsState, setTagsState] = useState<Tag[]>(tags);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  const router = useRouter();

  // Auto-save state
  const [postId, setPostId] = useState<string | null>(initialData?.id || null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  const isEditing = !!initialData;
  const currentStatus = initialData?.status || "draft";
  const action = isEditing ? updatePost.bind(null, initialData.id) : createPost;

  // Auto-save function
  const autoSave = useCallback(async () => {
    // Only auto-save if there are changes and basic fields are filled
    if (
      !hasUnsavedChanges.current ||
      !title ||
      title.length < 3 ||
      !slug ||
      !/^[a-z0-9-]+$/.test(slug)
    ) {
      return;
    }

    setIsAutoSaving(true);

    try {
      const response = await fetch("/api/admin/posts/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          title,
          slug,
          content,
          excerpt,
          image: imagePreview,
          categoryId: selectedCategoryIds[0] || null,
          tagIds: selectedTagIds,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update postId if this was a new draft
        if (!postId && result.id) {
          setPostId(result.id);
          // Update URL to include the new post ID without navigation
          window.history.replaceState({}, "", `/admin/posts/${result.id}/edit`);
        }
        setLastSaved(new Date());
        hasUnsavedChanges.current = false;
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [
    postId,
    title,
    slug,
    content,
    excerpt,
    imagePreview,
    selectedCategoryIds,
    selectedTagIds,
  ]);

  // Mark as having unsaved changes when content changes
  useEffect(() => {
    hasUnsavedChanges.current = true;
  }, [
    title,
    slug,
    content,
    excerpt,
    imagePreview,
    selectedCategoryIds,
    selectedTagIds,
  ]);

  // Auto-save timer (every 30 seconds)
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Set up auto-save interval
    autoSaveTimerRef.current = setInterval(() => {
      autoSave();
    }, 30000); // 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSave]);

  // Handle archive
  const handleArchive = async () => {
    if (!initialData?.id) return;

    if (
      !confirm(
        "Are you sure you want to archive this post? It will be hidden from visitors."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await archivePost(initialData.id);
        addToast("success", "Post archived successfully");
        router.push("/admin/posts");
      } catch (error) {
        addToast("error", "Failed to archive post");
        console.error("Error archiving post:", error);
      }
    });
  };

  const handleCreateCategory = async (name: string) => {
    startTransition(async () => {
      try {
        const newCategory = await quickCreateCategory(name);
        setCategoriesState((prev) => [...prev, newCategory]);
        setSelectedCategoryIds([newCategory.id]);
        setNewCategoryName("");
        addToast("success", `Category "${name}" created`);
      } catch (error) {
        addToast("error", "Failed to create category");
        console.error("Error creating category:", error);
      }
    });
  };

  const handleCreateTag = async (name: string) => {
    startTransition(async () => {
      try {
        const newTag = await quickCreateTag(name);
        setTagsState((prev) => [...prev, newTag]);
        setSelectedTagIds((prev) => [...prev, newTag.id]);
        setNewTagName("");
        addToast("success", `Tag "${name}" created`);
      } catch (error) {
        addToast("error", "Failed to create tag");
        console.error("Error creating tag:", error);
      }
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will affect all posts using it."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategory(id);
        setCategoriesState((prev) => prev.filter((cat) => cat.id !== id));
        setSelectedCategoryIds((prev) => prev.filter((catId) => catId !== id));
        addToast("success", "Category deleted successfully");
      } catch (error) {
        addToast("error", "Failed to delete category");
      }
    });
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteTag(id);
        setTagsState((prev) => prev.filter((tag) => tag.id !== id));
        setSelectedTagIds((prev) => prev.filter((tagId) => tagId !== id));
        addToast("success", "Tag deleted successfully");
      } catch (error) {
        addToast("error", "Failed to delete tag");
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Posts
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-800">
            <Save className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing ? "Update your blog post" : "Write something amazing"}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />

            <Input
              label="Slug"
              name="slug"
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
            />

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 resize-y"
                placeholder="Brief summary of the post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
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
            {/* Featured Image Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Save className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Featured Image
                </h3>
              </div>

              <div className="space-y-3">
                <Input
                  label="Image URL"
                  name="image"
                  id="image"
                  type="url"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Paste image URL"
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Invalid URL</text></svg>';
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Preview
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Save className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Publishing
                </h3>
              </div>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <input
                    type="hidden"
                    name="categoryId"
                    value={selectedCategoryIds[0] || ""}
                  />
                  <input
                    type="hidden"
                    name="newCategory"
                    value={newCategoryName}
                  />
                  <PillSelector
                    label="Category"
                    options={categoriesState.map((c) => ({
                      id: c.id,
                      name: c.name,
                    }))}
                    selectedIds={selectedCategoryIds}
                    onChange={setSelectedCategoryIds}
                    onCreateNew={handleCreateCategory}
                    onDelete={handleDeleteCategory}
                    placeholder="No categories available. Create one!"
                    helperText="Select one category for this post"
                    multiSelect={false}
                  />
                </div>

                {/* Tags Selection */}
                <div>
                  <input
                    type="hidden"
                    name="tagsInput"
                    value={selectedTagIds
                      .map((id) => tagsState.find((t) => t.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <input type="hidden" name="newTag" value={newTagName} />
                  <PillSelector
                    label="Tags"
                    options={tagsState.map((t) => ({ id: t.id, name: t.name }))}
                    selectedIds={selectedTagIds}
                    onChange={setSelectedTagIds}
                    onCreateNew={handleCreateTag}
                    onDelete={handleDeleteTag}
                    placeholder="No tags available. Create one!"
                    helperText="Select multiple tags for this post"
                    multiSelect={true}
                  />
                </div>

                {/* Auto-save Status */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
                  <Clock className="h-3.5 w-3.5" />
                  {isAutoSaving ? (
                    <span className="text-blue-500">Auto-saving...</span>
                  ) : lastSaved ? (
                    <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
                  ) : (
                    <span>Auto-save enabled (every 30s)</span>
                  )}
                </div>

                {/* Current Status Badge */}
                {isEditing && (
                  <div className="pt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Current status:{" "}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        currentStatus === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : currentStatus === "archived"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                      {currentStatus === "published"
                        ? "Published"
                        : currentStatus === "archived"
                        ? "Archived"
                        : "Draft"}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {/* Save Draft & Publish Buttons */}
                  <div className="flex gap-2 w-full overflow-hidden">
                    {/* Save Draft - always show */}
                    <SubmitButton type="draft" disabled={isPending} />

                    {/* Publish - only show if not already published */}
                    {currentStatus !== "published" && (
                      <SubmitButton type="publish" disabled={isPending} />
                    )}
                  </div>

                  {/* Archive Button (only for published posts, not for archived) */}
                  {isEditing && currentStatus === "published" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleArchive}
                      disabled={isPending}
                      className="w-full gap-2 justify-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-700">
                      <Archive className="h-4 w-4" />
                      Archive Post
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
