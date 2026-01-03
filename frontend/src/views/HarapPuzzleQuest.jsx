import React, { useState, useEffect, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useNavigate } from 'react-router-dom';
import bgHome from '../assets/bg-home.png';

// --- Backend Detection for react-dnd ---
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const DndBackend = isTouch ? TouchBackend : HTML5Backend;
const dndOptions = isTouch ? { enableMouseEvents: true } : {};

// --- Asset Loading ---
const allPieceModules = import.meta.glob('../assets/HarapPuzzle/**/*.png', { eager: true, as: 'url' });

const getPuzzleImages = (puzzleName) => {
  const images = {};
  const puzzleNameKey = puzzleName.replace(/\s/g, ''); // "Caste System" -> "CasteSystem"
  
  // This loop populates the 'images' object from the Vite glob import.
  for (const path in allPieceModules) {
    const fileName = path.split('/').pop(); // e.g., "CasteSystem_1.png"
    images[fileName] = allPieceModules[path];
  }

  // This generates the array of 12 pieces for the given puzzle.
  // It now looks for files named like "CasteSystem_1.png", "CasteSystem_2.png", etc.
  return Array.from({ length: 12 }, (_, i) => images[`${puzzleNameKey}_${i + 1}.png`]);
};

// --- Data ---
const PUZZLE_DATA = [
  { name: 'Caste System', grid: { rows: 3, cols: 4 } },
  { name: 'Indus River', grid: { rows: 3, cols: 4 } },
  { name: 'Harappa', grid: { rows: 3, cols: 4 } },
  { name: 'Vedas', grid: { rows: 3, cols: 4 } },
  { name: 'Mohenjo-Daro', grid: { rows: 3, cols: 4 } },
];

const puzzles = PUZZLE_DATA.map((p, index) => ({
  ...p,
  id: index,
  pieces: getPuzzleImages(p.name).map((img, i) => ({ 
    id: i, 
    img,
    rotation: Math.floor(Math.random() * 90) - 45 // Add random rotation
  })),
}));

const ItemTypes = {
  PIECE: 'piece',
};

// --- MANUAL PIECE CONFIGURATION ---
// "default" applies to any piece you haven't listed specifically.
// Add specific IDs (0, 1, 2...) to override them.
const PIECE_CONFIG = {
  default: { scaleX: '135%', scaleY: '135%', nudgeX: '0%', nudgeY: '0%' },
  
  // EXAMPLE: Manually adjusting specific pieces
  // Top Row (0-3)
  0: { scaleX: '150%', scaleY: '140%', nudgeX: '4%', nudgeY: '7%' }, 
  1: { scaleX: '145%', scaleY: '120%', nudgeX: '-3%', nudgeY: '0%' }, 
  2: { scaleX: '145%', scaleY: '145%', nudgeX: '2%', nudgeY: '8%' }, 
  3: { scaleX: '133%', scaleY: '135%', nudgeX: '1%', nudgeY: '5%' }, 
  4: { scaleX: '138%', scaleY: '135%', nudgeX: '1%', nudgeY: '8%' }, 
  5: { scaleX: '150%', scaleY: '155%', nudgeX: '0%', nudgeY: '1%' }, 
  6: { scaleX: '140%', scaleY: '115%', nudgeX: '2%', nudgeY: '0%' }, 
  7: { scaleX: '135%', scaleY: '150%', nudgeX: '0%', nudgeY: '4%' }, 
  8: { scaleX: '135%', scaleY: '125%', nudgeX: '0%', nudgeY: '0%' }, 
  9: { scaleX: '140%', scaleY: '125%', nudgeX: '0%', nudgeY: '0%' }, 
  10: { scaleX: '155%', scaleY: '142%', nudgeX: '7%', nudgeY: '-6%' }, 
  11: { scaleX: '120%', scaleY: '125%', nudgeX: '7%', nudgeY: '0%' }, 

};

// --- Draggable Piece Component ---
const DraggablePiece = ({ piece, isBankPiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { piece },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // === INDIVIDUAL PIECE CONFIGURATION ===
  const getPieceStyle = () => {
    // 1. If it's in the bank, keep it standard
    if (isBankPiece) {
      return {
        width: '100%',
        height: '100%',
        transform: 'scale(0.8)',
        position: 'relative',
      };
    }

    // 2. Load settings for THIS specific piece (or use default)
    const config = PIECE_CONFIG[piece.id] || PIECE_CONFIG.default;
    
    // 3. Fallback values if you forgot to define one property
    const width = config.scaleX || PIECE_CONFIG.default.scaleX;
    const height = config.scaleY || PIECE_CONFIG.default.scaleY;
    const nudgeX = config.nudgeX || '0%';
    const nudgeY = config.nudgeY || '0%';

    return {
      width: width,
      height: height,
      position: 'absolute',
      top: '50%',
      left: '50%',
      // Combine centering with your manual nudge
      transform: `translate(calc(-50% + ${nudgeX}), calc(-50% + ${nudgeY}))`,
      zIndex: 10,
    };
  };

  const customStyle = getPieceStyle();

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transition: 'transform 0.2s ease',
    maxWidth: 'none',  // Allow overflow
    maxHeight: 'none', // Allow overflow
    pointerEvents: isDragging ? 'none' : 'auto',
    ...customStyle,
  };

  return (
    <img
      ref={drag}
      src={piece.img}
      alt={`Puzzle piece ${piece.id}`}
      className="cursor-grab active:cursor-grabbing"
      // Force 'fill' so your scaleX/scaleY settings actually stretch the image
      style={{ ...style, objectFit: 'fill' }} 
    />
  );
};

// --- Drop Slot Component (on the board) ---
const DropSlot = ({ slotId, piece, onDrop, isComplete, gridSize }) => { // Accept gridSize
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(slotId, item.piece),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const borderStyle = isComplete ? 'none' : '2px dashed rgba(0, 0, 0, 0.2)';

  return (
    <div
      ref={drop}
      className="relative w-full h-full"
      style={{ 
        border: borderStyle,
        backgroundColor: isOver && canDrop ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
        overflow: 'visible', 
        zIndex: piece ? 2 : 1 
      }}
    >
      {/* Pass gridSize to DraggablePiece */}
      {piece && <DraggablePiece piece={piece} isBankPiece={false} gridSize={gridSize} />}
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
          gridSize={puzzle.grid} // <--- PASS GRID SIZE HERE
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

  return (
    <div ref={drop} className="w-full h-full bg-[#FBE7C6] p-4 rounded-2xl shadow-md border-2 border-amber-300/50">
      <h3 className="text-2xl font-bold text-center text-[#772402] mb-4 font-[var(--font-heading)]">
        Mga Piraso
      </h3>
      <div
        className="grid grid-cols-4 gap-2 w-full h-full p-2"
        style={{ backgroundColor: isOver && canDrop ? 'rgba(119, 36, 2, 0.2)' : 'transparent' }}
      >
        {pieces.map((p) => (
          <div key={p.id} className="w-full h-full flex items-center justify-center">
            <DraggablePiece piece={p} isBankPiece={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Game Component ---
function HarapPuzzleQuest() {
  const navigate = useNavigate();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [pieces, setPieces] = useState({ bank: [], board: [] });
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const currentPuzzle = useMemo(() => puzzles[currentPuzzleIndex], [currentPuzzleIndex]);

  // Effect to preload images and set loading state
  useEffect(() => {
    setImagesLoaded(false);
    const allImages = currentPuzzle.pieces.map(p => p.img).filter(Boolean);
    if (allImages.length === 0) {
        setImagesLoaded(true);
        return;
    }
    
    let loadedCount = 0;
    allImages.forEach(src => {
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

  // Effect to initialize puzzle state once images are loaded
  useEffect(() => {
    if (imagesLoaded) {
      setIsPuzzleComplete(false); // Reset completion state for the new puzzle
      const shuffled = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
      setPieces({
        bank: shuffled,
        board: Array(currentPuzzle.grid.rows * currentPuzzle.grid.cols).fill(null),
      });
    }
  }, [currentPuzzle, imagesLoaded]);

  // // PANG AUTOCOMPLETE TO PAG NAGDEDEBUG
  // useEffect(() => {
  //   if (imagesLoaded) {
  //     setIsPuzzleComplete(false); 
      
  //     // --- DEBUG MODE: AUTO-COMPLETE ---
  //     // 1. Don't shuffle.
  //     // 2. Put everything directly on the board in the correct order.
  //     setPieces({
  //       bank: [], // Bank is empty
  //       board: currentPuzzle.pieces, // Board has all pieces in correct slots (Index 0 = Piece 0)
  //     });
      
  //     /* // --- ORIGINAL GAME MODE (Uncomment this to revert later) ---
  //     const shuffled = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
  //     setPieces({
  //       bank: shuffled,
  //       board: Array(currentPuzzle.grid.rows * currentPuzzle.grid.cols).fill(null),
  //     });
  //     */
  //   }
  // }, [currentPuzzle, imagesLoaded]);

  // --- Completion Check Effect ---
  useEffect(() => {
    // Do not run the check if the board is empty or the game is already finished.
    if (isGameFinished || !pieces.board.length || !imagesLoaded) {
      return;
    }

    const boardPieces = pieces.board.filter(Boolean);
    // Check if all slots on the board are filled.
    if (boardPieces.length === pieces.board.length) {
      // Verify that every piece is in its correct slot (piece.id must match slot index).
      const isComplete = pieces.board.every((p, index) => p && p.id === index);
      
      if (isComplete) {
        console.log(`Puzzle ${currentPuzzle.name} completed!`);
        setIsPuzzleComplete(true); // Set puzzle as complete
        // Wait a moment before advancing to show the completed puzzle.
        setTimeout(() => {
          if (currentPuzzleIndex < puzzles.length - 1) {
            console.log('Advancing to the next puzzle...');
            setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
          } else {
            console.log('All puzzles finished!');
            setIsGameFinished(true);
          }
        }, 1500);
      }
    }
  }, [pieces.board, currentPuzzleIndex, isGameFinished, currentPuzzle.name, imagesLoaded]);


  const handleDropOnBoard = (targetSlotId, droppedPiece) => {
    setPieces(prev => {
      const { bank, board } = prev;
      const newBoard = [...board];
      let newBank = [...bank];

      const sourceSlotId = board.findIndex(p => p && p.id === droppedPiece.id);
      const pieceAtTarget = newBoard[targetSlotId];

      // Case 1: Drag from Bank to Board
      if (sourceSlotId === -1) {
        newBank = newBank.filter(p => p.id !== droppedPiece.id);
        if (pieceAtTarget) {
          newBank.push(pieceAtTarget);
        }
      }
      // Case 2: Drag from Board to Board (Swap)
      else {
        newBoard[sourceSlotId] = pieceAtTarget;
      }
      
      newBoard[targetSlotId] = droppedPiece;
      
      return { bank: newBank, board: newBoard };
    });
  };

  const handleDropOnBank = (droppedPiece) => {
    setPieces(prev => {
      const { bank, board } = prev;
      // Only handle drops from the board
      const sourceSlotId = board.findIndex(p => p && p.id === droppedPiece.id);
      if (sourceSlotId === -1) return prev; // Already in bank, do nothing

      const newBoard = [...board];
      const newBank = [...bank, droppedPiece];
      newBoard[sourceSlotId] = null;

      return { bank: newBank, board: newBoard };
    });
  };

  if (isGameFinished) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50 max-w-lg w-full">
          <h2 className="text-5xl font-bold mb-4 text-[#5a2d0c]">Congratulations!</h2>
          <p className="text-3xl mb-8 text-[#5a2d0c]">
            You've completed all the puzzles!
          </p>
          <button onClick={() => navigate(-1)} className="bg-[#772402] text-white py-3 px-12 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-2xl">
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={DndBackend} options={dndOptions}>
      <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="w-full max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-lg md:text-xl cursor-pointer">
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
            <div className="text-center text-2xl font-bold text-[#772402]">Loading Puzzle...</div>
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