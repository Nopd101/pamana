import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const ClassProgress = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("All");
  const navigate = useNavigate();
  
  useEffect(() => {
    API.get('teacher-dashboard/')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const sections = ["All", ...new Set(students.map(s => s.section))];

  const filteredList = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === "All" || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Helper to calculate student average
  const calculateAverage = (activities) => {
    if (activities.length === 0) return 0;
    let totalPercent = 0;
    activities.forEach(act => {
        if(act.max_score > 0) totalPercent += (act.score / act.max_score);
    });
    return Math.round((totalPercent / activities.length) * 100);
  };

  return (
    <div className="min-h-screen font-[var(--font-body)]">
      <h1 className="text-2xl font-bold text-[#52392F] font-[var(--font-heading)] mb-6">Class Progress Report</h1>

      {/* FILTERS */}
      <div className="bg-white/50 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 border border-[#52392F]/10">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search student name..." 
            className="w-full pl-10 pr-4 py-2 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        
        <select 
          className="px-4 py-2 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white text-[#52392F]"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          {sections.map(sec => <option key={sec} value={sec}>{sec === "All" ? "All Sections" : sec}</option>)}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#52392F]/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#52392F] text-white uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4 hidden md:table-cell">Section</th>
              <th className="p-4 text-center">Activities Done</th>
              <th className="p-4 text-center">Avg. Performance</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredList.map((student) => {
              const avg = calculateAverage(student.activities);
              return (
                <tr key={student.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                  <td className="p-4 font-bold text-black">{student.name}</td>
                  <td className="p-4 text-black hidden md:table-cell">{student.section}</td>
                  <td className="p-4 text-center text-gray-600">{student.activities.length}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded font-bold text-xs ${avg >= 75 ? 'bg-green-100 text-green-800' : avg >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                        {student.activities.length > 0 ? `${avg}%` : "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => navigate(`/teacher/report/${student.id}`, { state: { student } })}
                        className="text-[#772402] hover:bg-[#772402] hover:text-white border border-[#772402] px-3 py-1 rounded-md transition text-xs font-bold uppercase"
                    >
                        View Report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassProgress;