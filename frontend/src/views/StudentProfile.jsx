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
  GraduationCap // 👈 Added icon for Post-Test
} from "lucide-react";

// Placeholder images
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
    progressDetails: {},
    isPostTestDone: false, // 👈 New State for Post-Test
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('student/stats/');
        const { name, section, stats, history } = response.data;

        // Initialize details
        const details = {};
        CIVILIZATIONS.forEach(civ => {
            details[civ.id] = { 
                video: false, 
                quiz: false, 
                games: false, 
                _gamesFound: new Set() 
            };
        });
        
        const normalize = (str) => str?.toLowerCase().replace(" ", "");
        let postTestFound = false; // Flag for Post-Test

        // Process history
        history.forEach(log => {
           // 👇 CHECK FOR POST-TEST
           if (log.activity_name === "Post-Test" || log.activity_name === "Post Test") {
               postTestFound = true;
           }

           const civKey = normalize(log.civilization);
           
           if (details[civKey]) {
               if (log.activity_type === 'Quiz') details[civKey].quiz = true;
               if (log.activity_type === 'Video') details[civKey].video = true;
               if (log.activity_type === 'Game') details[civKey]._gamesFound.add(log.activity_name);
           }
        });

        // Finalize Game Status
        Object.values(details).forEach(d => {
            if (d._gamesFound.size >= 2) {
                d.games = true;
            }
        });

        // Calculate Stats
        const calculatedStats = {
            videos: history.filter(h => h.activity_type === 'Video').length,
            games: new Set(history.filter(h => h.activity_type === 'Game').map(h => h.activity_name)).size,
            quizzes: new Set(history.filter(h => h.activity_type === 'Quiz').map(h => h.activity_name)).size,
        };

        // Calculate Overall Progress (Adding Post-Test as a requirement?)
        // For now, let's keep it based on the modules, but you can add +1 for post-test if you want.
        let tasksCompleted = 0;
        Object.values(details).forEach(d => {
            if(d.quiz) tasksCompleted++;
            if(d.video) tasksCompleted++;
            if(d.games) tasksCompleted++;
        });

        const totalTasks = 5 * 3; 
        const progressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

        setStudentData({
          name,
          section,
          overallProgress: progressPercent,
          stats: calculatedStats,
          progressDetails: details,
          isPostTestDone: postTestFound // 👈 Set state
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
          <div className="p-6 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 relative z-10">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight tracking-tight break-words">
                {studentData.name}
              </h2>
              <p className="text-white/80 font-medium font-body mt-1">
                Section: {studentData.section}
              </p>
            </div>
            <div className="text-right sm:text-left flex-shrink-0">
              <span className="text-3xl sm:text-4xl font-black font-heading">
                {studentData.overallProgress}%
              </span>
              <p className="text-white/80 font-medium font-body mt-1 leading-none tracking-tighter text-sm sm:text-base">
                Module Progress
              </p>
            </div>
          </div>

          <div className="bg-white px-6 py-8">
            <div className="bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden w-full shadow-inner">
              <div
                className="bg-[#bb6701] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${studentData.overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <PlayCircle className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">{studentData.stats.videos}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">Videos Watched</span>
          </div>

          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <Gamepad2 className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">{studentData.stats.games}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">Games Played</span>
          </div>

          <div className="bg-gradient-to-b from-[#8B2D06] to-[#5a2d0c] text-white rounded-xl p-4 py-6 flex flex-col items-center justify-center shadow-lg border border-white/10">
            <ClipboardCheck className="w-10 h-10 mb-1 text-white" />
            <span className="text-3xl font-bold mb-1">{studentData.stats.quizzes}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/80 text-center">Quizzes Taken</span>
          </div>
        </div>

        {/* NEW: Post-Test Status Card */}
        <div className={`rounded-xl p-6 shadow-lg border mb-10 flex flex-col sm:flex-row items-center sm:justify-between gap-4 ${
            studentData.isPostTestDone 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-white/90 border-gray-200"
        }`}>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`p-3 rounded-full ${studentData.isPostTestDone ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    <GraduationCap className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-black uppercase font-heading leading-tight ${studentData.isPostTestDone ? "text-emerald-800" : "text-gray-600"}`}>
                        Final Post-Test
                    </h3>
                    <p className="text-sm text-gray-500 font-bold">
                        {studentData.isPostTestDone 
                            ? "Assessment Completed" 
                            : "Not yet taken"}
                    </p>
                </div>
            </div>
            
            <div className="w-full sm:w-auto px-4 py-2">
                {studentData.isPostTestDone ? (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-700 font-bold bg-emerald-100 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>COMPLETED</span>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/post-test')}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold bg-[#772402] hover:bg-[#5a2d0c] px-6 py-2 rounded-lg transition-colors shadow-md"
                    >
                        TAKE TEST
                    </button>
                )}
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
              
              const isStarted = progress.video || progress.quiz || progress.games;

              return (
                <div key={civ.id} className="flex gap-6 items-center border-b-2 border-[#772402] pb-6 last:border-0 last:pb-0">
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
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-2 text-sm font-bold ${progress.video ? "text-emerald-600" : "text-gray-400"}`}>
                          {progress.video ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          <span>Video Lesson</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold ${progress.quiz ? "text-emerald-600" : "text-gray-400"}`}>
                          {progress.quiz ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          <span>Quiz</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold ${progress.games ? "text-emerald-600" : "text-gray-400"}`}>
                          {progress.games ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
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