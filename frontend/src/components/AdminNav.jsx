import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Import Icons

const AdminNav = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
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

  // Close sidebar when a link is clicked (for mobile UX)
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const linkClasses = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-[#FFDC88] text-[#52392F] font-bold"
        : "text-white hover:bg-[#772402]"
    }`;

  return (
    <div className="flex min-h-screen bg-[#FFF3D1] font-[var(--font-body)]">
      
      {/* --- MOBILE HEADER (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#52392F] text-white p-4 flex items-center justify-between z-40 shadow-md">
        <span className="font-bold tracking-widest text-lg">PAMANA ADMIN</span>
        <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
        </button>
      </div>

      {/* --- SIDEBAR OVERLAY (Mobile Only) --- */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#52392F] p-6 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
      `}>
        
        {/* Close Button (Mobile Only) */}
        <div className="flex justify-end md:hidden mb-2">
            <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-[#FFDC88]">
                <X size={24} />
            </button>
        </div>

        <div className="mb-10 text-center">
          <Link to="/admin/dashboard" className="text-white text-3xl font-extrabold tracking-widest" onClick={handleLinkClick}>
            PAMANA
          </Link>
          <p className="text-[#FFDC88] text-sm tracking-widest uppercase mt-2 opacity-80">Admin Portal</p>
        </div>

        <nav className="flex-1 space-y-2 font-[var(--font-body)]">
          <NavLink to="/admin/dashboard" className={linkClasses} onClick={handleLinkClick}>
            Dashboard & Users
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#ffffff20]">
          <button 
            onClick={handleLogoutClick}
            className="w-full text-white hover:text-[#FFDC88] transition-colors text-center py-2 font-bold uppercase tracking-widest cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      {/* Added pt-16 for mobile header spacing */}
      <div className="flex-1 md:ml-64 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </div>

      {/* --- ADMIN LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-[#5a2d0c]">Confirm Logout</h2>
            <p className="text-lg mb-8 text-[#5a2d0c]">
              Are you sure you want to end your Admin session?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmLogout}
                className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg cursor-pointer"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border-2 border-[#772402] text-[#772402] py-3 px-8 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors cursor-pointer"
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

export default AdminNav;