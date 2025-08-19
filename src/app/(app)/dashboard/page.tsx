// DashboardPage.tsx
"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import {
  SkillCard,
  BlankSkillCard,
} from "@/components/SkillComponents/SkillCard";
import {
  Spinner_Element,
  Spinner_Window,
} from "@/components/UtilityComponents/Spinner";
import { useRouter } from "next/navigation";
import type { UserData, SkillData } from "@/InterfacesAndTypes/Interfaces";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [newSkillTitle, setNewSkillTitle] = useState<string>("");
  const [skillList, setSkillList] = useState<SkillData[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [skillSetLoading, setSkillSetLoading] = useState<boolean>(false);
  const [skillButttonLoading, setSkillButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  // New state to manage which menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // only for testing phase in DEV (API Rate Limit Protection)
  const [useAI, setUseAI] = useState<boolean>(true);

  // periodic check to ensure session validity
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.get("/auth/me");
      } catch (err) {
        console.log("Session expired. Redirecting...", err);
        router.push("/");
      } finally {
        // setPageLoading(false);
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [router]);

  // Fetch user and their skills
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        setPageLoading(true);
        const res = await api.get("/auth/me");
        console.log("User Data : ", res.data);
        if (!res.data) throw new Error("Unauthorized");
        setUser(res.data);
        setPageLoading(false);

        getUserSkills();
      } catch (err) {
        console.log(err);
        router.push("/");
      }
    };

    fetchUserAndTasks();
  }, [router]);

  // Fetch skills
  const getUserSkills = async () => {
    try {
      setSkillSetLoading(true);
      const res = await api.get("/skill");
      
      // Sort the skills by `createdAt` to show the latest first
      const sortedSkills = res.data.sort((a: SkillData, b: SkillData) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // For descending order (latest first)
      });

      setSkillList(sortedSkills);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setSkillSetLoading(false);
    }
  };

  // Create a new skill
  const createSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillButtonLoading(true);
    const trimmed = newSkillTitle.trim().toLowerCase();

    if (!trimmed) {
      setError("Skill title cannot be empty.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      const res = await api.post("/skill", { title: trimmed, useAI });
      
      // Add new skill to the beginning of the list to show it first
      setSkillList((prev) => [res.data, ...prev]);
      
      setNewSkillTitle("");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const msg =
          axiosErr.response?.data?.message || "Failed to create skill.";
        setError(`${msg}`);
      } else {
        setError("ERROR : Failed to create skill.");
      }
      setNewSkillTitle("");
      setTimeout(() => setError(null), 5000);
      console.error("Error creating skill:", err);
    } finally {
      setSkillButtonLoading(false);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.delete(`/skill/${skillId}`);
      setSkillList((prev) => prev.filter((skill) => skill._id !== skillId));
    } catch (error) {
      console.log("Skill Deletion failed", error);
    }
  };

  // Function to handle toggling a card's menu
  const handleToggleMenu = (skillId: string) => {
    setOpenMenuId(openMenuId === skillId ? null : skillId);
  };

  if (pageLoading) {
    return (
      <div className="h-full w-full">
        <Spinner_Window />
      </div>
    );
  }

  return (
    <main className="h-screen bg-gray-800 p-6">
      <div className="flex flex-col h-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-300">
            Welcome Back, {user?.name.split(" ")[0]}
          </h1>

          {/* useAI DEV Button */}
          {/* <button
            type="button"
            onClick={() => setUseAI((prev) => !prev)}
            className={`px-4 py-2 rounded-full border transition duration-100 cursor-pointer ${
              useAI ? "bg-gray-300 text-black" : "bg-gray-800 text-white"
            }`}
          >
            {useAI ? "AI active" : "AI not active"}
          </button> */}
        </div>

        {/* Task Creation Section */}
        <section className="mb-8 flex flex-col justify-start">
          <h2 className="text-xl font-semibold mb-2 text-amber-50">
            Learn a New Skill
          </h2>

          <form
            className="flex items-center justify-end space-x-2"
            onSubmit={createSkill}
          >
            <input
              type="text"
              value={newSkillTitle}
              placeholder="What do you want to learn?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-300"
              onChange={(e) => setNewSkillTitle(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={skillButttonLoading}
              className="flex items-center justify-between px-4 py-2 bg-gray-300 text-gray-900 rounded-full cursor-pointer hover:bg-gray-50"
            >
              {skillButttonLoading ? (
                <span className="animate animate-pulse flex items-center justify-between">
                  Creating Skill...
                  <Spinner_Element />
                </span>
              ) : (
                "Create Skill"
              )}
            </button>
          </form>

          <p className=" text-red-400 text-md font-semibold text-center mt-2 opacity-100 transition-opacity duration-1000">
            {error}
          </p>
        </section>

        {/* Skill List */}
        <section className="flex flex-col w-full h-[70%] px-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            Your Skills
          </h2>

          {/* Code to show blank skill cards if the user has skills but haven't been fetched yet or skill creation prompt div if user has no skills */}
          {skillSetLoading ? (
            user?.skillMetaData?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full overflow-y-auto custom-scrollbar">
                {user.skillMetaData.map((skill, index) => (
                  <BlankSkillCard key={index} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-600 rounded-xl">
                <p className="text-gray-200 italic text-center font-semibold text-lg">
                  Create a new skill to begin learning
                </p>
              </div>
            )
          ) : // {/* Code to show skill cards if the user has skills or skill creation prompt div if the user has no skills yet */}
          skillList.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full overflow-y-auto custom-scrollbar">
              {skillList.map((skill, index) => (
                <SkillCard
                  key={index}
                  skill={skill}
                  handleDeleteSkill={handleDeleteSkill}
                  useAI={useAI}
                  setSkillList={setSkillList}
                  isMenuOpen={openMenuId === skill._id}
                  onToggleMenu={handleToggleMenu}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-700 rounded-xl ">
              <p className="text-gray-200 italic text-center font-semibold text-lg ">
                Create a new skill to begin learning
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}