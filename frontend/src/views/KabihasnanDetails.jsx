import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import API from "../api/axios";
import kabihasnanImg from "../assets/main-home-bg-2.png";
import { PlayCircle, Gamepad2, ClipboardList } from "lucide-react";
import BackButton from "../components/BackButton";

// --- COMPONENT: LetterInputGroup (For Mesoamerica) ---
const LetterInputGroup = ({ answer, onAnswerChange }) => {
  const [inputs, setInputs] = useState(Array(answer.length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 1) {
      const newInputs = [...inputs];
      newInputs[index] = val;
      setInputs(newInputs);
      onAnswerChange(newInputs.join("")); // Send answer back to parent

      if (val && index < answer.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="inline-flex flex-wrap gap-0.5 items-center mx-1 align-middle">
      {answer
        .split("")
        .map((char, i) =>
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
              className="w-5 h-7 border-b-2 border-[#772402] bg-transparent text-center font-bold text-[#772402] text-md outline-none focus:border-amber-500 transition-colors uppercase"
            />
          )
        )}
    </div>
  );
};

function KabihasnanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("video");

  // --- Quiz States ---
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // --- Matching Type States ---
  const [selectedA, setSelectedA] = useState(null);
  const [connections, setConnections] = useState([]);
  const containerRef = useRef(null);
  const [lineCoords, setLineCoords] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  // --- HANDLERS ---
  const handleAnswerChange = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleClearAnswers = () => {
    setConnections([]);
    setLineCoords([]);
    setSelectedA(null);
    setUserAnswers({});
    setResetKey((prev) => prev + 1);
  };

  const handleSubmitQuiz = async () => {
    // 👈 Make this ASYNC
    let currentScore = 0;
    let maxScore = 0;

    if (id === "mesopotamia") {
      // Multiple Choice Logic
      // Define correct answers mapping based on Question ID
      const answers = {
        1: "Hanging Gardens",
        2: "Akkad",
        3: "Kodigo ni Hammurabi",
        4: "Cuneiform",
        5: "Imperyong Achaemenid",
      };
      maxScore = 5;
      Object.keys(answers).forEach((qid) => {
        if (userAnswers[qid] === answers[qid]) currentScore++;
      });
    } else if (id === "indus") {
      // True/False Logic (Note: Your provided code used text input for True/False, assuming "TAMA"/"MALI")
      // Update this based on expected correct answers
      const answers = { 1: "TAMA", 2: "MALI", 3: "TAMA", 4: "MALI", 5: "TAMA" };
      maxScore = 5;
      Object.keys(answers).forEach((qid) => {
        if (userAnswers[qid]?.toUpperCase() === answers[qid]) currentScore++;
      });
    } else if (id === "tsino") {
      // Identification Logic
      const answers = {
        1: "HUANG HO",
        2: "ORACLE BONES",
        3: "ZHOU",
        4: "CALLIGRAPHY",
        5: "MANDATE OF HEAVEN",
      };
      maxScore = 5;
      Object.keys(answers).forEach((qid) => {
        if (userAnswers[qid]?.toUpperCase() === answers[qid]) currentScore++;
      });
    } else if (id === "egypt") {
      // Matching Logic
      // Map Hanay A IDs to correct Hanay B text indices or values
      // a1 (Hieroglyphics) -> b2
      // a2 (Chariot) -> b3
      // a3 (Monoteismo) -> b5
      // a4 (Nomarch) -> b0
      // a5 (Nome) -> b1
      const correctPairs = { a1: "b2", a2: "b3", a3: "b5", a4: "b0", a5: "b1" };
      maxScore = 5;
      connections.forEach((conn) => {
        if (correctPairs[conn.fromId] === conn.toId) currentScore++;
      });
    } else if (id === "mesoamerica") {
      // Fill in the blank logic
      const answers = {
        1: "AZTEC",
        2: "MANSA MUSA",
        3: "MAYA",
        4: "HALACK UINIC",
        5: "HUITZILOPOCHTLI",
      };
      maxScore = 5;
      Object.keys(answers).forEach((qid) => {
        // Remove spaces for comparison to be lenient? Or strict?
        // Currently strict exact match.
        if (userAnswers[qid] === answers[qid]) currentScore++;
      });
    }

    try {
      await API.post("submit-score/", {
        civilization: currentData.title, // e.g., "Mesopotamia"
        activity_type: "Quiz",
        activity_name: currentData.quizTitle, // e.g., "QuizStory"
        score: currentScore,
        max_score: maxScore,
      });
      console.log("Score saved successfully!");
    } catch (error) {
      console.error("Failed to save score:", error);
      // Optional: Alert the user if save fails
    }

    setScore(currentScore);
    setTotalItems(maxScore);
    setIsQuizFinished(true);
  };

  // ... (Keep existing Game Navigation and Matching Line logic) ...
  const handleStartGame = (gameTitle) => {
    if (gameTitle === "HARAPPUZZLE QUEST") navigate("/harappuzzle-quest");
    else if (gameTitle === "CASTE YOUR ANSWER") navigate("/caste-game");
    else if (gameTitle === "MindFlip") navigate("/mindflip-game");
    else if (gameTitle === "BrainTease") navigate("/riddle-game");
    else if (gameTitle === "DynasSeek") navigate("/wordhunt-game");
    else if (gameTitle === "MistakeMaze") navigate("/itama-mo-ako");
    else if (gameTitle === "Selectify") navigate("/saan-ako-nabibilang");
    else if (gameTitle === "4 Pics 1 Word") navigate("/four-pics-one-word");
    else if (gameTitle === "Game of Elimination")
      navigate("/game-of-elimination");
    else if (gameTitle === "Artifact Hidden Object")
      navigate("/artifact-hidden-object");
  };

  const handleConnect = (idB) => {
    if (selectedA) {
      setConnections((prev) => [
        ...prev.filter((c) => c.fromId !== selectedA),
        { fromId: selectedA, toId: idB },
      ]);
      setSelectedA(null);
    }
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
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [connections, activeTab, id]);

  // ... (Keep Hanay A/B Data) ...
  const hanayA = [
    {
      id: "a1",
      text: "Sistema ng pagsulat ng sinaunang Egyptian na ang ibig sabihin ay “sagradong ukit.”",
      color: "#674422",
    },
    {
      id: "a2",
      text: "Uri ng karwaheng pandigma na natutunan ng mga Egyptian mula sa Hyksos.",
      color: "#83643E",
    },
    {
      id: "a3",
      text: "Pagsamba sa iisang mataas na diyos na sinimulan ni Amenophis IV o Akhenaton.",
      color: "#C29B6C",
    },
    {
      id: "a4",
      text: "Pinuno ng isang nome o lalawigan sa sinaunang Egypt.",
      color: "#947352",
    },
    {
      id: "a5",
      text: "Malalayang pamayanan o lalawigan sa sinaunang estado ng Egypt.",
      color: "#704F38",
    },
  ];
  const hanayB = [
    "Nomarch",
    "Nome",
    "Hieroglyphics",
    "Chariot",
    "Polyteismo",
    "Monoteismo",
  ];

  // ... (Keep Data Objects) ...
  const civilizationData = {
    mesopotamia: {
      title: "Mesopotamia",
      subtitle:
        "Ang Kabihasnang Mesopotamia - ang lupain sa pagitan ng dalawang ilog",
      games: [
        { title: "MindFlip", desc: "Flip cards to match concepts." },
        { title: "BrainTease", desc: "Solve riddles of the ancients." },
      ],
      quizType: "multiple-choice",
      quizTitle: "QuizStory - Multiple Choice",
      quizInstructions:
        "Basahin nang mabuti ang bawat tanong. Piliin ang letra ng tamang sagot.",
    },
    indus: {
      title: "Indus",
      subtitle: "Kabihasnang Indus at mga imperyo ng India",
      games: [
        { title: "HARAPPUZZLE QUEST", desc: "Reconstruct the ancient ruins." },
        { title: "CASTE YOUR ANSWER", desc: "Identify the social hierarchy." },
      ],
      quizType: "true-false",
      quizTitle: "IndusQUIZtery",
      quizInstructions: "Isulat ang TAMA o MALI sa bawat pahayag.",
    },
    tsino: {
      title: "Tsino",
      subtitle: "Ang duyan ng sinaunang imbensyon at pilosopiya.",
      games: [
        { title: "DynasSeek", desc: "Find the dynasties in the grid." },
        { title: "Game of Elimination", desc: "Eliminate the wrong choices." },
      ],
      quizType: "identification",
      quizTitle: "IdentiFun - IDENTIFICATION",
      quizInstructions:
        "Ayusin ang mga magulong titik upang mabuo ang tamang sagot.",
    },
    egypt: {
      title: "Egypt",
      subtitle: "Ang Kabihasnang Egyptian at ang pamana ng mga Paraon.",
      games: [
        {
          title: "4 Pics 1 Word",
          desc: "Hulaan ang salita batay sa apat na larawan.",
        },
        {
          title: "Artifact Hidden Object",
          desc: "Tuklasin ang mga nakatagong kayamanan.",
        },
      ],
      quizType: "matching-type",
      quizTitle: "Egypto-Connect",
      quizInstructions:
        "Pagtambalin ang mga konsepto mula sa Hanay A patungo sa Hanay B.",
    },
    mesoamerica: {
      title: "Mesoamerica",
      subtitle: "Ang sibilisasyon ng mga Maya, Aztec, at iba pang katutubo.",
      games: [
        { title: "MistakeMaze", desc: "Navigate the maze of history." },
        { title: "Selectify", desc: "Select the correct artifact." },
      ],
      quizType: "fill-in-the-blank",
      quizTitle: "MesoQuiz - PUNAN MO AKO!",
      quizInstructions: "Punan ang mga patlang ng tamang sagot.",
      wordBank: [
        "Huitzilopochtli",
        "Francisco Pizarro",
        "Yucatan Peninsula",
        "Quetzalcoatl",
        "Aztec",
        "Hilagang Mexico",
        "Halack Uinic",
        "Mansa Musa",
        "Maya",
      ],
    },
  };

  const mesoQuestions = [
    { id: 1, text1: "Ang salitang ", text2: " ay nangangahulugang “isang nagmula sa Aztlan” isang mitikong lugar sa Hilagang Mexico.", ans: "AZTEC" },
    { id: 2, text1: "Ang salitang ", text2: " ay literal na nangangahulugang “imperyo”.", ans: "INCA" },
    { id: 3, text1: "Ang kabihasnang ", text2: " ay namayani sa Yucatan Peninsula, ito ay lupain sa Timog ng Mexico hanggang Guatemala", ans: "MAYA" },
    { id: 4, text1: "Ang pinuno ng mga Mayan ay tinatawag na ", text2: ".", ans: "HALACK UINIC" },
    { id: 5, text1: "Ang pinakamahalagang Diyos ng mga Aztec ay si ", text2: ", ang Diyos ng araw.", ans: "HUITZILOPOCHTLI" },
  ];

  const currentData = civilizationData[id] || civilizationData.mesopotamia;

  // --- MODAL RENDER ---
  if (isQuizFinished) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${bgHome})` }}
      >
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md md:max-w-lg w-full">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#5a2d0c]">
            Congratulations!
          </h2>
          <p className="text-xl md:text-3xl mb-6 md:mb-8 text-[#5a2d0c]">
            Your Final Score:{" "}
            <span className="font-extrabold">
              {score}/{totalItems}
            </span>
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setIsQuizFinished(false);
                handleClearAnswers();
              }}
              className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/homepage")}
              className="bg-white border-2 border-[#772402] text-[#772402] py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-bold text-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center p-4 pt-16 md:pt-36 md:p-6 font-[var(--font-body)]"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      <BackButton className="mb-6 md:ml-20 mt-7" />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img
            src={kabihasnanImg}
            alt="Kabihasnan Thumbnail"
            className="w-full md:w-40 h-48 md:h-30 rounded-sm shadow-inner shrink-0 object-cover border border-amber-900/20"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#7B3306] font-[var(--font-heading)] uppercase">
              Kabihasnang {currentData.title}
            </h1>
            <p className="text-[#A5521E] text-lg font-body font-bold">{currentData.subtitle}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex w-full border-b border-[#5a2d0c]/20 mb-8 shadow-md rounded-t-lg overflow-hidden">
          {["video", "game", "quiz"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 md:px-4 flex items-center justify-center gap-2 font-body transition-colors text-xs md:text-base ${
                activeTab === tab
                  ? "bg-white text-[#5a2d0c]"
                  : "bg-[#772402] text-white/80"
              }`}
            >
              {tab === "video" && (
                <>
                  <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span> Video Lecture</span>
                </>
              )}
              {tab === "game" && (
                <>
                  <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
                  <span> Mini-Game</span>
                </>
              )}
              {tab === "quiz" && (
                <>
                  <ClipboardList className="w-4 h-4 md:w-5 md:h-5" />
                  <span> Quiz</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div
          className={`${
            activeTab !== "game"
              ? "bg-white p-4 md:p-10 rounded-xl shadow-xl"
              : ""
          } min-h-[500px]`}
        >
          {/* VIDEO TAB */}
          {activeTab === "video" && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-[#5a2d0c] mb-6 font-[var(--font-heading)]">
                Kabihasnang {currentData.title}
              </h2>
              <div
                className="relative w-full"
                style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-inner"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <button className="mt-8 self-center md:self-end border-2 border-emerald-600 text-emerald-700 px-6 py-1 rounded-lg font-bold">
                Next →
              </button>
            </div>
          )}

          {/* MINI-GAME TAB (Indus Specific Labels) */}
          {activeTab === "game" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData.games.map((game, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-amber-900/20 p-6 flex flex-col"
                >
                  <h3 className="text-2xl font-black text-[#5a2d0c] mb-1 font-[var(--font-heading)] uppercase">
                    {game.title}
                  </h3>
                  <p className="text-amber-800/70 font-medium mb-6">
                    {game.desc}
                  </p>
                  <button
                    onClick={() => handleStartGame(game.title)}
                    className="w-full bg-[#772402] text-white py-3 rounded-lg flex items-center justify-center gap-3 font-bold shadow-md hover:bg-[#5a2d0c] transition-colors cursor-pointer"
                  >
                    <Gamepad2 className="w-5 h-5" /> Start Game
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === "quiz" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#5a2d0c] font-[var(--font-heading)] uppercase">
                  {currentData.quizTitle}
                </h2>
                <p className="text-[#B06A3A] font-bold leading-relaxed mt-2">
                  {currentData.quizInstructions}
                </p>
              </div>

              {/* 1. MESOPOTAMIA */}
              {id === "mesopotamia" && (
                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      q: "Aling kilalang gusali sa Babylonia ang ipinatayo ni Haring Nebuchadnezzar para sa kanyang asawa at kabilang sa Seven Wonders of the Ancient World?",
                      options: [
                        "Taj Mahal",
                        "Ziggurat",
                        "Pyramid",
                        "Hanging Gardens",
                      ],
                    },
                    {
                      id: 2,
                      q: "Ano ang unang imperyo sa daigdig na itinatag ni Sargon I?",
                      options: ["Sumer", "Babylonia", "Akkad", "Chaldea"],
                    },
                    {
                      id: 3,
                      q: "Ano ang isa sa pinakaunang batas na naisulat sa kasaysayan na mula sa Babylonia na naglalaman ng 282 na batas?",
                      options: [
                        "Kodigo ni Hammurabi",
                        "Kodigo ni Sargon",
                        "Kodigo ni Naram Sin",
                        "Kodigo ni Cyrus the Great",
                      ],
                    },
                    {
                      id: 4,
                      q: "Anong uri ng sistema ng pagsusulat ang ginawa ng mga Sumerian?",
                      options: [
                        "Hieroglyphics",
                        "Calligraphy",
                        "Pictograph",
                        "Cuneiform",
                      ],
                    },
                    {
                      id: 5,
                      q: "Ano ang imperyong itinatag ng mga Persian?",
                      options: [
                        "Imperyong Achaemenid",
                        "Imperyong Akkadian",
                        "Imperyong Chaldean",
                        "Imperyong Assyrian",
                      ],
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-6 bg-white shadow-sm"
                    >
                      <p className="text-[#5a2d0c] font-black mb-4">
                        {item.id}. {item.q}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {item.options.map((opt, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={`q-${item.id}`}
                              className="w-4 h-4 accent-[#772402] shrink-0"
                              onChange={() => handleAnswerChange(item.id, opt)}
                              checked={userAnswers[item.id] === opt}
                            />
                            <span className="text-[#5a2d0c] group-hover:text-[#772402] transition-colors">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. INDUS */}
              {id === "indus" && (
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      text: "Ang Harappa at Mohenjo-Daro ay mga lungsod ng Kabihasnang Indus.",
                    },
                    {
                      id: 2,
                      text: "Kilala ang Mohenjo-Daro bilang lungsod na nasa hilagang bahagi ng Indus River.",
                    },
                    {
                      id: 3,
                      text: "Ang Kabihasnang Indus ay may maayos at planadong lungsod na may malalapad na kalsada.",
                    },
                    {
                      id: 4,
                      text: "Ang mga Aryan ang unang nanirahan sa Harappa at Mohenjo-Daro.",
                    },
                    {
                      id: 5,
                      text: " Ang sistema ng mga palikuran at alkantarilya sa Indus ay isa sa mga pinakamaunlad noong sinaunang panahon.",
                    },
                  ].map((q) => (
                    <div
                      key={q.id}
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-5 bg-white flex flex-col md:flex-row items-center md:items-start gap-4 shadow-sm text-center md:text-left"
                    >
                      <input
                        key={resetKey}
                        type="text"
                        placeholder=""
                        className="w-full md:w-32 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors"
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                      />
                      <p className="text-[#5a2d0c] font-bold">
                        {q.id}. {q.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. TSINO */}
              {id === "tsino" && (
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      scrambled: "G N H A U O H",
                      clue: "log kung saan sumibol ang sinaunang kabihasnang Tsino, tinatawag din itong “River of Sorrow.”",
                    },
                    {
                      id: 2,
                      scrambled: "O L C A R E \u00A0\u00A0B O N S E",
                      clue: "ortoise shell at cattle bone na ginamit upang mabatid ang mensahe ng mga diyos.",
                    },
                    {
                      id: 3,
                      scrambled: "H O Z U",
                      clue: "Pinaka mahaba at pinaka dakilang dinastiya sa Tsina na nagtaguyod ng Confucianism, Taoism, at Legalism",
                    },
                    {
                      id: 4,
                      scrambled: "A L L C I G A R P H Y",
                      clue: "Sistema ng pagsulat ng mga Tsino na gumagamit ng mga simbolong kahawig ng larawan.",
                    },
                    {
                      id: 5,
                      scrambled:
                        "A D N M T E A \u00A0\u00A0F O\u00A0\u00A0 E H E A V E N",
                      clue: "Paniniwalang Tsino na ang emperador ay may basbas ng kalangitan upang mamuno.",
                    },
                  ].map((q) => (
                    <div
                      key={q.id}
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-5 bg-white flex flex-col md:flex-row items-center md:items-start gap-4 shadow-sm text-center md:text-left"
                    >
                      <input
                        type="text"
                        key={resetKey}
                        className="w-full md:w-48 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors"
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                      />
                      <p className="text-[#5a2d0c] font-bold">
                        {q.id}.{" "}
                        <span className="text-[#772402]">{q.scrambled}</span>-{" "}
                        {q.clue}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. EGYPT */}
              {id === "egypt" && (
                <div className="space-y-6">
                  <div className="relative" ref={containerRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-8 bg-white shadow-sm z-10 relative">
                      <div className="space-y-4">
                        <p className="font-black text-center text-[#5a2d0c] mb-2 uppercase">
                          Hanay A
                        </p>
                        {hanayA.map((item) => {
                          const isConnected = connections.find(
                            (c) => c.fromId === item.id
                          );
                          return (
                            <div
                              key={item.id}
                              id={item.id}
                              onClick={() => setSelectedA(item.id)}
                              style={{
                                backgroundColor: isConnected
                                  ? "#772402"
                                  : item.color,
                              }}
                              className={`p-4 rounded-lg font-bold text-center text-sm min-h-[100px] flex items-center justify-center cursor-pointer transition-all border-4 ${
                                selectedA === item.id
                                  ? "border-amber-400 scale-105 shadow-lg z-20"
                                  : "border-transparent"
                              } text-white`}
                            >
                              {item.text}
                            </div>
                          );
                        })}
                      </div>
                      <div className="space-y-4">
                        <p className="font-black text-center text-[#5a2d0c] mb-2 uppercase">
                          Hanay B
                        </p>
                        {hanayB.map((text, i) => (
                          <button
                            key={i}
                            id={`b${i}`}
                            onClick={() => handleConnect(`b${i}`)}
                            className={`w-full border-2 border-[#772402] p-4 md:p-6 rounded-lg font-black uppercase transition-colors min-h-[60px] ${
                              connections.find((c) => c.toId === `b${i}`)
                                ? "bg-[#772402] text-white"
                                : "text-[#772402] hover:bg-amber-50"
                            }`}
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>
                    <svg
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 15, overflow: "visible" }}
                    >
                      {lineCoords.map((coords, index) => (
                        <line
                          key={index}
                          x1={coords.x1}
                          y1={coords.y1}
                          x2={coords.x2}
                          y2={coords.y2}
                          stroke="#772402"
                          strokeWidth="4"
                          strokeLinecap="round"
                          style={{ opacity: 0.8 }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              )}

              {/* 5. MESOAMERICA */}
              {id === "mesoamerica" && activeTab === "quiz" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {mesoQuestions.map((q) => (
                      <div
                        key={`${resetKey}-${q.id}`}
                        className="border-2 border-[#5a2d0c]/30 rounded-xl p-4 md:p-6 bg-white shadow-sm"
                      >
                        <p className="text-lg leading-[3rem] text-[#5a2d0c] font-bold">
                          {q.id}. {q.text1}
                          <LetterInputGroup
                            key={`${resetKey}-${q.id}`}
                            answer={q.ans}
                            onAnswerChange={(val) =>
                              handleAnswerChange(q.id, val)
                            }
                          />
                          {q.text2}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row justify-end pt-4 gap-4">
                <button
                  onClick={handleClearAnswers}
                  className="w-full md:w-auto border-2 border-[#772402] text-[#772402] px-8 py-3 rounded-xl font-black text-lg shadow-md hover:bg-amber-50 transition-all active:scale-95"
                >
                  Clear Answer
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full md:w-auto bg-[#772402] text-white px-12 py-3 rounded-xl font-black text-xl shadow-xl hover:bg-[#5a2d0c] transition-all transform active:scale-95"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KabihasnanDetails;
