"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaRegStickyNote,
  FaCloud,
  FaFileAlt,
  FaSignOutAlt,
  FaSyncAlt,
} from "react-icons/fa";
import api from "@/lib/axios";
import { UserData } from "@/InterfacesAndTypes/Interfaces";

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isAvailable?: boolean;
  onClick: () => void;
  isLogout?: boolean;
  isExpanded: boolean;
}

// A reusable component for each navigation link
const NavLink = ({
  label,
  icon,
  isActive,
  isAvailable = true,
  onClick,
  isLogout,
  isExpanded,
}: NavLinkProps) => {
  const baseClasses =
    "flex items-center p-3 rounded-lg transition-all duration-200  text-sm";
  const activeClasses = isActive
    ? "bg-gray-700 text-white"
    : "text-gray-300 hover:bg-gray-800 hover:text-white";
  const logoutClasses = isLogout ? "text-red-400 hover:bg-red-900/50" : "";
  const unavailableClasses = !isAvailable ? "text-gray-600" : activeClasses;

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${logoutClasses} ${unavailableClasses} cursor-pointer`}
    >
      <div className="text-xl">{icon}</div>
      {isExpanded && (
        <span className="font-medium ml-3 whitespace-nowrap">{label}</span>
      )}
    </div>
  );
};

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  // Handle the active link state based on the current path
  const getInitialActiveLink = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.includes("notes")) return "notes";
    return "dashboard"; // Default to dashboard
  };

  const [activeLink, setActiveLink] = useState<string>(getInitialActiveLink);

  const handleNavigation = (link: string, href: string) => {
    setActiveLink(link);
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      router.push("/"); // Redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`flex flex-col h-screen ${
        isExpanded ? "w-64" : "w-19"
      } bg-gray-900 text-white p-4 shadow-xl transition-[width] duration-300 ease-in-out`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* App Title */}
      <div className="mb-8 overflow-hidden border-b border-gray-700 pb-4">
        {isExpanded ? (
          <h1 className="text-3xl font-extrabold italic text-gray-200 text-start cursor-default ">
            SkillSync
          </h1>
        ) : (
          // <FaSyncAlt className="text-3xl text-gray-200 mx-auto" />
          <p className="text-5xl text-center font-extrabold italic text-gray-200  cursor-default ">
            S
          </p>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 space-y-2">
        <NavLink
          href="/dashboard"
          label="Home"
          icon={<FaHome color="" />}
          isActive={activeLink === "dashboard"}
          onClick={() => handleNavigation("dashboard", "/dashboard")}
          isExpanded={isExpanded}
        />
        <NavLink
          href="/notes"
          label="My Notes"
          icon={<FaRegStickyNote />}
          isActive={activeLink === "notes"}
          onClick={() =>
            handleNavigation("notes", `/userNotesPage/${user!._id}`)
          } // Stub: Redirect to dashboard for now
          isExpanded={isExpanded}
        />
        <NavLink
          href="/cloud"
          label="Coming Soon..."
          icon={<FaCloud />}
          isActive={false} // Always false for stubs
          isAvailable = {false}
          onClick={() => console.log("Cloud Dev clicked")} // Stub
          isExpanded={isExpanded}
        />
        <NavLink
          href="/resume"
          label="Coming Soon..."
          icon={<FaFileAlt />}
          isActive={false} // Always false for stubs
          isAvailable = {false}
          onClick={() => console.log("Resume Builder clicked")} // Stub
          isExpanded={isExpanded}
        />
      </div>

      {/* Spacer to push logout to the bottom */}
      <div className="flex-grow" />

      {/* User Actions */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <NavLink
          href="#"
          label="Logout"
          icon={<FaSignOutAlt />}
          isActive={false}
          onClick={handleLogout}
          isLogout={true}
          isExpanded={isExpanded}
        />
      </div>
    </nav>
  );
}
