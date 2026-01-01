import { useState } from 'react';
import { Link } from 'react-router-dom';
import footerCharacter from '../assets/footer-character.png';

export default function Footer() {
  const [isSiteMapExpanded, setIsSiteMapExpanded] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const ChevronIcon = ({ isExpanded }) => (
    <svg className={`chevron-icon ${isExpanded ? 'expanded' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <footer className="relative font-sans text-[#432818] z-10">
      <div className="bg-[#F3F0E8] pt-2 pb-8 md:pt-10 md:pb-16 px-4 rounded-t-[62.4px] relative overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        
        {/* Desktop View */}
        <div className="hidden md:flex justify-between max-w-6xl mx-auto relative z-[2] gap-24 text-left">
          <div className="flex-1">
            <h3 className="text-6xl font-bold mb-4">PAMANA</h3>
            <p className="max-w-[300px] mb-4 leading-relaxed text-lg">
              An interactive learning platform for Grade 8 Social Studies students.
            </p>
            <button onClick={scrollToTop} className="bg-gradient-to-b from-[#772402] to-[#551900] text-white border-none py-3.5 px-7 rounded-3xl cursor-pointer text-lg font-bold shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
              Back on top
            </button>
          </div>
          <div className="flex-1 pl-36">
            <h3 className="text-4xl font-bold mb-6">Site Map</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-1"><Link to="/" className="text-[#432818] no-underline font-bold text-lg">Homepage</Link></li>
              <li className="mb-1"><Link to="/faq" className="text-[#432818] no-underline font-bold text-lg">FAQ Page</Link></li>
              <li className="mb-1"><Link to="/contact" className="text-[#432818] no-underline font-bold text-lg">Contact Us</Link></li>
              <li className="mb-1"><Link to="/about" className="text-[#432818] no-underline font-bold text-lg">About Us</Link></li>
              <li><Link to="/privacy" className="text-[#432818] no-underline font-bold text-lg">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden text-center">
          <div className="mt-4">
            <button onClick={() => setIsSiteMapExpanded(!isSiteMapExpanded)} className="w-full flex justify-center items-center gap-2">
              <h3 className="text-2xl font-bold">Site Map</h3>
              <ChevronIcon isExpanded={isSiteMapExpanded} />
            </button>
            <div className={`collapsible-content ${isSiteMapExpanded ? 'expanded' : ''}`}>
              <ul className="list-none p-0 mt-4">
                <li className="mb-2"><Link to="/" className="text-[#432818] no-underline font-bold text-base">Homepage</Link></li>
                <li className="mb-2"><Link to="/faq" className="text-[#432818] no-underline font-bold text-base">FAQ Page</Link></li>
                <li className="mb-2"><Link to="/contact" className="text-[#432818] no-underline font-bold text-base">Contact Us</Link></li>
                <li className="mb-2"><Link to="/about" className="text-[#432818] no-underline font-bold text-base">About Us</Link></li>
                <li><Link to="/privacy" className="text-[#432818] no-underline font-bold text-base">Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <img src={footerCharacter} alt="Character" className="hidden md:block absolute right-[-200px] bottom-[-400px] w-[700px] z-[1]" />
      </div>

      <div className="bg-[#D9D9D9] p-2 rounded-t-[40px] relative z-[3] mt-[-20px]">
        <p className="text-center text-xs font-bold">
          Copyright © 2025, Pamana.edu, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
