import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const ClassProgress = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("All");
  
  useEffect(() => {
    API.get('teacher-dashboard/')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Extract unique sections for filter dropdown
  const sections = ["All", ...new Set(students.map(s => s.section))];

  // Filtering Logic
  const filteredList = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === "All" || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="min-h-screen font-[var(--font-body)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#52392F] font-[var(--font-heading)]">Class Progress Report</h1>
      </div>

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
              <th className="p-4">Section</th>
              <th className="p-4">Latest Activity</th>
              <th className="p-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredList.map((student) => {
              // Get the most recent activity if available
              const latest = student.activities.length > 0 
                ? student.activities[student.activities.length - 1] 
                : null;

              return (
                <tr key={student.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                  <td className="p-4 font-bold text-black">{student.name}</td>
                  <td className="p-4 text-black">{student.section}</td>
                  <td className="p-4 text-gray-600">
                    {latest ? `${latest.activity_name} (${latest.civilization})` : "No activity yet"}
                  </td>
                  <td className="p-4 text-right font-bold text-[#772402]">
                    {latest ? `${latest.score} / ${latest.max_score}` : "-"}
                  </td>
                </tr>
              );
            })}
            {filteredList.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassProgress;