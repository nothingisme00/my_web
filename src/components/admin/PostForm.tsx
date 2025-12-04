"use client";

import {
  createPost,
  updatePost,
  deleteCategory,
  quickCreateCategory,
  archivePost,
} from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PillSelector } from "@/components/ui/PillSelector";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  Send,
  Archive,
  Clock,
  Languages,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { Category, Post } from "@prisma/client";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

// Helper function to generate slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// PostWithTags is now just Post since tags is a string field
type PostWithTags = Post;

interface PostFormProps {
  categories: Category[];
  initialData?: PostWithTags;
}

interface TranslateResponse {
  translatedTexts?: string[];
  error?: string;
  code?: string;
}

function SubmitButton({
  type,
  disabled,
  isTranslating,
}: {
  type: "draft" | "publish" | "update";
  disabled?: boolean;
  isTranslating?: boolean;
}) {
  const { pending } = useFormStatus();
  const isPending = pending || disabled || isTranslating;

  if (type === "draft") {
    return (
      <button
        type="submit"
        name="status"
        value="draft"
        disabled={isPending}
        className="flex-1 min-w-0 inline-flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]">
        <FileText
          className={`h-4 w-4 shrink-0 ${isPending ? "animate-pulse" : ""}`}
        />
        {isTranslating
          ? "Translating..."
          : pending
          ? "Saving..."
          : "Save Draft"}
      </button>
    );
  }

  if (type === "update") {
    return (
      <button
        type="submit"
        name="status"
        value="published"
        disabled={isPending}
        className="flex-1 min-w-0 inline-flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]">
        <Save
          className={`h-4 w-4 shrink-0 ${isPending ? "animate-spin" : ""}`}
        />
        {isTranslating ? "Translating..." : pending ? "Updating..." : "Update"}
      </button>
    );
  }

  return (
    <button
      type="submit"
      name="status"
      value="published"
      disabled={isPending}
      className="flex-1 min-w-0 inline-flex items-center gap-2 justify-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]">
      <Send
        className={`h-4 w-4 shrink-0 ${isPending ? "animate-pulse" : ""}`}
      />
      {isTranslating ? "Translating..." : pending ? "Publishing..." : "Publish"}
    </button>
  );
}

export default function PostForm({ categories, initialData }: PostFormProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categoryId ? [initialData.categoryId] : []
  );
  const [tags, setTags] = useState(initialData?.tags || "");
  const [categoriesState, setCategoriesState] =
    useState<Category[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();
  const router = useRouter();

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-save state
  const [postId, setPostId] = useState<string | null>(initialData?.id || null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  const isEditing = !!initialData;
  const currentStatus = initialData?.status || "draft";

  // Handle form submission with auto-translation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTranslationError(null);
    setIsTranslating(true);

    try {
      // Collect texts to translate (only non-empty ones)
      const textsToTranslate = [
        title,
        excerpt,
        content,
        metaDescription,
      ].filter(Boolean);

      let translatedTexts: string[] = [];

      if (textsToTranslate.length > 0) {
        // Call translate API
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ texts: textsToTranslate }),
        });

        const data: TranslateResponse = await response.json();

        if (!response.ok) {
          if (data.code === "QUOTA_EXCEEDED") {
            setTranslationError(
              "Kuota DeepL telah habis. Silakan tunggu hingga bulan depan."
            );
            setIsTranslating(false);
            return;
          }
          throw new Error(data.error || "Gagal menerjemahkan");
        }

        translatedTexts = data.translatedTexts || [];
      }

      // Map translations back to fields
      let translatedTitle = "";
      let translatedExcerpt = "";
      let translatedContent = "";
      let translatedMetaDescription = "";
      let idx = 0;

      if (title) translatedTitle = translatedTexts[idx++] || "";
      if (excerpt) translatedExcerpt = translatedTexts[idx++] || "";
      if (content) translatedContent = translatedTexts[idx++] || "";
      if (metaDescription)
        translatedMetaDescription = translatedTexts[idx++] || "";

      // Create FormData with translated content
      const formData = new FormData();
      formData.append("title", title);
      formData.append("titleEn", translatedTitle);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("contentEn", translatedContent);
      formData.append("excerpt", excerpt);
      formData.append("excerptEn", translatedExcerpt);
      formData.append("metaDescription", metaDescription);
      formData.append("metaDescriptionEn", translatedMetaDescription);
      formData.append("image", imagePreview);
      formData.append("categoryId", selectedCategoryIds[0] || "");
      formData.append("tags", tags);

      // Get status from the clicked button
      const submitter = (e.nativeEvent as SubmitEvent)
        .submitter as HTMLButtonElement;
      formData.append("status", submitter?.value || "draft");

      // Call the server action
      const action = isEditing
        ? updatePost.bind(null, initialData.id)
        : createPost;
      await action(formData);

      addToast(
        "success",
        isEditing ? "Post berhasil diperbarui!" : "Post berhasil dibuat!"
      );
      router.push("/admin/posts");
    } catch (error) {
      // Check if this is a redirect (not an actual error)
      // Next.js redirect() throws an error with digest containing "NEXT_REDIRECT"
      const isRedirectError =
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" ||
          (error as { digest?: string }).digest?.includes("NEXT_REDIRECT"));

      if (isRedirectError) {
        // This is a successful redirect from server action, not an error
        addToast(
          "success",
          isEditing ? "Post berhasil diperbarui!" : "Post berhasil dibuat!"
        );
        return;
      }

      console.error("Submit error:", error);
      setTranslationError(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
      addToast("error", "Gagal menyimpan post");
    } finally {
      setIsTranslating(false);
    }
  };

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
          tags: tags,
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
    tags,
  ]);

  // Mark as having unsaved changes when content changes
  useEffect(() => {
    hasUnsavedChanges.current = true;
  }, [title, slug, content, excerpt, imagePreview, selectedCategoryIds, tags]);

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
      } catch {
        addToast("error", "Failed to delete category");
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
          Kembali ke Posts
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-800">
            <Save className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Post" : "Buat Post Baru"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing
                ? "Perbarui blog post Anda"
                : "Tulis sesuatu yang luar biasa"}
            </p>
          </div>
        </div>

        {/* Translation Notice */}
        <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Auto-Translate Aktif 🇮🇩 → 🇬🇧
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Tulis dalam Bahasa Indonesia. Konten akan otomatis diterjemahkan
              ke English saat disimpan.
            </p>
          </div>
        </div>

        {/* Translation Error */}
        {translationError && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Gagal Menerjemahkan
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                {translationError}
              </p>
            </div>
          </div>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content - Full Width */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <Input
              label="Judul (Indonesia)"
              name="title"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul post"
            />

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="url-friendly-slug"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setSlug(generateSlug(title))}
                  disabled={!title}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Generate slug dari judul">
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Hanya huruf kecil, angka, dan tanda hubung (-)
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ringkasan (Indonesia)
              </label>
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 resize-y"
                placeholder="Ringkasan singkat dari post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konten (Indonesia)
              </label>
              <input type="hidden" name="content" value={content} />
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Tulis konten post Anda di sini..."
              />
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description (Indonesia)
              </label>
              <textarea
                name="metaDescription"
                id="metaDescription"
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 resize-y"
                placeholder="Deskripsi untuk SEO (opsional)"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Featured Image & Publishing Options in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow duration-300 hover:shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                  <Save className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Publishing
                </h3>
              </div>
              {/* Status Badge */}
              {isEditing && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    currentStatus === "published"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : currentStatus === "archived"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  }`}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentStatus === "published"
                        ? "bg-emerald-500 animate-pulse"
                        : currentStatus === "archived"
                        ? "bg-gray-400"
                        : "bg-amber-500"
                    }`}
                  />
                  {currentStatus === "published"
                    ? "Published"
                    : currentStatus === "archived"
                    ? "Archived"
                    : "Draft"}
                </span>
              )}
            </div>

            <div className="p-4 space-y-4">
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
                  placeholder="No categories available"
                  helperText="Select one category"
                  multiSelect={false}
                />
              </div>

              {/* Tags Input - Comma separated */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tech, programming, web development"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Pisahkan tags dengan koma (contoh: tech, tips, tutorial)
                </p>
              </div>

              {/* Auto-save Status */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs border border-gray-100 dark:border-gray-700/50">
                <div
                  className={`p-1 rounded-full ${
                    isAutoSaving
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}>
                  <Clock
                    className={`h-3 w-3 transition-colors duration-200 ${
                      isAutoSaving
                        ? "text-indigo-600 dark:text-indigo-400 animate-spin"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {isAutoSaving ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Saving...
                    </span>
                  ) : lastSaved ? (
                    <>
                      Saved at{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {lastSaved.toLocaleTimeString()}
                      </span>
                    </>
                  ) : (
                    "Auto-save enabled"
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {/* Translating indicator */}
                {isTranslating && (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full" />
                    <span className="font-medium">Translating content...</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="grid gap-2">
                  {currentStatus === "published" ? (
                    <SubmitButton
                      type="update"
                      disabled={isPending}
                      isTranslating={isTranslating}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <SubmitButton
                        type="draft"
                        disabled={isPending}
                        isTranslating={isTranslating}
                      />
                      <SubmitButton
                        type="publish"
                        disabled={isPending}
                        isTranslating={isTranslating}
                      />
                    </div>
                  )}
                </div>

                {/* Archive Button */}
                {isEditing && currentStatus === "published" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleArchive}
                    disabled={isPending || isTranslating}
                    className="w-full gap-2 justify-center text-sm text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200">
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
