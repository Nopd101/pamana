import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const ClassProgress = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sections: [], students: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 Uses the SAME new endpoint as your Dashboard
        const response = await API.get('teacher/progress/');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load progress data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTERING LOGIC (Matches Backend IDs) ---
  const filteredStudents = data.students.filter(student => {
    // 1. Filter by Section ID (exact match)
    const matchesSection = selectedSection === "all" || student.section_id === parseInt(selectedSection);
    // 2. Filter by Name
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="min-h-screen font-[var(--font-body)]">
      <h1 className="text-2xl font-bold text-[#52392F] font-[var(--font-heading)] mb-6">
        Class Progress Report
      </h1>

      {/* FILTERS */}
      <div className="bg-white/50 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 border border-[#52392F]/10">
        
        {/* Search Input */}
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
        
        {/* Section Dropdown (Populated from API) */}
        <select 
          className="px-4 py-2 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white text-[#52392F] cursor-pointer"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="all">All Sections</option>
          {data.sections.map(section => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#52392F]/10">
        <div className="overflow-x-auto">
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
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading data...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => {
                  // Use pre-calculated average from backend
                  const avg = student.average; 
                  
                  return (
                    <tr key={student.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                      <td className="p-4 font-bold text-black">{student.name}</td>
                      <td className="p-4 text-black hidden md:table-cell">{student.section}</td>
                      <td className="p-4 text-center text-gray-600">{student.activities_done}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${
                          avg === "N/A" ? "bg-gray-100 text-gray-600" :
                          avg >= 75 ? 'bg-green-100 text-green-800' : 
                          avg >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {avg === "N/A" ? "N/A" : `${avg}%`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => navigate(`/teacher/report/${student.id}`, { state: { student } })}
                          className="text-[#772402] hover:bg-[#772402] hover:text-white border border-[#772402] px-3 py-1 rounded-md transition text-xs font-bold uppercase cursor-pointer"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassProgress;