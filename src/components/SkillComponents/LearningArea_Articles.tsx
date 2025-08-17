"use client";

import api from "@/lib/axios";
import { ArticleData, SubModuleData } from "@/InterfacesAndTypes/Interfaces";
import { Spinner_Window } from "../UtilityComponents/Spinner";
import { useEffect, useState } from "react";

interface LearningArea_ArticlesProps {
  contentId: string;
  skillName: string;
  moduleName: string;
  submoduleName: string;
  setCurrentSubModule: React.Dispatch<React.SetStateAction<SubModuleData>>;
}

export const LearningArea_Articles = ({
  contentId,
  skillName,
  moduleName,
  submoduleName, // currently used to refresh the component as a side effect trigger.
  setCurrentSubModule,
}: LearningArea_ArticlesProps) => {
  const [contentArticles, setContentArticles] =
    useState<ArticleData[]>([]);
  const [articleLoading, setArticleLoading] = useState<boolean>(false);
  const [useAI, setUseAI] = useState<boolean>(false);

  useEffect(() => {
    const getPersistedArticles = async () => {
      try {
        setArticleLoading(true);
        const persistedResponse = await api.get(`/content/getPersistedArticles/${contentId}`);
        setContentArticles(persistedResponse.data);
        console.log('Backend call for persisted articles successful');
      } catch (error) {
        console.log('Failure in LearningArticles_UseEffect');
        console.error(error);
      } finally {
        setArticleLoading(false);
      }
    };
    getPersistedArticles();
  }, [submoduleName, contentId]);

  const handleGenerateContent = async (
    skillName: string,
    moduleName: string,
    submoduleName: string,
    contentId: string
  ) => {
    try {
      setArticleLoading(true);
      console.log("Fired handleGenerateContent For Articles");
      const endpoint = `/content/generateArticles`;
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
        "Generated Articles; saving in db...",
        contentGenerationResponse.data
      );

      // backend call for persisted data
      const persistedResponse = await api.get(`/content/getPersistedArticles/${contentId}`);
      setContentArticles(persistedResponse.data);

      setCurrentSubModule((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          articles: persistedResponse.data,
          youtubeLinks: prevState.content?.youtubeLinks ?? [],
          notes: prevState.content?.notes ?? [],
          _id: prevState.content?._id ?? "",
          userId: prevState.content?.userId ?? "", // ensure always a string
        },
      }));
    } catch (error) {
      console.error("Error in handleGenerateContent: ", error);
    } finally {
      setArticleLoading(false);
    }
  };

  if (articleLoading) {
    return (
      <div className="h-full w-full">
        <Spinner_Window />
      </div>
    );
  }

  return (
    <div
      className={` flex flex-col items-center justify-center gap-2 h-full w-full bg-gray-900 rounded-lg shadow px-3 overflow-y-auto custom-scrollbar ${
        contentArticles.length > 0 ? "pt-40" : "pt-0"
      }`}
    >
      {contentArticles.length !== 0 ? (
        contentArticles.map((article, index) => {
          return (
            <div className="mb-4" key={index}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-yellow-400 hover:underline"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-300">{article.summary}</p>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full gap-2">
          <p className="text-lg text-gray-300">No articles found</p>
          <button
            className="bg-gray-300 hover:bg-gray-100 px-4 py-1 rounded-full text-black cursor-pointer text-sm"
            onClick={() =>
              handleGenerateContent(
                skillName,
                moduleName,
                submoduleName,
                contentId
              )
            }
          >
            Generate Articles
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

// NOTE ABOUT STATE SYNC:

/*
 * WRONG LOGIC (commented out below):
 *
 * Using 'contentArticles' here immediately after calling setContentArticles(response.data.data)
 * will NOT work as expected because React state updates are asynchronous.
 * At this moment, contentArticles still holds the old state (before update),
 * so the parent state will be updated with stale articles data.
 *
 * setCurrentSubModule((prevState) => ({
 *   ...prevState,
 *   content: {
 *     ...prevState.content,
 *     articles: contentArticles,  // STALE value, not fresh!
 *     youtubeLinks: prevState.content?.youtubeLinks ?? [],
 *     _id: prevState.content?._id ?? "",
 *     notes: prevState.content?.notes ?? [],
 *   },
 * }));
 *
 * => This causes UI inconsistency and bugs because parent state is out of sync.
 * 
 * CORRECT LOGIC : 
 * 
 *  setCurrentSubModule((prevState) => ({
   ...prevState,
      content: {
     ...prevState.content,
        articles: freshArticles, // Use freshly fetched data directly
        youtubeLinks: prevState.content?.youtubeLinks ?? [], // fallback if undefined
        _id: prevState.content?._id ?? "", // keep this if _id is required; use empty string if undefined
      notes: prevState.content?.notes ?? [], // fallback for notes array
   },
 }));

 */
