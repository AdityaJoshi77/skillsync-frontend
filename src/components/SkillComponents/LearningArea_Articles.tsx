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
  articles: ArticleData[];
  useAI: boolean;
  setCurrentSubModule: React.Dispatch<React.SetStateAction<SubModuleData>>;
}

export const LearningArea_Articles = ({
  contentId,
  skillName,
  moduleName,
  submoduleName,
  articles,
  useAI,
  setCurrentSubModule,
}: LearningArea_ArticlesProps) => {
  const [contentArticles, setContentArticles] =
    useState<ArticleData[]>(articles);
  const [articleLoading, setArticleLoading] = useState<boolean>(false);

  useEffect(() => {
    setArticleLoading(true);
    setContentArticles(articles);
    setArticleLoading(false);
  }, [articles]);

  const handleGenerateContent = async (
    skillName: string,
    moduleName: string,
    submoduleName: string,
    contentId: string,
    useAI: boolean
  ) => {
    try {
      setArticleLoading(true);
      console.log("Fired handleGenerateContent For Articles");
      const endpoint = `/content/generatearticles`;
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

      console.log("Generated Articles", response.data);

      // Correct Logic: Use the fresh response data directly here,
      // to update both local state AND the parent component state.
      const freshArticles = response.data.data;

      setContentArticles(freshArticles);

      setCurrentSubModule((prevState) => ({
        ...prevState,
        content: {
          ...prevState.content,
          articles: freshArticles,  // Use freshly fetched data directly
          youtubeLinks: prevState.content?.youtubeLinks ?? [], // fallback if undefined
          _id: prevState.content?._id ?? "", // keep this if _id is required; use empty string if undefined
          notes: prevState.content?.notes ?? [], // fallback for notes array
        },
      }));


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
       */


    } catch (error) {
      console.error("Error in handleGenerateContent: ", error);
    } finally {
      // setArticleLoading(false);
    }
  };

  if(articleLoading){
    return <div className="h-full w-full">
      <Spinner_Window/>
    </div>
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-2 w-full bg-gray-900 rounded-lg shadow p-6 overflow-y-auto custom-scrollbar">
      {contentArticles.length !== 0 ? (
        contentArticles.map((article, index) => {
          return (
            <div className="mb-4" key={index}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-300">{article.summary}</p>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-lg text-gray-300">No articles found</p>
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
            Generate Articles
          </button>
        </div>
      )}
    </div>
  );
};
