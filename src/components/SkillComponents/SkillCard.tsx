"use client";

import api from "@/lib/axios";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useState } from "react";
import SampleRoadmapModal from "./Modals/SampleRoadmapModal";
import ProgressModal from "./Modals/progressModal";

import { ProgressBar } from "../UtilityComponents/ProgressBar";

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

      // FOR TESTING PURPOSE
      useAI
        ? setPreviewData(res.data.roadmap.modules) // REQUIRED CODE !
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

      // update skill list
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
      className={`flex flex-row justify-between cursor-pointer w-[97%] bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-md shadow-sm border ${
        generatingRoadmap && "relative overflow-hidden shimmer-bg"
      } `}
    >
      {/* Title and tasklist view */}
      <div className="flex flex-row items-center">
        <h3 className="text-lg font-bold pr-6 text-slate-200">{skill.title}</h3>
      </div>

      <div>
        {showSampleRoadmapModal && (
          <SampleRoadmapModal
            skillTitle={skill.title}
            previewData={previewData}
            handleAcceptRoadmap={handleAcceptRoadmap}
            setShowSampleRoadmapModal={setShowSampleRoadmapModal}
          />
        )}
      </div>

      <div className="flex flex-row items-center justify-end w-2/5">
        {skill.modules.length ? (
          <div className="flex flex-row items-center justify-end w-full">
            <ProgressBar
              progressPercent={skill.progress}
              showProgressPercent={true}
            />
            <button
              className=" bg-gray-300 hover:bg-gray-50 text-black cursor-pointer rounded-md px-3 py-1 text-sm mr-2"
              onClick={() => router.push(`/skillPage/${skill._id}`)}
            >
              Visit Skill
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
        <div className="relative flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <HiOutlineDotsVertical className="w-5 h-5 -mr-2" />
          </button>

          {showMenu && (
            <div className="absolute top-4 right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
              {skill.modules.length > 0 && (
                <button
                  onClick={(e) => {
                    // e.stopPropagation();
                    setShowProgressModal(true);
                    setShowMenu(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  View Progress
                </button>
              )}
              <button
                onClick={(e) => {
                  handleDeleteSkill(skill._id);
                  setShowMenu(false);
                }}
                className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Delete Skill
              </button>
            </div>
          )}
        </div>

        {showProgressModal && (
          <ProgressModal
            skill = {skill}
            setShowProgressModal={setShowProgressModal}
          />
        )}
      </div>
    </main>
  );
};

const BlankSkillCard = () => {
  return (
    <main className="relative overflow-hidden shimmer-bg flex flex-row justify-between cursor-pointer h-[15%] w-[97%] bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-md shadow-sm border">
      {/* Your content here */}
      {/* <p className="text-md text-blue-100 italic animate animate-pulse w-full">Loading</p> */}
    </main>
  );
};

export { SkillCard, BlankSkillCard };
