"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Minus,
  Video,
  Loader2,
} from "lucide-react";
import {
  AVAILABLE_LANGUAGES,
  AVAILABLE_THEMES,
} from "@/lib/highlightjs-config";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

function ToolbarButton({
  onClick,
  isActive = false,
  children,
  title,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className={`p-2 rounded-md transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isActive
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
      title={title}
      type="button"
      disabled={disabled}>
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const uploadMedia = async (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      type === "image"
        ? "image/*"
        : "video/mp4,video/webm,video/ogg,video/quicktime";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size - reduce max for videos to avoid server limits
      const maxSize = type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 50MB max for video
      if (file.size > maxSize) {
        alert(
          `File too large (${(file.size / (1024 * 1024)).toFixed(
            1
          )}MB). Maximum size: ${maxSize / (1024 * 1024)}MB`
        );
        return;
      }

      setIsUploading(true);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadProgress(`Uploading ${type} (${sizeMB}MB)...`);

      console.log("Starting upload:", {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: sizeMB + "MB",
      });

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<{ url: string; type: string }>(
          (resolve, reject) => {
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(
                  `Uploading ${type} (${sizeMB}MB): ${percent}%`
                );
                console.log(`Upload progress: ${percent}%`);
              }
            });

            xhr.addEventListener("load", () => {
              console.log(
                "Upload complete, status:",
                xhr.status,
                xhr.responseText
              );
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const result = JSON.parse(xhr.responseText);
                  resolve(result);
                } catch {
                  reject(new Error("Invalid server response"));
                }
              } else {
                try {
                  const error = JSON.parse(xhr.responseText);
                  reject(new Error(error.error || `HTTP ${xhr.status}`));
                } catch {
                  reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
                }
              }
            });

            xhr.addEventListener("error", () => {
              console.error("XHR error:", xhr.status, xhr.statusText);
              reject(new Error("Network error - upload failed"));
            });

            xhr.addEventListener("timeout", () => {
              console.error("XHR timeout");
              reject(new Error("Upload timeout - file may be too large"));
            });

            xhr.addEventListener("abort", () => {
              reject(new Error("Upload cancelled"));
            });

            xhr.open("POST", "/api/media/upload");
            xhr.timeout = 120000; // 2 minute timeout
            xhr.send(formData);
          }
        );

        const result = await uploadPromise;

        if (result.url) {
          if (result.type === "image") {
            editor.chain().focus().setImage({ src: result.url }).run();
          } else if (result.type === "video") {
            editor.chain().focus().setVideo({ src: result.url }).run();
          }
          console.log("Upload successful:", result.url);
          setUploadProgress("Upload complete!");
          setTimeout(() => setUploadProgress(""), 2000);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert(
          "Upload failed: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const uploadImage = () => uploadMedia("image");
  const uploadVideo = () => uploadMedia("video");

  const addVideo = () => {
    const url = window.prompt("Enter video URL (MP4, WebM, OGG):");
    if (url) {
      editor.chain().focus().setVideo({ src: url }).run();
    }
  };

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-900/50">
      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold">
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic">
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline Code">
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Font Size Dropdown */}
      <div className="relative">
        <select
          value={editor.getAttributes("textStyle").fontSize || "default"}
          onChange={(e) => {
            if (e.target.value === "default") {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(e.target.value).run();
            }
          }}
          className="h-8 px-2 pr-6 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          onClick={(e) => e.preventDefault()}>
          <option value="default">Default</option>
          <option value="12px">12px - Tiny</option>
          <option value="14px">14px - Small</option>
          <option value="16px">16px - Normal</option>
          <option value="18px">18px - Medium</option>
          <option value="20px">20px - Large</option>
          <option value="24px">24px - XL</option>
          <option value="32px">32px - 2XL</option>
          <option value="36px">36px - 3XL</option>
          <option value="48px">48px - 4XL</option>
          <option value="64px">64px - 5XL</option>
        </select>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List">
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Quote">
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Code Block Section */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block">
        <Code className="w-4 h-4" />
      </ToolbarButton>

      {/* Language & Theme Selectors - Only show when in code block */}
      {editor.isActive("codeBlock") && (
        <>
          <select
            value={editor.getAttributes("codeBlock").language || "javascript"}
            onChange={(e) => {
              e.preventDefault();
              editor.chain().focus().setCodeBlockLanguage(e.target.value).run();
            }}
            className="h-8 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.preventDefault()}>
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={editor.getAttributes("codeBlock").theme || "github-dark"}
            onChange={(e) => {
              e.preventDefault();
              editor.chain().focus().setCodeBlockTheme(e.target.value).run();
            }}
            className="h-8 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.preventDefault()}>
            {AVAILABLE_THEMES.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleLineNumbers().run()}
            isActive={editor.getAttributes("codeBlock").showLineNumbers}
            title="Toggle Line Numbers">
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </>
      )}

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Insert */}
      <ToolbarButton onClick={addLink} title="Add Link">
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton onClick={addImage} title="Add Image from URL">
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={uploadImage}
        title="Upload Image File"
        disabled={isUploading}>
        <Upload className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton onClick={addVideo} title="Add Video from URL">
        <Video className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={uploadVideo}
        title="Upload Video File"
        disabled={isUploading}>
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Video className="w-4 h-4" />
        )}
      </ToolbarButton>

      <ToolbarButton onClick={addHorizontalRule} title="Insert Horizontal Rule">
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>{uploadProgress}</span>
        </div>
      )}

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo">
        <Undo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo">
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}
