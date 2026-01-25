import React, { useEffect, useState } from "react";
import heroBanner from "../assets/hero-banner.png";
import bgHome from "../assets/bg-home.png";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import chinaImg from "../assets/CivilizationPhotos/China.png";
import egyptImg from "../assets/CivilizationPhotos/Egypt.png";
import indusImg from "../assets/CivilizationPhotos/Indus.png";
import mesoamericaImg from "../assets/CivilizationPhotos/Mesoamerica.png";
import mesopotamiaImg from "../assets/CivilizationPhotos/Mesopotamia.png";

function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Student");
  
  // 👇 NEW: State to store progress percentages for each civilization
  const [progressMap, setProgressMap] = useState({});

  const kabihasnanList = [
    {
      id: "mesopotamia",
      name: "Kabihasnang Mesopotamia",
      image: mesopotamiaImg,
      description: "Ang Kabihasnang Mesopotamia - ang lupain sa pagitan ng dalawang ilog",
    },
    {
      id: "indus",
      name: "Kabihasnang Indus",
      image: indusImg,
      description: "Ang Kabihasnang Indus - tanyag sa maunlad nitong mga lungsod at sistema ng kanal",
    },
    {
      id: "tsino",
      name: "Kabihasnang Tsino",
      image: chinaImg,
      description: "Ang Kabihasnang Tsina – ang duyan ng sinaunang imbensyon at pilosopiya.",
    },
    {
      id: "egypt",
      name: "Kabihasnang Egypt",
      image: egyptImg,
      description: "Ang Kabihasnang Egypt – ang lupain ng mga piramide at mga paraon.",
    },
    {
      id: "mesoamerica",
      name: "Kabihasnang Mesoamerica",
      image: mesoamericaImg,
      description: "Ang Kabihasnang Mesoamerica – ang sibilisasyon ng mga Maya, Aztec, at iba pang katutubo ng Gitnang Amerika.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch User Info
        const userRes = await API.get("me/");
        setFirstName(userRes.data.first_name || userRes.data.username || "Student");

        // 2. Fetch Student Stats (To calculate progress bars)
        const statsRes = await API.get('student/stats/');
        const history = statsRes.data.history;

        // --- CALCULATION LOGIC (Matches StudentProfile.jsx) ---
        const details = {};
        
        // Initialize all civs
        kabihasnanList.forEach(civ => {
            details[civ.id] = { video: false, quiz: false, games: new Set() };
        });

        const normalize = (str) => str?.toLowerCase().replace(" ", "");

        // Fill data from history
        history.forEach(log => {
            const civKey = normalize(log.civilization);
            if (details[civKey]) {
                if (log.activity_type === 'Quiz') details[civKey].quiz = true;
                if (log.activity_type === 'Video') details[civKey].video = true;
                if (log.activity_type === 'Game') details[civKey].games.add(log.activity_name);
            }
        });

        // Calculate Percentages
        const calculatedProgress = {};
        Object.keys(details).forEach(key => {
            let tasksDone = 0;
            const d = details[key];
            
            if (d.video) tasksDone++; // 1 Point for Video
            if (d.quiz) tasksDone++;  // 1 Point for Quiz
            if (d.games.size >= 2) tasksDone++; // 1 Point if at least 2 games played
            
            // Total items per civ is 3 (Video, Quiz, Games)
            calculatedProgress[key] = Math.round((tasksDone / 3) * 100);
        });

        setProgressMap(calculatedProgress);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-[60vh] md:min-h-screen flex items-center bg-cover bg-bottom bg-no-repeat z-10"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundColor: "transparent",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full md:h-[85%] bg-gradient-to-b from-black/70 via-black/20 to-transparent z-0" />

        <div className="relative z-10 w-full px-6 md:px-20 mt-10 md:-mt-20">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight font-[var(--font-heading)]">
              Welcome, {firstName}!
            </h1>

            <p className="mt-4 text-lg md:text-xl font-[var(--font-heading)]">
              Choose a civilization to study
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("civilizations")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 bg-amber-700 hover:bg-amber-800 transition px-6 py-3 rounded-md font-semibold cursor-pointer font-[var(--font-body)]"
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* ================= BG / CONTENT SECTION ================= */}
      <section
        id="civilizations"
        className="bg-cover bg-top px-4 md:px-20 py-10 md:py-16 -mt-10 md:-mt-32 relative z-0"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="pt-10 md:pt-32 px-2 md:px-40">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#7B3306] font-[var(--font-heading)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
              THE CIVILIZATIONS
            </h2>
            
            <button
              onClick={() => navigate('/post-test')}
              className="bg-[#7B3306] hover:bg-[#5a2504] text-white px-5 py-2 rounded-lg font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2 text-sm md:text-base cursor-pointer"
            >
              Take Post-Test
            </button>
          </div>

          <div className="space-y-4 md:space-y-6">
            {kabihasnanList.map((item) => {
              // 👇 Get percentage from state, default to 0
              const percentage = progressMap[item.id] || 0;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/kabihasnan/${item.id}`)}
                  className="bg-white/85 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-4 transition-transform hover:scale-[1.01] cursor-pointer overflow-hidden p-4 md:p-0 md:pr-8"
                >
                  {/* Image Container */}
                  <div className="w-full h-40 md:w-40 md:h-30 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md md:rounded-none"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 py-2 text-center md:text-left w-full">
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#7B3306] font-[var(--font-heading)]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-[var(--font-body)] mt-2 md:mt-0 mb-3">
                      {item.description}
                    </p>

                    {/* 👇 RESTORED PROGRESS BAR */}
                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner border border-gray-400/30">
                      <div 
                        className="bg-gradient-to-r from-[#bb6701] to-[#bb6701] h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500 font-bold">{percentage}% Completed</p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="hidden md:block text-amber-700 font-bold text-2xl pr-2">
                    →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;