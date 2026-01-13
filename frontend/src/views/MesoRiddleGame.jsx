import React, { useState, useEffect } from "react"; // 👈 Added useEffect here
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios';

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

const MesoRiddleGame = () => {
  const navigate = useNavigate(); // Initialize hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  

  const currentRiddle = RIDDLES[currentIndex];

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const cleanUser = userAnswer.trim().toUpperCase();
    const cleanAnswer = currentRiddle.answer.toUpperCase();

    if (
      cleanUser === cleanAnswer ||
      (currentRiddle.id === 4 && cleanUser.includes("HANGING GARDEN"))
    ) {
      handleCorrect();
    } else {
      setFeedback("Mali ang iyong sagot. Subukan muli!");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const handleCorrect = () => {
    setFeedback("TAMA!");
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setFeedback("");
      setUserAnswer("");
      setShowHint(false);

      if (currentIndex < RIDDLES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsGameFinished(true);
      }
    }, 1500);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setShowHint(false);
    setIsGameFinished(false);
    setFeedback("");
  };

  const getHintText = () => {
    const ans = currentRiddle.answer;
    const firstChar = ans.charAt(0);
    const hidden = ans
      .slice(1)
      .split("")
      .map((char) => (char === " " ? " " : "_"))
      .join(" ");
    return `${firstChar} ${hidden}`;
  };

  // 👇 This was causing the crash because useEffect wasn't imported
  useEffect(() => {
    if (isGameFinished) {
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
            sagot. Ulitin hanggang mahulaan ang lahat ng bugtong.
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
                className="w-full p-4 rounded-lg border-2 border-[#8B5E3C] text-center font-bold text-[#5a2d0c] text-lg outline-none focus:ring-4 ring-[#C8AA86]/50 placeholder:text-[#8B5E3C]/50 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isGameFinished}
              />

              {feedback && (
                <div
                  className={`text-center font-black text-lg animate-bounce ${
                    feedback.includes("TAMA")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feedback}
                </div>
              )}

              {showHint && (
                <div className="text-center text-[#772402] font-bold animate-pulse">
                  HINT: {getHintText()}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isGameFinished}
                  className="flex-1 bg-[#5a2d0c] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#3E2b26] active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
                <button
                  onClick={() => setShowHint(true)}
                  disabled={isGameFinished}
                  className="flex-1 bg-white text-[#5a2d0c] border-2 border-[#5a2d0c] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-amber-50 active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Show Hint
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesoRiddleGame;