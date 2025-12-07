'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Extract text content from children
    let textToCopy = '';
    
    if (typeof children === 'string') {
      textToCopy = children;
    } else if (children && typeof children === 'object' && 'props' in children) {
      const props = (children as { props: { children: React.ReactNode } }).props;
      if (typeof props.children === 'string') {
        textToCopy = props.children;
      }
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600
                   text-gray-300 hover:text-white transition-all duration-200
                   opacity-0 group-hover:opacity-100 focus:opacity-100
                   flex items-center gap-1.5 text-sm font-medium z-10"
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </>
        )}
      </button>
      <pre className={className}>{children}</pre>
    </div>
  );
}
