import React, { useState, useEffect, useMemo } from "react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import API from "../api/axios";

// --- Backend Detection for react-dnd ---
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const DndBackend = isTouch ? TouchBackend : HTML5Backend;
const dndOptions = isTouch ? { enableMouseEvents: true } : {};

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

// --- CUSTOM DRAG LAYER ---
const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

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
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        }}
      >
        <img
          src={item.piece.img}
          alt="Drag Preview"
          style={{
            ...getPreviewStyle(item.piece, true),
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
};

// --- Draggable Piece Component ---
const DraggablePiece = ({ piece, isBankPiece }) => {
  // FIX: Added [piece] dependency array at the end!
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [piece]); // <--- THIS FIXED THE ISSUE

  const getPieceStyle = () => {
    if (isBankPiece) {
      return {
        width: "100%", 
        height: "100%",
        objectFit: "contain", 
        transform: "scale(0.9)", 
        position: "relative",
      };
    }

    const config = PIECE_CONFIG[piece.id] || PIECE_CONFIG.default;
    const width = config.scaleX || PIECE_CONFIG.default.scaleX;
    const height = config.scaleY || PIECE_CONFIG.default.scaleY;
    const nudgeX = config.nudgeX || "0%";
    const nudgeY = config.nudgeY || "0%";

    return {
      width: width,
      height: height,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${nudgeX}), calc(-50% + ${nudgeY}))`,
      zIndex: 10,
    };
  };

  const customStyle = getPieceStyle();

  const style = {
    opacity: isDragging ? 0 : 1,
    transition: "transform 0.2s ease",
    maxWidth: "none",
    maxHeight: "none",
    cursor: "grab",
    ...customStyle,
  };

  return (
    <img
      ref={drag}
      src={piece.img}
      alt={`Puzzle piece ${piece.id}`}
      style={{ ...style }}
    />
  );
};

// --- Drop Slot Component ---
const DropSlot = ({ slotId, piece, onDrop, isComplete, gridSize }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(slotId, item.piece),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const borderStyle = isComplete ? "none" : "2px dashed rgba(0, 0, 0, 0.2)";

  return (
    <div
      ref={drop}
      className="relative w-full h-full"
      style={{
        border: borderStyle,
        backgroundColor:
          isOver && canDrop ? "rgba(255, 255, 255, 0.3)" : "transparent",
        overflow: "visible",
        zIndex: piece ? 2 : 1,
      }}
    >
      {piece && (
        <DraggablePiece piece={piece} isBankPiece={false} gridSize={gridSize} />
      )}
    </div>
  );
};

// --- Puzzle Board Component ---
const PuzzleBoard = ({ puzzle, boardState, onDrop, isComplete }) => {
  const { rows, cols } = puzzle.grid;
  return (
    <div
      className="grid w-full"
      style={{
        aspectRatio: `${cols} / ${rows}`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {boardState.map((piece, index) => (
        <DropSlot
          key={`slot-${index}`}
          slotId={index}
          piece={piece}
          onDrop={onDrop}
          isComplete={isComplete}
          gridSize={puzzle.grid}
        />
      ))}
    </div>
  );
};

// --- Piece Bank Component ---
const PieceBank = ({ pieces, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(item.piece),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Create fixed 12 slots for the bank structure
  const bankSlots = Array.from({ length: 12 });

  return (
    <div
      ref={drop}
      className="w-full h-full bg-[#FBE7C6] p-4 rounded-2xl shadow-md border-2 border-amber-300/50 flex flex-col"
    >
      <h3 className="text-2xl font-bold text-center text-[#772402] mb-2 font-[var(--font-heading)]">
        Mga Piraso
      </h3>

      <div
        className="grid grid-cols-4 grid-rows-3 gap-2 w-full flex-1"
        style={{
          backgroundColor:
            isOver && canDrop ? "rgba(119, 36, 2, 0.2)" : "transparent",
        }}
      >
        {bankSlots.map((_, index) => {
          const piece = pieces[index]; 
          return (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center relative border border-black/5 rounded-lg bg-white/10"
            >
              {piece && <DraggablePiece piece={piece} isBankPiece={true} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Game Component ---
function HarapPuzzleQuest() {
  const navigate = useNavigate();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  
  // Initialize both as fixed arrays of 12
  const [pieces, setPieces] = useState({ 
    bank: Array(12).fill(null), 
    board: Array(12).fill(null) 
  });
  
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const currentPuzzle = useMemo(
    () => puzzles[currentPuzzleIndex],
    [currentPuzzleIndex]
  );

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
        if (loadedCount === allImages.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [currentPuzzle]);

  // INITIALIZE GAME STATE
  useEffect(() => {
    if (imagesLoaded) {
      setIsPuzzleComplete(false);
      const shuffled = [...currentPuzzle.pieces].sort(
        () => Math.random() - 0.5
      );
      
      const initialBank = Array(12).fill(null);
      shuffled.forEach((p, i) => {
          if (i < 12) initialBank[i] = p;
      });

      setPieces({
        bank: initialBank,
        board: Array(currentPuzzle.grid.rows * currentPuzzle.grid.cols).fill(null),
      });
    }
  }, [currentPuzzle, imagesLoaded]);

  useEffect(() => {
    if (isGameFinished || !pieces.board.length || !imagesLoaded) {
      return;
    }

    const boardPieces = pieces.board.filter(Boolean);
    if (boardPieces.length === pieces.board.length) {
      const isComplete = pieces.board.every((p, index) => p && p.id === index);

      if (isComplete) {
        setIsPuzzleComplete(true);
        setTimeout(() => {
          if (currentPuzzleIndex < puzzles.length - 1) {
            setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
          } else {
            setIsGameFinished(true);
          }
        }, 1500);
      }
    }
  }, [
    pieces.board,
    currentPuzzleIndex,
    isGameFinished,
    currentPuzzle.name,
    imagesLoaded,
  ]);

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

  // --- DROP LOGIC: BOARD ---
  const handleDropOnBoard = (targetSlotId, droppedPiece) => {
    setPieces((prev) => {
      const { bank, board } = prev;
      const newBoard = [...board];
      const newBank = [...bank];

      // 1. Locate source of the piece
      const bankIndex = bank.findIndex(p => p && p.id === droppedPiece.id);
      const boardIndex = board.findIndex(p => p && p.id === droppedPiece.id);

      // 2. Identify piece currently at target
      const pieceAtTarget = newBoard[targetSlotId];

      // 3. Remove dragged piece from its source
      if (bankIndex !== -1) {
          newBank[bankIndex] = null; 
      } else if (boardIndex !== -1) {
          newBoard[boardIndex] = null; 
      }

      // 4. Swap logic
      if (pieceAtTarget) {
          if (boardIndex !== -1) {
              // Swap within board
              newBoard[boardIndex] = pieceAtTarget;
          } else {
              // Return displaced piece to bank
              if (bankIndex !== -1) {
                  newBank[bankIndex] = pieceAtTarget;
              } else {
                  // Fallback: Find first empty
                  const emptyBankSlot = newBank.findIndex(p => p === null);
                  if (emptyBankSlot !== -1) newBank[emptyBankSlot] = pieceAtTarget;
              }
          }
      }

      // 5. Place dropped piece
      newBoard[targetSlotId] = droppedPiece;

      return { bank: newBank, board: newBoard };
    });
  };

  // --- DROP LOGIC: BANK ---
  const handleDropOnBank = (droppedPiece) => {
    setPieces((prev) => {
      const { bank, board } = prev;
      
      const boardIndex = board.findIndex(p => p && p.id === droppedPiece.id);
      if (boardIndex === -1) return prev; 

      const newBoard = [...board];
      const newBank = [...bank];

      const emptyBankSlot = newBank.findIndex(p => p === null);

      if (emptyBankSlot !== -1) {
          newBoard[boardIndex] = null; 
          newBank[emptyBankSlot] = droppedPiece; 
      }

      return { bank: newBank, board: newBoard };
    });
  };

  if (isGameFinished) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50 max-w-lg w-full">
          <h2 className="text-5xl font-bold mb-4 text-[#5a2d0c]">
            Congratulations!
          </h2>
          <p className="text-3xl mb-8 text-[#5a2d0c]">
            You've completed all the puzzles!
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#772402] text-white py-3 px-12 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-2xl"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={DndBackend} options={dndOptions}>
      <CustomDragLayer />

      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-lg md:text-xl cursor-pointer mt-20"
          >
            <span className="mr-2">◀</span> Back
          </button>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-[#7B3306] font-[var(--font-heading)] uppercase">
              HARAPPUZZLE QUEST
            </h1>
            <p className="text-[#B06A3A] font-bold text-lg">
              Assemble the pieces to reveal a part of history!
            </p>
          </div>

          {!imagesLoaded ? (
            <div className="text-center text-2xl font-bold text-[#772402]">
              Loading Puzzle...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 w-full aspect-[4/3] bg-white/30 rounded-2xl shadow-lg p-2">
                <PuzzleBoard
                  puzzle={currentPuzzle}
                  boardState={pieces.board}
                  onDrop={handleDropOnBoard}
                  isComplete={isPuzzleComplete}
                />
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