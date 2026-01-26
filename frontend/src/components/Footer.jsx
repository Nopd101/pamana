import { useState } from "react";
import { Link } from "react-router-dom";
import footerCharacter from "../assets/footer-character.png";
import titleLogo from "../assets/pamana-title.png"; 

export default function Footer() {
  const [isSiteMapExpanded, setIsSiteMapExpanded] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const ChevronIcon = ({ isExpanded }) => (
    <svg
      className={`chevron-icon ${isExpanded ? "expanded" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <footer className="relative font-sans text-[#432818] z-10">
      <div className="bg-[#F3F0E8] pt-2 pb-8 md:pt-10 md:pb-16 px-4 rounded-t-[62.4px] relative overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between max-w-7xl mx-auto relative z-[2] gap-20 text-left">
          
          {/* Left Content Area - Split into two columns */}
          <div className="flex-2 flex flex-row gap-16">
            
            {/* Column 1: Logo, Description, Button */}
            <div className="flex flex-col items-start max-w-xs">
              <img 
                src={titleLogo} 
                alt="PAMANA Logo" 
                className="w-72 h-auto mb-6" 
              />
              <p className="leading-relaxed text-lg mb-8 text-[#52392F]">
                Isang interaktibong plataporma sa pagkatuto para sa mga mag-aaral ng Araling Panlipunan 8. 
              </p>
              <button
                onClick={scrollToTop}
                className="bg-gradient-to-b from-[#772402] to-[#551900] text-white border-none py-3 px-8 rounded-full cursor-pointer text-lg font-bold shadow-lg hover:scale-105 transition-transform hover:shadow-xl"
              >
                Back on top
              </button>
            </div>

            {/* Column 2: MELCs (Bigger & Better Spaced) */}
            <div className="text-[#52392F] min-w-max mt-4">
              <p className="mb-4 text-2xl font-extrabold tracking-wide border-b-2 border-[#772402]/20 pb-2">
                AP 8 MELCs:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-lg font-medium opacity-90">
                <li>AP8HSK-Ig-6</li>
                <li>AP8HSK-Ij-10</li>
                <li>AP8DKT-IIf-8</li>
                <li>AP8DKT-IIf-8</li>
              </ul>
            </div>

          </div>

          {/* Right Content Area - Site Map */}
          <div className="flex-1 pl-10 border-l border-[#432818]/10">
            <h3 className="text-4xl font-extrabold mb-8 text-[#432818]">Site Map</h3>
            <ul className="list-none p-0 m-0 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#52392F] no-underline font-bold text-xl hover:text-[#772402] hover:translate-x-1 transition-all inline-block"
                >
                  Homepage
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#52392F] no-underline font-bold text-xl hover:text-[#772402] hover:translate-x-1 transition-all inline-block"
                >
                  FAQ Page
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#52392F] no-underline font-bold text-xl hover:text-[#772402] hover:translate-x-1 transition-all inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#52392F] no-underline font-bold text-xl hover:text-[#772402] hover:translate-x-1 transition-all inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#52392F] no-underline font-bold text-xl hover:text-[#772402] hover:translate-x-1 transition-all inline-block"
                >
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden text-center">
          <div className="mt-4">
            <button
              onClick={() => setIsSiteMapExpanded(!isSiteMapExpanded)}
              className="w-full flex justify-center items-center gap-2"
            >
              <h3 className="text-2xl font-bold">Site Map</h3>
              <ChevronIcon isExpanded={isSiteMapExpanded} />
            </button>
            <div
              className={`collapsible-content ${
                isSiteMapExpanded ? "expanded" : ""
              }`}
            >
              <ul className="list-none p-0 mt-4">
                <li className="mb-2">
                  <Link
                    to="/"
                    className="text-[#432818] no-underline font-bold text-base"
                  >
                    Homepage
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/faq"
                    className="text-[#432818] no-underline font-bold text-base"
                  >
                    FAQ Page
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contact"
                    className="text-[#432818] no-underline font-bold text-base"
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/about"
                    className="text-[#432818] no-underline font-bold text-base"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-[#432818] no-underline font-bold text-base"
                  >
                    Privacy & Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <img
          src={footerCharacter}
          alt="Character"
          className="hidden md:block absolute right-[-200px] bottom-[-400px] w-[700px] z-[1]"
        />
      </div>

      <div className="bg-[#D9D9D9] p-2 rounded-t-[40px] relative z-[3] mt-[-20px]">
        <p className="text-center text-xs font-bold">
          Copyright © 2025, Pamana.edu, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}