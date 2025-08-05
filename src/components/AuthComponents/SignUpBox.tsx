"use client";

import api from "@/lib/axios";
import { signUpFunction } from "@/utility_functions/auth_functions";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { loginFunction } from "@/utility_functions/auth_functions";
import { useRouter } from "next/navigation";

interface SignUpBoxProps {
  loginOrSignup: boolean;
  setLoginOrSignup: (data: boolean) => void;
}

const SignUpBox = ({ loginOrSignup, setLoginOrSignup }: SignUpBoxProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const registerResponse = await signUpFunction(formData);
      console.log("Registered", registerResponse.data);
      const loginResponse = await loginFunction({
        email: formData.email,
        password: formData.password,
      });
      console.log("Successfully Logged in : ", loginResponse);
      router.push("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.msg || "SignUp Failed";
      setError(msg);
    }
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-gray-800">
      {/* Top-right logo */}
      <div className="absolute top-4 right-4">
        <p className="text-2xl font-semibold italic cursor-default text-slate-200">
          SkillSync
        </p>
      </div>

      {/* Signup Box */}
      <div className="w-full mt-8 max-w-sm p-6 rounded-xl border-[0.1px] border-slate-400 bg-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-center text-slate-200">
          Create your account
        </h2>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 text-sm text-slate-200">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className="px-4 py-2 border rounded-md w-full bg-gray-100 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
              required
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 text-sm text-slate-200">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              className="px-4 py-2 border rounded-md w-full bg-gray-100 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
              required
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 text-sm text-slate-200">
              Password
            </label>
            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="px-4 py-2 border rounded-md w-full bg-gray-100 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                required
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
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 text-sm text-slate-200"
            >
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="px-4 py-2 border rounded-md w-full bg-gray-100 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center -mt-4">
              Error: {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 rounded-lg cursor-pointer border-[0.1px] border-slate-400 hover:bg-gray-300 hover:text-black transition"
          >
            SignUp and Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-200 mt-6 ">
          Already have an account?{" "}
          <span
            onClick={() => setLoginOrSignup(!loginOrSignup)}
            className="text-yellow-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpBox;
