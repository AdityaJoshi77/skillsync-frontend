"use client";

import { useState } from "react";
import type { NoteData } from "@/InterfacesAndTypes/Interfaces";
import {
  FaPlus,
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

interface LearningArea_NotesProps {
  notes: NoteData[];
}

export const LearningArea_Notes = ({ notes }: LearningArea_NotesProps) => {
  const [savedNotes, setSavedNotes] = useState<NoteData[]>(notes);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

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
    setNewNote((prev) => ({ ...prev, content: textarea.value }));
    textarea.focus();
    textarea.selectionStart = start + syntax.length;
    textarea.selectionEnd = start + syntax.length + placeholder.length;
  };

  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const noteWithId = {
      ...newNote,
      _id: Date.now().toString(),
    };

    setSavedNotes((prev) => [...prev, noteWithId]);
    setNewNote({ title: "", content: "" });
    setIsCreating(false);
    setPreviewMode(false);
  };

  return (
    <div className="relative flex flex-col gap-2 w-full h-full overflow-y-auto">
      {!isCreating ? (
        <>
          {/* Saved Notes */}
          {savedNotes.length ? (
            savedNotes.map((n) => (
              <div key={n._id} className="mb-4 p-3 bg-gray-700 rounded">
                <h3 className="font-semibold text-white">{n.title}</h3>
                <div className="prose prose-invert">
                  <ReactMarkdown>{n.content}</ReactMarkdown>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-400 text-center">No saved notes.</p>
            </div>
          )}

          {/* Floating Add Note Button */}
          <button
            onClick={() => setIsCreating(true)}
            className="fixed bottom-8 right-8 z-50 bg-yellow-500 hover:bg-yellow-400 text-black p-2.5 rounded-full shadow-lg cursor-pointer"
          >
            <FaPlus size={15} />
          </button>
        </>
      ) : (
        <div className="flex flex-col justify-between h-full w-full">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) =>
              setNewNote((prev) => ({ ...prev, title: e.target.value }))
            }
            className="mb-3 p-2 w-full rounded bg-gray-700 text-white focus:outline-none"
          />

          {/* Markdown Toolbar */}
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
          <div className="h-full w-full overflow-y-auto bg-gray-900 rounded custom-scrollbar">
            {!previewMode ? (
              <textarea
                id="note-content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full h-[95%] p-1 rounded bg-gray-800 text-white resize-none focus:outline-none"
                placeholder="Write your note in markdown..."
              />
            ) : (
              <div className="prose prose-invert max-w-none bg-gray-800 h-[95%]">
                <ReactMarkdown>{newNote.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 ">
            <button
              onClick={() => {
                setIsCreating(false);
                setPreviewMode(false);
              }}
              className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="px-4 py-1 rounded-full bg-gray-300 hover:bg-gray-200 text-black text-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
