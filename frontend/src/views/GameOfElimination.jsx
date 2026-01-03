import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgHome from '../assets/bg-home.png';

const questions = [
  {
    question: 'Pinunong nagpasimula ng pag-iisang China at nagdeklara bilang “Unang Emperador.”',
    options: ['Shi Huangdi', 'Liu Bang', 'Wudi'],
    answer: 'Shi Huangdi',
  },
  {
    question: 'Pangunahing relihiyong umusbong sa dinastiyang Tang at tinangkilik ng dugong bughaw.',
    options: ['Legalism', 'Confucianism', 'Buddhism'],
    answer: 'Buddhism',
  },
  {
    question: 'Dinastiyang kilala sa pag-imbento ng papel at pagsisimula ng sistematikong pag-aaral.',
    options: ['Shang Dynasty', 'Han Dynasty', 'Zhou Dynasty'],
    answer: 'Han Dynasty',
  },
  {
    question: 'Ito ang kanal na nag-uugnay sa Huang Ho at Yangtze na ginawa sa panahon ng Sui Dynasty.',
    options: ['Dragon River Canal', 'Imperial Canal', 'Grand Canal'],
    answer: 'Grand Canal',
  },
  {
    question: 'Pilosopiyang Tsino na nagsasabing ang tao ay likas na makasarili ngunit maaaring mapasunod sa pamamagitan ng mahigpit na batas.',
    options: ['Legalism', 'Taoism', 'Confucianism'],
    answer: 'Legalism',
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
    const finalAnswer = currentQuestion.options.find(opt => !eliminatedOptions.includes(opt));
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

  if (isGameFinished) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md md:max-w-lg w-full">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#5a2d0c]">Congratulations!</h2>
          <p className="text-xl md:text-3xl mb-6 md:mb-8 text-[#5a2d0c]">
            Your Final Score: <span className="font-extrabold">{score}/{questions.length}</span>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#772402] text-white py-3 px-8 md:px-12 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg md:text-2xl"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
      <div className="w-full max-w-2xl mx-auto px-4 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-lg md:text-xl cursor-pointer"
        >
          <span className="mr-2">◀</span> Back
        </button>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            Game of Elimination
          </h1>
          <p className="text-[#964B1D] font-bold text-sm md:text-lg max-w-3xl mx-auto leading-relaxed px-4">
            Click an option to cross it out, the last remaining unclicked is the final answer of the user.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border-4 border-[#7B3306] w-full mx-auto">
          <p className="text-center text-xl md:text-2xl font-bold text-[#5a2d0c] mb-6">{currentQuestion.question}</p>
          <div className="flex flex-col items-center space-y-3 md:space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={eliminatedOptions.includes(option)}
                className={`w-full max-w-md text-center p-3 md:p-4 font-bold text-base md:text-xl rounded-lg transition-all duration-200
                  ${eliminatedOptions.includes(option)
                    ? 'bg-red-300 text-gray-500 line-through'
                    : 'bg-white hover:bg-amber-100 text-[#5a2d0c] shadow-md'
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
