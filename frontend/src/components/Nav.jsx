import React from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-fixed">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-4">
        <div className="logo-text text-2xl tracking-widest">
          PAMANA
        </div>
        
        <div className="flex items-center gap-10">
          <ul className="flex list-none gap-8 m-0 p-0">
            <li><a href="#home" className="nav-link text-white text-xs hover:opacity-70">HOME</a></li>
            <li><a href="#contact" className="nav-link text-white text-xs hover:opacity-70">CONTACT US</a></li>
            <li><a href="#about" className="nav-link text-white text-xs hover:opacity-70">ABOUT US</a></li>
          </ul>

          <button className="login-btn">
            login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;