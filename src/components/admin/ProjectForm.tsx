"use client";

import { createProject, updateProject } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, Save, Languages, AlertTriangle } from "lucide-react";
import { Project } from "@prisma/client";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  initialData?: Project;
}

interface TranslateResponse {
  translatedTexts?: string[];
  error?: string;
  code?: string;
}

function SubmitButton({
  isEditing,
  isTranslating,
}: {
  isEditing: boolean;
  isTranslating?: boolean;
}) {
  const { pending } = useFormStatus();
  const isPending = pending || isTranslating;
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full gap-2 justify-center">
      <Save className="h-4 w-4" />
      {isTranslating
        ? "Menerjemahkan..."
        : pending
        ? "Menyimpan..."
        : isEditing
        ? "Update Project"
        : "Simpan Project"}
    </Button>
  );
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [techStack, setTechStack] = useState(initialData?.techStack || "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { addToast } = useToast();
  const router = useRouter();

  const isEditing = !!initialData;

  // Handle form submission with auto-translation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTranslationError(null);
    setIsTranslating(true);

    try {
      // Translate description to English
      let descriptionEn = "";

      if (description) {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: description }),
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

        descriptionEn = data.translatedTexts?.[0] || "";
      }

      // Create FormData with translated content
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("descriptionEn", descriptionEn);
      formData.append("content", content);
      formData.append("techStack", techStack);
      formData.append("image", imagePreview);
      formData.append("demoUrl", demoUrl);
      formData.append("githubUrl", githubUrl);

      // Call the server action
      const action = isEditing
        ? updateProject.bind(null, initialData.id)
        : createProject;
      await action(formData);

      addToast(
        "success",
        isEditing ? "Project berhasil diperbarui!" : "Project berhasil dibuat!"
      );
      router.push("/admin/projects");
    } catch (error) {
      console.error("Submit error:", error);
      setTranslationError(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
      addToast("error", "Gagal menyimpan project");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Projects
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-2 border-purple-200 dark:border-purple-800">
            <Save className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Project" : "Buat Project Baru"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isEditing
                ? "Perbarui detail project Anda"
                : "Tampilkan karya luar biasa Anda"}
            </p>
          </div>
        </div>

        {/* Translation Notice */}
        <div className="mt-4 flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
          <Languages className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Auto-Translate Aktif 🇮🇩 → 🇬🇧
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
              Tulis deskripsi dalam Bahasa Indonesia. Akan otomatis
              diterjemahkan ke English saat disimpan.
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
              placeholder="Masukkan judul project"
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

            <Input
              label="Tech Stack"
              name="techStack"
              id="techStack"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Next.js, Tailwind"
              helperText="Daftar teknologi dipisahkan koma"
            />

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi Singkat (Indonesia)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm hover:border-gray-400 dark:hover:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-y"
                placeholder="Ringkasan singkat tentang project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Konten
              </label>
              <input type="hidden" name="content" value={content} />
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Tulis studi kasus project Anda di sini..."
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
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Project Links
                </h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Demo URL"
                  name="demoUrl"
                  id="demoUrl"
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo.example.com"
                  helperText="Link demo live"
                />

                <Input
                  label="GitHub URL"
                  name="githubUrl"
                  id="githubUrl"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  helperText="Repository source code"
                />

                {/* Translating indicator */}
                {isTranslating && (
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" />
                    <span>Menerjemahkan ke English...</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <SubmitButton
                    isEditing={isEditing}
                    isTranslating={isTranslating}
                  />
                </div>
              </div>
            </div>

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
                  placeholder="https://..."
                  helperText="Screenshot project"
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
          </div>
        </div>
      </form>
    </div>
  );
}
