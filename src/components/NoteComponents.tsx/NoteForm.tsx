import React, { useState } from "react";
import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaCode,
  FaLink,
  FaEye,
  FaHeading,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface NoteFormProps {
  noteFormData: { title: string; content: string };
  setNoteFormData: React.Dispatch<
    React.SetStateAction<{ title: string; content: string }>
  >;
  handleSaveNote: () => void;
  handleCancel: () => void;
  isEditing: boolean;
  formWrapperStyling?: string; // 🔑 NEW
}

export const NoteForm: React.FC<NoteFormProps> = ({
  noteFormData,
  setNoteFormData,
  handleSaveNote,
  handleCancel,
  isEditing,
  formWrapperStyling,
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  const defaultWrapper =
    "flex flex-col justify-between h-full w-full"; // 🔑 Default styles

  const insertAtCursor = (syntax: string, placeholder: string) => {
    const textarea = document.getElementById(
      "note-content"
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    textarea.value = before + syntax + placeholder + syntax + after;
    setNoteFormData((prev) => ({ ...prev, content: textarea.value }));
    textarea.focus();
    textarea.selectionStart = start + syntax.length;
    textarea.selectionEnd = start + syntax.length + placeholder.length;
  };

  return (
    <div className={formWrapperStyling ?? defaultWrapper}>
      <input
        type="text"
        placeholder="Note Title"
        value={noteFormData.title}
        onChange={(e) =>
          setNoteFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        className="mb-3 p-2 w-full rounded bg-gray-700 text-white focus:outline-none"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-6 ml-1 mb-3 py-1 text-gray-300 text-md">
        <button
          onClick={() => insertAtCursor("# ", "Heading")}
          title="Heading"
          className="cursor-pointer hover:text-white"
        >
          <FaHeading />
        </button>
        <button
          onClick={() => insertAtCursor("**", "Bold")}
          title="Bold"
          className="cursor-pointer hover:text-white"
        >
          <FaBold />
        </button>
        <button
          onClick={() => insertAtCursor("*", "Italic")}
          title="Italic"
          className="cursor-pointer hover:text-white"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => insertAtCursor("1. ", "List Item")}
          title="Ordered List"
          className="cursor-pointer hover:text-white"
        >
          <FaListOl />
        </button>
        <button
          onClick={() => insertAtCursor("- ", "List Item")}
          title="Unordered List"
          className="cursor-pointer hover:text-white"
        >
          <FaListUl />
        </button>
        <button
          onClick={() => insertAtCursor("> ", "Quote")}
          title="Quote"
          className="cursor-pointer hover:text-white"
        >
          <FaQuoteRight />
        </button>
        <button
          onClick={() => insertAtCursor("```\n", "Code Block\n```")}
          title="Code Block"
          className="cursor-pointer hover:text-white"
        >
          <FaCode />
        </button>
        <button
          onClick={() => insertAtCursor("[", "Link Text](url)")}
          title="Add Link"
          className="cursor-pointer hover:text-white"
        >
          <FaLink />
        </button>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          title="Toggle Preview"
          className={`cursor-pointer ${
            previewMode ? "text-yellow-500" : "hover:text-white"
          }`}
        >
          <FaEye />
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="h-full w-full bg-gray-900 rounded">
        {!previewMode ? (
          <textarea
            id="note-content"
            value={noteFormData.content}
            onChange={(e) =>
              setNoteFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full h-full p-3 rounded bg-gray-800 text-white resize-none focus:outline-none overflow-y-auto custom-scrollbar"
            placeholder="Write your note in markdown..."
          />
        ) : (
          <div className="prose prose-invert min-w-full max-w-prose justify-self-center bg-gray-800 text-white h-full p-3 overflow-y-auto custom-scrollbar break-words">
            <ReactMarkdown>{noteFormData.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          onClick={handleCancel}
          className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveNote}
          className="px-4 py-1 rounded-full bg-gray-300 hover:bg-gray-200 text-black text-sm cursor-pointer"
        >
          {isEditing ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};
