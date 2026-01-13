import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton"; 
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios'; // 👈 Import API

const questions = [
  {
    question:
      "Pinunong nagpasimula ng pag-iisang China at nagdeklara bilang “Unang Emperador.”",
    options: ["Shi Huangdi", "Liu Bang", "Wudi"],
    answer: "Shi Huangdi",
  },
  {
    question:
      "Pangunahing relihiyong umusbong sa dinastiyang Tang at tinangkilik ng dugong bughaw.",
    options: ["Legalism", "Confucianism", "Buddhism"],
    answer: "Buddhism",
  },
  {
    question:
      "Dinastiyang kilala sa pag-imbento ng papel at pagsisimula ng sistematikong pag-aaral.",
    options: ["Shang Dynasty", "Han Dynasty", "Zhou Dynasty"],
    answer: "Han Dynasty",
  },
  {
    question:
      "Ito ang kanal na nag-uugnay sa Huang Ho at Yangtze na ginawa sa panahon ng Sui Dynasty.",
    options: ["Dragon River Canal", "Imperial Canal", "Grand Canal"],
    answer: "Grand Canal",
  },
  {
    question:
      "Pilosopiyang Tsino na nagsasabing ang tao ay likas na makasarili ngunit maaaring mapasunod sa pamamagitan ng mahigpit na batas.",
    options: ["Legalism", "Taoism", "Confucianism"],
    answer: "Legalism",
  },
];

const GameOfElimination = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (eliminatedOptions.length < 2) {
      setEliminatedOptions([...eliminatedOptions, option]);
    }
  };

  const handleNextQuestion = () => {
    const finalAnswer = currentQuestion.options.find(
      (opt) => !eliminatedOptions.includes(opt)
    );
    if (finalAnswer === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEliminatedOptions([]);
    } else {
      setIsGameFinished(true);
    }
  };

  // 👇 Submit Score when Game Finished
  useEffect(() => {
    if (isGameFinished) {
        const submitScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Tsino",
                    activity_type: "Game",
                    activity_name: "Game of Elimination",
                    score: score,
                    max_score: questions.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitScore();
    }
  }, [isGameFinished, score]);

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setEliminatedOptions([]);
    setScore(0);
    setIsGameFinished(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-x-hidden relative"
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
                    Score: {score} / {questions.length}
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

      <div className="w-full max-w-4xl mx-auto px-4 pb-10 pt-24 md:pt-32">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            Game of Elimination
          </h1>
          <p className="text-[#964B1D] font-bold text-sm md:text-lg max-w-3xl mx-auto leading-relaxed px-4">
            Click an option to cross it out, the last remaining unclicked is the
            final answer of the user.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border-4 border-[#7B3306] w-full max-w-2xl mx-auto">
          <p className="text-center text-xl md:text-2xl font-bold text-[#5a2d0c] mb-6">
            {currentQuestion.question}
          </p>
          <div className="flex flex-col items-center space-y-3 md:space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={eliminatedOptions.includes(option)}
                className={`w-full max-w-md text-center p-3 md:p-4 font-bold text-base md:text-xl rounded-lg transition-all duration-200
                  ${
                    eliminatedOptions.includes(option)
                      ? "bg-red-300 text-gray-500 line-through"
                      : "bg-white hover:bg-amber-100 text-[#5a2d0c] shadow-md"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
          {eliminatedOptions.length === 2 && (
            <div className="text-center mt-8">
              <button
                onClick={handleNextQuestion}
                className="bg-[#772402] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors text-lg md:text-xl"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOfElimination;