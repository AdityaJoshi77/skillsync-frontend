"use client";

import api from "@/lib/axios";
import { FaRegStickyNote } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiBrain } from "react-icons/gi";
import { contentButtonItems } from "./LearningAreaContentButtons";
import { useEffect, useState } from "react";

import type {
  ArticleData,
  NoteData,
  SubModuleData,
  ContentData,
} from "@/InterfacesAndTypes/Interfaces";

import { LearningArea_Articles } from "./LearningArea_Articles";
import { LearningArea_Videos } from "./LearningArea_Video";
import { LearningArea_Notes } from "./LearningArea_Notes";

// DEV:
import { dummySubModule } from "@/dummydata/dummyContent";

interface LearningAreaProps {
  SubModule: SubModuleData;
  handleShowLearningArea: (
    SubModule: SubModuleData | null,
    setVal: boolean
  ) => void;
}

const LearningArea = ({
  SubModule,
  handleShowLearningArea,
}: LearningAreaProps) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(0);
  const [currentSubModule, setCurrentSubModule] =
    useState<SubModuleData>(SubModule);
  const [useAI, setUseAI] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSubModule(SubModule);
    setSelectedContentIndex(0);
  }, [SubModule]);

  const selectedLearningArea = (selectedContentIndex: number) => {
    switch (selectedContentIndex) {
      case 0:
        return (
          <LearningArea_Articles
            contentId={SubModule.contentId}
            skillName={SubModule.skillName}
            moduleName={SubModule.moduleName}
            submoduleName={SubModule.title}
            // articles={currentSubModule.content?.articles!}
            setCurrentSubModule = {setCurrentSubModule}
          />
        );

      case 1:
        return (
          <LearningArea_Videos
            contentId={SubModule.contentId}
            skillName={SubModule.skillName}
            moduleName={SubModule.moduleName}
            submoduleName={SubModule.title}
            // youtubeLinks={currentSubModule.content?.youtubeLinks!}
            setCurrentSubModule = {setCurrentSubModule}
          />
        );

      case 2:
        return (
          <LearningArea_Notes
            contentId={SubModule.contentId}
            skillName={SubModule.skillName}
            moduleName={SubModule.moduleName}
            submoduleName={SubModule.title}
            notes={currentSubModule.content?.notes!}
            setCurrentSubModule = {setCurrentSubModule}
          />
        );

      default:
        return null; // in case index is invalid
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-3/5 p-4 border-[0.2] border-slate-400 rounded-lg overflow-y-auto bg-gray-800 text-white">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full border-b-2 border-slate-500 pb-3 mt-6">
        {/* Back Button */}
        <button
          className="flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-4 py-1 "
          onClick={() => handleShowLearningArea(null, false)}
        >
          <FaArrowLeftLong size={15} />
        </button>

        {/* SubModule Title */}
        <h2 className="text-sm font-semibold text-gray-100 text-wrap">
          {SubModule.title}
        </h2>

        {/* Content Buttons */}
        <div className="flex flex-row items-center justify-evenly gap-2">
          {contentButtonItems.map((content, index) => {
            // For the notes button (index 2), check if either articles or youtubeLinks have content
            if (
              index === 2 &&
              !(
                currentSubModule.content?.articles?.length! > 0 ||
                currentSubModule.content?.youtubeLinks?.length! > 0
              )
            ) {
              return null; // don't render notes button if both are empty
            }

            return (
              <button
                key={index}
                className={`flex items-center justify-between gap-2 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1 ${
                  index === selectedContentIndex
                    ? "bg-gray-200 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
                onClick={() => setSelectedContentIndex(index)}
              >
                <span
                  className={
                    index === selectedContentIndex
                      ? content.iconColorOnSelect
                      : content.iconColor
                  }
                >
                  <content.icon size={15} />
                </span>{" "}
                {content.buttonName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Area for the Selected Button */}
      <div className=" flex flex-col items-center justify-center gap-2 h-[85%] w-full bg-gray-900 rounded-lg shadow p-6 overflow-y-auto custom-scrollbar">
        {selectedLearningArea(selectedContentIndex)}
      </div>
    </div>
  );
};

export default LearningArea;
