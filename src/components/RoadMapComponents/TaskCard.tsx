"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";

interface TaskCardProps {
  taskId: string;
  taskTitle: string;
  subtasks: string[];
  onDelete: (taskId: string) => void;
  onGenerate?: (taskId: string) => void; // Optional handler
}

const TaskCard = ({
  taskId,
  taskTitle,
  subtasks,
  onDelete,
  onGenerate,
}: TaskCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setLoading(true);
    await onGenerate(taskId);
    setLoading(false);
  };

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-sm border">
      {/* Delete button */}
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
        onClick={() => onDelete(taskId)}
        aria-label="Delete Task"
      >
        <HiOutlineTrash className="w-5 h-5" />
      </button>
      
      {/* Title */}
      <h3 className="text-lg font-bold pr-6">{taskTitle}</h3>
      {/* Subtasks */}
      <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
        {subtasks.length ? (
          subtasks.map((subtask, index) => <li key={index}>{subtask}</li>)
        ) : (
          <li>No Roadmap yet</li>
        )}
      </ul>
      {/* Generate Roadmap Button */}
      {subtasks.length === 0 && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-3 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      )}
      {/* Status */}
      <div className="mt-3 text-xs text-gray-500">Status: In Progress</div>
    </div>
  );
};

export default TaskCard;
