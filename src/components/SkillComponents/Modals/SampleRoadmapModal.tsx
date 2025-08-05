"use client";

import ModalPortal from "@/components/ModalPortals/ModalPortal";
import { useEffect } from "react";

interface SubModuleData {
  title: string;
  type: "Learning" | "Practice" | "Project";
  status: string;
}

interface ModuleData {
  title: string;
  status: string;
  submodules: SubModuleData[];
}

interface SampleRoadmapModalProps {
  skillTitle: string;
  previewData: ModuleData[];
  handleAcceptRoadmap: () => void;
  setShowSampleRoadmapModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SampleRoadmapModal = ({
  skillTitle,
  previewData,
  handleAcceptRoadmap,
  setShowSampleRoadmapModal,
}: SampleRoadmapModalProps) => {

  // useEffect(() => {
  //   console.log(previewData);
  // },[]);

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-[60%] h-[80%] border-1 border-slate-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">{skillTitle}</h2>

          <div className="overflow-y-scroll h-[75%] mt-6 custom-scrollbar">
            <ul className="list-disc list-inside text-sm text-white mb-4">
              {previewData.map((module, idx) => (
                <li key={idx} className="mb-2">
                  <span className="font-medium">{module.title}</span>
                  <ul className="list-[circle] list-inside ml-4 mt-1 text-slate-400">
                    {module.submodules.map((sub, subIdx) => (
                      <li key={subIdx} className="text-sm">
                        {sub.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-4 mt-6 mr-2">
            <button
              onClick={() => setShowSampleRoadmapModal(false)}
              className="px-3 py-1 text-sm rounded-md border-1 border-slate-300 bg-slate-300 hover:bg-slate-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptRoadmap}
              className="px-3 py-1 text-sm rounded-md border-1 border-slate-300 bg-green-800 text-white hover:bg-green-700 cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default SampleRoadmapModal;
