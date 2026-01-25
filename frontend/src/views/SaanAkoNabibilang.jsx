import React, { useState, useEffect, useRef } from "react"; // 👈 Added useRef
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios';

const ItemTypes = {
  WORD: "word",
};

const CATEGORIES = {
  "Imperyong Maya": {
    id: "Imperyong Maya",
    label: "Imperyong Maya",
    color: "bg-[#964B1D]", 
  },
  "Imperyong Aztec": {
    id: "Imperyong Aztec",
    label: "Imperyong Aztec",
    color: "bg-[#F4C458]", 
  },
  "Imperyong Inca": {
    id: "Imperyong Inca",
    label: "Imperyong Inca",
    color: "bg-[#D36E0D]", 
  },
};

const WORDS = [
  { id: "Yucatan Peninsula", label: "Yucatan Peninsula", correct: "Imperyong Maya" },
  { id: "Tlaloc", label: "Tlaloc", correct: "Imperyong Aztec" },
  { id: "Serpent", label: "Serpent", correct: "Imperyong Maya" },
  { id: "Pachakuti", label: "Pachakuti", correct: "Imperyong Inca" },
  { id: "Texcoco", label: "Texcoco", correct: "Imperyong Aztec" },
  { id: "Lambak ng Cuzco", label: "Lambak ng Cuzco", correct: "Imperyong Inca" },
  { id: "Topa Yupanqui", label: "Topa Yupanqui", correct: "Imperyong Inca" },
  { id: "God of the Feathered", label: "God of the Feathered", correct: "Imperyong Maya" },
  { id: "Hernando Cortez", label: "Hernando Cortez", correct: "Imperyong Aztec" },
  { id: "Tunay na lalaki", label: "Tunay na lalaki", correct: "Imperyong Maya" },
];

// 👇 UPDATED: Custom Drag Layer with Auto-Scroll Logic
const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const scrollInterval = useRef(null);

  useEffect(() => {
    if (!isDragging || !currentOffset) {
      if (scrollInterval.current) {
        cancelAnimationFrame(scrollInterval.current);
        scrollInterval.current = null;
      }
      return;
    }

    const scrollStep = () => {
      const { y } = currentOffset;
      const threshold = 150; // Distance from edge to start scrolling
      const speed = 5; // Scroll speed
      const viewportHeight = window.innerHeight;

      // Scroll Down
      if (y > viewportHeight - threshold) {
        window.scrollBy(0, speed);
      }
      // Scroll Up
      else if (y < threshold) {
        window.scrollBy(0, -speed);
      }

      scrollInterval.current = requestAnimationFrame(scrollStep);
    };

    scrollStep();

    return () => {
      if (scrollInterval.current) cancelAnimationFrame(scrollInterval.current);
    };
  }, [isDragging, currentOffset]);

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
          className={`bg-white text-[#5a2d0c] w-max font-bold py-2 px-4 rounded-lg shadow-2xl text-center text-sm md:text-lg opacity-90 scale-110 -rotate-2 cursor-grabbing`}
        >
          {item.label}
        </div>
      </div>
    </div>
  );
};

const DraggableWord = ({ id, label, origin }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.WORD,
    item: { id, label, origin },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`p-2 m-1 bg-white text-[#5a2d0c] font-semibold rounded-md shadow-md cursor-grab active:cursor-grabbing`}
    >
      {label}
    </div>
  );
};

const DropTarget = ({ categoryId, onDrop, children, title, color }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.WORD,
    drop: (item) => onDrop(categoryId, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg min-h-[200px] transition-all duration-200 shadow-inner ${color} ${
        isOver ? "brightness-110 scale-[1.02]" : ""
      }`}
    >
      {title && (
        <h3 className="text-xl font-black mb-2 text-white drop-shadow-md">
          {title}
        </h3>
      )}
      <div className="flex flex-wrap content-start items-start bg-black/10 rounded-md p-1 min-h-[150px]">
        {children}
      </div>
    </div>
  );
};

const SaanAkoNabibilang = () => {
  const navigate = useNavigate();
  const [wordPlacements, setWordPlacements] = useState(() => {
    const initial = { source: WORDS.map((w) => w.id) };
    Object.keys(CATEGORIES).forEach((key) => (initial[key] = []));
    return initial;
  });
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const handleDrop = (targetCategory, droppedItem) => {
    const { id, origin } = droppedItem;

    if (origin === targetCategory) return;

    setWordPlacements((prev) => {
      const newPlacements = { ...prev };
      newPlacements[origin] = newPlacements[origin].filter(
        (wordId) => wordId !== id
      );
      newPlacements[targetCategory] = [...newPlacements[targetCategory], id];
      return newPlacements;
    });
  };

  const checkAnswers = () => {
    let currentScore = 0;
    WORDS.forEach((word) => {
      const placedCategory = Object.keys(wordPlacements).find((cat) =>
        wordPlacements[cat].includes(word.id)
      );
      if (placedCategory === word.correct) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsGameFinished(true);
  };

  // 👇 Submit Score when Game Finished
  useEffect(() => {
    if (isGameFinished) {
        const submitScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Mesoamerica",
                    activity_type: "Game",
                    activity_name: "Saan Ako Nabibilang",
                    score: score,
                    max_score: WORDS.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitScore();
    }
  }, [isGameFinished, score]);

  const handleReset = () => {
    setWordPlacements(() => {
      const initial = { source: WORDS.map((w) => w.id) };
      Object.keys(CATEGORIES).forEach((key) => (initial[key] = []));
      return initial;
    });
    setScore(0);
    setIsGameFinished(false);
  };

  const getWordById = (id) => WORDS.find((w) => w.id === id);

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <CustomDragLayer />
      <div
        className="min-h-screen bg-cover bg-center font-[var(--font-body)] p-4 relative"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        
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

              <div className="z-30 text-center mb-4">
                <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                    Score: {score} / {WORDS.length}
                </p>
              </div>

              <div className="flex gap-4 z-30">
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

        <div className="flex flex-col items-center justify-center min-h-screen pt-16 md:pt-24">
          <div className="w-full max-w-5xl mx-auto pb-10">
            <BackButton className="mb-6 md:ml-20" />

            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
                Selectify
              </h1>
              <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-2xl mx-auto leading-relaxed px-4">
                Ilipat ang mga salitang nasa kahon patungo sa mga tamang
                kabihasnang kanilang kinabibilangan.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border-4 border-[#7B3306]">
              <DropTarget
                categoryId="source"
                onDrop={handleDrop}
                title="Mga Pagpipilian"
              >
                {wordPlacements.source.map((id) => {
                  const word = getWordById(id);
                  return (
                    <DraggableWord
                      key={id}
                      id={id}
                      label={word.label}
                      origin="source"
                    />
                  );
                })}
              </DropTarget>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {Object.values(CATEGORIES).map((cat) => (
                  <DropTarget
                    key={cat.id}
                    categoryId={cat.id}
                    onDrop={handleDrop}
                    title={cat.label}
                    color={cat.color}
                  >
                    {wordPlacements[cat.id].map((id) => {
                      const word = getWordById(id);
                      return (
                        <DraggableWord
                          key={id}
                          id={id}
                          label={word.label}
                          origin={cat.id}
                        />
                      );
                    })}
                  </DropTarget>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={handleReset}
                  className="w-full md:w-auto border-2 border-[#772402] text-[#772402] font-bold py-3 px-8 rounded-lg hover:bg-amber-50 transition-colors text-lg"
                >
                  Reset
                </button>
                <button
                  onClick={checkAnswers}
                  className="w-full md:w-auto bg-[#772402] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#5a2d0c] transition-colors text-lg flex-grow"
                >
                  Check Answers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default SaanAkoNabibilang;