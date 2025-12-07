'use client';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';

interface CodeBlockNodeProps {
  node: ProseMirrorNode;
}

export function CodeBlockNode({ node }: CodeBlockNodeProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const code = node.textContent;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <pre
        data-language={node.attrs.language}
        data-line-numbers={node.attrs.showLineNumbers}
        data-theme={node.attrs.theme}
      >
        <button
          onClick={copyCode}
          className={`code-block-copy-button ${copied ? 'copied' : ''}`}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
