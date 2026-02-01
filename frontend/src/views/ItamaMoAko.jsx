import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import Navbar from "../components/Nav";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios'; 
import { toast } from 'react-toastify'; 

// --- Sound Effects ---
import correctSfx from "../assets/sfx/correct.mp3";
import incorrectSfx from "../assets/sfx/incorrect.mp3";
import clearedSfx from "../assets/sfx/cleared.mp3";
import hintSfx from "../assets/sfx/hint.mp3"; 

const questionsData = [
  {
    id: 1,
    sentenceParts: [
      "Si ",
      " ay isang tagapayong heneral na nagbigay-daan sa kanilang pagbabago at itinaguyod niya ang pagsamba sa diyos na si Huitzilopochtli.",
    ],
    error: "Manco Capac",
    correct: "Tlacaelel",
  },
  {
    id: 2,
    sentenceParts: [
      "Noong ",
      ", tuluyang bumagsak ang lungsod ng Tenochtitlan.",
    ],
    error: "1512",
    correct: "1521",
  },
  {
    id: 3,
    sentenceParts: [
      "Ang sentro ng mga lungsod ng mga Mayan ay may isang ",
      " na ang itaas na bahagi ay may dambana para sa mga diyos.",
    ],
    error: "mosque",
    correct: "pyramid",
  },
  {
    id: 4,
    sentenceParts: [
      "Itinatag ng kabihasnang ",
      " ang pamayanan ng Tenochtitlan noong 1325 sa isang maliit na isla sa gitna ng lawa ng Texcoco.",
    ],
    error: "Inca",
    correct: "Aztec",
  },
  {
    id: 5,
    sentenceParts: [
      "Ang mga Aztec ay bumuo ng alyansa sa mga taga lungsod-estado ng ",
      " at sinakop ang maliliit na pamayanan sa Gitnang Mexico.",
    ],
    error: "Polynesia at Micronesia",
    correct: "Texcoco at Tlacopan",
  },
];

// 👇 Shared Toast Style
const toastStyle = {
  backgroundColor: "#772402",
  color: "#FDFBF7",
  border: "2px solid #B89336",
  borderRadius: "10px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)"
};

const ItamaMoAko = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isWordClicked, setIsWordClicked] = useState(false);

  // Hints & Reveals States
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const currentQuestion = questionsData[currentIndex];

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  const handleWordClick = () => {
    if (isGameFinished) return;
    setIsWordClicked(true);
  };

  // 👇 Hint Logic
  const getHintText = () => {
    const ans = currentQuestion.correct;
    const chars = ans.split("");
    
    return chars.map((char, index) => {
        if (char === " ") return "  "; 
        
        let shouldReveal = false;
        if (hintLevel >= 1 && index === 0) shouldReveal = true; // First
        if (hintLevel >= 2 && index === chars.length - 1) shouldReveal = true; // Last
        if (hintLevel >= 3 && index === Math.floor(chars.length / 2)) shouldReveal = true; // Middle

        return shouldReveal ? char : "_";
    }).join(" ");
  };

  const handleShowHint = () => {
    if (hintLevel < 3) {
        playSound(hintSfx);
        setHintLevel(prev => prev + 1);
    }
  };

  // 👇 Reveal Button Logic
  const handleForcedReveal = () => {
      playSound(incorrectSfx);
      setUserAnswer(currentQuestion.correct); 
      setFeedback("REVEALED"); 
      
      toast.info(`Ang tamang sagot ay: ${currentQuestion.correct}`, {
        position: "top-center",
        autoClose: 2000,
        style: { ...toastStyle, backgroundColor: "#B89336", color: "#3E2b26" },
        icon: "💡"
      });

      setTimeout(() => {
         moveToNextQuestion();
      }, 2500);
  };

  const handleSubmit = () => {
    // 👇 CHANGED: Removed Skip Logic. 
    // If empty, warn user to enter answer.
    if (!userAnswer.trim()) {
        playSound(incorrectSfx);
        toast.warn("Mangyaring maglagay ng sagot.", {
            position: "top-center",
            autoClose: 2000,
            style: { ...toastStyle, border: "2px solid #B89336" },
            icon: "⚠️"
        });
        return; // Stop here, do not move next
    }

    if (feedback === "TAMA!" || feedback === "REVEALED") return;

    const cleanUser = userAnswer.trim().toLowerCase();
    const cleanAnswer = currentQuestion.correct.toLowerCase();

    if (cleanUser === cleanAnswer) {
      playSound(correctSfx);
      handleCorrect();
    } else {
      playSound(incorrectSfx);
      setWrongAttempts(prev => prev + 1); 

      toast.error("Mali ang iyong sagot. Subukan muli!", {
        position: "top-center",
        autoClose: 2000,
        style: { ...toastStyle, border: "2px solid #ff4444" },
        icon: "❌"
      });
    }
  };

  const handleCorrect = () => {
    setFeedback("TAMA!");
    toast.success("TAMA!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        style: toastStyle,
        icon: "✅"
    });

    setScore((prev) => prev + 1);
    setTimeout(() => {
        moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
      setFeedback("");
      setUserAnswer("");
      setIsWordClicked(false);
      setHintLevel(0);    
      setWrongAttempts(0); 

      if (currentIndex < questionsData.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsGameFinished(true);
      }
  };

  useEffect(() => {
    if (isGameFinished) {
        playSound(clearedSfx);
        const submitScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Mesoamerica",
                    activity_type: "Game",
                    activity_name: "Itama Mo Ako",
                    score: score,
                    max_score: questionsData.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitScore();
    }
  }, [isGameFinished, score]);

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setFeedback("");
    setIsWordClicked(false);
    setHintLevel(0);
    setWrongAttempts(0);
    setIsGameFinished(false);
  };

  const renderSentence = () => {
    const parts = currentQuestion.sentenceParts;
    const errorWord = currentQuestion.error;

    const wordClass = `font-bold cursor-pointer transition-colors duration-300 ${
      isWordClicked 
        ? "text-red-500 underline decoration-wavy" 
        : "text-white hover:text-[#FFDC88]" 
    }`;

    return (
      <p className="text-white font-bold text-lg md:text-2xl italic leading-relaxed whitespace-pre-line drop-shadow-md">
        "{parts[0]}
        <span onClick={handleWordClick} className={wordClass} title="Click the error">
          {errorWord}
        </span>
        {parts[1]}"
      </p>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden relative"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      <Navbar />

      {isGameFinished && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-transparent max-w-lg w-full flex flex-col items-center justify-center">
            
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                <img 
                    src={charImg} 
                    alt="Game Cleared Character" 
                    className="w-40 md:w-56 drop-shadow-2xl animate-bounce-short z-10"
                />
                <div className="text-center md:text-left z-20">
                    <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] leading-tight uppercase tracking-tighter transform -rotate-2">
                        GAME <br/> CLEARED
                    </h1>
                    <p className="text-white font-bold text-xl mt-2 drop-shadow-md">
                        Score: {score} / {questionsData.length}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 mt-2 z-30">
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

      <div className="w-full max-w-4xl mx-auto px-4 pb-10 pt-24 md:pt-32">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            MistakeMaze 
          </h1>
          <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
            Pindutin ang salita sa pangungusap na nagpamali rito at ilagay kung ano ang angkop na kasagutan.
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 relative flex flex-col items-center w-full mx-auto">
          <div className="w-full max-w-2xl">
            <div className="flex flex-col items-center mb-6 text-[#772402] font-bold">
              <span className="text-lg md:text-xl uppercase">
                Question {currentIndex + 1} of {questionsData.length}
              </span>
              <span className="text-sm opacity-80">
                Score: {score}/{questionsData.length}
              </span>
            </div>

            <div className="bg-gradient-to-b from-[#8B5E3C] to-[#5a2d0c] rounded-xl p-6 md:p-10 shadow-inner mb-6 text-center flex flex-col justify-center min-h-[200px]">
              {renderSentence()}
            </div>

            {isWordClicked && (
              <div className="w-full flex flex-col gap-3">
                
                {/* 👇 Hint Text Display */}
                {hintLevel > 0 && (
                     <div className="text-center font-mono tracking-[0.3em] text-[#772402] font-bold text-xl mb-2 animate-fade-in">
                         {getHintText()}
                     </div>
                )}

                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Isulat ang sagot dito..."
                  className="w-full text-center p-3 border-2 border-[#C8AA86] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#5a2d0c] font-bold"
                  disabled={feedback === "TAMA!" || feedback === "REVEALED"}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                
                <div className="flex gap-2">
                    {/* 👇 Submit Button (Always says "Submit Answer" now) */}
                    <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[#772402] text-white py-3 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg"
                    disabled={feedback === "TAMA!" || feedback === "REVEALED"}
                    >
                        Submit Answer
                    </button>

                    {/* 👇 Hint Button */}
                    <button
                    onClick={handleShowHint}
                    disabled={hintLevel >= 3 || feedback !== ""}
                    className="bg-[#C8AA86] text-[#5a2d0c] py-3 px-4 rounded-lg shadow-lg hover:bg-[#b0936f] transition-colors font-bold border-2 border-[#772402]"
                    title="Get a Hint"
                    >
                        {hintLevel >= 3 ? "No Hints Left" : "💡 Hint"}
                    </button>
                </div>

                {/* 👇 Forced Reveal Button (Shows after 3 wrong attempts) */}
                {wrongAttempts >= 3 && feedback === "" && (
                     <button
                        onClick={handleForcedReveal}
                        className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors font-bold text-sm animate-bounce-short"
                     >
                        Reveal Answer (Give Up)
                     </button>
                )}
              </div>
            )}

            {feedback && (
              <div className="mt-4 text-center font-bold text-xl">
                <p className={feedback === "TAMA!" ? "text-green-600" : "text-red-600"}>
                  {feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItamaMoAko;