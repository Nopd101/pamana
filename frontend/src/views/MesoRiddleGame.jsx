import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";

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
  const navigate = useNavigate();

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

  return (
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

      <div className="max-w-4xl mx-auto px-4 pb-10 mt-15">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer"
        >
          <span className="mr-2">◀</span> Back
        </button>

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
          {!isGameFinished ? (
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
                    className="flex-1 bg-[#5a2d0c] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#3E2b26] active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex-1 bg-white text-[#5a2d0c] border-2 border-[#5a2d0c] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-amber-50 active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Show Hint
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-4xl font-black text-[#5a2d0c] mb-4">
                BINABATI KITA!
              </h2>
              <p className="text-[#8B5E3C] text-xl font-bold mb-8">
                Nasagot mo nang tama ang lahat ng bugtong!
              </p>
              <div className="text-6xl mb-8">NICE!</div>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-[#8B5E3C] to-[#6F482D] text-white font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-[#5a2d0c] text-lg"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesoRiddleGame;
