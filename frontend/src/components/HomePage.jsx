import React from "react";
import heroBanner from "../assets/hero-banner.png";
import bgHome from "../assets/bg-home.png";
function HomePage() {
  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-[200vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-20">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Maligayang pagdating, Juan!
            </h1>

            <p className="mt-4 text-lg">
              Pumili ng kabihasnang pag-aaralan
            </p>

            <button className="mt-6 bg-amber-700 hover:bg-amber-800 transition px-6 py-3 rounded-md font-semibold">
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* ================= BG / CONTENT SECTION ================= */}
      <section
        className="bg-cover bg-top px-6 md:px-20 py-16"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <h2 className="text-xl font-extrabold text-[#5a2d0c] mb-8">
          MGA KABIHASNAN
        </h2>

        <div className="space-y-6">

          {[
            "Kabihasnang Mesopotamia",
            "Kabihasnang Indus",
            "Kabihasnang Tsina",
            "Kabihasnang Egypt",
            "Kabihasnang Mesoamerica",
          ].map((item) => (
            <div
              key={item}
              className="bg-white/95 rounded-xl shadow-md p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-24 h-20 bg-amber-200 rounded-md shrink-0" />

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-bold text-[#5a2d0c]">
                  {item}
                </h3>
                <p className="text-sm text-gray-600">
                  Maikling paglalarawan ng kabihasnan
                </p>

                {/* Progress */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[30%]" />
                </div>
              </div>

              {/* Arrow */}
              <button className="text-amber-700 font-bold text-xl">
                →
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
