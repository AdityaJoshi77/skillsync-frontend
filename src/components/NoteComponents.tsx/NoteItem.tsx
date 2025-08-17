// NoteItem.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { type NoteData } from "@/InterfacesAndTypes/Interfaces";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

interface NoteItemProps {
  note: NoteData;
  onEdit: (note: NoteData) => void;
  onView: (note: NoteData) => void;
  onDelete: (noteId: string) => void;
  isNotesPage?: boolean;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onEdit,
  onView,
  onDelete,
  isNotesPage = false,
}) => {
  return (
    <div
      className="flex flex-col p-3 w-full bg-gray-700 hover:bg-gray-600 rounded relative cursor-pointer"
      onClick={() => onView(note)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-400 pr-20">{note.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1 text-white hover:text-yellow-300 transition-colors cursor-pointer"
            title="Edit Note"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
            className="p-1 text-white hover:text-red-400 cursor-pointer"
            title="Delete Note"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>
      </div>

      <div className="prose prose-invert max-h-24 max-w-prose overflow-hidden text-white text-sm">
        {isNotesPage ? (
          `${note.content}`
        ) : (
          <ReactMarkdown>{note.content}</ReactMarkdown>
        )}
      </div>

      {isNotesPage && (
        <p className="text-gray-400 text-xs mt-1">
          {note.skillName} -&gt; {note.moduleName} -&gt; {note.submoduleName}
        </p>
      )}

      <p className="text-gray-400 text-xs self-end mt-auto italic">
        {new Date(note.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    </div>
  );
};
