import React from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="max-w-xs mx-auto w-full text-white">
      <h2 className="text-3xl md:text-4xl tracking-widest text-center mb-10 font-[var(--font-heading)] font-light"
        style={{ textShadow: "0px 4px 4px rgba(0, 0, 1, 0.25)" }}>
        LOGIN
      </h2>

      <form className="space-y-5">
        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Student ID
          </label>
          <input
            type="text"
            placeholder="20221515"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••••"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <button
          type="button"
          className="w-full mt-4 bg-[#B89336] hover:bg-[#a68b4f] text-[#3E2b26] font-bold py-2.5 rounded-lg transition-colors duration-200 font-[var(--font-body)] cursor-pointer"
          
        >
          Login
        </button>
      </form>

      <div className="flex items-center my-5 opacity-50 -mx-6">
        <div className="flex-1 h-px bg-gray-400"></div>
        <span className="px-2 text-xs text-gray-300 font-[var(--font-body)]">
          Or
        </span>
        <div className="flex-1 h-px bg-gray-400"></div>
      </div>

     <Link to="/signup" className="block w-full">
        <button
          type="button"
          className="w-full bg-white hover:bg-gray-100 text-[#3E2b26] font-bold py-2.5 rounded-lg transition-colors duration-200 font-[var(--font-body)] cursor-pointer"
        >
          Sign Up
        </button>
      </Link>
    </div>
  );
};

export default LoginForm;