import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student;

  if (!student) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 bg-[#FFF3D1]">
        <p className="text-xl text-[#52392F] font-bold mb-4">No student data found.</p>
        <button 
          onClick={() => navigate('/teacher/progress')} 
          className="bg-[#52392F] text-white px-6 py-2 rounded-lg hover:bg-[#772402] transition"
        >
          Back to Class List
        </button>
      </div>
    );
  }

  // 1. GET FINAL SCORES
  // Logic: Create a list of unique activities. 
  // FIX: We now check (Activity Name + Civilization) to treat "Video Lecture" (Indus) 
  // and "Video Lecture" (Tsino) as two different items.
  const finalGrades = (student.activities || []).reduce((acc, current) => {
    
    // 👇 CHANGED: Check both Name AND Civilization
    const existing = acc.find(item => 
        item.activity_name === current.activity_name && 
        item.civilization === current.civilization
    );
    
    if (!existing) {
      acc.push(current);
    } else {
      // If a newer version exists (same activity AND same civ), replace the old one
      if (new Date(current.timestamp) > new Date(existing.timestamp)) {
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
    }
    return acc;
  }, []);

  // 2. GROUP BY CIVILIZATION
  const gradesByCiv = finalGrades.reduce((acc, log) => {
    const civ = log.civilization || "General";
    if (!acc[civ]) acc[civ] = [];
    acc[civ].push(log);
    return acc;
  }, {});

  const civKeys = Object.keys(gradesByCiv).sort();
  const totalCompleted = finalGrades.length;

  return (
    // 👇 FIX 1: Layout Wrapper (Fixed Height + Hidden Overflow)
    <div className="h-full flex flex-col bg-[#FFF3D1] font-[var(--font-body)] overflow-hidden">
      
      {/* Fixed Header Section */}
      <div className="p-6 pb-2 flex-none">
        <button 
            onClick={() => navigate(-1)} 
            className="mb-4 text-[#52392F] font-bold flex items-center hover:underline cursor-pointer"
        >
            <span className="mr-2">◀</span> Back to Class List
        </button>

        {/* Student Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-[#52392F] font-[var(--font-heading)] uppercase">{student.name}</h1>
                <p className="text-gray-600 font-medium mt-1">Section: <span className="text-black">{student.section}</span></p>
            </div>
            <div className="flex gap-6 text-left md:text-right">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Activities Completed</p>
                    <p className="text-3xl font-bold text-[#772402]">{totalCompleted}</p>
                </div>
                <div className="border-l border-gray-300 pl-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Average Performance</p>
                    <p className={`text-3xl font-bold ${student.average >= 75 ? 'text-green-700' : 'text-[#772402]'}`}>
                        {student.average === "N/A" ? "N/A" : `${student.average}%`}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 👇 FIX 2: Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        
        <h2 className="text-xl font-bold text-[#52392F] mb-4 border-b-2 border-[#52392F]/20 pb-2 flex items-center gap-2 mt-4">
            <span className="bg-[#52392F] w-2 h-6 rounded-full inline-block"></span>
            Final Grades by Civilization
        </h2>

        {/* Gradebook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {civKeys.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white/50 rounded-xl border-2 border-dashed border-[#52392F]/20">
                    <p className="text-[#52392F]/60 font-bold text-lg">No graded activities found.</p>
                </div>
            )}

            {civKeys.map((civName) => (
            <div key={civName} className="bg-white rounded-xl shadow-sm border border-[#52392F]/10 overflow-hidden flex flex-col h-fit">
                {/* Header */}
                <div className="bg-[#772402] px-5 py-3 flex justify-between items-center">
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm md:text-base">{civName}</h3>
                </div>

                {/* Scores List */}
                <div className="flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-5 py-3">Activity Name</th>
                                <th className="px-5 py-3 text-right">Final Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {gradesByCiv[civName].map((log, idx) => {
                                // Logic: Prefer 'gamemode' if available, else 'activity_type'
                                const displayType = (log.gamemode || log.activity_type || "Quiz").replace(/_/g, ' ');

                                return (
                                    <tr key={idx} className="hover:bg-[#FFF3D1]/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-[#5a2d0c] text-sm">{log.activity_name}</p>
                                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">
                                                {displayType}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`text-base font-bold ${log.score >= log.max_score / 2 ? 'text-green-700' : 'text-red-600'}`}>
                                                {log.score}
                                            </span>
                                            <span className="text-gray-400 text-sm font-medium"> / {log.max_score}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudentReport;