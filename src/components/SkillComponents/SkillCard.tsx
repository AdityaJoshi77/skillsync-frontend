"use client";

import api from "@/lib/axios";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaBookOpen, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useState, useEffect } from "react";
import SampleRoadmapModal from "./Modals/SampleRoadmapModal";
import ProgressModal from "./Modals/progressModal";
import "react-circular-progressbar/dist/styles.css";

import type { SkillData, ModuleData } from "@/InterfacesAndTypes/Interfaces";
import { Spinner_Element } from "../UtilityComponents/Spinner";
import { useRouter } from "next/navigation";

interface NewSkillCardProps {
  skill: SkillData;
  useAI?: boolean;
  handleDeleteSkill: (skillId: string) => void;
  setSkillList: React.Dispatch<React.SetStateAction<SkillData[]>>;
}

const SkillCard = ({
  skill,
  handleDeleteSkill,
  useAI,
  setSkillList,
}: NewSkillCardProps) => {
  const router = useRouter();
  const [showSampleRoadmapModal, setShowSampleRoadmapModal] = useState(false);
  const [previewData, setPreviewData] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // New state for the animated progress value
  const [displayedProgress, setDisplayedProgress] = useState(0);

  // Animation effect
  useEffect(() => {
    if (skill.progress > 0) {
      const timer = setTimeout(() => {
        let currentProgress = 0;
        const animationInterval = setInterval(() => {
          if (currentProgress >= skill.progress) {
            clearInterval(animationInterval);
          } else {
            currentProgress += 1;
            setDisplayedProgress(currentProgress);
          }
        }, 10); // Adjust interval for animation speed (10ms is a good starting point)
      }, 500); // Wait 500ms before starting animation

      return () => clearTimeout(timer);
    }
  }, [skill.progress]);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratingRoadmap(true);
    try {
      const roadmapController = useAI ? "generateGemini" : "generateDummy";
      console.log("Roadmap generation via ", roadmapController);
      const res = await api.post(`/roadmap/${roadmapController}`, {
        title: skill.title,
      });

      console.log("✅ Roadmap received:", res.data);

      useAI
        ? setPreviewData(res.data.roadmap.modules)
        : setPreviewData(res.data.roadmap);

      setShowSampleRoadmapModal(true);
    } catch (err) {
      console.error("❌ Unexpected error during roadmap generation:", err);
    } finally {
      setLoading(false);
      setGeneratingRoadmap(false);
    }
  };

  const handleAcceptRoadmap = async () => {
    try {
      const res = await api.post("/roadmap/accept", {
        skillId: skill._id,
        roadmap: previewData,
      });

      console.log("✅ Roadmap saved", res.data);

      setSkillList((prev) => [
        ...prev.filter((s) => s._id !== skill._id),
        res.data.skill,
      ]);

      setShowSampleRoadmapModal(false);
    } catch (err) {
      console.error("❌ Error accepting roadmap:", err);
    }
  };

  return (
    <main
      className={`relative flex flex-col justify-between w-full h-48 p-4 rounded-lg shadow-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-colors duration-200 ${
        generatingRoadmap && "shimmer-bg"
      } `}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-md font-bold text-slate-200 capitalize">
          {skill.title}
        </h3>

        {/* Card Action Buttons */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="text-gray-400 hover:text-gray-200 cursor-pointer p-1 rounded-md hover:bg-gray-500 transition-colors"
          >
            <HiOutlineDotsVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute top-8 right-0 mt-2 w-36 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
              {skill.modules.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProgressModal(true);
                    setShowMenu(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-t-md"
                >
                  View Progress
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSkill(skill._id);
                  setShowMenu(false);
                }}
                className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-md"
              >
                Delete Skill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="mt-2">
        {skill.modules.length ? (
          <div className="flex flex-row justify-between items-end w-full h-full cursor-default">
            {/* Left side: Stats */}
            <div className="flex flex-col items-start justify-end h-full">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaBookOpen className="text-amber-400" />
                <span className="text-sm">
                  Total Modules: {skill.modules.length}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaCheckCircle className="text-emerald-400" />
                <span className="text-sm">
                  Completed: {skill.completedSubModules}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaClipboardList className="text-blue-400" />
                <span className="text-sm">
                  Total Submodules: {skill.totalSubmodules}
                </span>
              </div>
              <button
                className="w-full mt-4 bg-gray-300 hover:bg-gray-50 text-black cursor-pointer rounded-full px-3 py-2 text-sm font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/skillPage/${skill._id}`);
                }}
              >
                Visit Skill
              </button>
            </div>

            {/* Right side: Circular Progress Bar */}
            <div className="w-20 h-20 font-semibold mr-3">
              <CircularProgressbar
                value={displayedProgress} // Use the new state variable here
                text={`${displayedProgress}%`}
                styles={buildStyles({
                  pathColor: "#FACC15",
                  trailColor: "#1F2937",
                  textColor: "#E2E8F0",
                  textSize: "1.4rem",
                  strokeLinecap: "round",
                })}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerate();
            }}
            disabled={loading}
            className="w-full px-3 py-2 text-sm bg-gray-300 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center animate-pulse">
                Generating Roadmap...
                <Spinner_Element />
              </span>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        )}
      </div>

      {showProgressModal && (
        <ProgressModal
          skill={skill}
          setShowProgressModal={setShowProgressModal}
        />
      )}
      {showSampleRoadmapModal && (
        <SampleRoadmapModal
          skillTitle={skill.title}
          previewData={previewData}
          handleAcceptRoadmap={handleAcceptRoadmap}
          setShowSampleRoadmapModal={setShowSampleRoadmapModal}
        />
      )}
    </main>
  );
};

const BlankSkillCard = () => {
  return (
    <main className="relative overflow-hidden shimmer-bg flex flex-row justify-between h-48 w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg shadow-sm border border-gray-600"></main>
  );
};

export { SkillCard, BlankSkillCard };
