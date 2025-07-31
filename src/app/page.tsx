"use client";
import LoginBox from "../components/AuthComponents/LoginBox";
import SignUpBox from "../components/AuthComponents/SignUpBox";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [loginOrSignup, setLoginOrSignup] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          console.log("Response data : ", res.data);
          router.push("/dashboard"); // user is already logged in
        } else {
          console.log("Token Not found, initiate new login");
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="flex flex-row w-full h-screen">
      {/* LEFT PANEL : HERO SECTION */}
      <div className="flex items-center justify-center w-1/2 border-1 bg-cyan-700">

        <div className="flex flex-col justify-center items-start w-full h-full px-12 text-white space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Learn. Build. Master.
          </h1>
          <p className="text-lg text-gray-100 max-w-md">
            SkillSync is your personalized learning roadmap to tech excellence.
            Track your progress, build real-world projects, and get AI-guided
            feedback.
          </p>

          <ul className="text-sm space-y-2 text-gray-200 list-disc list-inside">
            <li>🎯 Roadmaps tailored to your goals</li>
            <li>🧠 AI-generated projects and assignments</li>
            <li>📈 Track your growth in real time</li>
          </ul>

          <div className="mt-6">
            <p className="text-sm italic text-gray-300">
              "Because learning shouldn't be guesswork."
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL : LOGIN / REGISTER BOX */}
      <div className="flex items-center justify-center border-1 w-1/2 bg-blue-800">
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
