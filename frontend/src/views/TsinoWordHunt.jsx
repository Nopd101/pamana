import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";

const WORDS_TO_FIND = [
  { word: "ZHONGGUO", hint: "Tawag sa Tsina: 'Gitnang Kaharian'" },
  { word: "CONFUCIUS", hint: "Dakilang guro at pilosopo ng Tsina" },
  { word: "TAOISM", hint: "Pilosopiya ng balanse at kalikasan" },
  { word: "DYNASTY", hint: "Pamahalaang pinamumunuan ng angkan" },
  { word: "BUDDHISM", hint: "Relihiyong tinangkilik ng mga dugong bughaw" },
];

// content grid (8 Rows x 11 Cols)
const FIXED_GRID = [
  ["Z", "H", "O", "N", "G", "G", "U", "O", "A", "M", "B"],
  ["A", "C", "E", "L", "M", "A", "D", "C", "Q", "G", "U"],
  ["T", "L", "Y", "T", "R", "W", "Z", "A", "Q", "B", "D"],
  ["S", "A", "T", "X", "B", "N", "F", "V", "C", "J", "D"],
  ["F", "C", "O", "N", "F", "U", "C", "I", "U", "S", "H"],
  ["O", "T", "W", "I", "Q", "U", "N", "G", "D", "R", "I"],
  ["D", "Y", "N", "A", "S", "T", "Y", "H", "T", "Y", "S"],
  ["R", "E", "V", "S", "O", "M", "Y", "R", "E", "B", "M"],
];

const TsinoWordHunt = () => {
  const navigate = useNavigate();
  const [selectedCells, setSelectedCells] = useState([]);
  const [errorCells, setErrorCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [startCell, setStartCell] = useState(null);
  const [foundCellCoords, setFoundCellCoords] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  useEffect(() => {
    if (foundWords.length === WORDS_TO_FIND.length) {
      setTimeout(() => setIsGameWon(true), 1000);
    }
  }, [foundWords]);

  const getCellsBetween = (start, end) => {
    const path = [];
    const dr = end.row - start.row;
    const dc = end.col - start.col;

    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;

      for (let i = 0; i <= steps; i++) {
        path.push({
          row: start.row + i * stepR,
          col: start.col + i * stepC,
        });
      }
      return path;
    }
    return [];
  };

  const checkWordSelection = (cells) => {
    const formedWord = cells.map((c) => FIXED_GRID[c.row][c.col]).join("");
    const validWordObj = WORDS_TO_FIND.find(
      (w) =>
        w.word === formedWord ||
        w.word === formedWord.split("").reverse().join("")
    );

    if (validWordObj) {
      if (foundWords.includes(validWordObj.word)) {
        setFeedbackText(`"${validWordObj.word}" is already found!`);
        setFeedbackType("neutral");
        setStartCell(null);
        setSelectedCells([]);
      } else {
        setFeedbackText(`You found: ${validWordObj.word}!`);
        setFeedbackType("success");
        setFoundWords((prev) => [...prev, validWordObj.word]);
        setFoundCellCoords((prev) => [...prev, ...cells]);
        setStartCell(null);
        setSelectedCells([]);
      }
    } else {
      setFeedbackText(`"${formedWord}" is incorrect.`);
      setFeedbackType("error");
      setErrorCells(cells);
      setSelectedCells([]);
      setStartCell(null);
      setTimeout(() => {
        setErrorCells([]);
        setFeedbackText("");
      }, 1000);
    }
  };

  const handleCellClick = (row, col) => {
    if (errorCells.length > 0) {
      setErrorCells([]);
      setFeedbackText("");
    }

    if (!startCell) {
      setStartCell({ row, col });
      setSelectedCells([{ row, col }]);
      setFeedbackText("Select end letter...");
      setFeedbackType("neutral");
    } else {
      const path = getCellsBetween(startCell, { row, col });

      if (path.length > 0) {
        checkWordSelection(path);
      } else {
        setStartCell({ row, col });
        setSelectedCells([{ row, col }]);
        setFeedbackText("Must be a straight line!");
        setFeedbackType("error");
      }
    }
  };

  const handleReset = () => {
    setFoundWords([]);
    setStartCell(null);
    setSelectedCells([]);
    setFoundCellCoords([]);
    setErrorCells([]);
    setIsGameWon(false);
    setFeedbackText("");
  };

  const getCellStyle = (r, c) => {
    const isError = errorCells.some((cell) => cell.row === r && cell.col === c);
    const isSelected = selectedCells.some(
      (cell) => cell.row === r && cell.col === c
    );
    const isFound = foundCellCoords.some(
      (cell) => cell.row === r && cell.col === c
    );

    if (isError)
      return "bg-red-600 text-white shadow-md z-20 animate-pulse border-red-800";

    if (isSelected || isFound) {
      return "bg-white text-[#5a2d0c] shadow-lg scale-105 z-10 border-white font-extrabold";
    }

    return "bg-gradient-to-b from-[#A07048] to-[#764C29] text-white border-[#5a2d0c]/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      {isGameWon && (
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

      <div className="max-w-5xl mx-auto px-4 pb-10 mt-25">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            DynasSeek
          </h1>
          <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
            Hanapin at bilugan sa puzzle ang mga salita o terminong may
            kaugnayan sa Kabihasnang Tsino.
          </p>
        </div>

        <div className="h-8 mb-4 w-full flex justify-center items-center">
          {feedbackText && (
            <div
              className={`px-6 py-1 rounded-full font-bold text-xs md:text-sm shadow-sm animate-bounce-short transition-colors
                  ${
                    feedbackType === "success"
                      ? "bg-green-100 text-green-800 border border-green-500"
                      : feedbackType === "error"
                      ? "bg-red-100 text-red-800 border border-red-500"
                      : "bg-amber-100 text-[#5a2d0c] border border-[#5a2d0c]"
                  }
                `}
            >
              {feedbackText}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mb-8">
          <div
            className="grid gap-1.5 md:gap-2 p-1 select-none"
            style={{
              gridTemplateColumns: `repeat(${FIXED_GRID[0].length}, minmax(0, 1fr))`,
            }}
          >
            {FIXED_GRID.map((row, rIndex) =>
              row.map((letter, cIndex) => (
                <div
                  key={`${rIndex}-${cIndex}`}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                  className={`
                        w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 
                        flex items-center justify-center
                        rounded-md
                        font-black text-sm md:text-2xl
                        cursor-pointer transition-all duration-200
                        border-[1px]
                        ${getCellStyle(rIndex, cIndex)}
                    `}
                >
                  {letter}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-[#8B5E3C] font-black text-center mb-3 uppercase tracking-wide text-lg md:text-xl drop-shadow-sm">
            Words to Find:
          </h3>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mb-8">
            {WORDS_TO_FIND.map((item, idx) => {
              const isFound = foundWords.includes(item.word);
              return (
                <div
                  key={idx}
                  className={`
                                px-4 py-2 rounded-lg border-2 font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-sm
                                ${
                                  isFound
                                    ? "bg-gradient-to-r from-[#A07048] to-[#764C29] border-[#5a2d0c] text-white"
                                    : "bg-white border-[#8B5E3C] text-[#5a2d0c]"
                                }
                            `}
                >
                  {item.word}
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-2xl px-4">
            {!isGameWon && (
              <button
                onClick={() => {
                  setStartCell(null);
                  setSelectedCells([]);
                  setFeedbackText("");
                  setErrorCells([]);
                }}
                className="w-full bg-gradient-to-b from-[#A07048] to-[#764C29] text-white font-bold py-3 md:py-4 rounded-xl border-2 border-[#5a2d0c] shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm md:text-base uppercase tracking-widest opacity-90"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TsinoWordHunt;