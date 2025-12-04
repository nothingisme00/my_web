import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add a video
       */
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  inline: false,

  group: "block",

  draggable: true,

  atom: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: "controls",
        preload: "metadata",
        class:
          "w-full max-w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 my-4",
        style: "max-height: 500px;",
      }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // Check if it's a NodeSelection by checking if selection has content matching video
        const selectedNode = state.doc.nodeAt(selection.from);
        if (selectedNode && selectedNode.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        // Check if parent is video
        if ($from.parent.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        // Check if node before cursor is video
        const nodeBefore = $from.nodeBefore;
        if (nodeBefore && nodeBefore.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        return false;
      },
      Delete: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // Check if it's a NodeSelection
        const selectedNode = state.doc.nodeAt(selection.from);
        if (selectedNode && selectedNode.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        // Check if parent is video
        if ($from.parent.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        // Check if node after cursor is video
        const nodeAfter = $from.nodeAfter;
        if (nodeAfter && nodeAfter.type.name === "video") {
          return editor.commands.deleteSelection();
        }

        return false;
      },
    };
  },
});
