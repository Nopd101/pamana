import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const AdminNav = () => {
  // Styles for the sidebar links
  const linkClasses = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-[#FFDC88] text-[#52392F] font-bold"
        : "text-white hover:bg-[#772402]"
    }`;

  return (
    <div className="flex min-h-screen bg-[#FFF3D1] font-[var(--font-body)]">
      
      {/* ================= SIDEBAR (The "Nav" part) ================= */}
      <aside className="w-64 bg-[#52392F] min-h-screen p-6 flex flex-col fixed left-0 top-0 z-50 shadow-xl">
        <div className="mb-10 text-center">
          <Link to="/admin/dashboard" className="text-white text-3xl font-extrabold tracking-widest font-[var(--font-heading)]">
            PAMANA
          </Link>
          <p className="text-[#FFDC88] text-sm tracking-widest uppercase mt-2 opacity-80">Admin Portal</p>
        </div>

        <nav className="flex-1 space-y-2 font-[var(--font-body)]">
          <NavLink to="/admin/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={linkClasses}>
            User Management
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#ffffff20]">
          <Link to="/login" className="block text-white hover:text-[#FFDC88] transition-colors text-center py-2">
            Logout
          </Link>
        </div>
      </aside>

      {/* ================= CONTENT AREA ================= */}
      {/* This <Outlet /> is CRITICAL. It tells React where to put the page content */}
      <div className="ml-64 flex-1 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminNav;