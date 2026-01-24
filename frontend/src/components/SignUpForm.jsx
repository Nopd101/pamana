import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
// 👇 Import Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [section, setSection] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [sectionsList, setSectionsList] = useState([]); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await API.get("sections/");
        setSectionsList(response.data);
      } catch (err) {
        console.error("Failed to load sections:", err);
      }
    };
    fetchSections();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!section) {
      setError("Please select a section.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await API.post("register/", {
        username: studentId,
        password: password,
        first_name: firstName,
        last_name: lastName,
        section: section, 
        role: "student"
      });

      // 👇 1. SHOW SUCCESS TOAST IMMEDIATELY
      toast.success("Account created! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000, // Disappears after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored", // Using colored theme for better visibility
        style: { backgroundColor: "#4caf50", color: "#fff" } // Force Green style
      });

      // 👇 2. WAIT 2 SECONDS, THEN REDIRECT
      setTimeout(() => {
          navigate("/login");
      }, 2500); // Slight buffer (2.5s) to let them read it
      
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const errMsg = err.response?.data?.username 
        ? "Student ID already registered." 
        : "Registration failed. Check details.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="max-w-sm mx-auto w-full text-white relative">
      
      {/* 👇 3. TOAST CONTAINER (With High Z-Index to stay on top) */}
      <div className="absolute top-0 left-0 w-full" style={{ zIndex: 9999 }}>
        <ToastContainer />
      </div>

      <h2
        className="text-3xl md:text-4xl tracking-widest text-center mb-6 font-[var(--font-heading)] font-light"
        style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
      >
        SIGN UP
      </h2>

      <form className="space-y-3" onSubmit={handleRegister}>
        {error && (
          <div className="text-red-500 text-xs text-center bg-red-100/10 p-2 rounded border border-red-500/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="ex. Juan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] text-black"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="ex. Dela Cruz"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] text-black"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Section
          </label>
          <div className="relative">
            <select
              className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] cursor-pointer text-black"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Section
              </option>
              {sectionsList.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
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
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] text-black"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)] text-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
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