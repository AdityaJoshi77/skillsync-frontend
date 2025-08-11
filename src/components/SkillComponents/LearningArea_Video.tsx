"use client";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa6";

interface LearningArea_VideosProps {
  links: string[];
}

export const LearningArea_Videos = ({ links }: LearningArea_VideosProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-row items-start gap-2 w-full h-full">
      {/* Video Player */}
      <div className="flex-1 h-full bg-gray-800 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={links[selectedIndex].replace("watch?v=", "embed/")}
          title={`YouTube video ${selectedIndex + 1}`}
          allowFullScreen
        />
      </div>

      {/* Video List */}
      <div
        className="relative flex flex-col h-full gap-2 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out"
        style={{
          width: isHovered ? "15%" : "6%",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {links.map((link, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
              idx === selectedIndex ? "bg-gray-600" : "bg-gray-800"
            } hover:bg-gray-600`}
            onClick={() => setSelectedIndex(idx)}
          >
            <FaYoutube className="text-red-500 min-w-[20px]" />
            {isHovered && <span className="whitespace-nowrap">Video {idx + 1}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
