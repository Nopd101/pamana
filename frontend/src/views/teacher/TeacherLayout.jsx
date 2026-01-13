import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';

const TeacherLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setShowLogoutModal(false);
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-[#FFDC88] text-[#52392F] font-bold"
        : "text-white hover:bg-[#772402]"
    }`;

  return (
    // 👇 FIX 1: 'h-screen' locks height, 'overflow-hidden' stops window scroll
    <div className="flex h-screen w-screen bg-[#FFF3D1] font-[var(--font-body)] overflow-hidden">
      
      {/* Sidebar - Switched from 'fixed' to standard flex item */}
      <aside className="w-64 bg-[#52392F] h-full flex flex-col shadow-xl z-50 flex-none">
        <div className="p-6 mb-4 text-center">
          <Link to="/teacher/dashboard" className="text-white text-3xl font-extrabold tracking-widest font-[var(--font-heading)]">
            PAMANA
          </Link>
          <p className="text-[#FFDC88] text-sm tracking-widest uppercase mt-2 opacity-80">Teacher Portal</p>
        </div>

        <nav className="flex-1 space-y-2 px-6">
          <NavLink to="/teacher/dashboard" className={linkClasses}>
            Dashboard Overview
          </NavLink>
          <NavLink to="/teacher/progress" className={linkClasses}>
            Class Progress
          </NavLink>
        </nav>

        <div className="mt-auto p-6 border-t border-[#ffffff20]">
          <button 
            onClick={handleLogoutClick}
            className="w-full text-white hover:text-[#FFDC88] transition-colors text-center py-2 font-bold uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* 👇 FIX 2: 'flex-1' takes remaining width, 'h-full' matches screen height */}
      {/* Removed 'p-8' so child components control their own spacing */}
      <div className="flex-1 h-full relative overflow-hidden">
        <Outlet />
      </div>

      {/* --- TEACHER LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-[#5a2d0c]">Confirm Logout</h2>
            <p className="text-lg mb-8 text-[#5a2d0c]">
              Are you sure you want to log out from Teacher Portal?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmLogout}
                className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border-2 border-[#772402] text-[#772402] py-3 px-8 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLayout;