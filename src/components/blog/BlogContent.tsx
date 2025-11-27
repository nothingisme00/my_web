'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all code blocks
    const codeBlocks = contentRef.current.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
      // Skip if button already added
      if (pre.querySelector('.copy-code-button')) return;

      // Create wrapper div for positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'relative group';

      // Wrap the pre element
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create copy button
      const button = document.createElement('button');
      button.className = `copy-code-button absolute top-2 right-2 p-2 rounded-md
        bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
        transition-all duration-200 opacity-0 group-hover:opacity-100
        focus:opacity-100 flex items-center gap-1.5 text-sm font-medium z-10`;
      button.setAttribute('aria-label', 'Copy code');

      // Create button content
      const iconSpan = document.createElement('span');
      iconSpan.className = 'icon-copy';
      iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

      const textSpan = document.createElement('span');
      textSpan.textContent = 'Copy';

      button.appendChild(iconSpan);
      button.appendChild(textSpan);

      // Copy functionality
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const textToCopy = code?.textContent || pre.textContent || '';

        try {
          await navigator.clipboard.writeText(textToCopy);

          // Update button to show success
          iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          textSpan.textContent = 'Copied!';
          button.classList.add('!bg-green-600', '!text-white');

          // Reset after 2 seconds
          setTimeout(() => {
            iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2 V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
            textSpan.textContent = 'Copy';
            button.classList.remove('!bg-green-600', '!text-white');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      wrapper.appendChild(button);
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg prose-blue dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
        prose-img:rounded-xl prose-img:shadow-lg
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-1 prose-blockquote:px-6
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:text-gray-700 dark:prose-li:text-gray-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
