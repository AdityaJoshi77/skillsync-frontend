"use client";

import {
  SubModuleData,
  youtubeLinkData,
} from "@/InterfacesAndTypes/Interfaces";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { Spinner_Window } from "../UtilityComponents/Spinner";

interface LearningArea_VideosProps {
  contentId: string;
  skillName: string;
  moduleName: string;
  submoduleName: string;
  // useAI: boolean;
  setCurrentSubModule: React.Dispatch<React.SetStateAction<SubModuleData>>;
}

export const LearningArea_Videos = ({
  contentId,
  skillName,
  moduleName,
  submoduleName, // currently used to refresh the component as a side effect trigger.
  setCurrentSubModule,
}: LearningArea_VideosProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [contentVideos, setContentVideos] = useState<youtubeLinkData[]>([]);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [useAI, setUseAI] = useState<boolean>(false);

  useEffect(() => {
    const getPersistedArticles = async () => {
      try {
        setVideoLoading(true);
        const persistedResponse = await api.get(`/content/getpersistedvideos/${contentId}`);
        console.log('Persited Video Response', persistedResponse.data);
        setContentVideos(persistedResponse.data);
      } catch (error) {
        console.log('Backend Call Failed');
        console.error(error);
      } finally {
        setVideoLoading(false);
      }
    };
    getPersistedArticles();
  }, [submoduleName]);

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
      const endpoint = `/content/generateVideos`;
      const contentGenerationResponse = await api.post(endpoint, {
        skillName,
        moduleName,
        submoduleName,
        contentId,
        useAI,
      });

      if (!contentGenerationResponse.data) {
        throw new Error("No content generated");
      }

      console.log(
        "Generated Videos; saving in db...",
        contentGenerationResponse.data
      );

      //  backend call for persisted data
      const persistedResponse = await api.get(`/content/getPersistedVideos/${contentId}`);
      setContentVideos(persistedResponse.data);

      setCurrentSubModule((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          articles: prevState.content?.articles ?? [],
          youtubeLinks: persistedResponse.data,
          notes: prevState.content?.notes ?? [],
          _id: prevState.content?._id ?? "",
          userId: prevState.content?.userId ?? "", // ensure always a string
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
              src={contentVideos[selectedIndex].link.replace(
                "watch?v=",
                "embed/"
              )}
              title={`YouTube video ${selectedIndex + 1}`}
              allowFullScreen
            />
          </div>

          {/* Video List */}
          <div
            className="relative flex flex-col h-full gap-2 pt-2 pr-2 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out"
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
        <div className="flex flex-col items-center justify-center h-full w-full gap-2">
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
          <button
            className={`rounded-full px-4 border-2 border-slate-400 mt-2 cursor-pointer
          ${useAI ? "text-black bg-gray-300" : " bg-gray-800 text-gray-200"}`}
            onClick={() => setUseAI(!useAI)}
          >
            {useAI ? "AI ACTIVE !" : "Ai Inactive"}
          </button>
        </div>
      )}
    </div>
  );
};
