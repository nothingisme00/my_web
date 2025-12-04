"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { X } from "lucide-react";

interface VideoNodeViewProps {
  node: {
    attrs: {
      src: string;
    };
  };
  deleteNode: () => void;
  selected: boolean;
}

export function VideoNodeView({
  node,
  deleteNode,
  selected,
}: VideoNodeViewProps) {
  const { src } = node.attrs;

  if (!src) {
    return (
      <NodeViewWrapper className="video-wrapper my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-500">No video source provided</p>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className="video-wrapper my-4 relative group"
      data-drag-handle>
      {/* Delete button - shows on hover or when selected */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteNode();
        }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-200 ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        title="Delete video"
        type="button"
        contentEditable={false}>
        <X className="w-4 h-4" />
      </button>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute inset-0 rounded-lg pointer-events-none ring-2 ring-blue-500 ring-offset-2" />
      )}

      {/* Video element */}
      <video
        src={src}
        controls
        preload="metadata"
        className="w-full max-w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        style={{ maxHeight: "500px" }}
        contentEditable={false}
        draggable={false}>
        Your browser does not support the video tag.
      </video>

      {/* Video URL indicator on hover */}
      <div className="absolute bottom-2 left-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded truncate block max-w-full">
          {src}
        </span>
      </div>
    </NodeViewWrapper>
  );
}
