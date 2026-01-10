import React, { useEffect, useState } from "react";
import heroBanner from "../assets/hero-banner.png";
import bgHome from "../assets/bg-home.png";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Import your API helper
import kabihasnanImg from "../assets/main-home-bg-2.png";

function HomePage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Student"); // Default state

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("me/");
        // If first_name is empty, fallback to username or 'Student'
        setFirstName(
          response.data.first_name || response.data.username || "Student"
        );
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optional: Redirect to login if token is invalid
        // navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const kabihasnanList = [
    { id: "mesopotamia", name: "Kabihasnang Mesopotamia", image: kabihasnanImg, description: "Ang Kabihasnang Mesopotamia - ang lupain sa pagitan ng dalawang ilog" },
    { id: "indus", name: "Kabihasnang Indus", image: kabihasnanImg, description: "Ang Kabihasnang Indus - tanyag sa maunlad nitong mga lungsod at sistema ng kanal" },
    { id: "tsino", name: "Kabihasnang Tsino", image: kabihasnanImg, description: "Ang Kabihasnang Tsina – ang duyan ng sinaunang imbensyon at pilosopiya." },
    { id: "egypt", name: "Kabihasnang Egypt", image: kabihasnanImg, description: "Ang Kabihasnang Egypt – ang lupain ng mga piramide at mga paraon." },
    { id: "mesoamerica", name: "Kabihasnang Mesoamerica", image: kabihasnanImg, description: "Ang Kabihasnang Mesoamerica – ang sibilisasyon ng mga Maya, Aztec, at iba pang katutubo ng Gitnang Amerika." },
  ];

  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-bottom bg-no-repeat z-10"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundColor: "transparent",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[85%] bg-gradient-to-b from-black/70 via-black/20 to-transparent z-0" />

        {/* Hero content */}
        <div className="relative z-10 w-full px-8 md:px-20 -mt-20">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight font-[var(--font-heading)]">
              {/* Dynamic Name Here */}
              Welcome, {firstName}!
            </h1>

            <p className="mt-4 text-lg font-[var(--font-heading)]">
              Choose a civilization to study
            </p>

            {/* Scroll or Navigate button */}
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
        className="bg-cover bg-top px-6 md:px-20 py-16 -mt-32 relative z-0"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="pt-32">
          <h2 className="text-3xl font-extrabold text-[#7B3306] mb-8 font-[var(--font-heading)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
            THE CIVILIZATIONS
          </h2>

          <div className="space-y-6">
            {kabihasnanList.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/kabihasnan/${item.id}`)}
                className="bg-white/85 rounded-xl shadow-md flex items-center gap-4 transition-transform hover:scale-[1.01] cursor-pointer overflow-hidden pr-8"
              >
                {/* Image Container - No padding/margin around the image */}
                <div className="w-40 h-30 shrink-0 mr-4">
                  <img
                    src={item.image} // Make sure your kabihasnanList has an image property
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 pr-4 py-2">
                  <h3 className="text-2xl font-extrabold text-[#7B3306] font-[var(--font-heading)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-[var(--font-body)]">
                    {item.description}
                  </p>

                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[30%]" />
                  </div>
                </div>

                <div className="text-amber-700 font-bold text-2xl pr-2">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
