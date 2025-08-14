// NoteView.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { type NoteData } from "@/InterfacesAndTypes/Interfaces";

interface NoteViewProps {
  note: NoteData;
  onClose: () => void;
}

export const NoteView: React.FC<NoteViewProps> = ({ note, onClose }) => {
  return (
    <div className=" flex flex-col gap-2 h-full overflow-y-auto p-4 bg-gray-800 rounded customs-scrollbar">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white text-2xl">{note.title}</h2>

        <button
          onClick={onClose}
          className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white text-sm mr-3"
        >
          Close
        </button>
      </div>
      <div className="prose prose-invert max-w-prose h-full justify-self-center text-white text-ellipsis p-2 overflow-x-auto custom-scrollbar break-words">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
};