"use client"

import { Editor } from '@tiptap/react'
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
} from 'lucide-react'
import { AVAILABLE_LANGUAGES, AVAILABLE_THEMES } from '@/lib/highlightjs-config'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  children?: React.ReactNode
  title?: string
}

function ToolbarButton({
  onClick,
  isActive = false,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
      }`}
      title={title}
      type="button"
    >
      {children}
    </button>
  )
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const uploadImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/about/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          alert(`Upload failed: ${error.error || 'Unknown error'}`)
          return
        }

        const result = await response.json()

        if (result.url) {
          editor.chain().focus().setImage({ src: result.url }).run()
        }
      } catch (error) {
        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }

    input.click()
  }

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run()
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-900/50">
      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Font Size Dropdown */}
      <div className="relative">
        <select
          value={editor.getAttributes('textStyle').fontSize || 'default'}
          onChange={(e) => {
            if (e.target.value === 'default') {
              editor.chain().focus().unsetFontSize().run()
            } else {
              editor.chain().focus().setFontSize(e.target.value).run()
            }
          }}
          className="h-8 px-2 pr-6 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
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
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}    
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}   
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Code Block Section */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      {/* Language & Theme Selectors - Only show when in code block */}
      {editor.isActive('codeBlock') && (
        <>
          <select
            value={editor.getAttributes('codeBlock').language || 'javascript'}
            onChange={(e) => {
              e.preventDefault()
              editor.chain().focus().setCodeBlockLanguage(e.target.value).run()
            }}
            className="h-8 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.preventDefault()}
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={editor.getAttributes('codeBlock').theme || 'github-dark'}
            onChange={(e) => {
              e.preventDefault()
              editor.chain().focus().setCodeBlockTheme(e.target.value).run()
            }}
            className="h-8 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.preventDefault()}
          >
            {AVAILABLE_THEMES.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleLineNumbers().run()}
            isActive={editor.getAttributes('codeBlock').showLineNumbers}
            title="Toggle Line Numbers"
          >
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

      <ToolbarButton onClick={uploadImage} title="Upload Image File">
        <Upload className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton onClick={addHorizontalRule} title="Insert Horizontal Rule">
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}
