import React from "react";
import heroBanner from "../assets/hero-banner.png";
import bgHome from "../assets/bg-home.png";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const kabihasnanList = [
    { id: "mesopotamia", name: "Kabihasnang Mesopotamia" },
    { id: "indus", name: "Kabihasnang Indus" },
    { id: "tsino", name: "Kabihasnang Tsino" },
    { id: "egypt", name: "Kabihasnang Egypt" },
    { id: "mesoamerica", name: "Kabihasnang Mesoamerica" },
  ];
  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-bottom bg-no-repeat z-10"
        style={{ 
            backgroundImage: `url(${heroBanner})`,
            backgroundColor: 'transparent' 
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[85%] bg-gradient-to-b from-black/70 via-black/20 to-transparent z-0" />

        {/* Hero content */}
        <div className="relative z-10 w-full px-8 md:px-20 -mt-20">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight font-[var(--font-heading)]">
              Welcome, Juan!
            </h1>

            <p className="mt-4 text-lg font-[var(--font-body)]">
              Choose a civilization to study
            </p>

            <button className="mt-6 bg-amber-700 hover:bg-amber-800 transition px-6 py-3 rounded-md font-semibold cursor-pointer font-[var(--font-body)]">
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* ================= BG / CONTENT SECTION ================= */}
      <section
        className="bg-cover bg-top px-6 md:px-20 py-16 -mt-32 relative z-0"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="pt-32">
            <h2 className="text-3xl font-extrabold text-[#5a2d0c] mb-8 font-[var(--font-heading)]">
            THE CIVILIZATIONS
            </h2>

            <div className="space-y-6">
            {kabihasnanList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/kabihasnan/${item.id}`)} 
                className="bg-white/85 rounded-xl shadow-md p-4 flex items-center gap-4 transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <div className="w-24 h-20 bg-amber-200 rounded-md shrink-0" />

                <div className="flex-1">
                  <h3 className="font-bold text-[#5a2d0c] font-[var(--font-heading)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-[var(--font-body)]">
                    A brief description of the civilization
                  </p>

                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[30%]" />
                  </div>
                </div>

                <div className="text-amber-700 font-bold text-xl">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;