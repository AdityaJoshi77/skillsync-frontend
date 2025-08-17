// NotesPage.tsx
"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { dummyUserNotes } from "@/dummydata/dummyUserNotesData";
import {
  FaSearch,
  FaSort,
  FaFilter,
} from "react-icons/fa";
import NoteViewModal from "@/components/NoteComponents.tsx/NotesSectionModals/NoteViewModal";
import NoteUpdateModal from "@/components/NoteComponents.tsx/NotesSectionModals/NoteUpdateModal";
import { NoteItem } from "@/components/NoteComponents.tsx/NoteItem";
import { NoteData, UserData } from "@/InterfacesAndTypes/Interfaces";
import { Spinner_Window } from "@/components/UtilityComponents/Spinner";

const NotesPage = () => {
  const [userNotes, setUserNotes] = useState<NoteData[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "earliest" | null>(null);
  const [filterSkill, setFilterSkill] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState<string | null>(null);
  const [filterSubModule, setFilterSubModule] = useState<string | null>(null);
  const [viewNoteId, setViewNoteId] = useState<string | null>(null);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [noteFormData, setNoteFormData] = useState<{
    title: string;
    content: string;
  }>({
    title: "",
    content: "",
  });

  useEffect( () => {
    const getUserandNotes = async () => {
      try {
        setPageLoading(true);
        const notesResponse = await api.get('/notes/getUserNotes');
        setUserNotes(notesResponse.data);
        console.log('User Notes : ', userNotes);
      } catch (error) {
        console.log('Could not get user notes', error);
      } finally {
        setPageLoading(false);
      }
    }
    getUserandNotes();
  },[]);

  // For stubbed filtering
  const uniqueSkills = [
    ...new Set(dummyUserNotes.map((note) => note.skillName)),
  ].map((skill) => ({ _id: skill, title: skill }));
  const uniqueModules = [
    ...new Set(dummyUserNotes.map((note) => note.moduleName)),
  ].map((module) => ({ _id: module, title: module }));
  const uniqueSubModules = [
    ...new Set(dummyUserNotes.map((note) => note.submoduleName)),
  ].map((submodule) => ({ _id: submodule, title: submodule }));

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filteredAndSortedNotes = userNotes
    .filter((note) => {
      const searchMatch = searchTerm
        ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const skillMatch = filterSkill ? note.skillName === filterSkill : true;
      const moduleMatch = filterModule
        ? note.moduleName === filterModule
        : true;
      const subModuleMatch = filterSubModule
        ? note.submoduleName === filterSubModule
        : true;
      return searchMatch && skillMatch && moduleMatch && subModuleMatch;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return b._id.localeCompare(a._id);
      } else if (sortBy === "earliest") {
        return a._id.localeCompare(b._id);
      }
      return 0;
    });

  const handleViewNote = (id: string) => {
    setViewNoteId(id);
    setEditNoteId(null);
  };

  const handleEditNote = (id: string) => {
    const note = filteredAndSortedNotes.find((n) => n._id === id);
    if (note) {
      setNoteFormData({ title: note.title, content: note.content });
      setEditNoteId(id);
      setViewNoteId(null);
    }
  };

  const handleDeleteNote = (id: string) => {
    alert(`Delete note with ID: ${id} (Not functional in this stub)`);
  };

  const currentNoteInView = filteredAndSortedNotes.find(
    (note) => note._id === viewNoteId
  );
  const currentNoteInEdit = filteredAndSortedNotes.find(
    (note) => note._id === editNoteId
  );

  if(pageLoading){
    return(
      <div className="h-full w-full">
        <Spinner_Window/>
      </div>
    )
  }

  return (
    <div className="h-screen p-6 flex flex-col items-center">
      <div className=" flex flex-col max-w-7xl h-full w-full">
        <h1 className="text-3xl font-bold text-gray-300 mb-6">Your Notes</h1>

        {/* Search, Sort, and Filter Section */}
        <div className="flex flex-row gap-4 items-center px-3 mb-6">
          {/* Search Bar */}
          <div className="flex flex-grow items-center w-full">
            <input
              type="text"
              placeholder="Search notes..."
              className="bg-gray-700 text-white rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="-ml-8 text-gray-400" />
          </div>

          {/* Sort Button */}
          <button
            className="bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none flex items-center w-[15%] whitespace-nowrap hover:bg-gray-600 cursor-pointer"
            onClick={() =>
              setSortBy(sortBy === "latest" ? "earliest" : "latest")
            }
          >
            <FaSort className="mr-2" /> Sort By
            {sortBy === "latest" && <span className="ml-1">(Latest)</span>}
            {sortBy === "earliest" && <span className="ml-1">(Earliest)</span>}
          </button>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              className="bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none flex items-center whitespace-nowrap hover:bg-gray-600 cursor-pointer"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <FaFilter className="mr-2" /> Filter
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-700 rounded-md shadow-lg z-10 p-4 flex flex-col gap-3 min-w-[200px]">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Skill:
                  </label>
                  <select
                    className="bg-gray-600 text-white rounded-md py-1 px-2 w-full focus:outline-none"
                    value={filterSkill || ""}
                    onChange={(e) =>
                      setFilterSkill(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                  >
                    <option value="">All Skills</option>
                    {uniqueSkills.map((skill) => (
                      <option key={skill._id} value={skill.title}>
                        {skill.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Module:
                  </label>
                  <select
                    className="bg-gray-600 text-white rounded-md py-1 px-2 w-full focus:outline-none"
                    value={filterModule || ""}
                    onChange={(e) =>
                      setFilterModule(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                  >
                    <option value="">All Modules</option>
                    {uniqueModules.map((module) => (
                      <option key={module._id} value={module.title}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Sub-Module:
                  </label>
                  <select
                    className="bg-gray-600 text-white rounded-md py-1 px-2 w-full focus:outline-none"
                    value={filterSubModule || ""}
                    onChange={(e) =>
                      setFilterSubModule(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                  >
                    <option value="">All Sub-Modules</option>
                    {uniqueSubModules.map((subModule) => (
                      <option key={subModule._id} value={subModule.title}>
                        {subModule.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
            
        {/* The Grid of NoteItem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 max-h-[80%] overflow-y-auto custom-scrollbar">
          {filteredAndSortedNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onEdit={() => handleEditNote(note._id)}
              onView={() => handleViewNote(note._id)}
              onDelete={() => handleDeleteNote(note._id)}
              isNotesPage={true}
            />
          ))}
        </div>

        {/* Modal/Display for Viewing Note */}
        {currentNoteInView && (
          <NoteViewModal
            note={currentNoteInView}
            onClose={() => setViewNoteId(null)}
          />
        )}

        {/* Modal/Display for Editing Note (Stubbed) */}
        {currentNoteInEdit && (
          <NoteUpdateModal
            noteFormData={noteFormData}
            setNoteFormData={setNoteFormData}
            handleSaveNote={() => {
              alert(
                `Save edit for note ID: ${currentNoteInEdit._id} with title: ${noteFormData.title}`
              );
              setEditNoteId(null);
            }}
            handleCancel={() => setEditNoteId(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default NotesPage;
