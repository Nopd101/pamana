import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import BackButton from "../components/BackButton";
import charImg from "../assets/main-home-character-left.png";

import img1 from "../assets/mindflip/1.png";
import img2 from "../assets/mindflip/2.png";
import img3 from "../assets/mindflip/3.png";
import img4 from "../assets/mindflip/4.png";
import img5 from "../assets/mindflip/5.png";
import img6 from "../assets/mindflip/6.png";

const UNIQUE_CARDS = [
  { id: 1, src: img1 },
  { id: 2, src: img2 },
  { id: 3, src: img3 },
  { id: 4, src: img4 },
  { id: 5, src: img5 },
  { id: 6, src: img6 },
];

const Card = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div
      className="relative w-full aspect-square cursor-pointer group perspective-1000"
      onClick={handleClick}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className="absolute inset-0 backface-hidden w-full h-full bg-gradient-to-br from-[#8B5E3C] to-[#5a2d0c] rounded-xl border-2 border-[#C8AA86]/50 shadow-inner flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-white font-black text-4xl md:text-6xl drop-shadow-md">
            ?
          </span>
        </div>

        <div
          className="absolute inset-0 backface-hidden w-full h-full bg-[#FDFBF7] rounded-xl border-4 border-[#8B5E3C] overflow-hidden rotate-y-180 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <img
            src={card.src}
            alt="memory card"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const MesoMemoryGame = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(() => {
    return [...UNIQUE_CARDS, ...UNIQUE_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() }));
  });

  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [peekTimer, setPeekTimer] = useState(10);
  const isPeekPhase = peekTimer > 0;
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  const disabled = isPeekPhase || (choiceOne && choiceTwo);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
  };

  const shuffleCards = () => {
    const shuffledCards = [...UNIQUE_CARDS, ...UNIQUE_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() }));

    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setMatches(0);
    setPeekTimer(10);
  };

  const handleChoice = (card) => {
    if (disabled) return;
    if (choiceOne && card.uniqueId === choiceOne.uniqueId) return;

    if (!choiceOne) {
      setChoiceOne(card);
      return;
    }

    setChoiceTwo(card);

    if (choiceOne.src === card.src) {
      setCards((prev) =>
        prev.map((c) => (c.src === card.src ? { ...c, matched: true } : c))
      );
      setMatches((prev) => prev + 1);
      setTimeout(resetTurn, 500);
    } else {
      setTimeout(resetTurn, 1000);
    }
  };

  useEffect(() => {
    if (peekTimer <= 0) return;
    const timer = setTimeout(() => {
      setPeekTimer((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [peekTimer]);

  return (
    <div
      className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-x-hidden relative"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      {!isPeekPhase && matches === 6 && (
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
                onClick={shuffleCards}
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
            MindFlip
          </h1>
          <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-2xl mx-auto leading-relaxed px-4">
            Obserbahan ang anim (6) na pares ng larawan sa loob ng sampung (10)
            segundo. Pagkatapos ng oras, babaliktarin ang lahat ng cards. Pumili
            ng dalawang cards sa bawat turn upang tukuyin kung alin ang
            magkapareha.
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-4 md:p-8 border-4 border-[#C8AA86]/50 relative max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6 px-4 md:px-12 text-[#772402] font-black uppercase text-sm md:text-xl">
            <div className="text-center">
              <p>Moves</p>
              <p className="text-2xl md:text-3xl">{turns}</p>
            </div>

            {isPeekPhase && (
              <div className="text-center animate-pulse text-red-600">
                <p className="text-xs">Memorize in</p>
                <p className="text-3xl md:text-4xl">{peekTimer}</p>
              </div>
            )}

            <div className="text-center">
              <p>Matches</p>
              <p className="text-2xl md:text-3xl">{matches}/6</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {cards.map((card) => (
              <Card
                key={card.uniqueId}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  isPeekPhase ||
                  card === choiceOne ||
                  card === choiceTwo ||
                  card.matched
                }
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesoMemoryGame;
