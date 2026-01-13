import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton"; 
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios'; // 👈 Import API

import p1_1 from "../assets/4Pics1Word/1.png";
import p1_2 from "../assets/4Pics1Word/2.png";
import p1_3 from "../assets/4Pics1Word/3.png";
import p1_4 from "../assets/4Pics1Word/4.png";
import p2_1 from "../assets/4Pics1Word/5.png";
import p2_2 from "../assets/4Pics1Word/6.png";
import p2_3 from "../assets/4Pics1Word/7.png";
import p2_4 from "../assets/4Pics1Word/8.png";
import p3_1 from "../assets/4Pics1Word/9.png";
import p3_2 from "../assets/4Pics1Word/10.png";
import p3_3 from "../assets/4Pics1Word/11.png";
import p3_4 from "../assets/4Pics1Word/12.png";
import p4_1 from "../assets/4Pics1Word/13.png";
import p4_2 from "../assets/4Pics1Word/14.png";
import p4_3 from "../assets/4Pics1Word/15.png";
import p4_4 from "../assets/4Pics1Word/16.png";
import p5_1 from "../assets/4Pics1Word/17.png";
import p5_2 from "../assets/4Pics1Word/18.png";
import p5_3 from "../assets/4Pics1Word/19.png";
import p5_4 from "../assets/4Pics1Word/20.png";

const puzzles = [
  {
    images: [p1_1, p1_2, p1_3, p1_4],
    answer: "PYRAMID",
    hint: "A monumental structure with a square or triangular base and sloping sides that meet in a point at the top, especially one built of stone as a royal tomb in ancient Egypt.",
  },
  {
    images: [p2_1, p2_2, p2_3, p2_4],
    answer: "PHARAOH",
    hint: "A ruler in ancient Egypt.",
  },
  {
    images: [p3_1, p3_2, p3_3, p3_4],
    answer: "CLEOPATRA",
    hint: "The last active ruler of the Ptolemaic Kingdom of Egypt.",
  },
  {
    images: [p4_1, p4_2, p4_3, p4_4],
    answer: "ANKH",
    hint: 'An ancient Egyptian hieroglyphic ideograph with the meaning "life".',
  },
  {
    images: [p5_1, p5_2, p5_3, p5_4],
    answer: "OBELISK",
    hint: "A stone pillar, typically having a square or rectangular cross section and a pyramidal top, set up as a monument or landmark.",
  },
];

const FourPicsOneWord = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const navigate = useNavigate();

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim().toUpperCase() === currentPuzzle.answer) {
      const newScore = score + 1;
      setScore(newScore);
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        setInputValue("");
        setShowHint(false);
      } else {
        setIsGameFinished(true);
      }
    } else {
      alert("Wrong answer, try again!");
    }
  };

  // 👇 Submit Score when Game Finished
  useEffect(() => {
    if (isGameFinished) {
        const submitScore = async () => {
            try {
                await API.post('submit-score/', {
                    civilization: "Egypt",
                    activity_type: "Game",
                    activity_name: "4 Pics 1 Word",
                    score: score,
                    max_score: puzzles.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        submitScore();
    }
  }, [isGameFinished, score]);

  const handleReset = () => {
    setCurrentPuzzleIndex(0);
    setScore(0);
    setInputValue("");
    setShowHint(false);
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

      <div className="w-full max-w-4xl mx-auto px-4 pb-10 pt-32 md:pt-40">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            4 Pics 1 Word
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-lg border-4 border-[#7B3306] w-full max-w-lg md:max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
            <h2 className="text-lg sm:text-2xl font-bold text-[#5a2d0c] mb-2 sm:mb-0">
              Puzzle {currentPuzzleIndex + 1}/{puzzles.length}
            </h2>
            <h2 className="text-lg sm:text-2xl font-bold text-[#5a2d0c]">
              Score: {score}/{puzzles.length}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-5">
            {currentPuzzle.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Puzzle clue ${index + 1}`}
                className="rounded-lg shadow-md w-full h-auto"
              />
            ))}
          </div>
          {showHint && (
            <p className="text-sm md:text-base text-center text-[#5a2d0c] mb-5 italic">
              {currentPuzzle.hint}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Isulat ang sagot dito..."
              className="w-full p-3 border-2 border-[#7B3306] rounded-lg mb-5 text-center text-base md:text-lg"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#772402] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#5a2d0c] transition-colors text-base md:text-lg"
              >
                Submit Answer
              </button>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="w-full sm:w-auto border-2 border-[#772402] text-[#772402] font-bold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors text-base md:text-lg"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FourPicsOneWord;