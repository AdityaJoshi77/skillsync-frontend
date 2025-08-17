
// LearningArea_Notes.tsx
"use client";

import { useEffect, useState } from "react";
import {
  UserData,
  type NoteData,
  type SubModuleData,
} from "@/InterfacesAndTypes/Interfaces";
import { FaPlus } from "react-icons/fa";
import api from "@/lib/axios";

// Import the new components
import { NoteItem } from "../NoteComponents.tsx/NoteItem";
import { NoteView } from "../NoteComponents.tsx/NoteView";
import { NoteForm } from "../NoteComponents.tsx/NoteForm";
import { Spinner_Window } from "../UtilityComponents/Spinner";

interface LearningArea_NotesProps {
  contentId: string;
  skillName: string;
  moduleName: string;
  submoduleName: string;
  SubModule: SubModuleData;
  notes: NoteData[];
  setCurrentSubModule: React.Dispatch<React.SetStateAction<SubModuleData>>;
}

export const LearningArea_Notes = ({
  contentId,
  submoduleName,
  SubModule,
  notes,
}: LearningArea_NotesProps) => {
  const [savedNotes, setSavedNotes] = useState<NoteData[]>(notes);
  const [isCreating, setIsCreating] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [noteFormData, setNoteFormData] = useState({ title: "", content: "" });
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [viewNote, setViewNote] = useState<NoteData | null>(null); // New state for viewing a single note

  useEffect(() => {
    const getPersistedNotes = async () => {
      try {
        setNotesLoading(true);
        const response = await api.get("/auth/me");
        setUser(response.data);
        const persistedResponse = await api.get(
          `/content/getPersistedNotes/${contentId}`
        );
        setSavedNotes(persistedResponse.data);
        console.log("Backend call for persisted notes successful");
      } catch (error) {
        console.log("Failure in LearningArea_Notes UseEffect");
        console.error(error);
      } finally {
        setNotesLoading(false);
      }
    };
    getPersistedNotes();
  }, [submoduleName, contentId]); // Added contentId as dependency

  // Handles opening a note for editing
  const handleEditNote = (note: NoteData) => {
    setIsCreating(true);
    setEditNoteId(note._id);
    setNoteFormData({ title: note.title, content: note.content });
  };
  
  // Handles opening a note in view mode
  const handleViewNote = (note: NoteData) => {
    setViewNote(note);
  };
  
  // Handles deleting a note
  const handleDeleteNote = async (noteId: string) => {
      try {
        // You'll need to confirm this with the user, e.g., using a modal
        await api.delete(`/content/deleteNote/${noteId}`);
        setSavedNotes((prev) => prev.filter((note) => note._id !== noteId));
      } catch (error) {
          console.error("Failed to delete note:", error);
      }
  };
  
  // Handles saving a new or existing note
  const handleSaveNote = async () => {
    try {
      if (!noteFormData.title.trim() || !noteFormData.content.trim()) return;

      if (editNoteId) {
        // Update an existing note
        const updatedResponse = await api.put(`/content/updateNote/${editNoteId}`, {
          title: noteFormData.title,
          content: noteFormData.content,
        });

        setSavedNotes((prev) =>
          prev.map((note) =>
            note._id === editNoteId ? updatedResponse.data : note
          )
        );
      } else {
        // Create a new note
        const noteCreationResponse = await api.post("/content/createNote", {
          title: noteFormData.title,
          noteContent: noteFormData.content,
          userId: user?._id,
          skillId: SubModule.skillId,
          moduleId: SubModule.moduleId,
          submoduleId: SubModule._id,
          contentId,
        });
        setSavedNotes((prev) => [...prev, noteCreationResponse.data]);
      }

      // Reset states
      setNoteFormData({ title: "", content: "" });
      setIsCreating(false);
      setEditNoteId(null);
    } catch (error) {
      console.log('Could not save the note');
      console.error(error);
    }
  };

  if (notesLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner_Window/>
      </div>
    );
  }
  
  // If a note is selected for viewing, show the NoteView component
  if (viewNote) {
    return (
      <NoteView 
        note={viewNote} 
        onClose={() => setViewNote(null)} 
      />
    );
  }

  return (
    <div className="relative flex flex-col p-4 gap-2 w-full h-full overflow-y-auto">
      {isCreating ? (
        <NoteForm
          noteFormData={noteFormData}
          setNoteFormData={setNoteFormData}
          handleSaveNote={handleSaveNote}
          handleCancel={() => {
            setIsCreating(false);
            setEditNoteId(null);
            setNoteFormData({ title: "", content: "" });
          }}
          isEditing={!!editNoteId}
        />
      ) : (
        <>
          {savedNotes.length ? (
            savedNotes.map((n) => (
              <NoteItem 
                key={n._id} 
                note={n} 
                onEdit={handleEditNote}
                onView={handleViewNote}
                onDelete={handleDeleteNote}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-400 text-center">No saved notes.</p>
            </div>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="fixed bottom-8 right-8 z-50 bg-yellow-500 hover:bg-yellow-400 text-black p-2.5 rounded-full shadow-lg cursor-pointer"
          >
            <FaPlus size={15} />
          </button>
        </>
      )}
    </div>
  );
};
