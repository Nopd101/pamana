import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import bgHome from "../assets/bg-home.png";
import API from "../api/axios";
import { PlayCircle, Gamepad2, ClipboardList, Check, X } from "lucide-react"; 
import BackButton from "../components/BackButton";

// Import Civilization Header Images
import chinaImg from "../assets/CivilizationPhotos/China.png";
import egyptImg from "../assets/CivilizationPhotos/Egypt.png";
import indusImg from "../assets/CivilizationPhotos/Indus.png";
import mesoamericaImg from "../assets/CivilizationPhotos/Mesoamerica.png";
import mesopotamiaImg from "../assets/CivilizationPhotos/Mesopotamia.png";

import renameTabSfx from "../assets/sfx/rename_tab.mp3";

// --- COMPONENT: LetterInputGroup (Fixed for Review Mode) ---
const LetterInputGroup = ({ answer, onAnswerChange, disabled, initialValue }) => {
  // Initialize state with the passed initialValue (student's answer)
  const [inputs, setInputs] = useState(() => {
    if (initialValue) {
      return initialValue.split("").concat(Array(Math.max(0, answer.length - initialValue.length)).fill(""));
    }
    return Array(answer.length).fill("");
  });
  
  const inputRefs = useRef([]);

  // Sync if initialValue changes (important for review mode loading)
  useEffect(() => {
    if (disabled && initialValue) {
        setInputs(initialValue.split('').concat(Array(Math.max(0, answer.length - initialValue.length)).fill('')));
    }
  }, [disabled, initialValue, answer.length]);

  const handleChange = (e, index) => {
    if (disabled) return; 
    const val = e.target.value.toUpperCase();
    if (val.length <= 1) {
      const newInputs = [...inputs];
      newInputs[index] = val;
      setInputs(newInputs);
      onAnswerChange(newInputs.join(""));

      if (val && index < answer.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled) return;
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Determine if the full answer matches
  const currentString = inputs.join("");
  const isCorrect = currentString === answer;

  return (
    <div className="inline-flex flex-wrap gap-0.5 items-center mx-1 align-middle">
      {answer.split("").map((char, i) =>
        char === " " ? (
          <div key={i} className="w-2" />
        ) : (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            maxLength="1"
            value={inputs[i]}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={disabled}
            className={`w-5 h-7 border-b-2 bg-transparent text-center font-bold text-md outline-none transition-colors uppercase
                ${disabled 
                    ? (isCorrect ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600') 
                    : 'border-[#772402] text-[#772402] focus:border-amber-500'
                }`}
          />
        )
      )}
    </div>
  );
};

function KabihasnanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  // 👇 EXTRACT REVIEW MODE DATA
  const isReviewMode = location.state?.reviewMode || false;
  const studentAnswersFromReport = location.state?.studentAnswers || {};
  const studentName = location.state?.studentName || "";

  // Initialize Tab: If reviewing, FORCE "quiz" tab
  const [activeTab, setActiveTab] = useState(isReviewMode ? "quiz" : "video");

  // --- Quiz States ---
  // Initialize userAnswers with review data if available
  const [userAnswers, setUserAnswers] = useState(
    (isReviewMode && id !== 'egypt') ? studentAnswersFromReport : {}
  );
  
  const [score, setScore] = useState(location.state?.score || 0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [totalItems, setTotalItems] = useState(location.state?.total || 0);

  // --- Matching Type States ---
  const [selectedA, setSelectedA] = useState(null);
  // Initialize connections for Egypt review
  const [connections, setConnections] = useState(
    (isReviewMode && id === 'egypt' && Array.isArray(studentAnswersFromReport)) 
    ? studentAnswersFromReport 
    : []
  );
  
  const containerRef = useRef(null);
  const [lineCoords, setLineCoords] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  // Checker States (Student Side Only)
  const [quizAlreadyTaken, setQuizAlreadyTaken] = useState(false);
  const [pastScore, setPastScore] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!isReviewMode); // Skip loading if reviewing

  const sfxRef = useRef(null);

  useEffect(() => {
    sfxRef.current = new Audio(renameTabSfx);
    sfxRef.current.volume = 0.5;
    sfxRef.current.preload = 'auto';
  }, []);

  const playSound = () => {
    if (sfxRef.current) {
      sfxRef.current.currentTime = 0; 
      sfxRef.current.play().catch((e) => console.error("Audio play failed:", e));
    }
  };

  const CIVILIZATION_IMAGES = {
    mesopotamia: mesopotamiaImg,
    indus: indusImg,
    tsino: chinaImg,
    egypt: egyptImg,
    mesoamerica: mesoamericaImg,
  };

  const headerImage = CIVILIZATION_IMAGES[id] || mesopotamiaImg;

  // --- DATA DEFINITION ---
  const civilizationData = {
    mesopotamia: { title: "Mesopotamia", videoUrl: "https://www.youtube-nocookie.com/embed/72rC4AlZLrw", games: [{ title: "MindFlip", desc: "I-flip ang mga card..." }, { title: "BrainTease", desc: "Lutasin ang mga palaisipan..." }], quizType: "multiple-choice", quizTitle: "QuizStory - Multiple Choice" },
    indus: { title: "Indus", videoUrl: "https://www.youtube-nocookie.com/embed/y_UlD1pCQFM", games: [{ title: "HARAPPUZZLE QUEST", desc: "Buuin ang mga istruktura." }, { title: "CASTE YOUR ANSWER", desc: "Tukuyin ang hirarkiya." }], quizType: "true-false", quizTitle: "IndusQUIZtery" },
    tsino: { title: "Tsino", videoUrl: "https://www.youtube-nocookie.com/embed/GTZP3iPhu3w", games: [{ title: "DynasSeek", desc: "Hanapin ang mga dinastiya." }, { title: "DynastOut", desc: "Tanggalin ang maling pagpipilian." }], quizType: "identification", quizTitle: "IdentiFun - IDENTIFICATION" },
    egypt: { title: "Egypt", videoUrl: "https://www.youtube-nocookie.com/embed/NTiXxQFn_1M", games: [{ title: "PictoWord", desc: "Hulaan ang salita..." }, { title: "EgyptHunt", desc: "Tuklasin ang kayamanan." }], quizType: "matching-type", quizTitle: "Egypto-Connect" },
    mesoamerica: { title: "Mesoamerica", videoUrl: "https://www.youtube-nocookie.com/embed/_r7EIipPjy4", games: [{ title: "MistakeMaze", desc: "Tahakin ang Kasaysayan" }, { title: "Selectify", desc: "Piliin ang artifact." }], quizType: "fill-in-the-blank", quizTitle: "MesoQuiz", wordBank: ["Huitzilopochtli", "Francisco Pizarro", "Yucatan Peninsula", "Quetzalcoatl", "Aztec", "Hilagang Mexico", "Halack Uinic", "Mansa Musa", "Maya"] },
  };
  const currentData = civilizationData[id] || civilizationData.mesopotamia;

  // --- HISTORY CHECKER (Only runs if NOT reviewing) ---
  useEffect(() => {
    if (isReviewMode) return; // 🛑 STOP here if teacher view

    let isMounted = true;
    const checkQuizHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await API.get("student/stats/"); 
        const history = response.data.history; 
        const existingLog = history.find(
          (log) => log.civilization === currentData.title && log.activity_type === "Quiz"
        );

        if (isMounted && existingLog) {
          setQuizAlreadyTaken(true);
          setPastScore(existingLog.score);
          setPastTotal(existingLog.max_score);
          setScore(existingLog.score); 
          setTotalItems(existingLog.max_score); 
        }
      } catch (error) {
        console.error("Error checking quiz history:", error);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };
    checkQuizHistory();
    return () => { isMounted = false; };
  }, [id, currentData.title, isReviewMode]);

  // --- HANDLERS ---
  const handleAnswerChange = (questionId, value) => {
    if (isReviewMode) return; 
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleClearAnswers = () => {
    if (isReviewMode) return;
    playSound(); 
    setConnections([]);
    setLineCoords([]);
    setSelectedA(null);
    setUserAnswers({});
    setResetKey((prev) => prev + 1);
  };

  const handleVideoComplete = async () => {
    if (isReviewMode) return;
    playSound();
    try {
      await API.post("submit-score/", {
        civilization: currentData.title,
        activity_type: "Video",
        activity_name: "Video Lecture",
        score: 1,
        max_score: 1,
      });
    } catch (error) { console.error(error); }
    setActiveTab("game");
  };

  const handleSubmitQuiz = async () => {
    if (isReviewMode) return; // Ensure teacher can't submit
    playSound();
    let currentScore = 0;
    let maxScore = 0;
    let detailsToSubmit = id === 'egypt' ? connections : userAnswers;

    if (id === "mesopotamia") {
        const answers = { 1: "Hanging Gardens", 2: "Akkad", 3: "Kodigo ni Hammurabi", 4: "Cuneiform", 5: "Imperyong Achaemenid" };
        maxScore = 5;
        Object.keys(answers).forEach((qid) => { if (userAnswers[qid] === answers[qid]) currentScore++; });
    } else if (id === "indus") {
        const answers = { 1: "TAMA", 2: "MALI", 3: "TAMA", 4: "MALI", 5: "TAMA" };
        maxScore = 5;
        Object.keys(answers).forEach((qid) => { if (userAnswers[qid]?.toUpperCase() === answers[qid]) currentScore++; });
    } else if (id === "tsino") {
        const answers = { 1: "HUANG HO", 2: "ORACLE BONES", 3: "ZHOU", 4: "CALLIGRAPHY", 5: "MANDATE OF HEAVEN" };
        maxScore = 5;
        Object.keys(answers).forEach((qid) => { if (userAnswers[qid]?.toUpperCase() === answers[qid]) currentScore++; });
    } else if (id === "egypt") {
        const correctPairs = { a1: "b2", a2: "b3", a3: "b5", a4: "b0", a5: "b1" };
        maxScore = 5;
        connections.forEach((conn) => { if (correctPairs[conn.fromId] === conn.toId) currentScore++; });
    } else if (id === "mesoamerica") {
        const answers = { 1: "AZTEC", 2: "MANSA MUSA", 3: "MAYA", 4: "HALACK UINIC", 5: "HUITZILOPOCHTLI" };
        maxScore = 5;
        Object.keys(answers).forEach((qid) => { if (userAnswers[qid] === answers[qid]) currentScore++; });
    }

    try {
      await API.post("submit-score/", {
        civilization: currentData.title,
        activity_type: "Quiz",
        activity_name: currentData.quizTitle,
        score: currentScore,
        max_score: maxScore,
        details: detailsToSubmit 
      });
    } catch (error) { console.error(error); }

    setScore(currentScore);
    setTotalItems(maxScore);
    setIsQuizFinished(true);
    setQuizAlreadyTaken(true); 
    setPastScore(currentScore);
    setPastTotal(maxScore);
  };

  const handleStartGame = (gameTitle) => {
    playSound();
    if (gameTitle === "HARAPPUZZLE QUEST") navigate("/harappuzzle-quest");
    else if (gameTitle === "CASTE YOUR ANSWER") navigate("/caste-game");
    else if (gameTitle === "MindFlip") navigate("/mindflip-game");
    else if (gameTitle === "BrainTease") navigate("/riddle-game");
    else if (gameTitle === "DynasSeek") navigate("/wordhunt-game");
    else if (gameTitle === "MistakeMaze") navigate("/itama-mo-ako");
    else if (gameTitle === "Selectify") navigate("/saan-ako-nabibilang");
    else if (gameTitle === "PictoWord") navigate("/four-pics-one-word");
    else if (gameTitle === "DynastOut") navigate("/game-of-elimination");
    else if (gameTitle === "EgyptHunt") navigate("/artifact-hidden-object");
  };

  const handleConnect = (idB) => {
    if (isReviewMode) return;
    playSound();
    if (selectedA) {
      setConnections((prev) => [
        ...prev.filter((c) => c.fromId !== selectedA),
        { fromId: selectedA, toId: idB },
      ]);
      setSelectedA(null);
    }
  };

  const handleSelectA = (idA) => {
    if (isReviewMode) return;
    playSound();
    setSelectedA(idA);
  };

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const newCoords = connections
        .map((conn) => {
          const fromElem = document.getElementById(conn.fromId);
          const toElem = document.getElementById(conn.toId);
          if (fromElem && toElem) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const fromRect = fromElem.getBoundingClientRect();
            const toRect = toElem.getBoundingClientRect();
            return {
              x1: fromRect.right - containerRect.left,
              y1: fromRect.top + fromRect.height / 2 - containerRect.top,
              x2: toRect.left - containerRect.left,
              y2: toRect.top + toRect.height / 2 - containerRect.top,
            };
          }
          return null;
        })
        .filter(Boolean);
      setLineCoords(newCoords);
    };
    setTimeout(updateLines, 100);
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [connections, activeTab, id]);

  const hanayA = [
    { id: "a1", text: "Sistema ng pagsulat ng sinaunang Egyptian na ang ibig sabihin ay “sagradong ukit.”", color: "#674422" },
    { id: "a2", text: "Uri ng karwaheng pandigma na natutunan ng mga Egyptian mula sa Hyksos.", color: "#83643E" },
    { id: "a3", text: "Pagsamba sa iisang mataas na diyos na sinimulan ni Amenophis IV o Akhenaton.", color: "#C29B6C" },
    { id: "a4", text: "Pinuno ng isang nome o lalawigan sa sinaunang Egypt.", color: "#947352" },
    { id: "a5", text: "Malalayang pamayanan o lalawigan sa sinaunang estado ng Egypt.", color: "#704F38" },
  ];
  const hanayB = ["Nomarch", "Nome", "Hieroglyphics", "Chariot", "Polyteismo", "Monoteismo"];
  
  const mesoQuestions = [
    { id: 1, text1: "Ang salitang ", text2: " ay nangangahulugang “isang nagmula sa Aztlan” isang mitikong lugar sa Hilagang Mexico.", ans: "AZTEC" },
    { id: 2, text1: "Ang salitang ", text2: " ay literal na nangangahulugang “imperyo”.", ans: "INCA" },
    { id: 3, text1: "Ang kabihasnang ", text2: " ay namayani sa Yucatan Peninsula, ito ay lupain sa Timog ng Mexico hanggang Guatemala", ans: "MAYA" },
    { id: 4, text1: "Ang pinuno ng mga Mayan ay tinatawag na ", text2: ".", ans: "HALACK UINIC" },
    { id: 5, text1: "Ang pinakamahalagang Diyos ng mga Aztec ay si ", text2: ", ang Diyos ng araw.", ans: "HUITZILOPOCHTLI" },
  ];

  // Helper logic to verify answers in UI
  const getBorderColor = (questionId, correctAns) => {
    if (!isReviewMode) return "border-[#5a2d0c]/30";
    
    // Normalize to Upper Case for comparison consistency
    const studentAns = (userAnswers[questionId] || "").toString().toUpperCase();
    if (studentAns === correctAns) return "border-green-500 bg-green-50";
    return "border-red-500 bg-red-50";
  };

  // 👇 Score Screen (Only show if NOT reviewing)
  if (!isReviewMode && (isQuizFinished || (quizAlreadyTaken && activeTab === "quiz"))) {
    if (isLoadingHistory && activeTab === "quiz") return <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgHome})` }} />;
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-[var(--font-body)]" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md md:max-w-lg w-full">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#5a2d0c] font-[var(--font-heading)]">
            {quizAlreadyTaken && !isQuizFinished ? "Quiz Completed" : "Congratulations!"}
          </h2>
          <p className="text-xl md:text-3xl mb-6 md:mb-8 text-[#5a2d0c]">
            {quizAlreadyTaken && !isQuizFinished ? "Previous Score: " : "Your Final Score: "}
             <span className="font-extrabold">{quizAlreadyTaken && !isQuizFinished ? pastScore : score}/{quizAlreadyTaken && !isQuizFinished ? pastTotal : totalItems}</span>
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={() => { playSound(); navigate("/homepage"); }} className="bg-white border-2 border-[#772402] text-[#772402] py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-bold text-lg">Back to Home</button>
            <button onClick={() => { playSound(); setActiveTab("video"); setIsQuizFinished(false); }} className="text-sm underline text-amber-900">Review Materials</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-fixed bg-center p-4 pt-16 md:pt-36 md:p-6 font-[var(--font-body)]" style={{ backgroundImage: `url(${bgHome})` }}>
      <BackButton className="mb-6 md:ml-20 mt-7" />

      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={headerImage} alt="Kabihasnan Thumbnail" className="w-full md:w-40 h-48 md:h-30 rounded-sm shadow-inner shrink-0 object-cover border border-amber-900/20" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#7B3306] font-[var(--font-heading)] uppercase">
                {isReviewMode ? `Reviewing: ${studentName}` : `Kabihasnang ${currentData.title}`}
            </h1>
            <p className="text-[#A5521E] text-lg font-body font-bold">{currentData.subtitle}</p>
          </div>
        </div>

        {/* TABS (Hidden in Review Mode) */}
        {!isReviewMode && (
            <div className="flex w-full border-b border-[#5a2d0c]/20 mb-8 shadow-md rounded-t-lg overflow-hidden">
            {["video", "game", "quiz"].map((tab) => (
                <button
                key={tab}
                onClick={() => { playSound(); setActiveTab(tab); }}
                className={`flex-1 py-3 px-2 md:px-4 flex items-center justify-center gap-2 font-body transition-colors text-xs md:text-base ${activeTab === tab ? "bg-white text-[#5a2d0c]" : "bg-[#772402] text-white/80"}`}
                >
                {tab === "video" && <><PlayCircle className="w-4 h-4 md:w-5 md:h-5" /><span> Video Lecture</span></>}
                {tab === "game" && <><Gamepad2 className="w-4 h-4 md:w-5 md:h-5" /><span> Mini-Game</span></>}
                {tab === "quiz" && <><ClipboardList className="w-4 h-4 md:w-5 md:h-5" /><span> Quiz</span></>}
                </button>
            ))}
            </div>
        )}

        <div className={`${activeTab !== "game" ? "bg-white p-4 md:p-10 rounded-xl shadow-xl" : ""} min-h-[500px]`}>
          
          {/* VIDEO & GAMES TAB (Skipped in Review Mode) */}
          {activeTab === "video" && !isReviewMode && (
             <div className="flex flex-col h-full">
               <h2 className="text-2xl font-bold text-[#5a2d0c] mb-6 font-[var(--font-heading)]">Kabihasnang {currentData.title}</h2>
               <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                 <iframe className="absolute top-0 left-0 w-full h-full rounded-lg shadow-inner" src={currentData.videoUrl} title="Video" allowFullScreen></iframe>
               </div>
               <button onClick={handleVideoComplete} className="mt-8 self-center md:self-end border-2 border-emerald-600 text-emerald-700 px-6 py-1 rounded-lg font-bold hover:bg-emerald-50 transition-colors">Complete</button>
             </div>
          )}
          {activeTab === "game" && !isReviewMode && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.games.map((game, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md border border-amber-900/20 p-6 flex flex-col">
                        <h3 className="text-2xl font-black text-[#5a2d0c] mb-1 font-[var(--font-heading)] uppercase">{game.title}</h3>
                        <p className="text-amber-800/70 font-medium mb-6">{game.desc}</p>
                        <button onClick={() => handleStartGame(game.title)} className="w-full bg-[#772402] text-white py-3 rounded-lg flex items-center justify-center gap-3 font-bold shadow-md hover:bg-[#5a2d0c] transition-colors cursor-pointer"><Gamepad2 className="w-5 h-5" /> Start Game</button>
                    </div>
                ))}
             </div>
          )}

          {/* QUIZ TAB (Modified for Review Mode) */}
          {activeTab === "quiz" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#5a2d0c] font-[var(--font-heading)] uppercase">
                    {isReviewMode ? `${currentData.quizTitle} (Review)` : currentData.quizTitle}
                </h2>
                <p className="text-[#B06A3A] font-bold leading-relaxed mt-2">{currentData.quizInstructions}</p>
              </div>

              {id === "mesopotamia" && (
                <div className="space-y-6">
                  {[
                    { id: 1, q: "Aling kilalang gusali sa Babylonia ang ipinatayo ni Haring Nebuchadnezzar para sa kanyang asawa at kabilang sa Seven Wonders of the Ancient World?", options: ["Taj Mahal", "Ziggurat", "Pyramid", "Hanging Gardens"], ans: "Hanging Gardens" },
                    { id: 2, q: "Ano ang unang imperyo sa daigdig na itinatag ni Sargon I?", options: ["Sumer", "Babylonia", "Akkad", "Chaldea"], ans: "Akkad" },
                    { id: 3, q: "Ano ang isa sa pinakaunang batas na naisulat sa kasaysayan na mula sa Babylonia na naglalaman ng 282 na batas?", options: ["Kodigo ni Hammurabi", "Kodigo ni Sargon", "Kodigo ni Naram Sin", "Kodigo ni Cyrus the Great"], ans: "Kodigo ni Hammurabi" },
                    { id: 4, q: "Anong uri ng sistema ng pagsusulat ang ginawa ng mga Sumerian?", options: ["Hieroglyphics", "Calligraphy", "Pictograph", "Cuneiform"], ans: "Cuneiform" },
                    { id: 5, q: "Ano ang imperyong itinatag ng mga Persian?", options: ["Imperyong Achaemenid", "Imperyong Akkadian", "Imperyong Chaldean", "Imperyong Assyrian"], ans: "Imperyong Achaemenid" },
                  ].map((item) => (
                    <div key={item.id} className={`border-2 rounded-xl p-4 md:p-6 shadow-sm ${getBorderColor(item.id, item.ans)}`}>
                      <p className="text-[#5a2d0c] font-black mb-4">{item.id}. {item.q}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {item.options.map((opt, i) => {
                            let optionClass = "text-[#5a2d0c] group-hover:text-[#772402]";
                            let icon = null;
                            const isCorrect = opt === item.ans;
                            const isSelected = userAnswers[item.id] === opt;

                            if (isReviewMode) {
                                if (isCorrect) { optionClass = "text-green-700 font-bold bg-green-50 p-2 rounded w-full border border-green-200"; icon = <Check size={16} className="ml-auto" />; }
                                else if (isSelected && !isCorrect) { optionClass = "text-red-600 font-bold bg-red-50 p-2 rounded w-full border border-red-200"; icon = <X size={16} className="ml-auto" />; }
                                else { optionClass = "text-gray-400 p-2"; }
                            }

                            return (
                            <label key={i} className={`flex items-center gap-3 cursor-pointer group ${isReviewMode ? 'cursor-default' : ''}`}>
                                <input 
                                    type="radio" 
                                    name={`q-${item.id}`} 
                                    className="w-4 h-4 accent-[#772402] shrink-0" 
                                    onChange={() => { if(!isReviewMode) { playSound(); handleAnswerChange(item.id, opt); }}} 
                                    checked={isSelected} 
                                    disabled={isReviewMode} 
                                />
                                <span className={`transition-colors flex items-center gap-2 ${optionClass}`}>
                                    {opt} {icon}
                                </span>
                            </label>
                            );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {id === "indus" && (
                <div className="space-y-4">
                  {[
                    { id: 1, text: "Ang Harappa at Mohenjo-Daro ay mga lungsod ng Kabihasnang Indus.", ans: "TAMA" },
                    { id: 2, text: "Kilala ang Mohenjo-Daro bilang lungsod na nasa hilagang bahagi ng Indus River.", ans: "MALI" },
                    { id: 3, text: "Ang Kabihasnang Indus ay may maayos at planadong lungsod na may malalapad na kalsada.", ans: "TAMA" },
                    { id: 4, text: "Ang mga Aryan ang unang nanirahan sa Harappa at Mohenjo-Daro.", ans: "MALI" },
                    { id: 5, text: " Ang sistema ng mga palikuran at alkantarilya sa Indus ay isa sa mga pinakamaunlad noong sinaunang panahon.", ans: "TAMA" },
                  ].map((q) => (
                    <div key={q.id} className={`border-2 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 shadow-sm text-center md:text-left ${getBorderColor(q.id, q.ans)}`}>
                      <input 
                        key={resetKey} 
                        type="text" 
                        value={userAnswers[q.id] || ""}
                        disabled={isReviewMode}
                        className="w-full md:w-32 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors disabled:text-black" 
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                      />
                      {isReviewMode && userAnswers[q.id]?.toUpperCase() !== q.ans && (
                        <span className="text-green-600 font-bold text-sm ml-2 self-center">({q.ans})</span>
                      )}
                      <p className="text-[#5a2d0c] font-bold">{q.id}. {q.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {id === "tsino" && (
                <div className="space-y-4">
                  {[
                    { id: 1, scrambled: "G N H A U O H", clue: "log kung saan sumibol ang sinaunang kabihasnang Tsino, tinatawag din itong “River of Sorrow.”", ans: "HUANG HO" },
                    { id: 2, scrambled: "O L C A R E   B O N S E", clue: "ortoise shell at cattle bone na ginamit upang mabatid ang mensahe ng mga diyos.", ans: "ORACLE BONES" },
                    { id: 3, scrambled: "H O Z U", clue: "Pinaka mahaba at pinaka dakilang dinastiya sa Tsina na nagtaguyod ng Confucianism, Taoism, at Legalism", ans: "ZHOU" },
                    { id: 4, scrambled: "A L L C I G A R P H Y", clue: "Sistema ng pagsulat ng mga Tsino na gumagamit ng mga simbolong kahawig ng larawan.", ans: "CALLIGRAPHY" },
                    { id: 5, scrambled: "A D N M T E A   F O   E H E A V E N", clue: "Paniniwalang Tsino na ang emperador ay may basbas ng kalangitan upang mamuno.", ans: "MANDATE OF HEAVEN" },
                  ].map((q) => (
                    <div key={q.id} className={`border-2 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 shadow-sm text-center md:text-left ${getBorderColor(q.id, q.ans)}`}>
                      <input 
                        type="text" 
                        key={resetKey} 
                        value={userAnswers[q.id] || ""}
                        disabled={isReviewMode}
                        className="w-full md:w-48 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors disabled:text-black" 
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                      />
                      {isReviewMode && userAnswers[q.id]?.toUpperCase() !== q.ans && (
                        <span className="text-green-600 font-bold text-sm ml-2 self-center">({q.ans})</span>
                      )}
                      <p className="text-[#5a2d0c] font-bold">{q.id}. <span className="text-[#772402]">{q.scrambled}</span>- {q.clue}</p>
                    </div>
                  ))}
                </div>
              )}

              {id === "egypt" && (
                <div className="space-y-6">
                  {isReviewMode && <p className="text-center text-red-600 font-bold bg-red-50 p-2 rounded">Visual review for Matching Game is not available. Score: {score}/{totalItems}</p>}
                  <div className={`relative ${isReviewMode ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-8 bg-white shadow-sm z-10 relative">
                      <div className="space-y-4">
                        <p className="font-black text-center text-[#5a2d0c] mb-2 uppercase">Hanay A</p>
                        {hanayA.map((item) => {
                          const isConnected = connections.find((c) => c.fromId === item.id);
                          return (
                            <div key={item.id} id={item.id} onClick={() => handleSelectA(item.id)} style={{ backgroundColor: isConnected ? "#772402" : item.color }} className={`p-4 rounded-lg font-bold text-center text-sm min-h-[100px] flex items-center justify-center cursor-pointer transition-all border-4 ${selectedA === item.id ? "border-amber-400 scale-105 shadow-lg z-20" : "border-transparent"} text-white`}>
                              {item.text}
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-4">
                        <p className="font-black text-center text-[#5a2d0c] mb-2 uppercase">Hanay B</p>
                        {hanayB.map((text, i) => (
                          <button key={i} id={`b${i}`} onClick={() => handleConnect(`b${i}`)} className={`w-full border-2 border-[#772402] p-4 md:p-6 rounded-lg font-black uppercase transition-colors min-h-[60px] ${connections.find((c) => c.toId === `b${i}`) ? "bg-[#772402] text-white" : "text-[#772402] hover:bg-amber-50"}`}>
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 15, overflow: "visible" }}>
                      {lineCoords.map((coords, index) => (
                        <line key={index} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke="#772402" strokeWidth="4" strokeLinecap="round" style={{ opacity: 0.8 }} />
                      ))}
                    </svg>
                  </div>
                </div>
              )}

              {id === "mesoamerica" && activeTab === "quiz" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {mesoQuestions.map((q) => (
                      <div key={`${resetKey}-${q.id}`} className={`border-2 rounded-xl p-4 md:p-6 shadow-sm ${getBorderColor(q.id, q.ans)}`}>
                        <p className="text-lg leading-[3rem] text-[#5a2d0c] font-bold">
                          {q.id}. {q.text1}
                          <LetterInputGroup 
                            key={`${resetKey}-${q.id}`} 
                            answer={q.ans} 
                            onAnswerChange={(val) => handleAnswerChange(q.id, val)}
                            disabled={isReviewMode}
                            initialValue={isReviewMode ? (userAnswers[q.id] || "") : ""}
                          />
                          {q.text2}
                        </p>
                        {isReviewMode && userAnswers[q.id] !== q.ans && (
                            <p className="text-green-600 font-bold text-sm mt-1">Correct Answer: {q.ans}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isReviewMode && (
                <div className="flex flex-col md:flex-row justify-end pt-4 gap-4">
                    <button onClick={handleClearAnswers} className="w-full md:w-auto border-2 border-[#772402] text-[#772402] px-8 py-3 rounded-xl font-black text-lg shadow-md hover:bg-amber-50 transition-all active:scale-95">Clear Answer</button>
                    <button onClick={handleSubmitQuiz} className="w-full md:w-auto bg-[#772402] text-white px-12 py-3 rounded-xl font-black text-xl shadow-xl hover:bg-[#5a2d0c] transition-all transform active:scale-95">Submit Answer</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KabihasnanDetails;