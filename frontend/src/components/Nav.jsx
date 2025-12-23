import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const linkClasses = ({ isActive }) =>
    `text-lg font-medium tracking-[0.1em] transition-colors no-underline block py-2 md:py-0 whitespace-nowrap ${
      isActive
        ? "text-[#FFDC88]"
        : "text-white hover:text-[#FFDC88] hover:opacity-70"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-1000 bg-[#52392F] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300
      ${isOpen ? "rounded-b-none" : "rounded-b-[30px]"} 
      md:rounded-b-[62.4px]`}
    >
      <div className="w-full flex items-center justify-between px-6 py-4 md:px-10 md:py-6 lg:px-24">
        <Link
          to="/"
          className="text-white text-2xl md:text-3xl lg:text-[2.34rem] font-extrabold tracking-widest no-underline shrink-0"
        >
          PAMANA
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-[3.9rem]">
          <ul className="flex list-none gap-6 lg:gap-[3.12rem] m-0 p-0">
            <li>
              <NavLink to="/" className={linkClasses}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={linkClasses}>
                CONTACT US
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClasses}>
                ABOUT US
              </NavLink>
            </li>
          </ul>

          <Link to="/login">
            <button className="bg-linear-to-b from-[#772402] to-[#551900] text-white px-6 py-3 lg:px-[3.12rem] lg:py-[0.78rem] rounded-[18.72px] font-semibold lowercase transition-transform hover:scale-105 cursor-pointer whitespace-nowrap">
              login
            </button>
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none cursor-pointer"
        >
          {isOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#52392F] shadow-lg rounded-b-[30px] py-6 px-6 flex flex-col items-center gap-6 border-t border-[#ffffff20]">
          <ul className="flex flex-col list-none gap-4 text-center m-0 p-0 w-full">
            <li>
              <NavLink to="/" className={linkClasses} onClick={toggleMenu}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={linkClasses}
                onClick={toggleMenu}
              >
                CONTACT US
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClasses} onClick={toggleMenu}>
                ABOUT US
              </NavLink>
            </li>
          </ul>

          <Link to="/login" onClick={toggleMenu}>
            <button className="bg-linear-to-b from-[#772402] to-[#551900] text-white px-10 py-3 rounded-[18.72px] font-semibold lowercase w-full">
              login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
