import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgHome from "../assets/bg-home.png";
import Navbar from '../components/Nav';

const questionsData = [
    {
      id: 1,
      sentenceParts: ['Si ', ' ay isang tagapayong heneral na nagbigay-daan sa kanilang pagbabago at itinaguyod niya ang pagsamba sa diyos na si Huitzilopochtli.'],
      error: 'Manco Capac',
      correct: 'Tlacaelel',
    },
    {
      id: 2,
      sentenceParts: ['Noong ', ', tuluyang bumagsak ang lungsod ng Tenochtitlan.'],
      error: '1512',
      correct: '1521',
    },
    {
      id: 3,
      sentenceParts: ['Ang sentro ng mga lungsod ng mga Mayan ay may isang ', ' na ang itaas na bahagi ay may dambana para sa mga diyos.'],
      error: 'mosque',
      correct: 'pyramid',
    },
    {
      id: 4,
      sentenceParts: ['Itinatag ng kabihasnang ', ' ang pamayanan ng Tenochtitlan noong 1325 sa isang maliit na isla sa gitna ng lawa ng Texcoco.'],
      error: 'Inca',
      correct: 'Aztec',
    },
    {
      id: 5,
      sentenceParts: ['Ang mga Aztec ay bumuo ng alyansa sa mga taga lungsod-estado ng ', ' at sinakop ang maliliit na pamayanan sa Gitnang Mexico.'],
      error: 'Polynesia at Micronesia',
      correct: 'Texcoco at Tlacopan',
    },
];

const ItamaMoAko = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isWordClicked, setIsWordClicked] = useState(false);

    const currentQuestion = questionsData[currentIndex];

    const handleWordClick = () => {
        if (isGameFinished) return;
        setIsWordClicked(true);
    };

    const handleSubmit = () => {
        if (!userAnswer.trim() || feedback === 'TAMA!') return;

        const cleanUser = userAnswer.trim().toLowerCase();
        const cleanAnswer = currentQuestion.correct.toLowerCase();

        if (cleanUser === cleanAnswer) {
            handleCorrect();
        } else {
            setFeedback('Mali ang iyong sagot. Subukan muli!');
            setTimeout(() => setFeedback(''), 2000);
        }
    };

    const handleCorrect = () => {
        setFeedback('TAMA!');
        setScore((prev) => prev + 1);

        setTimeout(() => {
            setFeedback('');
            setUserAnswer('');
            setIsWordClicked(false);

            if (currentIndex < questionsData.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setIsGameFinished(true);
            }
        }, 1500);
    };
    
    const renderSentence = () => {
        const parts = currentQuestion.sentenceParts;
        const errorWord = currentQuestion.error;
        
        const wordClass = `font-bold cursor-pointer ${isWordClicked ? 'text-red-500' : 'text-white'}`;

        return (
            <p className="text-white font-bold text-lg md:text-2xl italic leading-relaxed whitespace-pre-line drop-shadow-md">
                "{parts[0]}
                <span onClick={handleWordClick} className={wordClass}>
                    {errorWord}
                </span>
                {parts[1]}"
            </p>
        );
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center font-[var(--font-body)]"
            style={{ backgroundImage: `url(${bgHome})` }}
        >
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen pt-24 md:pt-32">
                <div className="w-full max-w-4xl mx-auto px-4 pb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer"
                    >
                        <span className="mr-2">◀</span> Back
                    </button>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
                            Itama Mo Ako!
                        </h1>
                        <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
                            Pindutin ang salitang mali sa pangungusap at i-type ang tamang sagot.
                        </p>
                    </div>

                    <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 relative flex flex-col items-center">
                        {!isGameFinished ? (
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
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Isulat ang sagot dito..."
                                            className="w-full text-center p-3 border-2 border-[#C8AA86] rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] text-[#5a2d0c]"
                                            disabled={feedback === 'TAMA!'}
                                        />
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full mt-4 bg-[#772402] text-white py-3 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg"
                                            disabled={feedback === 'TAMA!'}
                                        >
                                            Submit Answer
                                        </button>
                                    </div>
                                )}

                                {feedback && (
                                    <div className="mt-4 text-center font-bold text-xl">
                                        <p className={feedback === 'TAMA!' ? 'text-green-600' : 'text-red-600'}>
                                            {feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-[#5a2d0c]">
                                <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                                <p className="text-2xl mb-6">
                                    Your Final Score: <span className="font-extrabold">{score}/{questionsData.length}</span>
                                </p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-xl"
                                >
                                    Finish
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItamaMoAko;
