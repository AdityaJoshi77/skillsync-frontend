"use client";

import api from "@/lib/axios";
import SkillPageRoadmap from "@/components/SkillComponents/SkillPageRoadmap";
import { LearningArea } from "@/components/SkillComponents/LearningArea";
import type {
  UserData,
  SkillData,
  SubModuleData,
} from "@/InterfacesAndTypes/Interfaces";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [skill, setSkill] = useState<SkillData>();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);
  const [showLearningArea, setShowLearningArea] = useState<boolean>(false);
  const [openSubModule, setOpenSubModule] = useState<SubModuleData | null>(
    null
  );

  // periodic check to ensure session validity
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.get("/auth/me");
      } catch (err) {
        console.log("Session expired. Redirecting...");
        router.push("/");
      } finally {
        // setPageLoading(false);
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // fetching user and the skill
  useEffect(() => {
    const fetchUserandSkill = async () => {
      try {
        setPageLoading(true);
        const res = await api.get("/auth/me");
        if (!res.data) throw new Error("Unauthorized");
        setUser(res.data);
        getSkill(skillId);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserandSkill();
  }, []);

  const handleShowLearningArea = (sub: SubModuleData | null, set: boolean) => {
    setOpenSubModule(sub);
    setShowLearningArea(set);
  };

  const getSkill = async (skillId: string) => {
    try {
      setSkillLoading(true);
      const res = await api.get(`/skill/${skillId}`, {
        params: { populateContent: true },
      });

      console.log("Skill Data : ", res.data);
      setSkill(res.data);
    } catch (error) {
      console.error("Error Fetching Skill : ", error);
    } finally {
      setSkillLoading(false);
    }
  };

  return (
    <div className=" flex flex-row items-baseline-last justify-between h-screen bg-gray-800">
      {skill ? (
        <div className=" flex flex-row justify-between h-screen w-full">
          <SkillPageRoadmap
            skill_from_SkillPage={skill}
            handleShowLearningArea={handleShowLearningArea}
          />
          {/* Right: Learning Area Stub */}
          {openSubModule && (
            <LearningArea
              SubModule={openSubModule!}
              handleShowLearningArea={handleShowLearningArea}
            />
          )}
        </div>
      ) : (
        // Add the learning area stub div here :
        <div className="text-black">Loading skill data...</div>
      )}
    </div>
  );
}
