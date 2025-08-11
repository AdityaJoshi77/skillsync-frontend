"use client";

import { SubModuleData } from "@/InterfacesAndTypes/Interfaces";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { Spinner_Window } from "../UtilityComponents/Spinner";

interface LearningArea_VideosProps {
  contentId: string;
  skillName: string;
  moduleName: string;
  submoduleName: string;
  links: string[];
  useAI: boolean;
  setCurrentSubModule: React.Dispatch<React.SetStateAction<SubModuleData>>;
}

export const LearningArea_Videos = ({
  contentId,
  skillName,
  moduleName,
  submoduleName,
  links,
  useAI,
  setCurrentSubModule,
}: LearningArea_VideosProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [contentVideos, setContentVideos] = useState<string[]>(links);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);

  useEffect(() => {
    setVideoLoading(true);
    setContentVideos(links);
    setVideoLoading(false);
  }, [links]);

  const handleGenerateContent = async (
    skillName: string,
    moduleName: string,
    submoduleName: string,
    contentId: string,
    useAI: boolean
  ) => {
    try {
      setVideoLoading(true);
      console.log("Fired handleGenerateConten For Videos");
      const endpoint = `/content/generatevideos`;
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

      console.log("Generated Videos", response.data);

      const freshVideos = response.data.data;
      setContentVideos(freshVideos);

      setCurrentSubModule((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          articles: prevState.content!.articles,
          youtubeLinks: freshVideos ?? [], // fallback to empty array if undefined
          _id: prevState.content!._id!, // keep this if _id is required
          notes: prevState.content!.notes ?? [], // similarly for notes if needed
        },
      }));
    } catch (error) {
      console.error("Error in handleGenerateContent: ", error);
    } finally {
      setVideoLoading(false);
    }
  };

  if (videoLoading) {
    return (
      <div className="h-full w-full">
        <Spinner_Window />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-800 rounded-lg overflow-hidden">
      {contentVideos.length ? (
        <div className="flex flex-row items-start gap-2 w-full h-full">
          {/* Video Player */}
          <div className="flex-1 h-full bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={contentVideos[selectedIndex].replace("watch?v=", "embed/")}
              title={`YouTube video ${selectedIndex + 1}`}
              allowFullScreen
            />
          </div>

          {/* Video List */}
          <div
            className="relative flex flex-col h-full gap-2 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out"
            style={{
              width: isHovered ? "15%" : "6%",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {contentVideos.map((link, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
                  idx === selectedIndex ? "bg-gray-600" : "bg-gray-800"
                } hover:bg-gray-600`}
                onClick={() => setSelectedIndex(idx)}
              >
                <FaYoutube className="text-red-500 min-w-[20px]" />
                {isHovered && (
                  <span className="whitespace-nowrap">Video {idx + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full gap-2 bg-gray-900">
          <p className="text-lg text-gray-300">No videos found</p>
          <button
            className="bg-gray-300 hover:bg-gray-100 px-4 py-1 rounded-full text-black cursor-pointer text-sm"
            onClick={() =>
              handleGenerateContent(
                skillName,
                moduleName,
                submoduleName,
                contentId,
                useAI
              )
            }
          >
            Generate Videos
          </button>
        </div>
      )}
    </div>
  );
};
