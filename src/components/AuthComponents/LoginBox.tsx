"use client";

import api from "@/lib/axios";
import {loginFunction} from '@/utility_functions/auth_functions'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginBoxProps {
  loginOrSignup: boolean;
  setLoginOrSignup: (data: boolean) => void;
}

export default function LoginBox({
  loginOrSignup,
  setLoginOrSignup,
}: LoginBoxProps) {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log(formData.email);

    try {
      const apiResponse = await loginFunction(formData);
      console.log("Login Successful : ", apiResponse.data);
      router.push('/dashboard');
    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.msg || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-gray-800">
      {/* Top-right logo */}
      <div className="absolute top-4 right-4">
        <p className="text-2xl font-semibold italic cursor-default text-slate-200">SkillSync</p>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-sm p-6 rounded-xl border-[0.1px] border-slate-400 bg-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-center text-slate-200">
          Log in to your account
        </h2>

        <form 
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6">
          <label htmlFor="email-input" className="mb-1 text-sm text-slate-200">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-cyan-600"
            required={true}
            onChange={handleChange}
          />

          <label htmlFor="password-input" className="mb-1 text-sm text-slate-200">
            Password
          </label>
          <div className="relative w-full">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="px-4 py-2 border rounded-lg w-full bg-gray-100 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
              required={true}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        
          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center -mt-4">Error : {error}</p>
          )}

          <button
            type="submit"
            className="bg-gray-800 text-white py-2 rounded-lg cursor-pointer border-[0.1px] border-slate-400 hover:bg-gray-300 hover:text-black transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-200 mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setLoginOrSignup(!loginOrSignup)}
            className="text-yellow-500 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
