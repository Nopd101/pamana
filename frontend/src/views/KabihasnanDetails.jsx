import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
const LetterInputGroup = ({ answer }) => {
  const [inputs, setInputs] = useState(Array(answer.length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 1) {
      const newInputs = [...inputs];
      newInputs[index] = val;
      setInputs(newInputs);
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
  const [selectedA, setSelectedA] = useState(null);
  const [connections, setConnections] = useState([]);
  const containerRef = useRef(null);
  const [lineCoords, setLineCoords] = useState([]);
  const [resetKey, setResetKey] = useState(0); // Add this state

  const handleClearAnswers = () => {
    setConnections([]);
    setLineCoords([]);
    setSelectedA(null);

    setResetKey((prev) => prev + 1);
  };
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
  ]; //

  const handleStartGame = (gameTitle) => {
    if (gameTitle === "CASTE YOUR ANSWER") {
      navigate("/caste-game");
    } else if (gameTitle === "MindFlip") {
      navigate("/mindflip-game");
    } else if (gameTitle === "BrainTease") {
      navigate("/riddle-game");
    } 
    else if (gameTitle === "DynasSeek") {
      navigate("/wordhunt-game");
    } else if (gameTitle === "MistakeMaze") {
      navigate("/itama-mo-ako");
    } else if (gameTitle === "Selectify") {
      navigate("/saan-ako-nabibilang");
    } else {
      console.log("game does not exist", gameTitle);
    }
  };
  const handleConnect = (idB) => {
    if (selectedA) {
      // Updates connections: if the item in Hanay A was already connected, it replaces it
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
  // Dynamic Content Data based on ID
  const civilizationData = {
    mesopotamia: {
      title: "Mesopotamia",
      subtitle:
        "Ang Kabihasnang Mesopotamia - ang lupain sa pagitan ng dalawang ilog",
      games: [
        { title: "MindFlip", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
        { title: "BrainTease", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
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
        { title: "HARAPPUZZLE QUEST", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
        { title: "CASTE YOUR ANSWER", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
      ],
      quizType: "true-false",
      quizTitle: "IndusQUIZtery",
      quizInstructions:
        "Piliin kung TAMA o MALI ang bawat pahayag tungkol sa Kabihasnang Indus at mga imperyo ng India. Tuklasin ang “mystery” gamit ang tamang sagot!",
    },
    tsino: {
      title: "Tsino",
      subtitle: "Ang duyan ng sinaunang imbensyon at pilosopiya.",
      games: [
        { title: "DynasSeek", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
        { title: "ScratchVenture", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
      ],
      quizType: "identification",
      quizTitle: "IdentiFun - IDENTIFICATION",
      quizInstructions:
        "Ayusin ang mga magulong titik upang mabuo ang tamang termino na may kaugnayan sa Kabihasnang Tsino. Gamit ang ibinigay na clue o pangungusap, isulat ang tamang sagot sa patlang.",
    },
    africa: {
      title: "Africa",
      subtitle: "Ang mga sinaunang imperyo ng Africa",
      games: [
        { title: "Selectify", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
        { title: "BrainTease", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
      ],
      quizType: "multiple-choice",
      quizTitle: "QuizStory - Multiple Choice",
      quizInstructions:
        "Basahin nang mabuti ang bawat tanong. Piliin ang letra ng tamang sagot.",
    },
    mesoamerica: {
      title: "Mesoamerica",
      subtitle:
        "Ang sibilisasyon ng mga Maya, Aztec, at iba pang katutubo ng Gitnang Amerika.",
      games: [
        { title: "MistakeMaze", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
        { title: "Selectify", desc: "Fkhfai afiafhaw jfa iwifhaihf" },
      ],
      quizType: "fill-in-the-blank",
      quizTitle: "MesoQuiz - PUNAN MO AKO!",
      quizInstructions:
        "Piliin ang tamang sagot sa kahon na hinihingi sa bawat patlang.",
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
    {
      id: 1,
      text1: "Ang salitang ",
      text2:
        " ay nangangahulugang “isang nagmula sa Aztlan” isang mitikong lugar sa Hilagang Mexico.",
      ans: "AZTEC",
    },
    {
      id: 2,
      text1: "Si ",
      text2:
        " ay nagpatayo ng mga mosque o pook dasalan ng mga Muslim sa mga lungsod ng imperyo.",
      ans: "MANSA MUSA",
    },
    {
      id: 3,
      text1: "Ang kabihasnang ",
      text2:
        " ay namayani sa Yucatan Peninsula, ito ay lupain sa Timog ng Mexico hanggang Guatemala.",
      ans: "MAYA",
    },
    {
      id: 4,
      text1: "Ang pinuno ng mga Mayan ay tinatawag na ",
      text2: ".",
      ans: "HALACK UINIC",
    },
    {
      id: 5,
      text1: "Ang pinakamahalagang Diyos ng mga Aztec ay si ",
      text2: ", ang Diyos ng araw.",
      ans: "HUITZILOPOCHTLI",
    },
  ];
  // Fallback to Mesopotamia if id not found, or use current id
  const currentData = civilizationData[id] || civilizationData.mesopotamia;

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center p-6 pt-16 md:pt-36 font-[var(--font-body)]"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#5a2d0c] font-bold mb-6 md:ml-20 transition-transform hover:scale-[1.01] cursor-pointer"
      >
        <span className="mr-2">◀</span> Back
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-sm shadow-inner shrink-0" />
          <div>
            <h1 className="text-3xl font-extrabold text-[#7B3306] font-[var(--font-heading)] uppercase">
              Kabihasnang {currentData.title}
            </h1>
            <p className="text-[#B06A3A] font-bold">{currentData.subtitle}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex w-full border-b border-[#5a2d0c]/20 mb-8 shadow-md rounded-t-lg overflow-hidden">
          {["video", "game", "quiz"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition-colors ${
                activeTab === tab
                  ? "bg-white text-[#5a2d0c]"
                  : "bg-[#772402] text-white/80"
              }`}
            >
              {tab === "video" && <span>▷ Video Lecture</span>}
              {tab === "game" && <span>∞ Mini-Game</span>}
              {tab === "quiz" && <span>⚡ Quiz</span>}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div
          className={`${
            activeTab !== "game"
              ? "bg-white p-8 md:p-10 rounded-xl shadow-xl"
              : ""
          } min-h-[500px]`}
        >
          {/* VIDEO TAB */}
          {activeTab === "video" && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-[#5a2d0c] mb-6 font-[var(--font-heading)]">
                Kabihasnang {currentData.title}
              </h2>
              <div className="flex-1 bg-gray-400 rounded-lg relative flex items-center justify-center min-h-[400px] shadow-inner">
                <div className="w-20 h-20 border-4 border-black/40 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-black/40 border-b-[15px] border-b-transparent ml-2" />
                </div>
              </div>
              <button className="mt-8 self-end border-2 border-emerald-600 text-emerald-700 px-6 py-1 rounded-lg font-bold">
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
                    <span>∞</span> Start Game
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* QUIZ TAB CONTENT */}
          {activeTab === "quiz" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-[#5a2d0c] font-[var(--font-heading)] uppercase">
                  {currentData.quizTitle}
                </h2>
                <p className="text-[#B06A3A] font-bold leading-relaxed">
                  {currentData.quizInstructions ||
                    "Basahin nang mabuti ang bawat tanong."}
                </p>
              </div>

              {/* 1. MESOPOTAMIA: Multiple Choice */}
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
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-6 bg-white shadow-sm"
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
                              className="w-4 h-4 accent-[#772402]"
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

              {/* 2. INDUS: True or False */}
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
                      text: "Ang sistema ng mga palikuran at alkantarilya sa Indus ay isa sa mga pinakamaunlad noong sinaunang panahon.",
                    },
                  ].map((q) => (
                    <div
                      key={q.id}
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-5 bg-white flex items-center gap-4 shadow-sm"
                    >
                      <input
                        key={resetKey}
                        type="text"
                        placeholder=""
                        className="w-32 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors"
                      />
                      <p className="text-[#5a2d0c] font-bold">
                        {q.id}. {q.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. TSINO: Identification (Scrambled Letters) */}
              {id === "tsino" && (
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      scrambled: "G N H A U O H",
                      clue: "Ilog kung saan sumibol ang sinaunang kabihasnang Tsino, tinatawag din itong “River of Sorrow.”",
                    },
                    {
                      id: 2,
                      scrambled: "O L C A R E B O N S E",
                      clue: "Tortoise shell at cattle bone na ginamit upang mabatid ang mensahe ng mga diyos.",
                    },
                    {
                      id: 3,
                      scrambled: "H O Z U",
                      clue: "Pinaka mahaba at pinaka dakilang dinastiya sa Tsina na nagtaguyod ng Confucianism, Taoism, at Legalism.",
                    },
                    {
                      id: 4,
                      scrambled: "A L L C I G A R P H Y",
                      clue: "Sistema ng pagsulat ng mga Tsino na gumagamit ng mga simbolong kahawig ng larawan.",
                    },
                    {
                      id: 5,
                      scrambled: "A D N M T E A F O E H E A V E N",
                      clue: "Paniniwalang Tsino na ang emperador ay may basbas ng kalangitan upang mamuno.",
                    },
                  ].map((q) => (
                    <div
                      key={q.id}
                      className="border-2 border-[#5a2d0c]/30 rounded-xl p-5 bg-white flex items-center gap-4 shadow-sm"
                    >
                      {/* Answer Input Box */}
                      <input
                        type="text"
                        key={resetKey}
                        placeholder=""
                        className="w-48 border-b-2 border-[#5a2d0c] bg-transparent text-center font-bold text-[#772402] outline-none focus:border-amber-600 uppercase transition-colors"
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

              {/* 4. EGYPTIAN: Matching Type */}
              {id === "egypt" && (
                <div className="space-y-6">
                  <div className="relative" ref={containerRef}>
                    <div className="grid grid-cols-2 gap-20 border-2 border-[#5a2d0c]/30 rounded-xl p-8 bg-white shadow-sm z-10 relative">
                      {/* Hanay A */}
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

                      {/* Hanay B */}
                      <div className="space-y-4">
                        <p className="font-black text-center text-[#5a2d0c] mb-2 uppercase">
                          Hanay B
                        </p>
                        {hanayB.map((text, i) => (
                          <button
                            key={i}
                            id={`b${i}`}
                            onClick={() => handleConnect(`b${i}`)}
                            className={`w-full border-2 border-[#772402] p-6 mb-5.5 rounded-lg font-black uppercase transition-colors min-h-[60px] ${
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

              {/* 5. MESOAMERICA: Punan Mo Ako (Fill in the Blank) */}
              {id === "mesoamerica" && activeTab === "quiz" && (
                <div className="space-y-6">
                  {/* ... Word bank ... */}
                  <div className="space-y-4">
                    {mesoQuestions.map((q) => (
                      <div
                        key={`${resetKey}-${q.id}`}
                        className="border-2 border-[#5a2d0c]/30 rounded-xl p-6 bg-white shadow-sm"
                      >
                        <p className="text-lg leading-[3rem] text-[#5a2d0c] font-bold">
                          {q.id}. {q.text1}
                          {/* The resetKey here forces the inputs to empty when Clear is clicked */}
                          <LetterInputGroup
                            key={`${resetKey}-${q.id}`}
                            answer={q.ans}
                          />
                          {q.text2}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleClearAnswers}
                  className="border-2 border-[#772402] text-[#772402] px-8 py-3 mr-4 rounded-xl font-black text-lg shadow-md hover:bg-amber-50 transition-all active:scale-95"
                >
                  Clear Answer
                </button>
                <button className="bg-[#772402] text-white px-12 py-3 rounded-xl font-black text-xl shadow-xl hover:bg-[#5a2d0c] transition-all transform active:scale-95">
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
