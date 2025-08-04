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

import type { ModuleData } from "@/InterfacesAndTypes/Interfaces";

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
  handleDeleteSkill: (skillId: string) => void;
  setSkillList: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const NewSkillCard = ({
  skillId,
  skillTitle,
  modules,
  handleDeleteSkill,
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
      const res = await api.post("/roadmap/generateGemini", {
        title: skillTitle,
      });

      console.log("✅ Roadmap received:", res.data);
      setPreviewData(res.data.roadmap.modules);
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
    <main className="flex flex-row justify-between cursor-pointer bg-white p-4 rounded-xl shadow-sm border transition-transform hover:scale-105 ">
      {/* Title and tasklist view */}
      <div className="flex flex-col w-[60%] ">
        <h3 className="text-lg font-bold pr-6">{skillTitle}</h3>

        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
          {modules.length
            ? modules
                .slice(0, 3)
                .map((task, index) => <li key={index}>{task.title}</li>)
            : "No Roadmap yet"}
        </ul>

        {modules.length === 0 && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-3 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer w-3/5 self-start"
          >
            {loading ? (
              <span className="animate animate-pulse">
                Generating Roadmap...
              </span>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        )}

        {showSampleRoadmapModal && (
          <SampleRoadmapModal
            skillTitle={skillTitle}
            previewData={previewData}
            handleAcceptRoadmap={handleAcceptRoadmap}
            setShowSampleRoadmapModal={setShowSampleRoadmapModal}
          />
        )}
      </div>

      {modules.length !== 0 && (
        <div className="flex flex-col items-center justify-center w-[40%] group">
          <div className="flex items-center justify-center h-2/5 w-3/5">
            <CircularProgressbar
              className="flex items-center justify-center text-center mt-2"
              value={skillProgress}
              text={`${skillProgress}%`}
              styles={buildStyles({
                strokeLinecap: "round",
                pathColor: "yellow", // green-500 "#10b981"
                textColor: "#000000",
                trailColor: "gray", // gray-600 "#4b5563"
                backgroundColor: "#1f2937", // gray-800
                textSize: "18px",
              })}
            />
          </div>
          <button
            className=" bg-green-600 text-white cursor-pointer rounded-lg opacity-0 group-hover:opacity-100 px-2 py-1 text-xs translate-y-7"
            onClick={() => setShowProgressModal(true)}
          >
            View Progress
          </button>

          {showProgressModal && (
            <ProgressModal
              skillTitle={skillTitle}
              modules={modules}
              setShowProgressModal = {setShowProgressModal}
            />
          )}
        </div>
      )}

      {/* Card Action Buttons */}
      <div className="flex flex-col h-[95%] items-end justify-between">
        <button
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => handleDeleteSkill(skillId)}
          aria-label="Delete Skill"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};

export default NewSkillCard;
