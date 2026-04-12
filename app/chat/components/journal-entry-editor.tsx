"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";
import "@uiw/react-md-editor/markdown-editor.css";
import "./journal-entry-editor.css";
import {
  bold,
  italic,
  strikethrough,
  divider,
  heading1,
  heading2,
  heading3,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  quote,
  code,
  codeBlock,
  link,
} from "@uiw/react-md-editor/commands";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface JournalEntryEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const TOOLBAR_COMMANDS = [
  bold,
  italic,
  strikethrough,
  divider,
  heading1,
  heading2,
  heading3,
  divider,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  divider,
  quote,
  code,
  codeBlock,
  divider,
  link,
];

export const JournalEntryEditor = ({
  initialContent,
  onSave,
  onCancel,
  isSaving,
}: JournalEntryEditorProps) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="journal-editor w-full flex flex-1 flex-col">
      <div className="flex items-center justify-end border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={() => onSave(content)}
            disabled={isSaving || !content.trim()}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      {/* TODO: sync data-color-mode with app theme once a theme system is introduced */}
      <MDEditor
        value={content}
        onChange={(val) => setContent(val ?? "")}
        preview="live"
        // TODO: sync data-color-mode with app theme once a theme system is introduced
        data-color-mode="light"
        height="100%"
        visibleDragbar={false}
        highlightEnable={false}
        commands={TOOLBAR_COMMANDS}
        extraCommands={[]}
        components={{
          preview: (source: string) => (
            <MessageResponse>{source}</MessageResponse>
          ),
        }}
        textareaProps={{
          placeholder: "Write your journal entry in markdown...",
        }}
        style={{ border: "none", boxShadow: "none", borderRadius: 0, flex: 1 }}
      />
    </div>
  );
};
