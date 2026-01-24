import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 👈 Import useLocation
import API from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
// 👇 Import Toast logic here
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation(); // 👈 To get the state passed from register

  // 👇 CHECK FOR SUCCESS MESSAGE ON MOUNT
  useEffect(() => {
    if (location.state?.successMessage) {
        toast.success(location.state.successMessage, {
            position: "top-center",
            autoClose: 3000, // Disappears after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
        
        // Clear the state so the toast doesn't reappear on refresh
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('token/', {
        username: username,
        password: password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const userResponse = await API.get('me/');
      const role = userResponse.data.role;

      localStorage.setItem('user_role', role);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/homepage');
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid Student ID or Password.");
    }
  };

  return (
    <div className="max-w-xs mx-auto w-full text-white relative">
      {/* 👇 ADD TOAST CONTAINER */}
      <ToastContainer />

      <h2 className="text-3xl md:text-4xl tracking-widest text-center mb-10 font-[var(--font-heading)] font-light"
        style={{ textShadow: "0px 4px 4px rgba(0, 0, 1, 0.25)" }}>
        LOGIN
      </h2>

      <form className="space-y-5" onSubmit={handleLogin}>
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100/10 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Student ID / Username
          </label>
          <input
            type="text"
            placeholder="20221515"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#B89336] mb-1 font-[var(--font-body)] ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E8E8E8] text-gray-800 rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19a4b] font-[var(--font-body)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
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