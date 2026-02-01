import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 👈 Added useLocation
import Navbar from '../components/Nav';
import bgHome from '../assets/bg-home.png';
import API from '../api/axios';
import { CheckCircle2, XCircle, Clock } from 'lucide-react'; // 👈 Added Icons

// 👇 Import SFX
import renameTabSfx from '../assets/sfx/rename_tab.mp3';
import correctSfx from '../assets/sfx/correct.mp3';
import incorrectSfx from '../assets/sfx/incorrect.mp3';
import clearedSfx from '../assets/sfx/cleared.mp3';

const questions = [
    {
        question: "Anong estrukturang ipinatayo ni Nebuchadnezzar II upang maibsan ang pangungulila ng kaniyang asawa sa kanilang tahanang lupain at kinilalang isa sa Sinaunang Seven Wonders?",
        options: ["Ishtar Gate", "Ziggurat of Ur", "Hanging Gardens", "Temple of Marduk"],
        answer: "Hanging Gardens"
    },
    {
        question: "Alin sa mga sumusunod ang tumutukoy sa sistema ng pagsulat na umunlad sa kabihasnang Egyptian?",
        options: ["Cuneiform", "Pictogram", "Hieroglyphics", "Calligraphy"],
        answer: "Hieroglyphics"
    },
    {
        question: "Alin sa mga grupong ito ang itinuturing na mga unang nanirahan sa India?",
        options: ["Aryan", "Dravidian", "Mongol", "Persian"],
        answer: "Dravidian"
    },
    {
        question: "Alin sa mga sumusunod ang pangunahing dahilan ng paglalagay o pagtatayo ng mga pyramid sa Egypt?",
        options: ["Tirahan ng mga mamamayan", "Pagsamba sa mga diyos", "Libingan ng mga pharaoh", "Sentro ng kalakalan"],
        answer: "Libingan ng mga pharaoh"
    },
    {
        question: "Alin sa mga sumusunod ang imperyong unang nagtagumpay sa pag-iisa ng iba’t ibang lungsod estado sa Mesopotamia sa pamumuno ni Sargon I?",
        options: ["Sumer", "Babylonia", "Akkad", "Assyria"],
        answer: "Akkad"
    },
    {
        question: "Ano ang katangian ng isang taong tinatawag na “Arya” sa Sanskrit?",
        options: ["Matalino", "Marangal", "Mandirigma", "Pari"],
        answer: "Marangal"
    },
    {
        question: "Saang rehiyon unang nabuo at umunlad ang kabihasnang Maya?",
        options: ["Nile Delta", "Andes Mountains", "Yucatan Peninsula", "Valley of Mexico"],
        answer: "Yucatan Peninsula"
    },
    {
        question: "Aling diyos ang kinikilala ng mga Aztec bilang diyos ng araw?",
        options: ["Kukulcan", "Inti", "Huitzilopochtli", "Quetzalcoatl"],
        answer: "Huitzilopochtli"
    },
    {
        question: "Batay sa pagsusuri ng iba’t ibang posibleng dahilan, alin sa mga sumusunod ang nagsasaad ng pinakanaaangkop na historikal na paliwanag sa pagbagsak ng Kabihasnang Indus?",
        options: ["Paglusob ng Aryan", "Pagbagsak ng ekonomiya", "Likas na kalamidad", "Pagkamatay ng hari"],
        answer: "Paglusob ng Aryan"
    },
    {
        question: "Ayon sa pagsusuri ng kanilang paniniwala at tradisyon, ano ang papel ng Vedas sa paghubog ng lipunang Aryan?",
        options: ["Naging batayan ng sistemang caste", "Nagdulot ng digmaan", "Pinag-isa ang mga Dravidian", "Nagpatibay ng kalakalan"],
        answer: "Naging batayan ng sistemang caste"
    },
    {
        question: "Paano naimpluwensyahan ng pananakop ng mga Hyksos ang kabihasnang Egyptian, partikular sa kanilang teknolohikal, militar, at kultural na aspeto?",
        options: ["Natutunan nila ang paggamit ng chariot", "Nawala ang hieroglyphics", "Nabuo ang bagong relihiyon", "Naging demokratiko ang pamahalaan"],
        answer: "Natutunan nila ang paggamit ng chariot"
    },
    {
        question: "Kung susuriin ang lokasyon at pamumuhay ng mga naunang tao rito, bakit itinuring ang Mesopotamia bilang 'lunduyan ng kabihasnan'?",
        options: ["Dahil lumaganap dito ang pinakamalalaking relihiyon", "Dahil nagkaroon ito ng sistematikong pamahalaan at sentrong lungsod", "Dahil ito ang unang nagtatag ng malawak na imperyo sa Asya", "Dahil ito ang naging pangunahing ruta ng mga manlalakbay"],
        answer: "Dahil nagkaroon ito ng sistematikong pamahalaan at sentrong lungsod"
    },
    {
        question: "Ano ang nagpapakita ng estratehikong pamamahala na nagbigay tagumpay sa mga Persiano sa pagpapalawak ng imperyo?",
        options: ["Pagtatalaga ng satrap na nagpapalakas ng pamamahala sa mga lalawigan", "Pagpapalawak ng lupain upang makakuha ng mas maraming likas na yaman", "Mahigpit na pagpapatupad ng kaparusahan sa sinumang sumuway sa hari", "Pagpapalaganap ng iisang relihiyon upang mapag-isa ang mamamayan"],
        answer: "Pagtatalaga ng satrap na nagpapalakas ng pamamahala sa mga lalawigan"
    },
    {
        question: "Ano ang pangunahing dahilan kung bakit naging estratehikong lokasyon ang Tenochtitlan sa lawa ng Texcoco?",
        options: ["Madaling tumakas ang mga mamamayan", "May matabang lupa para sa agrikultura", "Malayo ito sa kalakalan", "Madali itong sakupin"],
        answer: "May matabang lupa para sa agrikultura"
    },
    {
        question: "Kung gagawa ka ng isang makabagong modelo ng lipunan na hango sa konsepto ng caste ngunit walang diskriminasyon, alin sa mga sumusunod ang pinakaangkop na paraan upang ito’y maisabuhay?",
        options: ["Sa pagbibigay ng mas mataas na pribilehiyo sa mga Brahmin", "Sa pagpapanatili ng tradisyonal na paghihiwalay ng mga uri", "Sa paglikha ng programang pantay sa edukasyon at oportunidad", "Sa pagtatakda ng bagong antas batay sa yaman at kapangyarihan"],
        answer: "Sa paglikha ng programang pantay sa edukasyon at oportunidad"
    },
    {
        question: "Sa pag-aaral ng pamahalaang Han, ano ang naging epekto ng pilosopiyang Confucianism sa kanilang pamamalakad?",
        options: ["Nagpatibay ng batas militar", "Nagpalaganap ng digmaan", "Pagpasimula ng reporma sa agrikultura", "Nagpahalaga sa moralidad at edukasyon"],
        answer: "Nagpahalaga sa moralidad at edukasyon"
    },
    {
        question: "Sa pagdating ng mga Espanyol, aling bahagi ng kabihasnang Mesoamerican ang nakaranas ng pinakamatinding pagbabago?",
        options: ["Ang sistemang panlipunan ng mga mandirigmang Aztec", "Ang paggamit ng wikang katutubo sa araw-araw", "Ang ugnayang panrelihiyon at kapangyarihang pampolitika", "Ang paraan ng pagsasaka at pangangalakal lamang"],
        answer: "Ang ugnayang panrelihiyon at kapangyarihang pampolitika"
    },
    {
        question: "Batay sa kanilang mga imbensyon at kasanayang teknikal, paano ipinakita ng Dinastiyang Shang ang kanilang kabihasnang teknolohikal?",
        options: ["Pagtatatag ng kalendaryo", "Pagpapalaganap ng Buddhism", "Pagpapagawa ng pyramid", "Paggamit ng bronse at oracle bones"],
        answer: "Paggamit ng bronse at oracle bones"
    },
    {
        question: "Kung pagsasamahin ang lakas ng Akkadian at Assyrian sa isang modernong bansa, anong katangian ang dapat nilang paunlarin upang maging epektibong estado?",
        options: ["Pagbuo ng hukbong mabilis tumugon sa panganib at may malinaw na pamamahala", "Pagtutok sa paglikha ng batas na may iisang pinagmulan", "Pagpapalaganap ng kulturang pangkalakalan bago magpalakas ng military", "Pagtatalaga ng mga pinuno batay lamang sa kanilang relihiyon"],
        answer: "Pagbuo ng hukbong mabilis tumugon sa panganib at may malinaw na pamamahala"
    },
    {
        question: "Kung muling itatatag ang mga sinaunang kabihasnang Mesoamerican ngayon, aling aspeto ang mas makatutulong upang sila ay umunlad?",
        options: ["Pagbabalik sa paniniwala sa maraming diyos", "Sistemang agrikultural at kalakalan", "Relihiyong nakabatay sa pagsasakripisyo", "Pagtitiwala sa mga panlabas na mananakop"],
        answer: "Sistemang agrikultural at kalakalan"
    }
];

const PostTest = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 👈 Added: To get Teacher Data

    // --- REVIEW MODE DATA ---
    const isReviewMode = location.state?.reviewMode || false;
    const studentAnswersReview = location.state?.studentAnswers || {};
    const reviewStudentName = location.state?.studentName || "Student";
    const reviewScore = location.state?.score || 0;
    const reviewTotal = location.state?.total || questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timeUp, setTimeUp] = useState(false);
    
    // 👇 NEW: State to store answers during the test
    const [userAnswers, setUserAnswers] = useState({});

    const timerRef = React.useRef(null);
    
    // 👇 AUDIO SETUP
    const playSound = (soundFile) => {
        if (isReviewMode) return; // Mute in review mode
        const audio = new Audio(soundFile);
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio play failed:", e));
    };

   const handleNextQuestion = (answerClicked) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answerClicked);
        
        // 👇 Save Answer using Current Index
        setUserAnswers(prev => ({ ...prev, [currentIndex]: answerClicked }));

        const isCorrect = answerClicked === questions[currentIndex].answer;

        if (isCorrect) {
            playSound(correctSfx);
        } else {
            playSound(incorrectSfx);
        }

        setTimeout(() => {
            if (isCorrect) {
                setScore(prev => prev + 1);
            }

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                setIsGameFinished(true);
            }
        }, 1000);
    };
    
    const handleTimeout = () => {
        setTimeUp(true);
        playSound(incorrectSfx);
        
        // Save as Unanswered/TimeUp
        setUserAnswers(prev => ({ ...prev, [currentIndex]: "NO_ANSWER" }));

        setSelectedAnswer("TIME_UP");

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null); 
                setTimeUp(false); 
            } else {
                setIsGameFinished(true);
            }
        }, 1000);
    };

    // --- TIMER LOGIC (Disable in Review) ---
    useEffect(() => {
        if (isReviewMode) return; // 👈 Stop timer in review

        setTimer(60); 
        if (timerRef.current) clearInterval(timerRef.current);

        if (!isGameFinished) {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        if (!selectedAnswer) {
                            handleTimeout();
                        }
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [currentIndex, isGameFinished, selectedAnswer, isReviewMode]);

    // --- SUBMISSION LOGIC ---
    useEffect(() => {
        if (isGameFinished && !isReviewMode) { // 👈 Only submit if NOT review
            const submitPostTestScore = async () => {
                try {
                    await API.post('submit-score/', {
                        civilization: "General",
                        activity_type: "Quiz",
                        activity_name: "Post-Test",
                        score: score,
                        max_score: questions.length,
                        details: userAnswers // 👈 CRITICAL: Sending answers to DB
                    });
                    console.log("Post-Test score submitted.");
                } catch (error) {
                    console.error("Error submitting score:", error);
                }
            };
            submitPostTestScore();
        }
    }, [isGameFinished, score, userAnswers, isReviewMode]);

    // ============================================
    // 👇 REVIEW MODE RENDER (TEACHER VIEW)
    // ============================================
    if (isReviewMode) {
        return (
            <div className="min-h-screen bg-cover bg-center font-[var(--font-body)] overflow-y-auto" style={{ backgroundImage: `url(${bgHome})` }}>
                <div className="max-w-4xl mx-auto px-4 py-10 pt-24">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-[#5a2d0c] font-bold mb-6 hover:underline bg-white/80 px-4 py-2 rounded-lg w-fit"
                    >
                        ◀ Back to Report
                    </button>

                    <div className="bg-[#FDFBF7]/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-[#C8AA86]/50">
                        <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-[#C8AA86]/30 pb-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-[#772402] uppercase">Post-Test Review</h1>
                                <p className="text-[#964B1D] font-bold text-lg">Student: {reviewStudentName}</p>
                            </div>
                            <div className="bg-[#772402] text-white px-6 py-3 rounded-xl shadow-lg mt-4 md:mt-0 text-center">
                                <p className="text-xs uppercase opacity-80 font-bold">Final Score</p>
                                <p className="text-3xl font-black">{reviewScore} / {reviewTotal}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {questions.map((q, idx) => {
                                const studentAns = studentAnswersReview[idx]; // Access by index
                                const isCorrect = studentAns === q.answer;
                                const isMissed = !studentAns || studentAns === "NO_ANSWER";

                                return (
                                    <div key={idx} className={`border-2 rounded-xl p-6 shadow-sm ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h3 className="font-bold text-[#5a2d0c] text-lg">
                                                <span className="bg-[#772402] text-white px-2 py-0.5 rounded mr-3 text-sm">{idx + 1}</span>
                                                {q.question}
                                            </h3>
                                            <div className="shrink-0">
                                                {isCorrect ? <CheckCircle2 className="text-green-600 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((option, optIdx) => {
                                                let btnClass = "border-2 border-gray-200 text-gray-600 bg-white opacity-70";
                                                
                                                if (option === q.answer) {
                                                    // Correct Answer (Always Green)
                                                    btnClass = "border-green-500 bg-green-100 text-green-900 font-bold opacity-100 ring-2 ring-green-500/20";
                                                } else if (option === studentAns) {
                                                    // Wrong Student Selection (Red)
                                                    btnClass = "border-red-500 bg-red-100 text-red-900 font-bold opacity-100";
                                                }

                                                return (
                                                    <div key={optIdx} className={`p-3 rounded-lg text-left transition-all ${btnClass}`}>
                                                        {option}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        {!isCorrect && (
                                            <div className="mt-4 text-sm font-bold text-red-700 bg-white/50 p-2 rounded inline-block">
                                                Student Answer: {isMissed ? "No Answer / Time Up" : studentAns}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // 👇 STUDENT RENDER (GAME/QUIZ VIEW)
    // ============================================
    if (isGameFinished) {
        return (
            <div className="min-h-screen bg-cover bg-center font-[var(--font-body)] flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bgHome})` }}>
                <Navbar />
                <div className="text-center bg-[#FDFBF7] rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50">
                    <h2 className="text-4xl font-bold mb-4 text-[#5a2d0c]">Post-Test Complete!</h2>
                    <p className="text-2xl mb-6 text-[#5a2d0c]">
                        Your Final Score: <span className="font-extrabold">{score}/{questions.length}</span>
                    </p>
                    <button
                        onClick={() => {
                            playSound(clearedSfx);
                            navigate('/student-profile');
                        }}
                        className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-xl"
                    >
                        Finish
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const getOptionClass = (option) => {
        const baseClass = "font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8AA86]";
        
        if (timeUp) {
            if (option === currentQuestion.answer) return `${baseClass} bg-green-600 text-white`; 
            return `${baseClass} bg-red-600 text-white`; 
        }

        if (selectedAnswer && !timeUp) {
            if (option === currentQuestion.answer) return `${baseClass} bg-green-600 text-white`; 
            if (option === selectedAnswer) return `${baseClass} bg-red-600 text-white`; 
        }
        
        return `${baseClass} bg-[#83643E] text-white hover:bg-[#7a4e2c]`; 
    };

    return (
        <div className="min-h-screen bg-cover bg-center font-[var(--font-body)]" style={{ backgroundImage: `url(${bgHome})` }}>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen pt-24 md:pt-32">
                <div className="w-full max-w-4xl mx-auto px-4 pb-10">
                    <button 
                        onClick={() => {
                            playSound(renameTabSfx);
                            navigate(-1);
                        }} 
                        className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer"
                    >
                        <span className="mr-2">◀</span> Back
                    </button>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
                            Pagsusulit
                        </h1>
                        <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
                            Basahing mabuti ang bawat tanong. Piliin ang tamang sagot sa mga ibinigay na pagpipilian. Mayroon ka lamang isang minuto para sagutin ang bawat katanungan.
                        </p>
                    </div>

                    <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 relative flex flex-col items-center">
                        <div className="w-full max-w-3xl">
                            
                            <div className="relative flex justify-between items-center mb-10 border-b-2 border-[#C8AA86]/30 pb-6 pt-2">
                                <span className="text-[#772402] font-extrabold text-base md:text-xl">
                                    Q. {currentIndex + 1}/{questions.length}
                                </span>

                                <div className={`absolute left-1/2 transform -translate-x-1/2 shadow-xl rounded-full px-6 py-2 border-2 border-[#FDFBF7] transition-all duration-300 ${
                                    timer <= 10 ? 'bg-red-600 scale-110' : 'bg-[#772402]'
                                }`}>
                                    <span className="text-white font-black text-xl tracking-wider flex items-center gap-2">
                                        <Clock className="w-5 h-5" /> {timer}s
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-b from-[#8B5E3C] to-[#5a2d0c] rounded-xl p-6 md:p-10 shadow-inner mb-6 text-center flex flex-col justify-center min-h-[150px]">
                                <p className="text-white font-semibold text-lg md:text-xl leading-relaxed whitespace-pre-line drop-shadow-md">
                                    {currentQuestion.question}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNextQuestion(option)}
                                        disabled={selectedAnswer !== null} 
                                        className={getOptionClass(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTest;