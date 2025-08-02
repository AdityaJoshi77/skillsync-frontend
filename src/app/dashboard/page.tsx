"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import TaskCard from "@/components/RoadMapComponents/SkillCard";
import Spinner from "@/components/UtilityComponents/Spinner";
import { useRouter } from "next/navigation"; // Correct one for app router

interface Task {
  title: string;
  type: string;
  status: string;
}

interface skill {
  _id: string;
  user: string;
  title: string;
  modules: Task[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; _id: string } | null>(null);
  const [newSkillTitle, setNewSkillTitle] = useState<string>("");
  const [skillList, setSkillList] = useState<skill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // periodic check to ensure session validity
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.get("/auth/me");
      } catch (err) {
        console.log("Session expired. Redirecting...");
        router.push("/");
      } finally {
        // setLoading(false);
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch user and their skills
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/me");
        if (!res.data) throw new Error("Unauthorized");
        setUser(res.data);
        getSkills(res.data._id);
      } catch (err) {
        console.log(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTasks();
  }, []);

  // Fetch skills
  const getSkills = async (userId: string) => {
    try {
      const res = await api.get(`/skill/${userId}`);
      setSkillList(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Create a new skill
  const createSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle || !user) return;

    try {
      const res = await api.post("/skill", { title: newSkillTitle });
      setNewSkillTitle("");
      setSkillList((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.delete(`/skill/${skillId}`);
      setSkillList((prev) => prev.filter((skill) => skill._id !== skillId));
    } catch (error) {
      console.log("Skill Deletion failed");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      router.push("/"); // Redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome Back {user?.name} 👋</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Task Creation Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Learn a New Skill</h2>
          <form className="flex gap-2" onSubmit={createSkill}>
            <input
              type="text"
              value={newSkillTitle}
              placeholder="What do you want to learn?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setNewSkillTitle(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Create Skill
            </button>
          </form>
        </section>

        {/* Skill List */}
        <section className="">
          <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-visible">
            {/* h-[calc(100vh-270px)] */}
            {skillList.length ? (
              skillList.map((skill, index) => (
                <TaskCard
                  key={index}
                  skillId={skill._id}
                  skillTitle={skill.title}
                  modules={skill.modules.map((sub: any) => sub.title)}
                  handleDeleteSkill={handleDeleteSkill}
                  skillList={skillList}
                  setSkillList={setSkillList}
                />
              ))
            ) : (
              <p>No skills to show</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}