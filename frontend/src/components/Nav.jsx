import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios"; // Ensure you have this import for fetching user data

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Dropdown state
  
  // Initialize state based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('access_token'));
  const [firstName, setFirstName] = useState("Student");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Check login status and fetch user name
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const hasToken = !!token;
    setIsLoggedIn(hasToken);

    if (hasToken) {
      const fetchUser = async () => {
        try {
          const response = await API.get("me/");
          // Use first_name if available, otherwise username, otherwise "Student"
          setFirstName(response.data.first_name || response.data.username || "Student");
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
      fetchUser();
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setFirstName("Student");
    setShowLogoutModal(false);
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `text-lg font-medium tracking-[0.1em] transition-colors no-underline block py-2 md:py-0 whitespace-nowrap ${
      isActive
        ? "text-[#FFDC88]"
        : "text-white hover:text-[#FFDC88] hover:opacity-70"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] bg-[#52392F] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300
        ${isOpen ? "rounded-b-none" : "rounded-b-[30px]"} 
        md:rounded-b-[62.4px]`}
      >
        <div className="w-full flex items-center justify-between px-6 py-4 md:px-10 md:py-6 lg:px-24">
          {/* 👇 LOGO */}
          <Link
            to={isLoggedIn ? "/homepage" : "/"}
            className="text-2xl md:text-3xl lg:text-[2.34rem] no-underline shrink-0"
            style={{ 
              fontFamily: "'Tourney', sans-serif", 
              fontWeight: 900,
              color: '#F1F1F1',
              letterSpacing: '0.05em' 
            }}
          >
            PAMANA
          </Link>

          {/* 👇 DESKTOP RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-8 lg:gap-[3.9rem]">
            {isLoggedIn ? (
              // STUDENT LOGGED IN VIEW
              <div className="flex items-center gap-4 text-white font-medium text-lg tracking-[0.05em] relative">
                
                {/* HOME LINK */}
                <NavLink 
                  to="/homepage" 
                  className={({ isActive }) => 
                    `transition-colors hover:text-[#FFDC88] ${isActive ? "text-[#FFDC88]" : "text-white"}`
                  }
                >
                  HOME
                </NavLink>

                {/* SEPARATOR */}
                <span className="text-[#FFDC88]">|</span>

                {/* NAME WITH DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 hover:text-[#FFDC88] transition-colors cursor-pointer uppercase font-bold"
                  >
                    {firstName}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* DROPDOWN MENU */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-4 w-48 bg-[#FDFBF7] rounded-xl shadow-xl border-2 border-[#C8AA86]/50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                      <Link 
                        to="/student-profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-6 py-3 text-[#5a2d0c] hover:bg-[#E8E8E8] hover:text-[#772402] font-bold transition-colors text-left"
                      >
                        PROFILE
                      </Link>
                      <button 
                        onClick={handleLogoutClick}
                        className="block w-full px-6 py-3 text-[#5a2d0c] hover:bg-[#E8E8E8] hover:text-[#772402] font-bold transition-colors text-left"
                      >
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // PUBLIC / LOGGED OUT LINKS
              <>
                <ul className="flex list-none gap-6 lg:gap-[3.12rem] m-0 p-0">
                  <li><NavLink to="/" className={linkClasses}>HOME</NavLink></li>
                  <li><NavLink to="/contact" className={linkClasses}>CONTACT US</NavLink></li>
                  <li><NavLink to="/about" className={linkClasses}>ABOUT US</NavLink></li>
                </ul>
                <Link to="/login">
                  <button className="bg-linear-to-b from-[#772402] to-[#551900] text-white px-6 py-3 lg:px-[3.12rem] lg:py-[0.78rem] rounded-[18.72px] font-semibold lowercase transition-transform hover:scale-105 cursor-pointer whitespace-nowrap">
                    login
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* 👇 MOBILE HAMBURGER */}
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none cursor-pointer">
            {isOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 👇 MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#52392F] shadow-lg rounded-b-[30px] py-6 px-6 flex flex-col items-center gap-6 border-t border-[#ffffff20]">
            <ul className="flex flex-col list-none gap-4 text-center m-0 p-0 w-full">
              {isLoggedIn ? (
                <>
                  <li className="text-[#FFDC88] font-bold text-xl mb-2 uppercase tracking-widest">
                    HI, {firstName}
                  </li>
                  <li><NavLink to="/homepage" className={linkClasses} onClick={toggleMenu}>HOME</NavLink></li>
                  <li><NavLink to="/student-profile" className={linkClasses} onClick={toggleMenu}>PROFILE</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/" className={linkClasses} onClick={toggleMenu}>HOME</NavLink></li>
                  <li><NavLink to="/contact" className={linkClasses} onClick={toggleMenu}>CONTACT US</NavLink></li>
                  <li><NavLink to="/about" className={linkClasses} onClick={toggleMenu}>ABOUT US</NavLink></li>
                </>
              )}
            </ul>

            {isLoggedIn ? (
              <button 
                onClick={handleLogoutClick}
                className="bg-linear-to-b from-[#772402] to-[#551900] text-white px-10 py-3 rounded-[18.72px] font-semibold lowercase w-full cursor-pointer hover:bg-white/10"
              >
                logout
              </button>
            ) : (
              <Link to="/login" onClick={toggleMenu} className="w-full">
                <button className="bg-linear-to-b from-[#772402] to-[#551900] text-white px-10 py-3 rounded-[18.72px] font-semibold lowercase w-full cursor-pointer">
                  login
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-[#5a2d0c]">Confirm Logout</h2>
            <p className="text-lg mb-8 text-[#5a2d0c]">
              Are you sure you want to log out?
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
    </>
  );
};

export default Navbar;