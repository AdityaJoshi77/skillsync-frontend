import { FaRegStickyNote } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { MdOutlineArticle } from "react-icons/md";
import { LearningArea_Articles } from "./LearningArea_Articles";
import { LearningArea_Videos } from "./LearningArea_Video";
import { LearningArea_Notes } from "./LearningArea_Notes";

export const contentButtonItems = [
  {
    buttonName: "Articles",
    icon: MdOutlineArticle,
    iconColor: "text-green-500",
    iconColorOnSelect: "text-green-600",
    LearningArea: LearningArea_Articles,
  },
  {
    buttonName: "Videos",
    icon: FaYoutube,
    iconColor: "text-red-400",
    iconColorOnSelect: "text-red-500",
    LearningArea: LearningArea_Videos,
  },
  {
    buttonName: "Notes",
    icon: FaRegStickyNote,
    iconColor: "text-yellow-300",
    iconColorOnSelect: "text-yellow-700",
    LearningArea: LearningArea_Notes,
  },
];
