"use client";

import { ArticleData } from "@/InterfacesAndTypes/Interfaces";

interface LearningArea_ArticlesProps {
  article: ArticleData;
}

export const LearningArea_Articles = ({
  article,
}: LearningArea_ArticlesProps) => {
  return (
    <div className="mb-4">
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
};
