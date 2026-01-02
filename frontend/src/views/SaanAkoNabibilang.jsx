import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import Navbar from "../components/Nav";

const ItemTypes = {
  WORD: "word",
};

const CATEGORIES = {
  "Imperyong Ghana": {
    id: "Imperyong Ghana",
    label: "Imperyong Ghana",
    color: "bg-[#964B1D]", // Dalit color
  },
  "Imperyong Mali": {
    id: "Imperyong Mali",
    label: "Imperyong Mali",
    color: "bg-[#F4C458]", // Vaishya color
  },
  "Imperyong Songhai": {
    id: "Imperyong Songhai",
    label: "Imperyong Songhai",
    color: "bg-[#D36E0D]", // Kshatriya color
  },
};

const WORDS = [
  { id: "Sundiata Keita", label: "Sundiata Keita", correct: "Imperyong Mali" },
  { id: "Sunni", label: "Sunni", correct: "Imperyong Songhai" },
  { id: "Ebony", label: "Ebony", correct: "Imperyong Ghana" },
  { id: "Mansa Musa", label: "Mansa Musa", correct: "Imperyong Mali" },
  { id: "Haring Sunni Ali", label: "Haring Sunni Ali", correct: "Imperyong Songhai" },
  { id: "Dia Kossoi", label: "Dia Kossoi", correct: "Imperyong Songhai" },
  { id: "Irigasyon", label: "Irigasyon", correct: "Imperyong Ghana" },
  { id: "Mosque", label: "Mosque", correct: "Imperyong Mali" },
  { id: "Naitatag sa kanlurang Africa", label: "Naitatag sa kanlurang Africa", correct: "Imperyong Ghana" },
];

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
        className={`p-4 rounded-lg min-h-[200px] transition-all duration-200 shadow-inner ${color} ${isOver ? 'brightness-110 scale-[1.02]' : ''}`}
      >
        {title && <h3 className="text-xl font-black mb-2 text-white drop-shadow-md">{title}</h3>}
        <div className="flex flex-wrap content-start items-start bg-black/10 rounded-md p-1 min-h-[150px]">
          {children}
        </div>
      </div>
    );
  };

const SaanAkoNabibilang = () => {
  const navigate = useNavigate();
  const [wordPlacements, setWordPlacements] = useState(() => {
    const initial = { source: WORDS.map(w => w.id) };
    Object.keys(CATEGORIES).forEach(key => initial[key] = []);
    return initial;
  });
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const handleDrop = (targetCategory, droppedItem) => {
    const { id, origin } = droppedItem;

    if (origin === targetCategory) return;

    setWordPlacements(prev => {
        const newPlacements = { ...prev };
        // Remove from origin
        newPlacements[origin] = newPlacements[origin].filter(wordId => wordId !== id);
        // Add to target
        newPlacements[targetCategory] = [...newPlacements[targetCategory], id];
        return newPlacements;
    });
  };
  
  const checkAnswers = () => {
    let currentScore = 0;
    WORDS.forEach(word => {
        const placedCategory = Object.keys(wordPlacements).find(cat => wordPlacements[cat].includes(word.id));
        if (placedCategory === word.correct) {
            currentScore++;
        }
    });
    setScore(currentScore);
    setIsGameFinished(true);
  };

  const handleReset = () => {
    setWordPlacements(() => {
        const initial = { source: WORDS.map(w => w.id) };
        Object.keys(CATEGORIES).forEach(key => initial[key] = []);
        return initial;
    });
    setScore(0);
    setIsGameFinished(false);
  };

  const getWordById = (id) => WORDS.find(w => w.id === id);

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <CustomDragLayer />
      <div
        className="min-h-screen bg-cover bg-center font-[var(--font-body)]"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen pt-24 md:pt-32">
          <div className="w-full max-w-6xl mx-auto px-4 pb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer"
            >
              <span className="mr-2">◀</span> Back
            </button>

            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
                Saan Ako Nabibilang?
              </h1>
              <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-2xl mx-auto leading-relaxed px-4">
                Ilipat ang mga salitang nasa kahon patungo sa mga tamang kabihasnang kanilang kinabibilangan.
              </p>
            </div>

            {!isGameFinished ? (
              <>
                <DropTarget categoryId="source" onDrop={handleDrop} title="Mga Pagpipilian">
                    {wordPlacements.source.map(id => {
                        const word = getWordById(id);
                        return <DraggableWord key={id} id={id} label={word.label} origin="source" />
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
                      {wordPlacements[cat.id].map(id => {
                        const word = getWordById(id);
                        return <DraggableWord key={id} id={id} label={word.label} origin={cat.id} />
                      })}
                    </DropTarget>
                  ))}
                </div>
                <div className="text-center mt-8">
                    <button
                        onClick={checkAnswers}
                        className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-xl"
                    >
                        Check Answers
                    </button>
                </div>
              </>
            ) : (
              <div className="text-center bg-[#FDFBF7] rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50">
                <h2 className="text-4xl font-bold mb-4 text-[#5a2d0c]">Congratulations!</h2>
                <p className="text-2xl mb-6 text-[#5a2d0c]">
                  Your Final Score: <span className="font-extrabold">{score}/{WORDS.length}</span>
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-xl"
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default SaanAkoNabibilang;
