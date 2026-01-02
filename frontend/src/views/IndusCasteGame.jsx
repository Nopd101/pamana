import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";

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
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CASTE,
      item: { id, label, color, originLevel },
      canDrag: !isDropped,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, label, color, isDropped, originLevel]
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={drag}
      style={{ opacity }}
      className={`${color} text-white font-black rounded-md shadow-lg cursor-grab active:cursor-grabbing text-center uppercase tracking-wider transition-transform hover:scale-105 border-2 border-white/20 ${className} ${
        isDropped ? "opacity-30 cursor-not-allowed grayscale" : ""
      }`}
    >
      {label}
    </div>
  );
};

const ContentLevel = ({ levelData, currentItem, onDrop, setHoveredLevel }) => {
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

  return (
    <div
      ref={drop}
      className="flex-1 w-full flex items-center justify-center relative z-20"
    >
      <div
        className="text-center px-2 flex flex-col items-center justify-center w-full"
        style={{
          WebkitTextStroke: "1.5px #5a2d0c",
          paintOrder: "stroke fill",
        }}
      >
        {currentItem ? (
          <DraggableBox
            {...currentItem}
            originLevel={levelData.id}
            isDropped={false}
            className="py-1 px-4 md:px-8 text-xs md:text-lg animate-bounce-short z-50 relative border-2 border-white !shadow-md"
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center text-white cursor-default select-none pointer-events-none transition-transform duration-200 ${
              isOver ? "scale-110" : ""
            }`}
          >
            <span className="font-extrabold text-[10px] md:text-sm lg:text-base leading-tight uppercase tracking-wide">
              {levelData.clue}
            </span>
            <span
              className={`hidden md:block text-[10px] lg:text-sm mt-1 leading-snug max-w-[500px] font-bold ${
                isOver ? "block" : ""
              }`}
            >
              {levelData.desc}
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

  // --- object swapping ---
  const handleDrop = (targetLevelId, item) => {
    setPlacements((prev) => {
      const newPlacements = { ...prev };

      const sourceLevelId = item.originLevel;
      const itemAtTarget = newPlacements[targetLevelId];

      newPlacements[targetLevelId] = item;

      if (sourceLevelId) {
        if (itemAtTarget) {
          newPlacements[sourceLevelId] = itemAtTarget;
        } else {
          delete newPlacements[sourceLevelId];
        }
      }

      return newPlacements;
    });
  };

  const handleReset = () => {
    setPlacements({});
  };

  const placedItemIds = Object.values(placements).map((p) => p?.id);

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <CustomDragLayer />

      <div
        className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="bg-[#462d24] text-white p-4 px-4 md:px-8 flex justify-between items-center shadow-lg rounded-b-[20px] md:rounded-b-[30px] mb-6 relative z-50">
          <div className="font-[var(--font-heading)] font-extrabold text-lg md:text-2xl tracking-widest">
            PAMANA
          </div>
          <div className="flex gap-3 md:gap-6 text-xs md:text-sm font-medium">
            <span className="hidden md:inline">MENU</span>
            <span className="hidden md:inline">ABOUT</span>
            <span className="opacity-70">Juan Dela Cruz</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer mt-13"
          >
            <span className="mr-2">◀</span> Back
          </button>

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
              CASTE YOUR ANSWER
            </h1>
            <p className="text-[#964B1D] font-bold text-xs md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              I-drag at i-drop ang tamang pangalan ng caste sa tamang pwesto sa
              pyramid.
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
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-[#8B5E3C] to-[#6F482D] text-white font-bold py-3 px-12 md:px-16 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-[#5a2d0c] text-sm md:text-lg cursor-pointer relative z-50"
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
