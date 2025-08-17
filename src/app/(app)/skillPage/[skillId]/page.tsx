"use client";

import api from "@/lib/axios";
import SkillPageRoadmap from "@/components/SkillComponents/SkillPageRoadmap";
import LearningArea from "@/components/SkillComponents/LearningArea";
import type {
  SkillData,
  SubModuleData,
} from "@/InterfacesAndTypes/Interfaces";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner_Window } from "@/components/UtilityComponents/Spinner";

export default function SkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
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
        console.log("Session expired. Redirecting...",err);
        router.push("/");
      } finally {
        setPageLoading(false);
      }
    }, 60000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [router]);

  // fetching user and the skill
  useEffect(() => {
    const fetchUserSkill = async () => {
      try {
        setPageLoading(true);
        const res = await api.get("/auth/me");
        if (!res.data) throw new Error("Unauthorized");
        getSkill(skillId);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserSkill();
  }, [router, skillId]);

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

  if (pageLoading || skillLoading) {
    return (
      <div className="h-full w-full">
        <Spinner_Window />
      </div>
    );
  }

  return (
    <div className=" flex flex-row items-baseline-last justify-between h-screen bg-gray-800">
      <div className=" flex flex-row justify-between h-screen w-full">
        {skill && (
          <SkillPageRoadmap
            skill_from_SkillPage={skill}
            showLearningArea={showLearningArea}
            handleShowLearningArea={handleShowLearningArea}
          />
        )}
        <LearningArea
          SubModule={openSubModule!}
          handleShowLearningArea={handleShowLearningArea}
        />
      </div>
    </div>
  );
}
