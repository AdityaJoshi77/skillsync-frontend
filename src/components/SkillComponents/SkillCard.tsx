"use client";

import api from "@/lib/axios";
import { HiOutlineTrash } from "react-icons/hi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useState } from "react";
import SampleRoadmapModal from "./Modals/SampleRoadmapModal";
import ProgressModal from "./Modals/progressModal";
import {
  calculateOverallProgress,
  moduleSpecificProgress,
} from "@/utility_functions/calculateProgress";

import { ProgressBar } from "../UtilityComponents/ProgressBar";

import type { ModuleData } from "@/InterfacesAndTypes/Interfaces";
import { Spinner_Element } from "../UtilityComponents/Spinner";

interface Skill {
  _id: string;
  user: string;
  title: string;
  modules: ModuleData[];
}

interface NewSkillCardProps {
  skillId: string;
  skillTitle: string;
  modules: ModuleData[];
  skillList: Skill[];
  useAI?: boolean;
  handleDeleteSkill: (skillId: string) => void;
  setSkillList: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const NewSkillCard = ({
  skillId,
  skillTitle,
  modules,
  handleDeleteSkill,
  useAI,
  skillList,
  setSkillList,
}: NewSkillCardProps) => {
  const [showSampleRoadmapModal, setShowSampleRoadmapModal] = useState(false);
  const [previewData, setPreviewData] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const skillProgress = calculateOverallProgress(modules);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const roadmapController = useAI ? "generateGemini" : "generateDummy";
      console.log("Roadmap generation via ", roadmapController);
      const res = await api.post(`/roadmap/${roadmapController}`, {
        title: skillTitle,
      });

      console.log("✅ Roadmap received:", res.data);

      // FOR TESTING PURPOSE
      useAI
        ? setPreviewData(res.data.roadmap.modules) // REQUIRED CODE !
        : setPreviewData(res.data.roadmap);

      setShowSampleRoadmapModal(true);
    } catch (err) {
      console.error("❌ Unexpected error during roadmap generation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRoadmap = async () => {
    try {
      const res = await api.post("/roadmap/accept", {
        skillId,
        roadmap: previewData,
      });

      console.log("✅ Roadmap saved", res.data);

      // update skill list
      setSkillList((prev) => [
        ...prev.filter((skill) => skill._id !== skillId),
        res.data.skill,
      ]);

      setShowSampleRoadmapModal(false);
    } catch (err) {
      console.error("❌ Error accepting roadmap:", err);
    }
  };

  return (
    <main className="flex flex-row justify-between cursor-pointer w-full bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-md shadow-sm border">
      {/* Title and tasklist view */}
      <div className="flex flex-row items-center">
        <h3 className="text-lg font-bold pr-6 text-slate-200">{skillTitle}</h3>
      </div>

      <div>
        {showSampleRoadmapModal && (
          <SampleRoadmapModal
            skillTitle={skillTitle}
            previewData={previewData}
            handleAcceptRoadmap={handleAcceptRoadmap}
            setShowSampleRoadmapModal={setShowSampleRoadmapModal}
          />
        )}
      </div>

      <div className="flex flex-row items-center justify-end w-2/5">
        {modules.length ? (
          <div className="flex flex-row items-center justify-end w-full">
            <ProgressBar
              progressPercent={skillProgress}
              showProgressPercent={true}
            />
            <button
              className=" bg-gray-300 hover:bg-gray-50 text-black cursor-pointer rounded-md px-2 py-1 text-xs mr-2"
              onClick={() => setShowProgressModal(true)}
            >
              Progress
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer mr-3"
          >
            {loading ? (
              <span className="flex items-center justify-between animate animate-pulse ">
                Generating Roadmap...
                <Spinner_Element />
              </span>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        )}

        {/* Card Action Buttons */}
        <div className="flex h-[95%] items-center justify-center -mr-2">
          <button
            className="text-gray-400 hover:text-gray-300 cursor-pointer"
            onClick={() => handleDeleteSkill(skillId)}
            aria-label="Delete Skill"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>

        {showProgressModal && (
          <ProgressModal
            skillTitle={skillTitle}
            modules={modules}
            setShowProgressModal={setShowProgressModal}
          />
        )}
      </div>
    </main>
  );
};

export default NewSkillCard;
