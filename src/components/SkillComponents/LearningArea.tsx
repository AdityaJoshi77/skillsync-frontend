"use client";

import api from "@/lib/axios";
import { FaRegStickyNote } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiBrain } from "react-icons/gi";
import { SubModuleData } from "@/InterfacesAndTypes/Interfaces";
import { contentButtonItems } from "./LearningAreaContentButtons";
import { useState } from "react";

import type {
  ArticleData,
  NoteData,
  ContentData,
} from "@/InterfacesAndTypes/Interfaces";

import { LearningArea_Videos } from "./LearningArea_Video";
import { LearningArea_Articles } from "./LearningArea_Articles";
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

export const LearningArea = ({
  SubModule,
  handleShowLearningArea,
}: LearningAreaProps) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(0);
  const [subModuleContent, setSubModuleContent] = useState<ContentData>(
    SubModule.content!
  );
  const [contentExists, setContentExists] = useState<boolean>(false);
  let useAI = false;

  console.log("Data of the Current SubModule : ", SubModule);

  const renderContent = () => {
    if (selectedContentIndex === 0) {
      // Articles
      if (subModuleContent?.articles?.length) {
        if (!contentExists) setContentExists(true);
        return subModuleContent.articles.map(
          (a: ArticleData, index: number) => (
            <LearningArea_Articles article={a} key={index} />
          )
        );
      } else {
        if (contentExists) setContentExists(false);
        return <p className="text-white">No articles found.</p>;
      }
    } else if (selectedContentIndex === 1) {
      // Videos
      if (subModuleContent?.youtubeLinks?.length) {
        if (!contentExists) setContentExists(true);
        return <LearningArea_Videos links={subModuleContent.youtubeLinks} />;
      } else {
        if (contentExists) setContentExists(false);
        return <p className="text-white">No videos found.</p>;
      }
    } else if (selectedContentIndex === 2) {
      return <LearningArea_Notes notes={subModuleContent.notes} />;
    }
  };

  const handleGenerateContent = async (
    skillName: string,
    moduleName: string,
    submoduleName: string,
    contentId: string,
    useAI: boolean,
    requiredContent: string
  ) => {
    try {
      console.log("Fired handleGenerateContent");

      // ✅ Corrected endpoint string
      const endpoint = `/content/generate${requiredContent.toLowerCase()}`;
      const response = await api.post(endpoint, {
        skillName,
        moduleName,
        submoduleName,
        contentId,
        useAI,
      });

      if (!response.data) {
        throw new Error("No content generated");
      }

      console.log(`Generated ${requiredContent}: `, response.data);

      // ✅ Use state so UI updates
      setContentExists(true);

      if (requiredContent.toLowerCase() === "videos") {
        setSubModuleContent((prevState) => ({
          ...prevState,
          youtubeLinks: response.data,
        }));
      } else if (requiredContent.toLowerCase() === "articles") {
        setSubModuleContent((prevState) => ({
          ...prevState,
          articles: response.data,
        }));
      }
    } catch (error) {
      console.error("Error in handleGenerateContent: ", error);
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
            return index !== 2 ||
              subModuleContent.articles.length ||
              subModuleContent.youtubeLinks.length ? (
              <button
                key={index}
                className={`flex items-center justify-between gap-2 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1 ${
                  index === selectedContentIndex
                    ? "bg-gray-200 text-black"
                    : " bg-gray-800 hover:bg-gray-700 text-white"
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
            ) : null;
          })}
        </div>
      </div>

      <div className=" flex flex-col items-center justify-center gap-2 h-[85%] w-full bg-gray-900 rounded-lg shadow p-6 overflow-y-auto custom-scrollbar">
        {renderContent()}

        {selectedContentIndex !== 2 && !contentExists && (
          <button
            className="bg-gray-200 hover:bg-gray-100 px-4 py-1 rounded-full text-black cursor-pointer text-sm"
            onClick={() =>
              handleGenerateContent(
                SubModule.skillName,
                SubModule.moduleName,
                SubModule.title,
                SubModule.contentId,
                useAI,
                `${contentButtonItems[selectedContentIndex].buttonName}` // requiredContent
              )
            }
          >
            {`Generate ${contentButtonItems[selectedContentIndex].buttonName}`}
          </button>
        )}
      </div>
    </div>
  );
};
