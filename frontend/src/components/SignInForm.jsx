import React from "react";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  return (
    <div className="max-w-sm mx-auto w-full text-white">
      <h2
        className="text-3xl md:text-4xl tracking-widest text-center mb-6 font-[var(--font-heading)] font-light"
        style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
      >
        SIGN UP
      </h2>

      <form className="space-y-3">
        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="ex. Juan"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="ex. Dela Cruz"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Section
          </label>
          <div className="relative">
            <select
              className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Select Section
              </option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Student ID
          </label>
          <input
            type="text"
            placeholder="20221515"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••••"
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <button
          type="button"
          className="w-full mt-2 bg-[#B89336] hover:bg-[#a68b4f] text-[#3E2b26] font-bold py-2.5 rounded-lg transition-colors duration-200 font-[var(--font-body)] cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      <div className="flex items-center my-4 opacity-50 -mx-4">
        <div className="flex-1 h-px bg-gray-400"></div>
        <span className="px-2 text-xs text-gray-300 font-[var(--font-body)]">
          Go back to{" "}
          <Link
            to="/login"
            className="underline hover:text-white transition-colors"
          >
            Login
          </Link>
        </span>
        <div className="flex-1 h-px bg-gray-400"></div>
      </div>
    </div>
  );
};

export default SignUpForm;
