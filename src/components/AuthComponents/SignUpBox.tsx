"use client";


import api from "@/lib/axios";
import { signUpFunction } from "@/utility_functions/auth_functions";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useState } from "react";


interface SignUpBoxProps{
    loginOrSignup:boolean,
    setLoginOrSignup:(data:boolean)=>void
}

const SignUpBox = ({loginOrSignup, setLoginOrSignup}:SignUpBoxProps) => {
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
        const apiResponse = await signUpFunction(formData);
        console.log("Registered", apiResponse.data);
    } catch (error : any) {
        const msg = error.response?.data?.msg || 'SignUp Failed';
        setError(msg);
    }    
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-gray-50">
      {/* Top-right logo */}
      <div className="absolute top-4 right-4">
        <p className="text-2xl font-semibold italic cursor-default">SkillSync</p>
      </div>

      {/* Signup Box */}
      <div className="w-full max-w-sm p-6 rounded-2xl bg-gray-50">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Create your account
        </h2>

        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 text-sm">
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
            <label htmlFor="email" className="mb-1 text-sm">
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
            <label htmlFor="password" className="mb-1 text-sm">
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
                className="absolute right-3 top-3.5"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1 text-sm">
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
                className="absolute right-3 top-3.5"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center -mt-4">Error!: {error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-cyan-700 text-white py-2 rounded-md cursor-pointer hover:bg-cyan-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span onClick={()=>setLoginOrSignup(!loginOrSignup)} className="text-blue-600 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


export default SignUpBox;