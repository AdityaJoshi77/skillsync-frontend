"use client";

import type {
  ModuleData,
  SubModuleData,
} from "@/InterfacesAndTypes/Interfaces";
import { FaRegStickyNote } from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ProgressBar } from "../UtilityComponents/ProgressBar";

interface ModuleAreaProps {
  module: ModuleData;
  handleShowLearningArea: (SubModule: SubModuleData, setVal: boolean) => void;
  updateModule: (Mod: ModuleData, subId: string, updation: string) => void;
  setOpenModuleIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const ModuleArea = ({
  module,
  handleShowLearningArea,
  updateModule,
  setOpenModuleIndex,
}: ModuleAreaProps) => {
  const handleTick = (subIdx: number) => {
    const updatedModule = { ...module }; // shallow copy
    console.log("in handleTick on ModuleArea");
    // Toggle status
    const sub = updatedModule.submodules[subIdx];
    sub.status = sub.status === "Completed" ? "Pending" : "Completed";

    // Recalculate progress of the module
    const completedCount = updatedModule.submodules.filter(
      (s) => s.status === "Completed"
    ).length;

    updatedModule.progress = Math.floor(
      (completedCount / updatedModule.submodules.length) * 100
    );

    // Now inform parent component (SkillPageRoadmap) about this change
    updateModule(
      updatedModule,
      updatedModule.submodules[subIdx]._id,
      sub.status
    );
  };

  return (
    <main className="h-[88%] w-full">
      {/* Title area : back button, module title, progress %*/}
      <div className="flex flex-row items-center justify-between h-[15%]">
        <button
          className="flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full cursor-pointer border-[0.2px] border-slate-400 px-4 py-1 "
          onClick={() => setOpenModuleIndex(-1)}
        >
          <FaArrowLeftLong size={10} /> Back
        </button>

        <h2 className="text-center text-gray-200 text-md">{module.title}</h2>
        <div className="w-2/5 flex items-center justify-end">
          <ProgressBar
            progressPercent={module.progress}
            showProgressPercent={true}
          />
        </div>
      </div>

      <div className="pr-1 py-2 h-[85%] rounded-b-xl space-y-3 overflow-y-auto custom-scrollbar">
        {module.submodules.map((sub, subIdx) => (
          <div
            key={subIdx}
            className="flex items-center justify-between px-4 py-2 rounded-md bg-gray-700 text-white border-[0.1px] border-gray-600"
          >
            <span className="text-sm font-medium w-3/5 ">{sub.title}</span>
            <div className="flex items-center justify-between w-1/4">
              <button
                className="flex items-center justify-between gap-2 hover:bg-gray-300 hover:text-black bg-gray-800  text-gray-200 text-sm rounded-full cursor-pointer border-[0.2px] border-slate-400 px-4 py-1 "
                onClick={() => handleShowLearningArea(sub, true)}
              >
                Open
              </button>
              <input
                type="checkbox"
                checked={sub.status === "Completed"}
                onChange={() => handleTick(subIdx)}
                className={`w-3.5 h-3.5 cursor-pointer  accent-yellow-300`}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
