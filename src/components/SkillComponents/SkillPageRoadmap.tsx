"use client";

import { useState } from "react";
import type { SkillData, ModuleData } from "@/InterfacesAndTypes/Interfaces";
import { ProgressBar } from "../UtilityComponents/ProgressBar";
import { ModuleArea } from "./ModuleArea";
import api from "@/lib/axios";

interface SkillPageRoadmapProps {
  skill_from_SkillPage: SkillData;
}

// backend call to recount progress value on submodule tick/untick
const updateSkillProgress = async (
  skillId: string,
  moduleId: string,
  subModuleId: string,
  updation: string
) => {
  try {
    const res = await api.put(`/skill/${skillId}`, {
      moduleId,
      subModuleId,
      updation,
    });
    console.log("Skill Values Recalculated Successfully", res.data);
  } catch (error) {
    console.error("Skill Recalculation Failed", error);
  }
};


// COMPONENT
const SkillPageRoadmap = ({ skill_from_SkillPage }: SkillPageRoadmapProps) => {
  const [skill, setSkill] = useState<SkillData>(skill_from_SkillPage);
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(-1);

  const updateModule = (
    updatedModule: ModuleData,
    subModuleId: string,
    updation: string
  ) => {
    const updatedSkill = { ...skill };
    const moduleIndex = updatedSkill.modules.findIndex(
      (m) => m._id === updatedModule._id
    );

    updatedSkill.modules[moduleIndex] = updatedModule;

    // Recalculate skill progress
    const allSubmodules = updatedSkill.modules.flatMap((m) => m.submodules);
    const completed = allSubmodules.filter(
      (s) => s.status === "Completed"
    ).length;
    updatedSkill.progress = Math.floor(
      (completed / allSubmodules.length) * 100
    );

    setSkill(updatedSkill); // this will cause re-render

    // Send update request to backend for persisting the changes.
    updateSkillProgress(
      updatedSkill._id,
      updatedModule._id,
      subModuleId,
      updation
    );
  };

  return (
    <section className="bg-gray-800 rounded-xl shadow-lg p-6 w-2/5 h-9/10 mb-2 border-[0.2] border-slate-400 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-row items-center justify-between border-b-2 border-slate-500 pb-3 mt-4">
        <h2 className="text-xl font-semibold text-gray-200">{skill.title}</h2>
        <div className="flex items-center justify-end w-[60%] text-white">
          <ProgressBar
            progressPercent={skill.progress}
            showProgressPercent={true}
          />
        </div>
      </div>

      {/* Modules */}
      {openModuleIndex === -1 ? (
        <div className="space-y-5 mt-8 h-4/5 overflow-y-auto custom-scrollbar">
          {skill.modules.map((module, idx) => {
            return (
              <div key={idx} className="border border-gray-600 rounded-md">
                <button
                  onClick={() => setOpenModuleIndex(idx)}
                  className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium cursor-pointer overflow-y-auto"
                >
                  <span>{module.title}</span>
                  <div className="flex items-center justify-end gap-3 w-1/2">
                    <ProgressBar
                      progressPercent={module.progress}
                      showProgressPercent={true}
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // SubModules
        <ModuleArea
          module={skill.modules[openModuleIndex]}
          updateModule={updateModule}
          setOpenModuleIndex={setOpenModuleIndex}
        />
      )}
    </section>
  );
};

export default SkillPageRoadmap;
