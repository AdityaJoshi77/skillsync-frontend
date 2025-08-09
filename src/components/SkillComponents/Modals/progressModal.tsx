"use client";

import ModalPortal from "@/ModalPortals/ModalPortal";
import type { ModuleData, SkillData } from "@/InterfacesAndTypes/Interfaces";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";



interface ProgressModalProps{
  skill: SkillData;
  setShowProgressModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProgressModal = ({
  skill,
  setShowProgressModal,
}: ProgressModalProps) => {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center ">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-[60%] h-[80%]">

          {/* Modal Header */}
          <div className="flex flex-row items-center justify-between border-b-2 border-slate-500 pb-3">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">
              Progress Review: <span className="italic">{skill.title}</span>
            </h2>
            <div className="flex items-center justify-end w-[40%] dark:text-white mr-5">
              <div className="mr-3 w-full bg-gray-200 rounded-full h-2.5 border-[0.5px] dark:bg-gray-800 dark:border-slate-500 dark:text-white">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
              <p>{`${skill.progress}`}%</p>
            </div>
          </div>

          {/* Modal Content Area*/}
          <div className="overflow-y-auto h-[75%] mt-6 custom-scrollbar  pr-2">
            <div className="space-y-3">
              {skill.modules.map((module, idx) => {
                const [open, setOpen] = useState(false);
                return (
                  <div key={idx} className="border border-gray-600 rounded-md">

                    {/* Module Accordion Button */}
                    <button
                      onClick={() => setOpen(!open)}
                      className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-left text-white font-medium cursor-pointer"
                    >
                      {/* Module Title */}
                      <span>{module.title}</span>

                      {/* Module Progress Bar */}
                      <div className="flex flex-row items-center justify-end gap-3 w-3/5">
                        <div className="w-[30%] mr-3 bg-gray-200 rounded-full h-2.5 border-[0.5px] dark:bg-gray-800 dark:border-slate-500">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full text-center"
                            style={{
                              width: `${module.progress}%`,
                            }}
                          ></div>
                        </div>

                        {/* Module Progress Percentage */}
                        <p>{module.progress}%</p>

                        {/* Module Open/Close DropDown Button */}
                        <span>
                          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                      </div>
                    </button>
                    
                    {/* Module -> SubModules */}
                    {open && (
                      <ul className="px-6 pb-3 pt-1 list-none text-md space-y-1">
                        {module.submodules.map((sub, subIdx) => (
                          <li
                            key={subIdx}
                            className={`relative pl-6 ${
                              sub.status === "Completed"
                                ? "before:content-['✓'] before:text-green-400 text-slate-200"
                                : "before:content-['•'] before:text-amber-600 text-slate-400"
                            } before:absolute before:left-0 before:top-0.5`}
                          >
                            {sub.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-end gap-4 mt-4 mr-2">
            <button
              onClick={() => setShowProgressModal(false)}
              className="px-4 py-1 text-sm rounded-md mr-2 bg-slate-300 hover:bg-slate-400 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ProgressModal;
