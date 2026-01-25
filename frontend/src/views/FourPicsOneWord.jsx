import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton"; 
import charImg from "../assets/main-home-character-left.png";
import API from '../api/axios'; 
import { toast } from 'react-toastify'; 

// Import Images
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
    hint: "A monumental structure with a square or triangular base...",
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
    answer: "MUMMY",
    hint: 'A preserved body from ancient Egypt.',
  },
  {
    images: [p5_1, p5_2, p5_3, p5_4],
    answer: "HIEROGLYPHICS",
    hint: "A system of writing using symbols and pictures used in ancient Egypt.",
  },
];

// 👇 SHARED TOAST STYLE
const toastStyle = {
  backgroundColor: "#772402", 
  color: "#FDFBF7",           
  border: "2px solid #B89336", 
  borderRadius: "10px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)"
};

const FourPicsOneWord = () => {
  const navigate = useNavigate();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hasUsedReveal, setHasUsedReveal] = useState(false); // 👈 Track usage
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  // Game Logic States
  const [userAnswer, setUserAnswer] = useState([]); 
  const [shuffledLetters, setShuffledLetters] = useState([]); 

  const currentPuzzle = puzzles[currentPuzzleIndex];

  // 1. PRELOAD IMAGES
  useEffect(() => {
    const allImages = puzzles.flatMap(p => p.images);
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 2. Initialize Level
  useEffect(() => {
    if (!currentPuzzle) return;

    setUserAnswer(Array(currentPuzzle.answer.length).fill(null));

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let pool = currentPuzzle.answer.toUpperCase().split("");
    
    while (pool.length < 12) {
      pool.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    const shuffled = pool
      .sort(() => Math.random() - 0.5)
      .map((char, i) => ({ letter: char, id: i, isUsed: false }));

    setShuffledLetters(shuffled);
    setShowHint(false);
    setHasUsedReveal(false); // 👈 Reset reveal usage

  }, [currentPuzzleIndex]);

  // 3. Handle Clicking a Letter from Pool
  const handlePoolClick = (letterObj) => {
    if (letterObj.isUsed) return;
    const firstEmptyIndex = userAnswer.indexOf(null);
    if (firstEmptyIndex !== -1) {
      const newAnswer = [...userAnswer];
      newAnswer[firstEmptyIndex] = letterObj;
      setUserAnswer(newAnswer);
      const newPool = shuffledLetters.map(l => 
        l.id === letterObj.id ? { ...l, isUsed: true } : l
      );
      setShuffledLetters(newPool);
    }
  };

  // 4. Handle Clicking an Answer Slot (Undo)
  const handleSlotClick = (index) => {
    const item = userAnswer[index];
    if (!item) return;
    const newAnswer = [...userAnswer];
    newAnswer[index] = null;
    setUserAnswer(newAnswer);
    const newPool = shuffledLetters.map(l => 
      l.id === item.id ? { ...l, isUsed: false } : l
    );
    setShuffledLetters(newPool);
  };

  // 5. 👇 NEW: Reveal Random Letter Function
  const handleRevealLetter = () => {
    if (hasUsedReveal) return; // Only allow once

    // Find indices that are currently empty
    const emptyIndices = userAnswer
      .map((val, idx) => val === null ? idx : null)
      .filter(val => val !== null);

    if (emptyIndices.length === 0) {
      toast.info("Remove a letter first to make space!", {
        position: "top-center",
        autoClose: 2000,
        style: toastStyle,
      });
      return;
    }

    // Pick a random empty index
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const correctChar = currentPuzzle.answer[randomIndex];

    // Find that char in the pool (must be unused)
    const availableLetterObj = shuffledLetters.find(
      item => item.letter === correctChar && !item.isUsed
    );

    if (availableLetterObj) {
      // Place it
      const newAnswer = [...userAnswer];
      newAnswer[randomIndex] = availableLetterObj;
      setUserAnswer(newAnswer);

      // Mark used in pool
      const newPool = shuffledLetters.map(l =>
        l.id === availableLetterObj.id ? { ...l, isUsed: true } : l
      );
      setShuffledLetters(newPool);

      // Mark hint as used
      setHasUsedReveal(true);
    } else {
      // If the needed letter is already on the board (but in the wrong spot)
      toast.warn("The letter you need is already on the board! Clear some wrong letters.", {
        position: "top-center",
        autoClose: 2000,
        style: toastStyle,
      });
    }
  };

  // 6. Check Answer automatically
  useEffect(() => {
    if (isGameFinished) return;
    
    if (!userAnswer.includes(null) && userAnswer.length > 0) {
      const constructedWord = userAnswer.map(obj => obj.letter).join("");
      
      if (constructedWord === currentPuzzle.answer) {
        setScore(prev => prev + 1);
        toast.success("Correct Answer!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          style: toastStyle,
          icon: "✅"
        });

        setTimeout(() => {
            if (currentPuzzleIndex < puzzles.length - 1) {
                setCurrentPuzzleIndex(prev => prev + 1);
            } else {
                setIsGameFinished(true);
            }
        }, 1000);

      } else {
        toast.error("Incorrect Arrangement!", {
            position: "top-center",
            autoClose: 1500,
            style: { ...toastStyle, border: "2px solid #ff4444" },
            icon: "❌"
        });
      }
    }
  }, [userAnswer, currentPuzzle, currentPuzzleIndex, isGameFinished]);


  // 7. Submit Score
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
  }, [isGameFinished]);

  const handleReset = () => {
    setCurrentPuzzleIndex(0);
    setScore(0);
    setIsGameFinished(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-x-hidden relative font-[var(--font-body)]"
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

      <div className="w-full max-w-4xl mx-auto px-4 pb-10 pt-24 md:pt-32">
        <BackButton className="mb-6 md:ml-20" />

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            PictoWord
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border-4 border-[#7B3306] w-full max-w-lg md:max-w-xl mx-auto">
          
          <div className="flex justify-between items-center mb-4 text-[#5a2d0c] font-bold text-sm md:text-lg">
            <span>Puzzle {currentPuzzleIndex + 1}/{puzzles.length}</span>
            <span>Score: {score}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {currentPuzzle.images.map((img, index) => (
              <div key={index} className="aspect-square w-full h-full overflow-hidden rounded-lg shadow-md border-2 border-[#C8AA86]">
                <img
                  src={img}
                  alt={`Puzzle clue ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {userAnswer.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`w-10 h-10 md:w-12 md:h-12 border-4 rounded-md font-black text-xl md:text-2xl flex items-center justify-center shadow-inner transition-all ${
                  item 
                    ? "bg-[#772402] text-white border-[#5a2d0c] scale-105" 
                    : "bg-[#FDFBF7] border-[#7B3306]"
                }`}
              >
                {item ? item.letter : ""}
              </button>
            ))}
          </div>

          {/* 👇 HINT ACTION AREA */}
          <div className="flex justify-between items-center mb-6 min-h-[24px] px-2 md:px-6">
             {/* Text Hint Toggle */}
             <div>
                {showHint ? (
                    <p className="text-sm md:text-base font-bold text-[#772402] italic animate-fade-in text-left">
                    💡 {currentPuzzle.hint}
                    </p>
                ) : (
                <button 
                    onClick={() => setShowHint(true)}
                    className="text-xs md:text-sm text-[#772402]/80 underline hover:text-[#772402] font-bold"
                >
                    Show Meaning Hint
                </button>
                )}
             </div>

             {/* Reveal Letter Button */}
             <button
                onClick={handleRevealLetter}
                disabled={hasUsedReveal}
                className={`text-xs md:text-sm font-bold py-1 px-3 rounded-full border-2 transition-colors ${
                    hasUsedReveal 
                        ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                        : "bg-[#C8AA86] border-[#772402] text-[#772402] hover:bg-[#b08d55] hover:text-white"
                }`}
             >
                {hasUsedReveal ? "Letter Used" : "Reveal Letter"}
             </button>
          </div>

          {/* Keyboard / Letter Pool */}
          <div className="grid grid-cols-6 gap-2 md:gap-3">
            {shuffledLetters.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePoolClick(item)}
                disabled={item.isUsed}
                className={`aspect-square rounded-lg font-black text-lg md:text-xl shadow-md border-b-4 border-r-4 transition-all active:scale-95 ${
                  item.isUsed
                    ? "bg-gray-300 text-gray-400 border-gray-400 cursor-default opacity-50"
                    : "bg-[#C8AA86] text-[#5a2d0c] border-[#964B1D] hover:bg-[#b08d55]"
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FourPicsOneWord;