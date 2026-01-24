import React, { useEffect, useState } from "react";
import heroBanner from "../assets/hero-banner.png";
import bgHome from "../assets/bg-home.png";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import kabihasnanImg from "../assets/main-home-bg-2.png";

function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Student");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("me/");
        setFirstName(
          response.data.first_name || response.data.username || "Student"
        );
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [navigate]);

  const kabihasnanList = [
    {
      id: "mesopotamia",
      name: "Kabihasnang Mesopotamia",
      image: kabihasnanImg,
      description:
        "Ang Kabihasnang Mesopotamia - ang lupain sa pagitan ng dalawang ilog",
    },
    {
      id: "indus",
      name: "Kabihasnang Indus",
      image: kabihasnanImg,
      description:
        "Ang Kabihasnang Indus - tanyag sa maunlad nitong mga lungsod at sistema ng kanal",
    },
    {
      id: "tsino",
      name: "Kabihasnang Tsino",
      image: kabihasnanImg,
      description:
        "Ang Kabihasnang Tsina – ang duyan ng sinaunang imbensyon at pilosopiya.",
    },
    {
      id: "egypt",
      name: "Kabihasnang Egypt",
      image: kabihasnanImg,
      description:
        "Ang Kabihasnang Egypt – ang lupain ng mga piramide at mga paraon.",
    },
    {
      id: "mesoamerica",
      name: "Kabihasnang Mesoamerica",
      image: kabihasnanImg,
      description:
        "Ang Kabihasnang Mesoamerica – ang sibilisasyon ng mga Maya, Aztec, at iba pang katutubo ng Gitnang Amerika.",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {" "}
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
        {/* CHANGED: px-4 for mobile, md:px-40 for desktop */}
        <div className="pt-10 md:pt-32 px-2 md:px-40">
          
          {/* 👇 MODIFIED HEADER SECTION: Flex container for Title + Button */}
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
            {kabihasnanList.map((item) => (
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
                <div className="flex-1 py-2 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#7B3306] font-[var(--font-heading)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-[var(--font-body)] mt-2 md:mt-0">
                    {item.description}
                  </p>

                  <div className="mt-3 md:mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[30%]" />
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:block text-amber-700 font-bold text-2xl pr-2">
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