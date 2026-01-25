import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import mainImage from "../assets/ArtifactHiddenObject/1.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios';

const artifacts = [
  {
    name: "TUTANKHAMEN MASK",
    hint: "Gintong maskara ng batang pharaoh.",
    coords: { x: 5, y: 15, width: 25, height: 45 }, 
    found: false,
  },
  {
    name: "SARCOPHAGUS",
    hint: "Malaking kahon para sa libingan ng pharaoh.",
    coords: { x: 25, y: 45, width: 50, height: 25 }, 
    found: false,
  },
  {
    name: "SCARAB",
    hint: "Kadalasang gawa sa bato o precious stones.",
    coords: { x: 50, y: 81, width: 10, height: 12 }, 
    found: false,
  },
  {
    name: "NILE RIVER MAP",
    hint: "Ipinapakita ang ilog na pangunahing pinagkukunan ng tubig sa Egypt.",
    coords: { x: 38, y: 75, width: 15, height: 12 }, 
    found: false,
  },
  {
    name: "CHARIOT",
    hint: "Sinaunang karwaheng pandigma.",
    coords: { x: 52, y: 28, width: 22, height: 20 }, 
    found: false,
  },
];

const ArtifactHiddenObject = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [mistakes, setMistakes] = useState([]); // 👈 Store wrong click coordinates
  const [activeHint, setActiveHint] = useState(null);
  const navigate = useNavigate();
  const imageContainerRef = useRef(null);

  const isGameFinished = foundItems.length === artifacts.length;

  const handleImageClick = (e) => {
    if (isGameFinished) return; // Prevent clicks if game is over

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let isCorrect = false;

    artifacts.forEach((artifact) => {
      if (
        !foundItems.includes(artifact.name) &&
        x >= artifact.coords.x &&
        x <= artifact.coords.x + artifact.coords.width &&
        y >= artifact.coords.y &&
        y <= artifact.coords.y + artifact.coords.height
      ) {
        setFoundItems((prev) => [...prev, artifact.name]);
        setActiveHint(null); 
        isCorrect = true;
      }
    });

    // 👇 Handle Wrong Click
    if (!isCorrect) {
      const newMistake = { x, y, id: Date.now() };
      setMistakes((prev) => [...prev, newMistake]);

      // Remove the red X after 800ms to keep DOM light
      setTimeout(() => {
        setMistakes((prev) => prev.filter((m) => m.id !== newMistake.id));
      }, 800);
    }
  };

  useEffect(() => {
    if (isGameFinished) {
        const submitScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Egypt",
                    activity_type: "Game",
                    activity_name: "Artifact Hidden Object",
                    score: artifacts.length,
                    max_score: artifacts.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitScore();
    }
  }, [isGameFinished]);

  const handleReset = () => {
    setFoundItems([]);
    setMistakes([]);
    setActiveHint(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-x-hidden relative"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      {/* --- Game Won Modal --- */}
      {isGameFinished && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-transparent max-w-lg w-full flex flex-col items-center justify-center">
            <div className="relative w-full h-64 md:h-80 flex justify-center items-center">
              <img 
                src={charImg} 
                alt="Game Cleared Character" 
                className="absolute left-0 bottom-0 w-48 md:w-64 drop-shadow-2xl animate-bounce-short z-10"
              />
              <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-center z-20 leading-tight uppercase tracking-tighter transform -rotate-2">
                GAME <br/> CLEARED
              </h1>
            </div>
            <div className="flex gap-4 mt-8 z-30">
              <button
                onClick={handleReset}
                className="bg-[#FDFBF7] text-[#772402] font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition-transform border-4 border-[#772402]"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-[#772402] text-white font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition-transform border-4 border-[#FDFBF7]"
              >
                FINISH
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-4 pb-10 pt-24 md:pt-32">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            Artifact Hidden Object
          </h1>
          <p className="text-[#964B1D] font-bold text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            Tuklasin ang mga nakatagong kayamanan ng sinaunang Egypt. Bawat
            artifact ay may hint na makakatulong sa’yo.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div
            ref={imageContainerRef}
            onClick={handleImageClick}
            className="w-full lg:w-3/4 relative cursor-pointer rounded-lg overflow-hidden shadow-lg border-4 border-[#7B3306] select-none"
          >
            <img
              src={mainImage}
              alt="Ancient Egyptian Tomb"
              className="w-full h-auto"
            />
            
            {/* Correct Find Indicator */}
            {artifacts.map(
              (artifact) =>
                foundItems.includes(artifact.name) && (
                  <div
                    key={artifact.name}
                    className="absolute border-4 border-yellow-400 rounded-full"
                    style={{
                      left: `${artifact.coords.x + artifact.coords.width / 2}%`,
                      top: `${artifact.coords.y + artifact.coords.height / 2}%`,
                      width: "20px",
                      height: "20px",
                      transform: "translate(-50%, -50%)",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                )
            )}

            {/* 👇 MISTAKE INDICATOR (Red X) */}
            {mistakes.map((mistake) => (
              <div
                key={mistake.id}
                className="absolute text-red-600 font-bold text-3xl pointer-events-none drop-shadow-md"
                style={{
                  fontSize: '1rem',
                  left: `${mistake.x}%`,
                  top: `${mistake.y}%`,
                  transform: "translate(-50%, -50%)",
                  animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) forwards", 
                  opacity: 80
                }}
              >
                ❌
              </div>
            ))}
            
          </div>

          <div className="w-full lg:w-1/4 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border-4 border-[#7B3306]">
            <h3 className="text-xl md:text-2xl font-bold text-[#5a2d0c] mb-4 text-center">
              Items to Find
            </h3>
            <ul className="space-y-2">
              {artifacts.map((artifact) => (
                <li
                  key={artifact.name}
                  onClick={() =>
                    !foundItems.includes(artifact.name) &&
                    setActiveHint(
                      activeHint === artifact.name ? null : artifact.name
                    )
                  }
                  className={`p-3 my-1 rounded-lg cursor-pointer transition-all shadow-sm ${
                    foundItems.includes(artifact.name)
                      ? "bg-green-200 text-gray-500 line-through"
                      : "bg-amber-100 hover:bg-amber-200"
                  }`}
                >
                  <p className="font-bold text-sm md:text-base text-[#5a2d0c]">
                    {artifact.name}
                  </p>
                  {activeHint === artifact.name && (
                    <p className="text-xs md:text-sm italic text-amber-800 mt-1">
                      {artifact.hint}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add subtle keyframe for custom fade out if needed, but 'animate-ping' works great out of box in Tailwind */}
      <style>{`
        @keyframes fadeOutUp {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default ArtifactHiddenObject;