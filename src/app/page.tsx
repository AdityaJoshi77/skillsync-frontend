"use client";
import LoginBox from "../components/AuthComponents/LoginBox";
import SignUpBox from "../components/AuthComponents/SignUpBox";
import { Spinner_Window } from "@/components/UtilityComponents/Spinner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { FaBrain, FaChartLine, FaGraduationCap } from "react-icons/fa";

export default function Home() {
  const [loginOrSignup, setLoginOrSignup] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        setPageLoading(true);
        const res = await api.get("/auth/me");
        if (res.data) {
          console.log("Currently Logged in User : ", res.data);
          router.push("/dashboard"); // user is already logged in
        } else {
          console.log("Token Not found, initiate new login");
        }
      } catch (err) {
        console.log("User not logged in",err);
      } finally{
        setPageLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (pageLoading) {
    return (
      <div className="h-screen w-screen">
        <Spinner_Window />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-screen">
      {/* LEFT PANEL : HERO SECTION */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 text-white relative">
        {/* The background now uses shades of gray */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-gray-400 opacity-80 animate-gradient-shift"></div>
        <div className="z-10 text-center md:text-left space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide">
            Your Roadmap to <br className="hidden md:inline" /> Skill Mastery.
          </h1>
          <p className="text-xl text-gray-200 max-w-xl mx-auto md:mx-0">
            SkillSync centralizes your learning journey, from curated tutorials
            and AI-powered assignments to real-time progress tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <FaGraduationCap className="text-4xl text-yellow-400 mb-2" />
              <span className="font-semibold">Personalized Paths</span>
              <p className="text-sm text-gray-300">
                Roadmaps tailored to your unique goals.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <FaBrain className="text-4xl text-yellow-400 mb-2" />
              <span className="font-semibold">AI-Guided Learning</span>
              <p className="text-sm text-gray-300">
                Smart projects and assignments to test your skills.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <FaChartLine className="text-4xl text-yellow-400 mb-2" />
              <span className="font-semibold">Real-Time Progress</span>
              <p className="text-sm text-gray-300">
                Track your growth and celebrate your milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL : LOGIN / REGISTER BOX */}
      <div className="flex items-center justify-center border-1 w-[50%] bg-gray-800">
        {loginOrSignup ? (
          <LoginBox
            loginOrSignup={loginOrSignup}
            setLoginOrSignup={setLoginOrSignup}
          />
        ) : (
          <SignUpBox
            loginOrSignup={loginOrSignup}
            setLoginOrSignup={setLoginOrSignup}
          />
        )}
      </div>
    </div>
  );
}
