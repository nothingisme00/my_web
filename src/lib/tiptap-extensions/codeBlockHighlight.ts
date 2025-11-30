import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlockHighlight: {
      setCodeBlockLanguage: (language: string) => ReturnType;
      toggleLineNumbers: () => ReturnType;
      setCodeBlockTheme: (theme: string) => ReturnType;
    };
  }
}

export const CodeBlockHighlight = CodeBlockLowlight.extend({
  name: 'codeBlock',

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: 'javascript',
        parseHTML: (element) => element.getAttribute('data-language'),
        renderHTML: (attributes) => ({
          'data-language': attributes.language,
          class: `language-${attributes.language}`,
        }),
      },
      showLineNumbers: {
        default: true,
        parseHTML: (element) => element.getAttribute('data-line-numbers') === 'true',
        renderHTML: (attributes) => ({
          'data-line-numbers': attributes.showLineNumbers,
        }),
      },
      theme: {
        default: 'github-dark',
        parseHTML: (element) => element.getAttribute('data-theme'),
        renderHTML: (attributes) => ({
          'data-theme': attributes.theme,
        }),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCodeBlockLanguage:
        (language: string) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { language });
        },
      toggleLineNumbers:
        () =>
        ({ commands, editor }) => {
          const { showLineNumbers } = editor.getAttributes(this.name);
          return commands.updateAttributes(this.name, {
            showLineNumbers: !showLineNumbers,
          });
        },
      setCodeBlockTheme:
        (theme: string) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { theme });
        },
    };
  },
}).configure({
  lowlight,
  HTMLAttributes: {
    class: 'relative rounded-lg overflow-hidden bg-[#1e1e1e] dark:bg-[#1e1e1e] p-0',
  },
});
