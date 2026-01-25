import React, { useState, useEffect, useMemo, useRef } from "react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from "../api/axios";

// 👇 Import Clear SFX
import clearedSfx from "../assets/sfx/cleared.mp3";

// --- Asset Loading ---
const allPieceModules = import.meta.glob("../assets/HarapPuzzle/**/*.png", {
  eager: true,
  as: "url",
});

const getPuzzleImages = (puzzleName) => {
  const images = {};
  const puzzleNameKey = puzzleName.replace(/\s/g, "");

  for (const path in allPieceModules) {
    const fileName = path.split("/").pop();
    images[fileName] = allPieceModules[path];
  }

  return Array.from(
    { length: 12 },
    (_, i) => images[`${puzzleNameKey}_${i + 1}.png`]
  );
};

// --- Data ---
const PUZZLE_DATA = [
  { name: "Caste System", grid: { rows: 3, cols: 4 } },
  { name: "Indus River", grid: { rows: 3, cols: 4 } },
  { name: "Harappa", grid: { rows: 3, cols: 4 } },
  { name: "Vedas", grid: { rows: 3, cols: 4 } },
  { name: "Mohenjo-Daro", grid: { rows: 3, cols: 4 } },
];

const puzzles = PUZZLE_DATA.map((p, index) => ({
  ...p,
  id: index,
  pieces: getPuzzleImages(p.name).map((img, i) => ({
    id: i,
    img,
    rotation: Math.floor(Math.random() * 90) - 45,
  })),
}));

const ItemTypes = {
  PIECE: "piece",
};

// --- MANUAL PIECE CONFIGURATION ---
const PIECE_CONFIG = {
  default: { scaleX: "135%", scaleY: "135%", nudgeX: "0%", nudgeY: "0%" },
  0: { scaleX: "150%", scaleY: "140%", nudgeX: "4%", nudgeY: "7%" },
  1: { scaleX: "145%", scaleY: "120%", nudgeX: "-3%", nudgeY: "0%" },
  2: { scaleX: "145%", scaleY: "145%", nudgeX: "2%", nudgeY: "8%" },
  3: { scaleX: "133%", scaleY: "135%", nudgeX: "1%", nudgeY: "5%" },
  4: { scaleX: "138%", scaleY: "135%", nudgeX: "1%", nudgeY: "8%" },
  5: { scaleX: "150%", scaleY: "155%", nudgeX: "0%", nudgeY: "1%" },
  6: { scaleX: "140%", scaleY: "115%", nudgeX: "2%", nudgeY: "0%" },
  7: { scaleX: "135%", scaleY: "150%", nudgeX: "0%", nudgeY: "4%" },
  8: { scaleX: "135%", scaleY: "125%", nudgeX: "0%", nudgeY: "0%" },
  9: { scaleX: "140%", scaleY: "125%", nudgeX: "0%", nudgeY: "0%" },
  10: { scaleX: "155%", scaleY: "142%", nudgeX: "7%", nudgeY: "-6%" },
  11: { scaleX: "120%", scaleY: "125%", nudgeX: "7%", nudgeY: "0%" },
};

// --- CUSTOM DRAG LAYER (WITH AUTO-SCROLL) ---
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
      const threshold = 100;
      const speed = 5;
      const viewportHeight = window.innerHeight;

      if (y > viewportHeight - threshold) {
        window.scrollBy(0, speed);
      } else if (y < threshold) {
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

  const getPreviewStyle = (piece, isBankPiece) => {
    if (isBankPiece) {
      return {
        width: "80px",
        height: "80px",
        transform: "scale(1.1)",
      };
    }
    return {
      width: "100px",
      height: "100px",
      objectFit: "contain",
    };
  };

  return (
    <div style={{ position: "fixed", pointerEvents: "none", zIndex: 100, left: 0, top: 0, width: "100%", height: "100%" }}>
      <div style={{ transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}>
        <img src={item.piece.img} alt="Drag Preview" style={{ ...getPreviewStyle(item.piece, true), opacity: 0.9 }} />
      </div>
    </div>
  );
};

// --- Draggable Piece Component ---
const DraggablePiece = ({ piece, isBankPiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { piece },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }), [piece]);

  const getPieceStyle = () => {
    if (isBankPiece) {
      return { width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)", position: "relative" };
    }
    const config = PIECE_CONFIG[piece.id] || PIECE_CONFIG.default;
    return {
      width: config.scaleX || "135%",
      height: config.scaleY || "135%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${config.nudgeX || "0%"}), calc(-50% + ${config.nudgeY || "0%"}))`,
      zIndex: 10,
    };
  };

  return <img ref={drag} src={piece.img} alt={`Puzzle piece ${piece.id}`} style={{ opacity: isDragging ? 0 : 1, transition: "transform 0.2s ease", maxWidth: "none", maxHeight: "none", cursor: "grab", ...getPieceStyle() }} />;
};

// --- Drop Slot Component ---
const DropSlot = ({ slotId, piece, onDrop, isComplete, gridSize }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(slotId, item.piece),
    collect: (monitor) => ({ isOver: !!monitor.isOver(), canDrop: !!monitor.canDrop() }),
  }));

  return (
    <div ref={drop} className="relative w-full h-full" style={{ border: isComplete ? "none" : "2px dashed rgba(0, 0, 0, 0.2)", backgroundColor: isOver && canDrop ? "rgba(255, 255, 255, 0.3)" : "transparent", overflow: "visible", zIndex: piece ? 2 : 1 }}>
      {piece && <DraggablePiece piece={piece} isBankPiece={false} gridSize={gridSize} />}
    </div>
  );
};

// --- Puzzle Board Component ---
const PuzzleBoard = ({ puzzle, boardState, onDrop, isComplete }) => {
  const { rows, cols } = puzzle.grid;
  return (
    <div className="grid w-full" style={{ aspectRatio: `${cols} / ${rows}`, gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {boardState.map((piece, index) => <DropSlot key={`slot-${index}`} slotId={index} piece={piece} onDrop={onDrop} isComplete={isComplete} gridSize={puzzle.grid} />)}
    </div>
  );
};

// --- Piece Bank Component ---
const PieceBank = ({ pieces, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(item.piece),
    collect: (monitor) => ({ isOver: !!monitor.isOver(), canDrop: !!monitor.canDrop() }),
  }));

  return (
    <div ref={drop} className="w-full h-full bg-[#FBE7C6] p-4 rounded-2xl shadow-md border-2 border-amber-300/50 flex flex-col">
      <h3 className="text-2xl font-bold text-center text-[#772402] mb-2 font-[var(--font-heading)]">Mga Piraso</h3>
      <div className="grid grid-cols-4 grid-rows-3 gap-2 w-full flex-1" style={{ backgroundColor: isOver && canDrop ? "rgba(119, 36, 2, 0.2)" : "transparent" }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="w-full h-full flex items-center justify-center relative border border-black/5 rounded-lg bg-white/10">
            {pieces[index] && <DraggablePiece piece={pieces[index]} isBankPiece={true} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Stage Navigator ---
const StageNavigator = ({ puzzles, currentIndex, onSelect }) => {
  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 bg-[#FBE7C6]/80 p-3 rounded-xl border border-[#B06A3A]/30 shadow-sm backdrop-blur-sm">
        {puzzles.map((p, index) => (
          <button key={index} onClick={() => onSelect(index)} className={`relative px-4 py-2 rounded-lg font-bold transition-all duration-200 flex flex-col items-center min-w-[80px] ${index === currentIndex ? "bg-[#772402] text-[#FBE7C6] scale-105 shadow-md transform -translate-y-1" : "bg-[#fff8ee] text-[#772402] hover:bg-[#ffe0b2] hover:scale-105"}`}>
            <span className="text-xs uppercase tracking-wider opacity-80">Stage {index + 1}</span>
            <span className="text-sm md:text-base leading-tight text-center">{p.name}</span>
            {index === currentIndex && <div className="absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#772402]"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Game Component ---
function HarapPuzzleQuest() {
  const navigate = useNavigate();

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(() => {
    const saved = localStorage.getItem("harap_puzzle_index");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [pieces, setPieces] = useState({
    bank: Array(12).fill(null),
    board: Array(12).fill(null),
  });

  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // --- Audio Helper ---
  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  useEffect(() => {
    localStorage.setItem("harap_puzzle_index", currentPuzzleIndex);
  }, [currentPuzzleIndex]);

  const currentPuzzle = useMemo(() => puzzles[currentPuzzleIndex], [currentPuzzleIndex]);

  useEffect(() => {
    setImagesLoaded(false);
    const allImages = currentPuzzle.pieces.map((p) => p.img).filter(Boolean);
    if (allImages.length === 0) {
      setImagesLoaded(true);
      return;
    }
    let loadedCount = 0;
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === allImages.length) setImagesLoaded(true);
      };
    });
  }, [currentPuzzle]);

  useEffect(() => {
    if (imagesLoaded) {
      setIsPuzzleComplete(false);
      const shuffled = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
      const initialBank = Array(12).fill(null);
      shuffled.forEach((p, i) => { if (i < 12) initialBank[i] = p; });
      setPieces({ bank: initialBank, board: Array(currentPuzzle.grid.rows * currentPuzzle.grid.cols).fill(null) });
    }
  }, [currentPuzzle, imagesLoaded]);

  useEffect(() => {
    if (isGameFinished || !pieces.board.length || !imagesLoaded) return;
    
    const boardPieces = pieces.board.filter(Boolean);
    if (boardPieces.length === pieces.board.length) {
      const isComplete = pieces.board.every((p, index) => p && p.id === index);
      if (isComplete && !isPuzzleComplete) {
        
        // 👇 Play Clear SFX on Stage Completion
        playSound(clearedSfx);

        const timer = setTimeout(() => {
          setIsPuzzleComplete(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [pieces.board, currentPuzzleIndex, isGameFinished, currentPuzzle.name, imagesLoaded, isPuzzleComplete]);

  useEffect(() => {
    if (isGameFinished) {
      const submitScore = async () => {
        try {
          await API.post("submit-score/", {
            civilization: "Indus",
            activity_type: "Game",
            activity_name: "HARAPPUZZLE QUEST",
            score: puzzles.length,
            max_score: puzzles.length,
          });
        } catch (err) {
          console.error(err);
        }
      };
      submitScore();
    }
  }, [isGameFinished]);

  const handleDropOnBoard = (targetSlotId, droppedPiece) => {
    setPieces((prev) => {
      const { bank, board } = prev;
      const newBoard = [...board];
      const newBank = [...bank];
      const bankIndex = bank.findIndex((p) => p && p.id === droppedPiece.id);
      const boardIndex = board.findIndex((p) => p && p.id === droppedPiece.id);
      const pieceAtTarget = newBoard[targetSlotId];

      if (bankIndex !== -1) newBank[bankIndex] = null;
      else if (boardIndex !== -1) newBoard[boardIndex] = null;

      if (pieceAtTarget) {
        if (boardIndex !== -1) newBoard[boardIndex] = pieceAtTarget;
        else if (bankIndex !== -1) newBank[bankIndex] = pieceAtTarget;
        else {
          const emptyBankSlot = newBank.findIndex((p) => p === null);
          if (emptyBankSlot !== -1) newBank[emptyBankSlot] = pieceAtTarget;
        }
      }
      newBoard[targetSlotId] = droppedPiece;
      return { bank: newBank, board: newBoard };
    });
  };

  const handleDropOnBank = (droppedPiece) => {
    setPieces((prev) => {
      const { bank, board } = prev;
      const boardIndex = board.findIndex((p) => p && p.id === droppedPiece.id);
      if (boardIndex === -1) return prev;
      const newBoard = [...board];
      const newBank = [...bank];
      const emptyBankSlot = newBank.findIndex((p) => p === null);
      if (emptyBankSlot !== -1) {
        newBoard[boardIndex] = null;
        newBank[emptyBankSlot] = droppedPiece;
      }
      return { bank: newBank, board: newBoard };
    });
  };

  const handleStageSelect = (index) => {
    setCurrentPuzzleIndex(index);
    setIsGameFinished(false);
  };

  const isLastStage = currentPuzzleIndex === puzzles.length - 1;

  const handleNextStage = async () => {
    setIsPuzzleComplete(false);
    
    if (isLastStage) {
        try {
            await API.post("submit-score/", {
              civilization: "Indus",
              activity_type: "Game",
              activity_name: "HARAPPUZZLE QUEST",
              score: puzzles.length,
              max_score: puzzles.length,
            });
        } catch (err) {
            console.error("Error submitting score:", err);
        }

        navigate('/kabihasnan/indus');
    } else {
        setCurrentPuzzleIndex((prev) => prev + 1);
    }
  };

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <CustomDragLayer />

      <div className="min-h-screen bg-cover bg-center p-4 pt-10" style={{ backgroundImage: `url(${bgHome})` }}>
        
        {isPuzzleComplete && !isGameFinished && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] p-8 rounded-2xl shadow-2xl border-4 border-[#772402] text-center max-w-md w-full animate-bounce-short">
                <h2 className="text-3xl font-black text-[#772402] uppercase mb-4 font-[var(--font-heading)]">
                    {isLastStage ? "All Stages Cleared!" : `Stage ${currentPuzzleIndex + 1} Complete!`}
                </h2>
                <div className="flex justify-center mb-6">
                    <img src={charImg} alt="Good Job" className="w-32" />
                </div>
                <button
                    onClick={handleNextStage}
                    className="bg-[#772402] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform uppercase"
                >
                    {isLastStage ? "Complete" : "Next Stage →"}
                </button>
            </div>
          </div>
        )}

        {/* 👇 FIXED GAME CLEARED MODAL (Flexbox Layout) */}
        {isGameFinished && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-transparent max-w-2xl w-full flex flex-col items-center justify-center">
              
              {/* Changed to flex-row to prevent overlap */}
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                <img src={charImg} alt="Game Cleared Character" className="w-40 md:w-56 drop-shadow-2xl animate-bounce-short z-10" />
                <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-center md:text-left z-20 leading-tight uppercase tracking-tighter transform -rotate-2">
                  GAME <br /> CLEARED
                </h1>
              </div>

              <div className="flex gap-4 mt-2 z-30">
                <button onClick={() => handleStageSelect(0)} className="bg-[#FDFBF7] text-[#772402] font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition-transform border-4 border-[#772402]">PLAY AGAIN</button>
                <button onClick={() => navigate(-1)} className="bg-[#772402] text-white font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 transition-transform border-4 border-[#FDFBF7]">FINISH</button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-24 left-4 md:left-20 z-10">
          <BackButton />
        </div>

        <div className="w-full max-w-7xl mx-auto flex flex-col items-center mt-24 md:mt-10">
          <div className="text-center mb-6 px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#7B3306] font-[var(--font-heading)] uppercase drop-shadow-sm">
              HARAPPUZZLE QUEST
            </h1>
            <p className="text-[#B06A3A] font-bold text-lg mt-2">
              Buuin ang puzzle gamit ang tamang piraso upang mabuo ang larawan o konseptong may kinalaman sa Kabihasnang Indus.
            </p>
          </div>

          <StageNavigator puzzles={puzzles} currentIndex={currentPuzzleIndex} onSelect={handleStageSelect} />

          {!imagesLoaded ? (
            <div className="text-center text-2xl font-bold text-[#772402] animate-pulse">Loading Puzzle...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
              <div className="md:col-span-2 w-full aspect-[4/3] bg-white/30 rounded-2xl shadow-lg p-2 border border-[#fff]/40">
                <PuzzleBoard puzzle={currentPuzzle} boardState={pieces.board} onDrop={handleDropOnBoard} isComplete={isPuzzleComplete} />
              </div>
              <div className="w-full h-[400px] md:h-auto md:aspect-[1/1.2]">
                <PieceBank pieces={pieces.bank} onDrop={handleDropOnBank} />
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default HarapPuzzleQuest;