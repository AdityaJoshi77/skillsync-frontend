"use client";

import api from "@/lib/axios";
import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";
import { title } from "process";

interface Task {
  title: string;
  type: string;
  status: string;
}

interface Skill {
  _id: string;
  user: string;
  title: string;
  modules: Task[];
}

interface TaskCardProps {
  skillId: string;
  skillTitle: string;
  modules: string[];
  skillList: Skill[];
  handleDeleteSkill: (skillId: string) => void;
  setSkillList: React.Dispatch<React.SetStateAction<Skill[]>>;
}

interface RoadmapData {
  title: string;
  type: string;
}

const SkillCard = ({
  skillId,
  skillTitle,
  modules,
  handleDeleteSkill,
  skillList,
  setSkillList,
}: TaskCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState<RoadmapData[]>([]);

  const handleGenerate = async () => {
    try {

      // const res = await api.post("/roadmap/generateGemini", {
      //   title: skillTitle,
      // });

      const res = await api.post('/roadmap/generateDummy',{
        title:skillTitle
      });

      console.log(res);
      setPreviewData(res.data.roadmap);
      setShowModal(true);
    } catch (err) {
      console.error("Error generating roadmap from gemini:", err);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await api.post("/roadmap/accept", {
        skillId,
        roadmap: previewData,
      });

      console.log("Roadmap saved", res.data);
      

      // remove the old skill sans-roadmap from the skillList
      setSkillList((prev) => prev.filter((skill) => skill._id !== skillId));

      // add the new skill with roadmap to the skillList
      setSkillList((prev) => [...prev, res.data.skill]);

      setShowModal(false);
    } catch (err) {
      console.error("Error accepting roadmap:", err);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-sm border cursor-pointer transition-transform">
      {/* Delete button */}
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
        onClick={() => handleDeleteSkill(skillId)}
        aria-label="Delete Task"
      >
        <HiOutlineTrash className="w-5 h-5" />
      </button>

      {/* Title */}
      <h3 className="text-lg font-bold pr-6 -mt-4">{skillTitle}</h3>
      {/* modules */}
      <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
        {modules.length ? (
          modules.slice(0, 3).map((task, index) => <li key={index}>{task}</li>)
        ) : (
          <li>No Roadmap yet</li>
        )}
      </ul>
      {/* Generate Roadmap Button */}
      {modules.length === 0 && (
        <button
          onClick={handleGenerate}
          className="mt-3 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
        >
          Generate Roadmap
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">{skillTitle}</h2>
            <ul className="list-disc list-inside text-sm text-gray-800 mb-4">
              {previewData.length ? (
                previewData.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.title}</span>
                    <span className="text-gray-500 italic">{item.type}</span>
                  </li>
                ))
              ) : (
                <li>No suggestions found.</li>
              )}
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillCard;
