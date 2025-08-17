import React from "react";
import ReactMarkdown from "react-markdown";
import { type NoteData } from "@/InterfacesAndTypes/Interfaces";

interface NoteViewProps {
  note: NoteData;
  onClose: () => void;
  noteSectionStyling?: string;
}

export const NoteView: React.FC<NoteViewProps> = ({ note, onClose, noteSectionStyling }) => {
  const defaultStyles =
    "flex flex-col gap-2 h-full w-full overflow-y-auto p-4 bg-gray-900 rounded customs-scrollbar";

  return (
    <div className={noteSectionStyling ?? defaultStyles}>
      <div className="flex items-center justify-between border-b border-slate-500 pb-4">
        <h2 className="font-bold text-white text-lg text-wrap">{note.title}</h2>

        <button
          onClick={onClose}
          className="px-4 py-1 rounded-full bg-gray-600 hover:bg-gray-500 text-white text-xs mr-3 cursor-pointer"
        >
          Close
        </button>
      </div>
      <div className="flex flex-row items-center justify-end h-[88%] w-prose bg-gray-800 ">
        <div className="prose prose-invert max-w-prose h-full ustify-self-end self-end text-white p-4 overflow-x-auto custom-scrollbar break-words bg-gray-800">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
