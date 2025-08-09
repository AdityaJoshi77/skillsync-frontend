"use client";

import { FaRegStickyNote } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiBrain } from "react-icons/gi";
import { SubModuleData } from "@/InterfacesAndTypes/Interfaces";

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
          <button className="flex items-center justify-evenly gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1">
            <span className="text-yellow-300"><FaRegStickyNote size={15} /></span> Notes
          </button>
          <button className="flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1">
            <span className="text-green-500"><MdOutlineArticle size={15}/></span> Articles
          </button>
          <button className="flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1">
            <span className="text-red-400"><FaYoutube size={15} /></span> Video
          </button>
          <button className="flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs rounded-full cursor-pointer border-[0.2px] border-slate-400 px-3 py-1">
             <span className="text-pink-400"><GiBrain size={15} /></span> AI Summary
          </button>
        </div>
      </div>

      <div className="h-[85%] w-full bg-gray-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Learning Area</h2>
        <p>This is where the learning content will be displayed.</p>
        <p>Depending upon the content button selected.</p>
      </div>
    </div>
  );
};
