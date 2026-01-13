import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgHome from "../assets/bg-home.png";
import kabihasnanImg from "../assets/main-home-bg-2.png";
import API from "../api/axios";
import {
  PlayCircle,
  Gamepad2,
  ClipboardCheck,
  CheckCircle2,
  Circle,
} from "lucide-react";

// Placeholder images - replace with your actual asset imports
const CIVILIZATIONS = [
  { id: "mesopotamia", title: "Kabihasnang Mesopotamia", img: kabihasnanImg },
  { id: "indus", title: "Kabihasnang Indus", img: kabihasnanImg },
  { id: "tsino", title: "Kabihasnang Tsino", img: kabihasnanImg },
  { id: "egypt", title: "Kabihasnang Egyptian", img: kabihasnanImg },
  { id: "mesoamerica", title: "Kabihasnang Mesoamerica", img: kabihasnanImg },
];

const StudentProfile = () => {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    name: "Student",
    section: "...",
    overallProgress: 0,
    stats: {
      videos: 0,
      games: 0,
      quizzes: 0,
    },
    progressDetails: {}, // To store specific completion data
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('student/stats/');
        const { name, section, stats, history } = response.data;

        // Initialize details for all civilizations to ensure they exist
        const details = {};
        CIVILIZATIONS.forEach(civ => {
            details[civ.id] = { 
                video: false, 
                quiz: false, 
                games: false, 
                _gamesFound: new Set() // Temporary set to track unique games
            };
        });
        
        // Helper to normalize civ names from DB (e.g., "Mesopotamia" -> "mesopotamia")
        const normalize = (str) => str?.toLowerCase().replace(" ", "");

        // Process history
        history.forEach(log => {
           const civKey = normalize(log.civilization);
           
           if (details[civKey]) {
               if (log.activity_type === 'Quiz') {
                   details[civKey].quiz = true;
               }
               if (log.activity_type === 'Video') {
                   details[civKey].video = true;
               }
               if (log.activity_type === 'Game') {
                   details[civKey]._gamesFound.add(log.activity_name);
               }
           }
        });

        // Finalize Game Status (Must have 2 unique games to be "True")
        Object.values(details).forEach(d => {
            if (d._gamesFound.size >= 2) {
                d.games = true;
            }
        });

        // Calculate Stats for the top cards (Total counts)
        const calculatedStats = {
            videos: history.filter(h => h.activity_type === 'Video').length,
            games: new Set(history.filter(h => h.activity_type === 'Game').map(h => h.activity_name)).size,
            quizzes: new Set(history.filter(h => h.activity_type === 'Quiz').map(h => h.activity_name)).size,
        };

        // Calculate Overall Progress
        // Now tracking 3 items per civilization: Video + Quiz + Games(Both)
        let tasksCompleted = 0;
        Object.values(details).forEach(d => {
            if(d.quiz) tasksCompleted++;
            if(d.video) tasksCompleted++; // Now tracking video
            if(d.games) tasksCompleted++; // Only counts if >=2 games
        });

        const totalTasks = 5 * 3; // 5 civs * 3 categories
        const progressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

        setStudentData({
          name,
          section,
          overallProgress: progressPercent,
          stats: calculatedStats,
          progressDetails: details
        });

      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center font-sans pb-10"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
      <div className="max-w-4xl mx-auto px-4 pt-32">
        {/* Header Progress Card */}
        <div className="bg-gradient-to-b from-[#8B2D06] to-[#772402] text-white rounded-xl shadow-xl overflow-hidden mb-6 border border-white/10">
          {/* Top Section (Brown/Red Gradient) */}
          <div className="p-6 pb-4 flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-3xl font-black font-heading leading-tight tracking-tight">
                {studentData.name}
              </h2>
              <p className="text-white/80 font-medium font-body mt-1">
                Section: {studentData.section}
              </p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black font-heading">
                {studentData.overallProgress}%
              </span>
              <p className="text-white/80 font-medium font-body mt-1 leading-none tracking-tighter">
                Overall Progress
              </p>
            </div>
          </div>

          {/* Bottom Section (Solid White Full Width) */}
          <div className="bg-white px-6 py-8">
            {/* The Gray Track */}
            <div className="bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden w-full shadow-inner">
              {/* The Actual Progress Fill */}
              <div
                className="bg-[#C8AA86] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${studentData.overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* Videos Watched */}
          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <PlayCircle className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">
              {studentData.stats.videos}
            </span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">
              Videos Watched
            </span>
          </div>

          {/* Games Played */}
          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <Gamepad2 className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">
              {studentData.stats.games}
            </span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">
              Games Played
            </span>
          </div>

          {/* Quizzes Taken */}
          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <ClipboardCheck className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">
              {studentData.stats.quizzes}
            </span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">
              Quizzes Taken
            </span>
          </div>
        </div>

        {/* Civilization Progress List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-xl border border-white/50">
          <h3 className="text-2xl font-black font-heading text-[#A5521E] mb-8 uppercase tracking-tight">
            Civilization Progress
          </h3>

          <div className="space-y-8">
            {CIVILIZATIONS.map((civ) => {
              const progress = studentData.progressDetails[civ.id] || {
                video: false,
                quiz: false,
                games: false,
              };
              
              const isStarted =
                progress.video || progress.quiz || progress.games;

              return (
                <div key={civ.id} className="flex gap-6 items-center">
                  <div className="w-30 h-20 rounded-md overflow-hidden shadow-md shrink-0 border border-amber-900/10">
                    <img
                      src={civ.img}
                      alt={civ.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#772402] mb-1">
                      {civ.title}
                    </h4>

                    {!isStarted ? (
                      <div className="inline-block px-3 py-0.5 rounded border border-orange-200 text-orange-400 text-sm font-bold bg-white">
                        Not Started
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {/* Video Indicator */}
                        <div
                          className={`flex items-center gap-2 text-sm font-bold ${
                            progress.video
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        >
                          {progress.video ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>Video Lesson</span>
                        </div>

                        {/* Quiz Indicator */}
                        <div
                          className={`flex items-center gap-2 text-sm font-bold ${
                            progress.quiz ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {progress.quiz ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>Quiz</span>
                        </div>

                        {/* Games Indicator (Requires both games) */}
                        <div
                          className={`flex items-center gap-2 text-sm font-bold ${
                            progress.games
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        >
                          {progress.games ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>Games (Complete all)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;