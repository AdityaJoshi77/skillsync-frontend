import { FaRegStickyNote } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { MdOutlineArticle } from "react-icons/md";


export const contentButtonItems = [
  {
    buttonName: "Articles",
    icon: MdOutlineArticle,
    iconColor: "text-green-500",
    iconColorOnSelect: "text-green-600",
  },
  {
    buttonName: "Videos",
    icon: FaYoutube,
    iconColor: "text-red-400",
    iconColorOnSelect: "text-red-500",
  },
  {
    buttonName: "Notes",
    icon: FaRegStickyNote,
    iconColor: "text-yellow-300",
    iconColorOnSelect: "text-yellow-700",
  },
];
