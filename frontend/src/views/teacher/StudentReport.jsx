import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentReport = () => {
  const { state } = useLocation(); // Retrieve student data passed from the previous page
  const navigate = useNavigate();
  const student = state?.student;

  if (!student) {
    return <div className="p-8">No student data found. Please go back.</div>;
  }

  // Helper to group activities by Civilization
  const historyByCiv = student.activities.reduce((acc, log) => {
    const civ = log.civilization || "General";
    if (!acc[civ]) acc[civ] = [];
    acc[civ].push(log);
    return acc;
  }, {});

  return (
    <div className="min-h-screen font-[var(--font-body)] p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-[#52392F] font-bold flex items-center hover:underline"
      >
        ← Back to Class List
      </button>

      {/* Header Profile */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F] mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-[#52392F] font-[var(--font-heading)]">{student.name}</h1>
            <p className="text-gray-600 font-medium">Section: {student.section}</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total Activities</p>
            <p className="text-3xl font-bold text-[#772402]">{student.activities.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#52392F] mb-4 border-b border-[#52392F]/20 pb-2">Civilization Progress</h2>

      {/* Civilization Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(historyByCiv).length === 0 && (
            <p className="text-gray-500 italic">No activity recorded yet.</p>
        )}

        {Object.entries(historyByCiv).map(([civName, logs]) => (
          <div key={civName} className="bg-white/80 rounded-xl shadow-sm border border-[#52392F]/10 overflow-hidden">
            <div className="bg-[#772402] px-4 py-2">
                <h3 className="text-white font-bold uppercase tracking-wider">{civName}</h3>
            </div>
            <div className="p-4 space-y-3">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                        <div>
                            <p className="font-bold text-[#5a2d0c] text-sm">{log.activity_name}</p>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{log.activity_type}</span>
                        </div>
                        <div className="text-right">
                            <span className={`font-bold ${log.score >= log.max_score / 2 ? 'text-green-600' : 'text-red-500'}`}>
                                {log.score} / {log.max_score}
                            </span>
                            <p className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentReport;