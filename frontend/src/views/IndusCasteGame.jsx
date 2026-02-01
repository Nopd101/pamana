import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from "../api/axios";

// --- Sound Effects ---
import correctSfx from "../assets/sfx/correct.mp3";
import incorrectSfx from "../assets/sfx/incorrect.mp3";
import clearedSfx from "../assets/sfx/cleared.mp3";

// --- data ---
const ItemTypes = {
  CASTE: "caste",
};

const LEVELS = [
  {
    id: 1,
    correctId: "brahmin",
    label: "BRAHMIN",
    clue: "Ang pinakamataas na caste; mga pari, guro, at tagapangalaga ng kaalaman at ritwal.",
  },
  {
    id: 2,
    correctId: "kshatriya",
    label: "KSHATRIYA",
    clue: "Mandirigma at pinuno; responsable sa pagtatanggol at pamumuno sa lipunan.",
  },
  {
    id: 3,
    correctId: "vaishya",
    label: "VAISHYA",
    clue: "Mangangalakal, negosyante, at magsasaka; tagapangalaga ng kalakalan at kabuhayan.",
  },
  {
    id: 4,
    correctId: "shudra",
    label: "SHUDRA",
    clue: "Mga manggagawa, artesano, at tagapaglingkod; gumagawa ng iba’t ibang serbisyo sa lipunan.",
  },
  {
    id: 5,
    correctId: "dalit",
    label: "DALIT",
    clue: "Itinuturing na nasa labas ng caste system; gumagawa ng mga trabahong “marumi” o mabigat sa lipunan.",
  },
];

const CASTE_ITEMS = [
  { id: "dalit", label: "DALIT", color: "bg-[#964B1D]" },
  { id: "vaishya", label: "VAISHYA", color: "bg-[#F4C458]" },
  { id: "kshatriya", label: "KSHATRIYA", color: "bg-[#D36E0D]" },
  { id: "brahmin", label: "BRAHMIN", color: "bg-[#A87F6B]" },
  { id: "shudra", label: "SHUDRA", color: "bg-[#2D9B86]" },
];

// --- drag layer ---
const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div className="fixed pointer-events-none z-[9999] left-0 top-0 w-full h-full">
      <div
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        }}
      >
        <div
          className={`${item.color} w-max text-white font-black py-2 px-6 rounded-full shadow-2xl text-center uppercase tracking-wider border-2 border-white text-sm md:text-lg opacity-90 scale-110 -rotate-2 cursor-grabbing`}
        >
          {item.label}
        </div>
      </div>
    </div>
  );
};

const DraggableBox = ({
  id,
  label,
  color,
  isDropped,
  originLevel = null,
  className = "",
  isLocked = false,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CASTE,
      item: { id, label, color, originLevel },
      canDrag: !isDropped && !isLocked,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, label, color, isDropped, originLevel, isLocked]
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={drag}
      style={{ opacity }}
      className={`${color} text-white font-black rounded-md shadow-lg text-center uppercase tracking-wider transition-transform border-2 border-white/20 ${className} ${
        isDropped ? "opacity-30 cursor-not-allowed grayscale" : "cursor-grab active:cursor-grabbing hover:scale-105"
      } ${isLocked ? "!cursor-default !hover:scale-100" : ""}`}
    >
      {label}
    </div>
  );
};

// --- UPDATED ContentLevel (Fixed Visibility) ---
const ContentLevel = ({ 
  levelData, 
  currentItem, 
  onDrop, 
  setHoveredLevel, 
  isError, 
  isSuccess 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CASTE,
    drop: (item) => onDrop(levelData.id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (isOver) {
      setHoveredLevel(levelData.id);
    } else {
      setHoveredLevel((prev) => (prev === levelData.id ? null : prev));
    }
  }, [isOver, levelData.id, setHoveredLevel]);

  // --- STYLE LOGIC ---
  // 1. Normal: White Text + Brown Stroke (To match your original design)
  // 2. Error: Red Text + White Stroke (To make red readable on brown)
  // 3. Success: Green Text + White Stroke
  
  let textColor = "white";
  let strokeColor = "#5a2d0c"; // Original dark brown stroke

  if (isError) {
    textColor = "#ff3333"; // Bright Red
    strokeColor = "#ffffff"; // White stroke to make red pop
  } else if (isSuccess) {
    textColor = "#4ade80"; // Bright Green
    strokeColor = "#ffffff"; // White stroke
  }

  const textStyle = {
    color: textColor,
    WebkitTextStroke: `1.5px ${strokeColor}`, // Restored the stroke!
    paintOrder: "stroke fill",
    transition: "color 0.2s ease, -webkit-text-stroke 0.2s ease",
  };

  return (
    <div
      ref={drop}
      className={`flex-1 w-full flex items-center justify-center relative z-20 transition-all duration-300 ${
        isError ? "animate-shake" : ""
      }`}
    >
      <div className="text-center px-2 flex flex-col items-center justify-center w-full">
        {currentItem ? (
          <DraggableBox
            {...currentItem}
            originLevel={levelData.id}
            isDropped={false}
            isLocked={true} 
            className="py-1 px-4 md:px-8 text-xs md:text-lg animate-bounce-short z-50 relative border-2 border-white !shadow-md"
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center cursor-default select-none pointer-events-none transition-transform duration-200 ${
              isOver ? "scale-110" : ""
            }`}
          >
            {/* Applied the style object here */}
            <span 
              style={textStyle} 
              className="font-extrabold text-[10px] md:text-sm lg:text-base leading-tight tracking-wide"
            >
              {levelData.clue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- bg layer ---
const BackgroundLevel = ({ isLast, isOver }) => {
  return (
    <div
      className={`flex-1 w-full transition-all duration-200 ${
        !isLast ? "border-b-4 border-[#3E2b26]" : ""
      } ${isOver ? "bg-[#c69c6d] brightness-125" : "bg-[#8B5E3C]"}`}
    />
  );
};

// --- main component ---
const IndusCasteGame = () => {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState({});
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [isGameWon, setIsGameWon] = useState(false);
  
  // Feedback States
  const [errorLevelId, setErrorLevelId] = useState(null);
  const [successLevelId, setSuccessLevelId] = useState(null);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  const handleDrop = (targetLevelId, item) => {
    const targetLevel = LEVELS.find((l) => l.id === targetLevelId);

    if (targetLevel.correctId === item.id) {
        // --- CORRECT ---
        playSound(correctSfx);
        
        // Show Green Text for 2 seconds
        setSuccessLevelId(targetLevelId);
        setTimeout(() => setSuccessLevelId(null), 2000);

        setPlacements((prev) => {
            const newPlacements = { ...prev, [targetLevelId]: item };
            if (Object.keys(newPlacements).length === LEVELS.length) {
                setTimeout(() => {
                    playSound(clearedSfx);
                    setIsGameWon(true);
                }, 500);
            }
            return newPlacements;
        });

    } else {
        // --- WRONG ---
        playSound(incorrectSfx);
        
        // Trigger Red Text + Shake
        setErrorLevelId(targetLevelId);
        setTimeout(() => setErrorLevelId(null), 2000); 
    }
  };

  const handleReset = () => {
    setPlacements({});
    setIsGameWon(false);
    setErrorLevelId(null);
    setSuccessLevelId(null);
  };

  useEffect(() => {
    if (isGameWon) {
      const submitScore = async () => {
        try {
          await API.post("submit-score/", {
            civilization: "Indus",
            activity_type: "Game",
            activity_name: "CASTE YOUR ANSWER",
            score: LEVELS.length,
            max_score: LEVELS.length,
          });
        } catch (err) {
          console.error(err);
        }
      };
      submitScore();
    }
  }, [isGameWon]);

  const placedItemIds = Object.values(placements).map((p) => p?.id);

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <CustomDragLayer />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div
        className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden relative"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        {/* === MODAL: GAME WON === */}
        {isGameWon && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-transparent max-w-2xl w-full flex flex-col items-center justify-center">
              
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                <img
                  src={charImg}
                  alt="Game Cleared Character"
                  className="w-40 md:w-56 drop-shadow-2xl animate-bounce-short z-10"
                />
                <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-center md:text-left z-20 leading-tight uppercase tracking-tighter transform -rotate-2">
                  GAME <br /> CLEARED
                </h1>
              </div>

              <div className="flex gap-4 mt-2 z-30">
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

        <div className="max-w-7xl mx-auto px-4 pb-10 mt-25">
          <BackButton className="mb-6 md:ml-20" />

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
              CASTE YOUR ANSWER
            </h1>
            <p className="text-[#964B1D] font-bold text-xs md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
               I-drag ang tamang caste sa katabing kahon. Kapag tama, mananatili ito. Kapag mali, magkukulay pula ang teksto.
            </p>
          </div>

          <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-4 md:p-10 border-4 border-[#C8AA86]/50 relative min-h-[600px] flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 w-full max-w-4xl relative z-50">
              {CASTE_ITEMS.map((item) => (
                <DraggableBox
                  key={item.id}
                  {...item}
                  originLevel={null}
                  isDropped={placedItemIds.includes(item.id)}
                  className="py-2 px-3 md:py-3 md:px-6 text-[10px] md:text-sm lg:text-base"
                />
              ))}
            </div>

            <div className="relative w-[100%] max-w-2xl md:max-w-5xl h-[300px] md:h-[500px] flex items-center justify-center">
              <div
                className="absolute inset-0 w-full h-full z-0 bg-[#3E2b26]"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  transform: "scale(1.03)",
                }}
              />

              <div
                className="absolute inset-0 flex flex-col w-full h-full z-10"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              >
                {LEVELS.map((level, index) => (
                  <BackgroundLevel
                    key={level.id}
                    isLast={index === LEVELS.length - 1}
                    isOver={hoveredLevel === level.id}
                  />
                ))}
              </div>

              <div className="absolute inset-0 flex flex-col w-full h-full z-20">
                {LEVELS.map((level) => (
                  <ContentLevel
                    key={level.id}
                    levelData={level}
                    currentItem={placements[level.id]}
                    onDrop={handleDrop}
                    setHoveredLevel={setHoveredLevel}
                    isError={errorLevelId === level.id}
                    isSuccess={successLevelId === level.id}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-12 gap-4">
              <button
                onClick={handleReset}
                className="bg-white text-[#772402] border-2 border-[#772402] font-bold py-3 px-8 md:px-12 rounded-full shadow-lg hover:bg-amber-50 transition-all text-sm md:text-lg cursor-pointer relative z-50"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default IndusCasteGame;