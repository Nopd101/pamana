import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `text-[1.17rem] font-medium tracking-[0.1em] transition-colors no-underline ${
      isActive ? "text-[#FFDC88]" : "text-white hover:text-[#FFDC88] hover:opacity-70"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] bg-[#52392F] shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-b-[62.4px]">
      <div className="w-full flex items-center justify-between px-[6rem] py-[1.56rem]">
        <Link
          to="/"
          className="text-white text-[2.34rem] font-extrabold tracking-widest no-underline font-[var(--font-heading)]"
        >
          PAMANA
        </Link>

        <div className="flex items-center gap-[3.9rem]">
          <ul className="flex list-none gap-[3.12rem] m-0 p-0">
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

          <button className="bg-gradient-to-b from-[#772402] to-[#551900] text-white px-[3.12rem] py-[0.78rem] rounded-[18.72px] font-semibold lowercase transition-transform hover:scale-105 cursor-pointer">
            login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
