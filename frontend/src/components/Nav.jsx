import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `text-xs font-medium tracking-[0.1em] transition-colors no-underline ${
      isActive ? "text-[#FFDC88]" : "text-white hover:text-[#FFDC88] hover:opacity-70"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] bg-[#52392F] shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-b-[40px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-4">
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-widest no-underline font-[var(--font-heading)]"
        >
          PAMANA
        </Link>

        <div className="flex items-center gap-10">
          <ul className="flex list-none gap-8 m-0 p-0">
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

          <button className="bg-gradient-to-b from-[#772402] to-[#551900] text-white px-8 py-2 rounded-[12px] font-semibold lowercase transition-transform hover:scale-105 cursor-pointer">
            login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
