import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios';
import { toast } from 'react-toastify'; 

// --- Sound Effects ---
import correctSfx from "../assets/sfx/correct.mp3";
import incorrectSfx from "../assets/sfx/incorrect.mp3";
import clearedSfx from "../assets/sfx/cleared.mp3";

const RIDDLES = [
  {
    id: 1,
    text: "Matangkad ako't tila hagdang-paraiso,\nDito nagdarasal at handog ay ibinubos.\nSa Sumer ako'y tahanan ng pananampalataya,\nSino ako sa sinaunang sibilisasyon na ito kaya?",
    answer: "ZIGGURAT",
  },
  {
    id: 2,
    text: "Sumerian ang gumamit sa akin noon\nHugis-sinsel sa luwad ang aking anyo,\nDito nakatala ang kasaysayan at batas ng bayan ko.",
    answer: "CUNEIFORM",
  },
  {
    id: 3,
    text: "282 ang bilang ko, batas na malinaw at totoo,\nGinawa ni Hammurabi para sa Babylon na dakila at buo.\nAko'y gabay sa mamamayan noon,\nSino ako sa sinaunang imperyong iyon?",
    answer: "CODE OF HAMMURABI",
  },
  {
    id: 4,
    text: "Itinayo para sa minamahal, taas ay kahanga-hanga,\nBulaklak at halaman, tanawin ay sariwa't kamangha-mangha.",
    answer: "HANGING GARDENS OF BABYLON",
  },
  {
    id: 5,
    text: "Ako ang nagtatag at humakbang sa tagumpay,\nMedes at Chaldean sa aking kamay ay napailalim at pinamunuan ng tunay.",
    answer: "CYRUS THE GREAT",
  },
];

const toastStyle = {
  backgroundColor: "#772402",
  color: "#FDFBF7",           
  border: "2px solid #B89336",
  borderRadius: "10px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)"
};

const MesoRiddleGame = () => {
  const navigate = useNavigate(); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  
  const [hintLevel, setHintLevel] = useState(0); 
  
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  const currentRiddle = RIDDLES[currentIndex];

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.5; 
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  const handleMainButtonClick = () => {
    if (isAnswerRevealed) {
        proceedToNext();
        return;
    }

   
    if (hintLevel >= 3 && userAnswer.trim() === "") {
        handleReveal();
        return;
    }

    handleSubmitAnswer();
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
        toast.warn("Mangyaring maglagay ng sagot.", {
            position: "top-center",
            autoClose: 2000,
            style: { ...toastStyle, border: "2px solid #B89336" }
        });
        return;
    }

    const cleanUser = userAnswer.trim().toUpperCase();
    const cleanAnswer = currentRiddle.answer.toUpperCase();

    if (
      cleanUser === cleanAnswer ||
      (currentRiddle.id === 4 && cleanUser.includes("HANGING GARDEN"))
    ) {
      handleCorrect();
    } else {
      playSound(incorrectSfx);
      toast.error("Mali ang iyong sagot. Subukan muli o gamitin ang hints!", {
        position: "top-center",
        autoClose: 2000,
        style: { ...toastStyle, border: "2px solid #ff4444" },
        icon: "❌"
      });
    }
  };

  const handleReveal = () => {
    playSound(incorrectSfx);
    setUserAnswer(currentRiddle.answer); 
    setIsAnswerRevealed(true); 
    
    toast.info(`Ang tamang sagot ay: ${currentRiddle.answer}`, {
        position: "top-center",
        autoClose: false,
        style: { ...toastStyle, backgroundColor: "#B89336", color: "#3E2b26" },
        icon: "💡"
    });
  };

  const handleCorrect = () => {
    playSound(correctSfx);
    toast.success("TAMA!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        style: toastStyle,
        icon: "✅"
    });
    setScore((prev) => prev + 1);
    
    setTimeout(() => {
        proceedToNext();
    }, 1500);
  };

  const proceedToNext = () => {
    setUserAnswer("");
    setHintLevel(0);
    setIsAnswerRevealed(false);

    if (currentIndex < RIDDLES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setHintLevel(0);
    setIsAnswerRevealed(false);
    setIsGameFinished(false);
  };

  const handleShowHint = () => {
    if (hintLevel < 3) {
        setHintLevel(prev => prev + 1);
    }
  };

  const getHintText = () => {
    const ans = currentRiddle.answer;
    const chars = ans.split("");
    
    return chars.map((char, index) => {
        if (char === " ") return " "; 
        
        let shouldReveal = false;
        if (hintLevel >= 1 && index === 0) shouldReveal = true; 
        if (hintLevel >= 2 && index === chars.length - 1) shouldReveal = true; 
        if (hintLevel >= 3 && index === Math.floor(chars.length / 2)) shouldReveal = true; 

        return shouldReveal ? char : "_";
    }).join(" ");
  };

  useEffect(() => {
    if (isGameFinished) {
        playSound(clearedSfx);
        const submitRiddleScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Mesopotamia",
                    activity_type: "Game",
                    activity_name: "BrainTease",
                    score: score,
                    max_score: RIDDLES.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitRiddleScore();
    }
  }, [isGameFinished, score]);

  const getMainButtonText = () => {
      if (isAnswerRevealed) return "Next Question ➡";
      if (hintLevel >= 3 && userAnswer.trim() === "") return "Reveal Answer 💡";
      
      return "Submit Answer";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden relative"
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
                GAME <br /> CLEARED
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

      <div className="max-w-4xl mx-auto px-4 pb-10 mt-25">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            BrainTease
          </h1>
          <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
            Basahin ng mabuti ang bawat bugtong. Ilagay sa patlang ang iyong
            sagot.
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 relative flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="flex flex-col items-center mb-6 text-[#772402] font-bold">
              <span className="text-lg md:text-xl uppercase">
                Question {currentIndex + 1} of {RIDDLES.length}
              </span>
              <span className="text-sm opacity-80">
                Score: {score}/{RIDDLES.length}
              </span>
            </div>

            <div className="bg-gradient-to-b from-[#8B5E3C] to-[#5a2d0c] rounded-xl p-6 md:p-10 shadow-inner mb-6 text-center flex flex-col justify-center min-h-[200px]">
              <p className="text-white font-bold text-lg md:text-2xl italic leading-relaxed whitespace-pre-line drop-shadow-md">
                "{currentRiddle.text}"
              </p>
            </div>

            <div className="w-full space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Isulat ang sagot dito..."
                className={`w-full p-4 rounded-lg border-2 text-center font-bold text-lg outline-none focus:ring-4 transition-all
                    ${isAnswerRevealed 
                        ? "bg-amber-100 border-[#B89336] text-[#772402]" // Style when revealed
                        : "border-[#8B5E3C] text-[#5a2d0c] ring-[#C8AA86]/50 placeholder:text-[#8B5E3C]/50" 
                    }`}
                onKeyDown={(e) => e.key === "Enter" && handleMainButtonClick()}
                disabled={isGameFinished || isAnswerRevealed} // Lock input when revealed
              />

              {hintLevel > 0 && (
                <div className="text-center text-[#772402] font-bold animate-pulse text-lg tracking-widest">
                  HINT: {getHintText()}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  onClick={handleMainButtonClick}
                  disabled={isGameFinished}
                  className={`flex-1 font-bold py-3 px-6 rounded-lg shadow-md transition-all uppercase tracking-wider disabled:opacity-50
                    ${isAnswerRevealed 
                        ? "bg-[#B89336] text-[#3E2b26] hover:bg-[#a37f2e]" // Next Question Style
                        : (hintLevel >= 3 && userAnswer.trim() === "")
                            ? "bg-[#8B5E3C] text-white hover:bg-[#724a2f]" // Reveal Style
                            : "bg-[#5a2d0c] text-white hover:bg-[#3E2b26]" // Submit Style
                    }`}
                >
                  {getMainButtonText()}
                </button>

                {!isAnswerRevealed && (
                    <button
                      onClick={handleShowHint}
                      disabled={isGameFinished || hintLevel >= 3}
                      className="flex-1 bg-white text-[#5a2d0c] border-2 border-[#5a2d0c] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-amber-50 active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {hintLevel === 0 ? "Show Hint (1/3)" : hintLevel === 1 ? "Next Hint (2/3)" : hintLevel === 2 ? "Last Hint (3/3)" : "No More Hints"}
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesoRiddleGame;